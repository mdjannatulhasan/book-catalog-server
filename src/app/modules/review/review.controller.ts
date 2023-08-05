import { Request, RequestHandler, Response } from "express";
import { ReviewService } from "./review.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { pagination } from "../../constants/pagination";
import { IReview } from "./review.interface";

const createReview: RequestHandler = async (req, res, next) => {
	try {
		const { ...reviewData } = req.body;
		const result = await ReviewService.createReview(reviewData);
		sendResponse<IReview>(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Review Created successfully",
			meta: null,
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getAllReview = catchAsync(async (req: Request, res: Response) => {
	const paginationOptions = pick(req.query, pagination);
	const bookId = req.params.id;
	const result = await ReviewService.getAllReview(bookId, paginationOptions);

	sendResponse<IReview[]>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Reviews retrived successfully",
		meta: result?.meta || null,
		data: result?.data,
	});
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = req.user;
	const result = await ReviewService.getSingleReview(id, user);

	sendResponse<IReview>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Review retrived successfully",
		data: result,
	});
});

const getBookReview = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = req.user;
	const result = await ReviewService.getSingleReview(id, user);

	sendResponse<IReview>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Review retrived successfully",
		data: result,
	});
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const updatedData = req.body as Partial<IReview>;

	const result = await ReviewService.updateReview(id, updatedData);

	sendResponse<IReview>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Review updated successfully",
		data: result,
	});
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const result = await ReviewService.deleteReview(id);

	sendResponse<IReview>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Review Deleted successfully",
		data: result,
	});
});

export const ReviewController = {
	createReview,
	getAllReview,
	getSingleReview,
	updateReview,
	deleteReview,
	getBookReview,
};
