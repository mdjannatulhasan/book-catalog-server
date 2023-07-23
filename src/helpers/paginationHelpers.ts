import { SortOrder } from 'mongoose';
import { IPaginationOptions } from '../app/interfaces/pagination';

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: SortOrder;
};

const calculatePagination = (option: IPaginationOptions): IOptionsResult => {
    const { page = 1, limit = 10 } = option;

    const skip = (page - 1) * limit;

    const sortBy = option.sortBy || 'updatedAt';
    const sortOrder = option.sortOrder || 1;

    return { skip, page, limit, sortBy, sortOrder };
};

export const paginationHelpers = {
    calculatePagination,
};
