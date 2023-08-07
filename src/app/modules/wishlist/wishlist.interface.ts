/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IUser } from "../users/users.interface";
import { IBook } from "../book/book.interface";

export type IReadingStatus = "READ_IN_FUTURE" | "READING" | "COMPLETED_READING" | "REMOVE";

export type IWishlist = {
	user: Types.ObjectId | IUser;
	wishlist?: Types.ObjectId[] | IBook[];
	otherList?: [
		{
			bookId: Types.ObjectId[] | IBook[];
			status: IReadingStatus;
		}
	];
};

export type WishlistModel = Model<IWishlist, object>;

export type ITokenInfo = {
	email: string;
	iat: number;
	exp: number;
};
