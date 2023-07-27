import { Request, RequestHandler, Response } from "express";
import { BookService } from "./book.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { pagination } from "../../constants/pagination";
import { bookFilterableFields } from "./book.constant";
import { IBook, IBookFilters } from "./book.interface";

const createBook: RequestHandler = async (req, res, next) => {
	try {
		const { ...bookData } = req.body;

		const result = await BookService.createBook(bookData);
		sendResponse<IBook>(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Book Created successfully",
			meta: null,
			data: result,
		});
	} catch (err) {
		next(err);
	}
};

const getAllBook = catchAsync(async (req: Request, res: Response) => {
	const filterOptions = pick(req.query, bookFilterableFields);
	const paginationOptions = pick(req.query, pagination);

	const result = await BookService.getAllBook(paginationOptions, filterOptions as IBookFilters);

	sendResponse<IBook[]>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Books retrived successfully",
		meta: result?.meta || null,
		data: result?.data,
	});
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const result = await BookService.getSingleBook(id);

	sendResponse<IBook>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Book retrived successfully",
		data: result,
	});
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;

	const updatedData = req.body as Partial<IBook>;
	const user = req.user;

	const result = await BookService.updateBook(id, updatedData, user);

	sendResponse<IBook>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Book updated successfully",
		data: result,
	});
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const user = req.user;
	const result = await BookService.deleteBook(id, user);

	sendResponse<IBook>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Book Deleted successfully",
		data: result,
	});
});

export const BookController = {
	createBook,
	getAllBook,
	getSingleBook,
	updateBook,
	deleteBook,
};
