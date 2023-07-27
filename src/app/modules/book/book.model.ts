import { Schema, model } from "mongoose";
import { BookModel, IBook } from "./book.interface";

export const BookSchema = new Schema<IBook, BookModel>(
	{
		code: {
			type: String,
			required: true,
		},
		title: { type: String, required: true },
		coverImage: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		genre: {
			type: String,
			required: true,
		},
		publicationDate: {
			type: String,
			required: true,
		},
		addedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

export const Book = model<IBook, BookModel>("Book", BookSchema);
