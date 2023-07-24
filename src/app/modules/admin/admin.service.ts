/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { ILoginUser } from "../auth/auth.interface";

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
	let newAdminAllData = null;
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		admin.role = "admin";

		const newAdmin = await Admin.create([admin], { session });

		if (!newAdmin.length) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create admin");
		}
		newAdminAllData = Admin.findById(newAdmin[0]._id);

		await session.commitTransaction();
		await session.endSession();
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		throw error;
	}

	return newAdminAllData;
};
const loginAdmin = async (payload: ILoginUser) => {
	const admin = new Admin();
	const { email, password } = payload;

	const isAdminExists = await admin.isAdminExists(email);

	if (!isAdminExists) {
		throw new ApiError(httpStatus.NOT_FOUND, "Admin not exists");
	}

	const isPasswordMatched = await admin.isPasswordMatched(password, isAdminExists.password as string);

	if (!isPasswordMatched) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
	}
	const accessToken = jwtHelpers.createToken(
		{
			_id: isAdminExists._id,
			role: isAdminExists.role,
		},
		config.jwt.secret as Secret,
		{
			expiresIn: config.jwt.expires_in,
		}
	);
	const refreshToken = jwtHelpers.createToken(
		{
			_id: isAdminExists._id,
			role: isAdminExists.role,
		},
		config.jwt.refresh_secret as Secret,
		{
			expiresIn: config.jwt.refresh_expires_in,
		}
	);
	return {
		accessToken,
		refreshToken,
	};
};
export const AdminService = {
	createAdmin,
	loginAdmin,
};
