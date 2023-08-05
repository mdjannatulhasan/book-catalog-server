import { Schema, model } from "mongoose";
import { ReviewModel, IReview } from "./review.interface";
import { string } from "zod";

export const ReviewSchema = new Schema<IReview, ReviewModel>(
	{
		book: {
			type: Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},
		reviews: {
			type: [String],
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

export const Review = model<IReview, ReviewModel>("Review", ReviewSchema);
