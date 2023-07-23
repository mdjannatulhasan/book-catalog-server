import express from 'express';
import { UserRoutes } from '../modules/users/users.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrderRoutes } from '../modules/order/order.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/cows',
        route: CowRoutes,
    },
    {
        path: '/orders',
        route: OrderRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/admins',
        route: AdminRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
