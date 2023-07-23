import { IGenericErrorMessage } from '../app/interfaces/error';

export type IGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
};
