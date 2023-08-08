import { Request, Response } from "express";
// import config from '../../../config';
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../../config";

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const { ...loginData } = req.body;
	console.log("User: ", loginData);
	const result = await AuthService.loginUser(loginData);
	const { refreshToken, ...others } = result;

	const cookieOptions = {
		secure: config.env === "production",
		httpOnly: true,
	};

	res.cookie("refreshToken", refreshToken, cookieOptions);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User Logged in successfully!",
		data: others,
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const { refreshToken } = req.cookies;
	const result = await AuthService.refreshToken(refreshToken);

	const cookieOptions = {
		secure: config.env === "production",
		httpOnly: true,
	};

	res.cookie("refreshToken", refreshToken, cookieOptions);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "New access token generated successfully!",
		data: result,
	});
});

export const AuthController = {
	loginUser,
	refreshToken,
};
