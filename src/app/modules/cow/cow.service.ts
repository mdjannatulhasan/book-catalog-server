/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cow } from './cow.model';
import { CowLabel, ICow, ICowFilters, ITokenInfo } from './cow.interface';
import { IPaginationOptions } from '../../interfaces/pagination';
import { IGenericResponse } from '../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import mongoose, { SortOrder } from 'mongoose';
// import { cowSearchableFields } from './cow.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../users/users.model';
import { cowSearchableFields } from './cow.constant';

const createCow = async (cow: ICow): Promise<ICow | null> => {
    const isSeller = await User.findById(cow.seller);

    if (isSeller?.role !== 'seller') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Please insert a seller');
    }

    if (!cow.label) {
        cow.label = CowLabel.ForSale;
    }

    let newCowAllData = null;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newCow = await Cow.create([cow], { session });

        if (!newCow.length) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create cow');
        }

        newCowAllData = newCow[0];

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newCowAllData) {
        newCowAllData = await Cow.findById(newCowAllData.id).populate('seller');
    }

    return newCowAllData;
};

const getAllCow = async (
    paginationOptions: IPaginationOptions,
    filters: ICowFilters
): Promise<IGenericResponse<ICow[]> | null> => {
    const { searchTerm, ...filtersData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            $or: cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    if (Object.keys(filtersData).length) {
        if ('minPrice' in filtersData || 'maxPrice' in filtersData) {
            const minPrice = (filtersData as any).minPrice;
            const maxPrice = (filtersData as any).maxPrice;

            if (typeof minPrice === 'string' && typeof maxPrice === 'string') {
                andConditions.push({
                    price: {
                        $gte: minPrice,
                        $lte: maxPrice,
                    },
                });
            } else if (typeof minPrice === 'string') {
                andConditions.push({
                    price: {
                        $gte: minPrice,
                    },
                });
            } else if (typeof maxPrice === 'string') {
                andConditions.push({
                    price: {
                        $lte: maxPrice,
                    },
                });
            }
            delete (filtersData as any).minPrice;
            delete (filtersData as any).maxPrice;
        }
        if (Object.keys(filtersData).length)
            andConditions.push({
                $and: Object.entries(filtersData).map(([field, value]) => ({
                    [field]: value,
                })),
            });
    }

    const { skip, page, limit, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortConditions) {
        sortConditions[sortBy] = sortOrder;
    }

    const conditions = andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await Cow.find(conditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

    const total = await Cow.countDocuments(conditions);

    return {
        data: result,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
    };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
    const result = await Cow.findById(id).populate('seller');

    return result;
};

const updateCow = async (
    id: string,
    payload: Partial<ICow>,
    userInfo: Partial<ITokenInfo>
): Promise<ICow | null> => {
    const isExist = await Cow.findById(id);

    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!');
    }

    if (isExist?.seller.toString() !== userInfo._id) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'Only owner can modify the information'
        );
    }

    if (payload.seller) {
        const isSeller = await User.findById(payload.seller);

        if (isSeller?.role !== 'seller') {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Please insert a seller'
            );
        }
    }

    const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });

    return result;
};

const deleteCow = async (
    id: string,
    userInfo: Partial<ITokenInfo>
): Promise<ICow | null> => {
    const isExist = await Cow.findById(id);

    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!');
    }

    if (isExist?.seller.toString() !== userInfo._id) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            'Only owner can remove this cow'
        );
    }
    const result = await Cow.findByIdAndDelete(id).populate('seller');

    return result;
};

export const CowService = {
    createCow,
    getAllCow,
    getSingleCow,
    updateCow,
    deleteCow,
};
