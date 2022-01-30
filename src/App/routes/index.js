import { Router } from 'express';
import blogs from './blog';
import users from './users';
import auth from './auth';
import noRoute from './error';
// import docs from '../documentation/docs';

const router = Router();

router.use('/blogs', blogs);
router.use('/users', users);
// router.use('/docs', docs);
router.use('/auth', auth);
router.use('/*', noRoute);

export default router;
