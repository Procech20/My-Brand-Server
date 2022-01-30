import { Router } from 'express';
import routeValidators from '../middlewares/validator';
import auth from '../controllers/auth';
import routeProtection from '../middlewares/token';

const { loginValidate, signupValidate } = routeValidators;

const router = Router();

router.route('/register')
        .post(signupValidate, auth.register);

router.route('/login')
        .post(loginValidate, auth.login);

router.route('/me')
        .get(routeProtection.protect, auth.logged);

export default router;
