import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { WishlistValidation } from "./wishlist.validation";
import { WishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), validateRequest(WishlistValidation.createWishlistZodSchema), WishlistController.createWishlist);

router.get("/:id", WishlistController.getSingleWishlist);

router.patch("/:id", validateRequest(WishlistValidation.updateWishlistZodSchema), WishlistController.updateWishlist);

router.delete("/:id", WishlistController.deleteWishlist);

router.get("/", WishlistController.getAllWishlist);

export const WishlistRoutes = router;
