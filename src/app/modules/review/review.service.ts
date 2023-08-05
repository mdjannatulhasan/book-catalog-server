/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Review } from "./review.model";
import { IReview } from "./review.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import mongoose, { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Book } from "../book/book.model";
import { ITokenInfo } from "../book/book.interface";

type IReviewReq = {
	book: string;
	reviews: string;
};
const createReview = async (review: IReviewReq): Promise<IReview | null> => {
	let newReviewAllData = null;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const book = await Book.findById(review.book);

		if (!book) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Please Select a Book");
		}

		const existingBookInReviews = await Review.findOne({ book: book._id });

		if (!existingBookInReviews) {
			newReviewAllData = await Review.create([{ book: review.book, reviews: [review.reviews] }], { session });
		} else {
			await Review.updateOne({ book: book._id }, { $push: { reviews: review.reviews } }, { new: true });

			newReviewAllData = await Review.findOne({ book: review.book });
		}

		if (!newReviewAllData) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Failed to add review");
		}

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}

	return newReviewAllData as IReview;
};

const getAllReview = async (bookId: string, paginationOptions: IPaginationOptions): Promise<IGenericResponse<IReview[]> | null> => {
	console.log("call review");

	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	const filter = { book: bookId };

	let result = await Review.find(filter).sort(sortConditions).skip(skip).limit(limit);

	const total = await Review.countDocuments(filter);

	return {
		data: result,
		meta: {
			page: Number(page),
			limit: Number(limit),
			total,
		},
	};
};

const getSingleReview = async (id: string, userInfo: Partial<ITokenInfo>): Promise<IReview | null> => {
	let result = await Review.findById(id)
		.populate("buyer")
		.populate({
			path: "book",
			populate: [
				{
					path: "seller",
				},
			],
		});

	return result;
};

const updateReview = async (id: string, payload: Partial<IReview>): Promise<IReview | null> => {
	const isExist = await Review.findById(id);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "Review not found!");
	}

	const result = await Review.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});

	return result;
};

const deleteReview = async (id: string): Promise<IReview | null> => {
	const result = await Review.findByIdAndDelete(id).populate("buyer");

	return result;
};

export const ReviewService = {
	createReview,
	getAllReview,
	getSingleReview,
	updateReview,
	deleteReview,
};
