import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
	console.log("auth");

	try {
		const token = req.headers.authorization;

		if (!token) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorised");
		}
		let verifyUser: JwtPayload | null = null;

		try {
			verifyUser = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;
		} catch (e) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorised");
		}
		req.user = verifyUser;

		next();
	} catch (er) {
		next(er);
	}
};

export default auth;
