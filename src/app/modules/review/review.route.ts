import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./review.validation";
import { OrderController } from "./review.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post("/", validateRequest(OrderValidation.createOrderZodSchema), auth(ENUM_USER_ROLE.BUYER), OrderController.createOrder);

router.get("/:id", auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN), OrderController.getSingleOrder);

// router.delete('/:id', OrderController.deleteOrder);

router.get("/", auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN), OrderController.getAllOrder);

export const OrderRoutes = router;
