import { Router } from 'express';
import blogs from './blogs';
import users from './users';
import auth from './auth';
import querry from './querries';
import noRoute from './error';
import docs from '../documentation/docs';

const router = Router();

router.use('/auth', auth);
router.use('/blogs', blogs);
router.use('/docs', docs);
router.use('/querries', querry);
router.use('/users', users);
router.use('/*', noRoute);

export default router;
