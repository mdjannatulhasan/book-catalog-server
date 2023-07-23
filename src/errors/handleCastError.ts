import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../app/interfaces/error';

export const handleCastError = (error: mongoose.Error.CastError) => {
    const statusCode = 400;
    const errors: IGenericErrorMessage[] = [
        {
            path: error?.path,
            message: 'Invalid Id',
        },
    ];
    return {
        statusCode,
        message: 'Cast Error',
        errorMessages: errors,
    };
};
