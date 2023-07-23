/* eslint-disable no-undefined */
import { Response } from 'express';

type IApiResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
    } | null;
    data?: T | null;
};
export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
    const responseData: IApiResponse<T> = {
        success: data.success,
        statusCode: data.statusCode,
        message: data.message || null,
        data: data.data || null,
        meta: data.meta || null,
    };
    // res.status(data.statusCode).json(responseData);
    res.json(responseData);
    res.status(data.statusCode);
};
