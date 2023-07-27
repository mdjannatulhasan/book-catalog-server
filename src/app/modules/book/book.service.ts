/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book } from "./book.model";
import { IBook, IBookFilters, ITokenInfo } from "./book.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import mongoose, { SortOrder } from "mongoose";
// import { bookSearchableFields } from './book.constant';
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { bookSearchableFields } from "./book.constant";

const createBook = async (book: IBook): Promise<IBook | null> => {
	let newBookAllData = null;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const newBook = await Book.create([book], { session });

		if (!newBook.length) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create book");
		}

		newBookAllData = newBook[0];

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}

	// if (newBookAllData) {
	// 	newBookAllData = await Book.findById(newBookAllData.id).populate("seller");
	// }

	return newBookAllData;
};

const getAllBook = async (paginationOptions: IPaginationOptions, filters: IBookFilters): Promise<IGenericResponse<IBook[]> | null> => {
	const { searchTerm, ...filtersData } = filters;

	const andConditions = [];

	if (searchTerm) {
		andConditions.push({
			$or: bookSearchableFields.map((field) => ({
				[field]: {
					$regex: searchTerm,
					$options: "i",
				},
			})),
		});
	}

	if (Object.keys(filtersData).length) {
		if ("minPrice" in filtersData || "maxPrice" in filtersData) {
			const minPrice = (filtersData as any).minPrice;
			const maxPrice = (filtersData as any).maxPrice;

			if (typeof minPrice === "string" && typeof maxPrice === "string") {
				andConditions.push({
					price: {
						$gte: minPrice,
						$lte: maxPrice,
					},
				});
			} else if (typeof minPrice === "string") {
				andConditions.push({
					price: {
						$gte: minPrice,
					},
				});
			} else if (typeof maxPrice === "string") {
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

	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	const conditions = andConditions.length > 0 ? { $and: andConditions } : {};

	const result = await Book.find(conditions).sort(sortConditions).skip(skip).limit(limit);

	const total = await Book.countDocuments(conditions);

	return {
		data: result,
		meta: {
			page: Number(page),
			limit: Number(limit),
			total,
		},
	};
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
	const result = await Book.findById(id);

	return result;
};

const updateBook = async (id: string, payload: Partial<IBook>, userInfo: Partial<ITokenInfo>): Promise<IBook | null> => {
	const isExist = await Book.findById(id);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "Book not found!");
	}

	// if (isExist?.addedBy.toString() !== userInfo._id) {
	// 	throw new ApiError(httpStatus.FORBIDDEN, "Only owner can modify the information");
	// }

	// if (payload.addedBy) {
	// 	const isSeller = await User.findById(payload.seller);
	// }

	const result = await Book.findOneAndUpdate({ _id: id }, payload, {
		new: true,
	});

	return result;
};

const deleteBook = async (id: string, userInfo: Partial<ITokenInfo>): Promise<IBook | null> => {
	const isExist = await Book.findById(id);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "Book not found!");
	}

	// if (isExist?.addedBy.toString() !== userInfo._id) {
	// 	throw new ApiError(httpStatus.FORBIDDEN, "Only owner can remove this book");
	// }

	const result = await Book.findByIdAndDelete(id);

	return result;
};

export const BookService = {
	createBook,
	getAllBook,
	getSingleBook,
	updateBook,
	deleteBook,
};
