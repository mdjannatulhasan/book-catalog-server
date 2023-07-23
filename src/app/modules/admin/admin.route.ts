import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';
import { AuthValidation } from '../auth/auth.validation';

const router = express.Router();

router.post(
    '/create-admin',
    validateRequest(AdminValidation.createAdminZodSchema),
    AdminController.createAdmin
);

router.post(
    '/login',
    validateRequest(AuthValidation.loginZodSchema),
    AdminController.loginAdmin
);

// router.get('/:id', AdminController.getSingleAdmin);

// router.patch(
//     '/:id',
//     validateRequest(AdminValidation.updateAdminZodSchema),
//     AdminController.updateAdmin
// );

// router.delete('/:id', AdminController.deleteAdmin);

// router.get('/', AdminController.getAllAdmin);

export const AdminRoutes = router;
