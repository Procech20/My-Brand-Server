import { Router } from 'express';
import routeValidators from '../middlewares/validator';
import routeProtection from '../middlewares/token';
import userServices from '../controllers/user';

const {
        getUsers, createUser, deleteUser, getUser, updatedUser,
} = userServices;

const router = Router();

router.route('/')
        .get(routeProtection.protect, routeProtection.isAdmin, getUsers)
        .post(routeProtection.protect, routeProtection.isAdmin,
                routeValidators.signupValidate, createUser);
router.route('/:id')
        .get(routeProtection.protect, routeProtection.isAdmin, getUser)
        .patch(routeProtection.protect, routeProtection.isAdmin, updatedUser)
        .delete(routeProtection.protect, routeProtection.isAdmin, deleteUser);

export default router;
