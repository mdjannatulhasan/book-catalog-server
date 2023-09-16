import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

const authGeneral = () => async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization;

		if (token) {
			let verifyUser: JwtPayload | null = null;

			try {
				verifyUser = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;
				req.user = verifyUser;
			} catch (e) {}
		}

		next();
	} catch (er) {
		next(er);
	}
};

export default authGeneral;
