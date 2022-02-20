import { Router } from 'express';
import auth from './auth';
import blogs from './blogs';
import comments from './comment';
import docs from '../documentation/docs';
import users from './users';
import querry from './querries';
import noRoute from './error';

const router = Router();

router.use('/auth', auth);
router.use('/blogs', blogs);
router.use('/blogs/comments', comments);
router.use('/docs', docs);
router.use('/querries', querry);
router.use('/users', users);
router.use('/*', noRoute);

export default router;
