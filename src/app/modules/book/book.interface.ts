/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IUser } from "../users/users.interface";

export type IBook = {
	code: string;
	title: string;
	coverImage: string;
	price: number;
	author: string;
	genre: string;
	publicationDate: string;
	addedBy: Types.ObjectId | IUser;
};
export type BookModel = Model<IBook, object>;

export type IBookFilters = {
	searchTerm: string;
	genre: string;
	year: string;
};
export type ITokenInfo = {
	_id: string;
	role: string;
	iat: number;
	exp: number;
};
