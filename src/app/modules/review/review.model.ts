import { Schema, model } from "mongoose";
import { OrderModel, IOrder } from "./review.interface";

export const OrderSchema = new Schema<IOrder, OrderModel>(
	{
		book: {
			type: Schema.Types.ObjectId,
			ref: "Book",
			required: true,
		},
		buyer: {
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

export const Order = model<IOrder, OrderModel>("Order", OrderSchema);
