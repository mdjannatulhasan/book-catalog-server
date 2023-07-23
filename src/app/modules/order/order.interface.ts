/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IUser } from '../users/users.interface';
import { ICow } from '../cow/cow.interface';

export type IOrder = {
    cow: Types.ObjectId | ICow;
    buyer: Types.ObjectId | IUser;
};

export type OrderModel = Model<IOrder, object>;

export type IOrderFilters = {
    searchTerm: string;
};
