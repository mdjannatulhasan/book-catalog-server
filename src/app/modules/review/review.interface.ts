/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IUser } from "../users/users.interface";
import { IBook } from "../book/book.interface";

export type IOrder = {
	book: Types.ObjectId | IBook;
	buyer: Types.ObjectId | IUser;
};

export type OrderModel = Model<IOrder, object>;

export type IOrderFilters = {
	searchTerm: string;
};
