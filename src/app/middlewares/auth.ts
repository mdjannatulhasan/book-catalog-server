import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';

const auth =
    (...requiredRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorised'
                );
            }
            let verifyUser: JwtPayload | null = null;

            verifyUser = jwt.verify(
                token,
                config.jwt.secret as Secret
            ) as JwtPayload;

            req.user = verifyUser;

            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifyUser.role)
            ) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    'Unathorised action. You are not allowed'
                );
            }
            next();
        } catch (er) {
            next(er);
        }
    };

export default auth;
