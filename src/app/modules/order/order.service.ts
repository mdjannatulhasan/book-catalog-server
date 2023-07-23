/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from './order.model';
import { IOrder } from './order.interface';
import { IPaginationOptions } from '../../interfaces/pagination';
import { IGenericResponse } from '../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import mongoose, { SortOrder } from 'mongoose';
// import { orderSearchableFields } from './order.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../users/users.model';
import { Cow } from '../cow/cow.model';
import { CowLabel, ICow, ITokenInfo } from '../cow/cow.interface';
import { ExtendedIUser } from '../users/users.interface';
import { ENUM_USER_ROLE } from '../../../enums/user';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
    let newOrderAllData = null;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const buyer = await User.findById(order.buyer);

        if (buyer?.role !== 'buyer') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Please Select a buyer');
        }

        const cow = await Cow.findById(order.cow);

        if (!cow) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Please Select a Cow');
        }

        if ((cow as ICow).label === CowLabel.SoldOut) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Cow has been sold already'
            );
        } else if ((cow as ICow).price > buyer.budget) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Buyer don't have enough money to buy this cow"
            );
        }

        const updatedCow = await Cow.findOneAndUpdate(
            { _id: order.cow },
            { label: CowLabel.SoldOut },
            { new: true }
        );

        const seller = await User.findById(cow?.seller);

        const updatedSeller = await User.findOneAndUpdate(
            { _id: cow?.seller },
            { income: Number(seller?.income) + Number(cow?.price) },
            { new: true }
        );

        const updatedBuyer = await User.findOneAndUpdate(
            { _id: order?.buyer },
            { budget: Number(buyer?.budget) - Number(cow?.price) },
            { new: true }
        );

        const newOrder = await Order.create([order], { session });

        if (
            !newOrder.length ||
            !updatedCow ||
            !updatedSeller ||
            !updatedBuyer
        ) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create order'
            );
        }

        newOrderAllData = newOrder[0];

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newOrderAllData) {
        newOrderAllData = await Order.findById(newOrderAllData.id)
            .populate('buyer')
            .populate({
                path: 'cow',
                populate: [
                    {
                        path: 'seller',
                    },
                ],
            });
    }

    return newOrderAllData;
};
const getAllOrder = async (
    paginationOptions: IPaginationOptions,
    userInfo: Partial<ITokenInfo>
): Promise<IGenericResponse<IOrder[]> | null> => {
    const { skip, page, limit, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortConditions) {
        sortConditions[sortBy] = sortOrder;
    }

    let filter = {};

    if (
        userInfo.role !== ENUM_USER_ROLE.ADMIN &&
        userInfo.role !== ENUM_USER_ROLE.BUYER
    ) {
        filter = {
            // $or: [{ 'cow.seller': userInfo._id }],
        };
    }

    let result = await Order.find(filter)
        .populate('buyer')
        .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    if (userInfo.role == ENUM_USER_ROLE.SELLER) {
        result = result.filter(order => {
            return (
                order.cow &&
                ((order.cow as ICow).seller as ExtendedIUser)._id.toString() ===
                    userInfo._id
            );
        });
    }

    const total = await Order.countDocuments();

    return {
        data: result,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
    };
};

const getSingleOrder = async (
    id: string,
    userInfo: Partial<ITokenInfo>
): Promise<IOrder | null> => {
    let result = await Order.findById(id)
        .populate('buyer')
        .populate({
            path: 'cow',
            populate: [
                {
                    path: 'seller',
                },
            ],
        });

    if (userInfo.role !== ENUM_USER_ROLE.ADMIN) {
        if (
            userInfo.role === ENUM_USER_ROLE.BUYER &&
            (result?.buyer as ExtendedIUser)._id.toString() !== userInfo._id
        ) {
            result = null;
        } else if (
            userInfo.role === ENUM_USER_ROLE.SELLER &&
            ((result?.cow as ICow).seller as ExtendedIUser)._id.toString() !==
                userInfo._id
        ) {
            result = null;
        }
    }

    return result;
};

const updateOrder = async (
    id: string,
    payload: Partial<IOrder>
): Promise<IOrder | null> => {
    const isExist = await Order.findById(id);

    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!');
    }

    if (payload.buyer) {
        const isBuyer = await User.findById(payload.buyer);

        if (isBuyer?.role !== 'buyer') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Please insert a buyer');
        }
    }

    const result = await Order.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });

    return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
    const result = await Order.findByIdAndDelete(id).populate('buyer');

    return result;
};

export const OrderService = {
    createOrder,
    getAllOrder,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};
