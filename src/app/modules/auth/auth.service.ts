/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../../config";
import { ILoginUser } from "./auth.interface";
import { User } from "../users/users.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { ExtendedIUser, IUser } from "../users/users.interface";

const loginUser = async (payload: ILoginUser) => {
	console.log("user login");

	const user = new User();
	const { email, password } = payload;

	// if (!user.password) {
	//     user.password = config.default_user_pass as string;
	// }

	// let newUserAllData = null;

	const isUserExists = (await user.isUserExists(email)) as ExtendedIUser;
	console.log(isUserExists);

	if (!isUserExists) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not exists");
	}

	const isPasswordMatched = await user.isPasswordMatched(password, isUserExists.password as string);

	if (!isPasswordMatched) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
	}
	const accessToken = jwtHelpers.createToken(
		{
			id: isUserExists._id,
			email: isUserExists.email,
			role: isUserExists.role,
		},
		config.jwt.secret as Secret,
		{
			expiresIn: config.jwt.expires_in,
		}
	);
	const refreshToken = jwtHelpers.createToken({ id: isUserExists._id, email: isUserExists.email, role: isUserExists.role }, config.jwt.refresh_secret as Secret, {
		expiresIn: config.jwt.refresh_expires_in,
	});
	return {
		id: isUserExists._id,
		role: isUserExists.role,
		accessToken,
		refreshToken,
	};
};

const refreshToken = async (token: string) => {
	const user = new User();
	let verifiedToken: JwtPayload | null = null;
	try {
		verifiedToken = jwt.verify(token, config.jwt.refresh_secret as Secret) as JwtPayload;
	} catch (err) {
		throw new ApiError(httpStatus.FORBIDDEN, "Refresh Token is invalid");
	}

	const { email } = verifiedToken;

	const isUserExists = (await user.isUserExists(email)) as ExtendedIUser;
	console.log(isUserExists);

	if (!isUserExists) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	const accessToken = jwtHelpers.createToken({ id: isUserExists._id, email: email, role: isUserExists.role }, config.jwt.refresh_secret as Secret, {
		expiresIn: config.jwt.refresh_expires_in,
	});
	return {
		accessToken: accessToken,
	};
};

export const AuthService = {
	loginUser,
	refreshToken,
};
