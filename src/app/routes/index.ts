import express from "express";
import { UserRoutes } from "../modules/users/users.route";
import { BookRoutes } from "../modules/book/book.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = express.Router();

const moduleRoutes = [
	{
		path: "/users",
		route: UserRoutes,
	},
	{
		path: "/books",
		route: BookRoutes,
	},
	{
		path: "/auth",
		route: AuthRoutes,
	},
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
