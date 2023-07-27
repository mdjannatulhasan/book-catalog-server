/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "./review.model";
import { IOrder } from "./review.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import mongoose, { SortOrder } from "mongoose";
// import { orderSearchableFields } from './order.constant';
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../users/users.model";
import { Book } from "../book/book.model";
import { BookLabel, IBook, ITokenInfo } from "../book/book.interface";
import { ExtendedIUser } from "../users/users.interface";
import { ENUM_USER_ROLE } from "../../../enums/user";

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
	let newOrderAllData = null;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const buyer = await User.findById(order.buyer);

		if (buyer?.role !== "buyer") {
			throw new ApiError(httpStatus.BAD_REQUEST, "Please Select a buyer");
		}

		const book = await Book.findById(order.book);

		if (!book) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Please Select a Book");
		}

		if ((book as IBook).label === BookLabel.SoldOut) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Book has been sold already");
		} else if ((book as IBook).price > buyer.budget) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Buyer don't have enough money to buy this book");
		}

		const updatedBook = await Book.findOneAndUpdate({ _id: order.book }, { label: BookLabel.SoldOut }, { new: true });

		const seller = await User.findById(book?.seller);

		const updatedSeller = await User.findOneAndUpdate({ _id: book?.seller }, { income: Number(seller?.income) + Number(book?.price) }, { new: true });

		const updatedBuyer = await User.findOneAndUpdate({ _id: order?.buyer }, { budget: Number(buyer?.budget) - Number(book?.price) }, { new: true });

		const newOrder = await Order.create([order], { session });

		if (!newOrder.length || !updatedBook || !updatedSeller || !updatedBuyer) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
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
			.populate("buyer")
			.populate({
				path: "book",
				populate: [
					{
						path: "seller",
					},
				],
			});
	}

	return newOrderAllData;
};
const getAllOrder = async (paginationOptions: IPaginationOptions, userInfo: Partial<ITokenInfo>): Promise<IGenericResponse<IOrder[]> | null> => {
	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	let filter = {};

	if (userInfo.role !== ENUM_USER_ROLE.ADMIN && userInfo.role !== ENUM_USER_ROLE.BUYER) {
		filter = {
			// $or: [{ 'book.seller': userInfo._id }],
		};
	}

	let result = await Order.find(filter)
		.populate("buyer")
		.populate({
			path: "book",
			populate: [
				{
					path: "seller",
				},
			],
		})
		.sort(sortConditions)
		.skip(skip)
		.limit(limit);

	if (userInfo.role == ENUM_USER_ROLE.SELLER) {
		result = result.filter((order) => {
			return order.book && ((order.book as IBook).seller as ExtendedIUser)._id.toString() === userInfo._id;
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

const getSingleOrder = async (id: string, userInfo: Partial<ITokenInfo>): Promise<IOrder | null> => {
	let result = await Order.findById(id)
		.populate("buyer")
		.populate({
			path: "book",
			populate: [
				{
					path: "seller",
				},
			],
		});

	if (userInfo.role !== ENUM_USER_ROLE.ADMIN) {
		if (userInfo.role === ENUM_USER_ROLE.BUYER && (result?.buyer as ExtendedIUser)._id.toString() !== userInfo._id) {
			result = null;
		} else if (userInfo.role === ENUM_USER_ROLE.SELLER && ((result?.book as IBook).seller as ExtendedIUser)._id.toString() !== userInfo._id) {
			result = null;
		}
	}

	return result;
};

const updateOrder = async (id: string, payload: Partial<IOrder>): Promise<IOrder | null> => {
	const isExist = await Order.findById(id);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "Order not found!");
	}

	if (payload.buyer) {
		const isBuyer = await User.findById(payload.buyer);

		if (isBuyer?.role !== "buyer") {
			throw new ApiError(httpStatus.BAD_REQUEST, "Please insert a buyer");
		}
	}

	const result = await Order.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});

	return result;
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
	const result = await Order.findByIdAndDelete(id).populate("buyer");

	return result;
};

export const OrderService = {
	createOrder,
	getAllOrder,
	getSingleOrder,
	updateOrder,
	deleteOrder,
};
