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
import { User } from "../users/users.model";
import { ExtendedIUser, IUser } from "../users/users.interface";

const createBook = async (book: IBook, userInfo: Partial<ITokenInfo>): Promise<IBook | null> => {
	let newBookAllData = null;
	console.log(userInfo);

	const session = await mongoose.startSession();

	book.price = book.price || 0;
	book.code = book.code || "";

	const user = (await User.findOne({ email: userInfo.email })) as IUser;

	console.log(user);

	if (user) {
		book.addedBy = user;
	}

	if (user.role == "admin" && !book.status) {
		book.status = "published";
	} else {
		book.status = "pending";
	}

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

const getAllBook = async (paginationOptions: IPaginationOptions, filters: IBookFilters, userInfo: Partial<ITokenInfo>): Promise<IGenericResponse<IBook[]> | null> => {
	const { searchTerm, year, ...filtersData } = filters;

	const user = (await User.findOne({ email: userInfo?.email })) as IUser;

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
	if (year) {
		andConditions.push({
			publicationDate: {
				$regex: `^${year}`,
			},
		});
	}

	if (Object.keys(filtersData).length)
		andConditions.push({
			$and: Object.entries(filtersData).map(([field, value]) => ({
				[field]: value,
			})),
		});

	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	const conditions = andConditions.length > 0 ? { $and: andConditions } : {};

	if (user?.role !== "admin") {
		(conditions as any).status = "published";
	}

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

const getMyBooks = async (paginationOptions: IPaginationOptions, filters: IBookFilters, userInfo: Partial<ITokenInfo>): Promise<IGenericResponse<IBook[]> | null> => {
	const { searchTerm, year, ...filtersData } = filters;

	const user = (await User.findOne({ email: userInfo?.email })) as ExtendedIUser;

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
	if (year) {
		andConditions.push({
			publicationDate: {
				$regex: `^${year}`,
			},
		});
	}

	if (Object.keys(filtersData).length)
		andConditions.push({
			$and: Object.entries(filtersData).map(([field, value]) => ({
				[field]: value,
			})),
		});

	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	const conditions = andConditions.length > 0 ? { $and: andConditions } : {};

	if (user?.role !== "admin") {
		(conditions as any).addedBy = user._id;
	}

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

	const user = (await User.findOne({ email: userInfo.email })) as ExtendedIUser;

	if (user.role != "admin" && payload.status) {
		payload.status = "pending";
	}

	if (isExist?.addedBy.toString() !== user._id.toString() && user.role != "admin") {
		throw new ApiError(httpStatus.FORBIDDEN, "Only owner can modify the information");
	}

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
	const user = (await User.findOne({ email: userInfo.email })) as IUser;

	if (isExist?.addedBy.toString() !== userInfo._id || user.role !== "admin") {
		throw new ApiError(httpStatus.FORBIDDEN, "Only owner can remove this book");
	}

	const result = await Book.findByIdAndDelete(id);

	return result;
};

export const BookService = {
	createBook,
	getAllBook,
	getMyBooks,
	getSingleBook,
	updateBook,
	deleteBook,
};
