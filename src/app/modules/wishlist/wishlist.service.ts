/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wishlist } from "./wishlist.model";
import { IWishlist, ITokenInfo } from "./wishlist.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import mongoose, { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createWishlist = async (book: IWishlist): Promise<IWishlist | null> => {
	let newWishlistAllData = null;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const newWishlist = await Wishlist.create([book], { session });

		if (!newWishlist.length) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create book");
		}

		newWishlistAllData = newWishlist[0];

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}

	return newWishlistAllData;
};

const getAllWishlist = async (paginationOptions: IPaginationOptions): Promise<IGenericResponse<IWishlist[]> | null> => {
	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	const result = await Wishlist.find({}).sort(sortConditions).skip(skip).limit(limit);

	const total = await Wishlist.countDocuments();

	return {
		data: result,
		meta: {
			page: Number(page),
			limit: Number(limit),
			total,
		},
	};
};

const getSingleWishlist = async (id: string): Promise<IWishlist | null> => {
	const result = await Wishlist.findById(id);

	return result;
};

const updateWishlist = async (id: string, payload: Partial<IWishlist>, userInfo: Partial<ITokenInfo>): Promise<IWishlist | null> => {
	const isExist = await Wishlist.findById(id);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found!");
	}

	const result = await Wishlist.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});

	return result;
};

const deleteWishlist = async (id: string, userInfo: Partial<ITokenInfo>): Promise<IWishlist | null> => {
	const isExist = await Wishlist.findById(id);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "Wishlist not found!");
	}

	const result = await Wishlist.findByIdAndDelete(id);

	return result;
};

export const WishlistService = {
	createWishlist,
	getAllWishlist,
	getSingleWishlist,
	updateWishlist,
	deleteWishlist,
};
