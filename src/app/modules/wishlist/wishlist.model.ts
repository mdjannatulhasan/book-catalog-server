import { Schema, Types, model } from "mongoose";
import { IWishlist, WishlistModel } from "./wishlist.interface";

export const WishlistSchema = new Schema<IWishlist, WishlistModel>(
	{
		book: {
			type: Types.ObjectId,
			ref: "Book",
			required: true,
		},
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		wishlist: [
			{
				type: String,
				required: true,
			},
		],
		otherList: {
			type: Object,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

export const Wishlist = model<IWishlist, WishlistModel>("Wishlist", WishlistSchema);
