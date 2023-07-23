import { Request, RequestHandler, Response } from 'express';
import { UserService } from './users.service';
import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IUser } from './users.interface';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { pagination } from '../../constants/pagination';

const createUser: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const { ...userData } = req.body;

        const result = await UserService.createUser(userData);
        sendResponse<IUser>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User Created successfully',
            meta: null,
            data: result,
        });
    }
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, pagination);
    const result = await UserService.getAllUser(paginationOptions);

    sendResponse<IUser[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrived successfully',
        meta: result?.meta || null,
        data: result?.data,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user;
    const result = await UserService.getSingleUser(id, user);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrived successfully',
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const updatedData = req.body as Partial<IUser>;
    const user = req.user;
    const result = await UserService.updateUser(id, updatedData, user);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await UserService.deleteUser(id);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Deleted successfully',
        data: result,
    });
});

export const UserController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
};
