/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IUser } from "../users/users.interface";
import { IBook } from "../book/book.interface";

export type IReview = {
	book: Types.ObjectId | IBook;
	reviews: string[];
};

export type ReviewModel = Model<IReview, object>;

export type IReviewFilters = {
	searchTerm: string;
};
