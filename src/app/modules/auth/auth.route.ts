import express from 'express';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { UserValidation } from '../users/user.validation';
import { UserController } from '../users/user.controller';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginZodSchema),
    AuthController.loginUser
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenZodSchema),
    AuthController.refreshToken
);

router.post(
    '/signup',
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
);

export const AuthRoutes = router;
