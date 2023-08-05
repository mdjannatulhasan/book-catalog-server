/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wishlist } from "./wishlist.model";
import { IWishlist, ITokenInfo } from "./wishlist.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import mongoose, { SortOrder, Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../users/users.model";
import { JwtPayload } from "jsonwebtoken";
import { Book } from "../book/book.model";
import { IBook } from "../book/book.interface";

function isIdInArray(array: Array<any>, id: Types.ObjectId): boolean {
	return array.some((item) => item instanceof Types.ObjectId && item.equals(id));
}

const createWishlist = async (user: JwtPayload, book: string): Promise<IWishlist | null> => {
	let newWishlistAllData = null;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const userExist = await User.findOne({ email: user.email });
		if (!userExist) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid User data");
		}
		const bookExist = await Book.findById(book);
		if (!bookExist) {
			throw new ApiError(httpStatus.BAD_REQUEST, "No book exists");
		}

		const isWishlistExists = await Wishlist.findOne({ user: userExist._id });

		if (!isWishlistExists) {
			const newWishlist = await Wishlist.create([{ user: userExist?._id, wishlist: [book] }], { session });

			if (!newWishlist.length) {
				throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create wishlist");
			}
			newWishlistAllData = newWishlist[0];
		} else {
			const bookId = new mongoose.Types.ObjectId(book);

			if (isIdInArray(isWishlistExists.wishlist, bookId)) {
				newWishlistAllData = await Wishlist.updateOne({ user: userExist._id }, { $pull: { wishlist: bookExist._id } }, { new: true });
			} else {
				newWishlistAllData = await Wishlist.updateOne({ user: userExist._id }, { $push: { wishlist: book } }, { new: true });
			}
		}

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}

	return newWishlistAllData as IWishlist;
};

const getAllWishlist = async (paginationOptions: IPaginationOptions, user: JwtPayload): Promise<IGenericResponse<IWishlist[]> | null> => {
	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}
	const isUserExists = await User.findOne({ email: user.email });

	if (!isUserExists) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid User data");
	}

	const result = await Wishlist.find({ user: isUserExists._id }).populate({
		path: "wishlist",
		model: "Book",
	});
	// const result = await Wishlist.find({}).sort(sortConditions).skip(skip).limit(limit);

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
