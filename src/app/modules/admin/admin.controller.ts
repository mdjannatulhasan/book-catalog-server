import { Request, RequestHandler, Response } from 'express';
import { AdminService } from './admin.service';
import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IAdmin } from './admin.interface';
import { catchAsync } from '../../../shared/catchAsync';
import config from '../../../config';

const createAdmin: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const { ...adminData } = req.body;

        const result = await AdminService.createAdmin(adminData);
        sendResponse<IAdmin>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Admin Created successfully',
            meta: null,
            data: result,
        });
    }
);
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AdminService.loginAdmin(loginData);
    const { refreshToken, ...others } = result;

    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin Logged in successfully!',
        data: others,
    });
});

export const AdminController = {
    createAdmin,
    loginAdmin,
};
