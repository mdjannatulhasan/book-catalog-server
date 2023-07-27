import { Request, RequestHandler, Response } from "express";
import { OrderService } from "./review.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { pagination } from "../../constants/pagination";
import { IOrder } from "./review.interface";

const createOrder: RequestHandler = async (req, res, next) => {
	try {
		const { ...orderData } = req.body;

		const result = await OrderService.createOrder(orderData);
		sendResponse<IOrder>(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Order Created successfully",
			meta: null,
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
	const paginationOptions = pick(req.query, pagination);
	const userInfo = req.user;
	const result = await OrderService.getAllOrder(paginationOptions, userInfo);

	sendResponse<IOrder[]>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Orders retrived successfully",
		meta: result?.meta || null,
		data: result?.data,
	});
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = req.user;
	const result = await OrderService.getSingleOrder(id, user);

	sendResponse<IOrder>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Order retrived successfully",
		data: result,
	});
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const updatedData = req.body as Partial<IOrder>;

	const result = await OrderService.updateOrder(id, updatedData);

	sendResponse<IOrder>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Order updated successfully",
		data: result,
	});
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const result = await OrderService.deleteOrder(id);

	sendResponse<IOrder>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Order Deleted successfully",
		data: result,
	});
});

export const OrderController = {
	createOrder,
	getAllOrder,
	getSingleOrder,
	updateOrder,
	deleteOrder,
};
