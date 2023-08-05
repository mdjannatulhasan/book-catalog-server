import { Request, RequestHandler, Response } from "express";
import { WishlistService } from "./wishlist.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { pagination } from "../../constants/pagination";
import { IWishlist } from "./wishlist.interface";

const createWishlist: RequestHandler = async (req, res, next) => {
	try {
		const id = req.params.id;
		const user = req.user;

		const result = await WishlistService.createWishlist(user, id);

		sendResponse<IWishlist>(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Wishlist Created successfully",
			meta: null,
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getAllWishlist = catchAsync(async (req: Request, res: Response) => {
	const paginationOptions = pick(req.query, pagination);
	const user = req.user;
	const result = await WishlistService.getAllWishlist(paginationOptions, user);

	sendResponse<IWishlist[]>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wishlists retrived successfully",
		meta: result?.meta || null,
		data: result?.data,
	});
});

const getSingleWishlist = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	console.log(id);

	const result = await WishlistService.getSingleWishlist(id);

	sendResponse<IWishlist>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wishlist retrived successfully",
		data: result,
	});
});

const updateWishlist = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const updatedData = req.body as Partial<IWishlist>;
	const user = req.user;

	const result = await WishlistService.updateWishlist(id, updatedData, user);

	sendResponse<IWishlist>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wishlist updated successfully",
		data: result,
	});
});

const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = req.user;
	const result = await WishlistService.deleteWishlist(id, user);

	sendResponse<IWishlist>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Wishlist Deleted successfully",
		data: result,
	});
});

export const WishlistController = {
	createWishlist,
	getAllWishlist,
	getSingleWishlist,
	updateWishlist,
	deleteWishlist,
};
