import { Schema, Types, model } from "mongoose";
import { IWishlist, WishlistModel } from "./wishlist.interface";

export const WishlistSchema = new Schema<IWishlist, WishlistModel>(
	{
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		wishlist: [
			{
				type: Types.ObjectId,
				ref: "Book",
				required: true,
			},
		],
		otherList: [
			{
				bookId: {
					type: Types.ObjectId,
					ref: "Book",
					required: true,
				},
				status: {
					type: String,
					enum: ["READ_IN_FUTURE", "READING", "COMPLETED_READING"],
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

export const Wishlist = model<IWishlist, WishlistModel>("Wishlist", WishlistSchema);
