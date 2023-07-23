import { Request, RequestHandler, Response } from 'express';
import { CowService } from './cow.service';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { pick } from '../../../shared/pick';
import { pagination } from '../../constants/pagination';
import { cowFilterableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';

const createCow: RequestHandler = async (req, res, next) => {
    try {
        const { ...cowData } = req.body;

        const result = await CowService.createCow(cowData);
        sendResponse<ICow>(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Cow Created successfully',
            meta: null,
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

const getAllCow = catchAsync(async (req: Request, res: Response) => {
    const filterOptions = pick(req.query, cowFilterableFields);
    const paginationOptions = pick(req.query, pagination);

    const result = await CowService.getAllCow(
        paginationOptions,
        filterOptions as ICowFilters
    );

    sendResponse<ICow[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cows retrived successfully',
        meta: result?.meta || null,
        data: result?.data,
    });
});

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CowService.getSingleCow(id);

    sendResponse<ICow>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cow retrived successfully',
        data: result,
    });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;

    const updatedData = req.body as Partial<ICow>;
    const user = req.user;

    const result = await CowService.updateCow(id, updatedData, user);

    sendResponse<ICow>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cow updated successfully',
        data: result,
    });
});

const deleteCow = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user;
    const result = await CowService.deleteCow(id, user);

    sendResponse<ICow>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cow Deleted successfully',
        data: result,
    });
});

export const CowController = {
    createCow,
    getAllCow,
    getSingleCow,
    updateCow,
    deleteCow,
};
