/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IUser } from "./users.interface";
import config from "../../../config";
import { User } from "./users.model";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { ITokenInfo } from "../book/book.interface";
import bcrypt from "bcrypt";

const createUser = async (user: IUser): Promise<IUser | null> => {
	if (!user.password) {
		user.password = config.default_user_pass as string;
	}

	let newUserAllData = null;
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const newUser = await User.create([user], { session });

		if (!newUser.length) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
		}
		newUserAllData = User.findById(newUser[0]._id);

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}
	return newUserAllData;
};

const getAllUser = async (paginationOptions: IPaginationOptions): Promise<IGenericResponse<IUser[]> | null> => {
	const { skip, page, limit, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);

	const sortConditions: { [key: string]: SortOrder } = {};

	if (sortBy && sortConditions) {
		sortConditions[sortBy] = sortOrder;
	}

	const result = await User.find().sort(sortConditions).skip(skip).limit(limit);

	const total = await User.countDocuments();

	return {
		data: result,
		meta: {
			page: Number(page),
			limit: Number(limit),
			total,
		},
	};
};

const getSingleUser = async (id: string, userInfo: Partial<ITokenInfo>): Promise<IUser | null> => {
	const userId = id || userInfo._id;
	const result = await User.findById(userId);

	return result;
};
const updateUser = async (id: string, payload: Partial<IUser>, userInfo: Partial<ITokenInfo>): Promise<IUser | null> => {
	const userId = id || userInfo._id;

	const isExist = await User.findById(userId);

	if (!isExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
	}

	const { name, ...userData } = payload;

	const updatedUserData: Partial<IUser> = { ...userData };

	if (name && Object.keys(name).length > 0) {
		Object.keys(name).forEach((key) => {
			const nameKey = `name.${key}` as keyof Partial<IUser>;
			(updatedUserData as any)[nameKey] = name[key as keyof typeof name];
		});
	}
	if (updatedUserData.password) {
		updatedUserData.password = await bcrypt.hash(updatedUserData.password, Number(config.bycrypt_salt_rounds));
	}
	const result = await User.findOneAndUpdate({ _id: userId }, updatedUserData, {
		new: true,
	});

	return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
	const result = await User.findByIdAndDelete(id);

	return result;
};

export const UserService = {
	createUser,
	getAllUser,
	getSingleUser,
	updateUser,
	deleteUser,
};
