import { Router } from "express";
import welcome from '../controllers/welcome'

const router = Router();

router
        .route('/')
        /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Welcome
   *     name: Welcoming
   *     summary: Welcoming page
   *     produces:
   *       - application/json
   *     requestBody:
   *     responses:
   *       '200':
   *             description:  Hello! Welcome to my Blog :)!
   * */
        .get(welcome.greeting);

export default router;
