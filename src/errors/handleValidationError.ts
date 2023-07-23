import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../app/interfaces/error';
import { IGenericErrorResponse } from './common';

const handleValidationError = (
    err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = Object.values(err.errors).map(
        (elem: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: elem?.path,
                message: elem?.message,
            };
        }
    );
    const statusCode = 400;

    return {
        statusCode,
        message: 'Validation Error',
        errorMessages: errors,
    };
};
export default handleValidationError;
