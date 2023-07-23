import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';
import { CowController } from './cow.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
    '/',
    validateRequest(CowValidation.createCowZodSchema),
    auth(ENUM_USER_ROLE.SELLER),
    CowController.createCow
);

router.get(
    '/:id',
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
    CowController.getSingleCow
);

router.patch(
    '/:id',
    validateRequest(CowValidation.updateCowZodSchema),
    auth(ENUM_USER_ROLE.SELLER),
    CowController.updateCow
);

router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

router.get(
    '/',
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
    CowController.getAllCow
);

export const CowRoutes = router;
