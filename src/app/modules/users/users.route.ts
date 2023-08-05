import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/signup", validateRequest(UserValidation.createUserZodSchema), UserController.createUser);
router.get(
	"/my-profile",
	// auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
	UserController.getSingleUser
);
router.patch(
	"/my-profile",
	// auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
	validateRequest(UserValidation.updateUserZodSchema),
	UserController.updateUser
);
router.get(
	"/:id", // auth(ENUM_USER_ROLE.ADMIN),
	UserController.getSingleUser
);

router.patch(
	"/:id",
	// auth(ENUM_USER_ROLE.ADMIN),
	validateRequest(UserValidation.updateUserZodSchema),
	UserController.updateUser
);

router.delete("/:id", auth(), UserController.deleteUser);

router.get("/", auth(), UserController.getAllUser);

export const UserRoutes = router;
