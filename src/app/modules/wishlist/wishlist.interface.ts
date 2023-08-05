/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IUser } from "../users/users.interface";
import { IBook } from "../book/book.interface";

export type IWishlist = {
	book: Types.ObjectId | IBook;
	user: Types.ObjectId | IUser;
	wishlist: string[];
	otherList: object;
};

export type WishlistModel = Model<IWishlist, object>;

export type ITokenInfo = {
	_id: string;
	role: string;
	iat: number;
	exp: number;
};
