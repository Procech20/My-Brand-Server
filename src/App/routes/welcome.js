import { Router } from "express";
import welcome from '../controllers/welcome'

const router = Router();

router
        .route('/')
        .get(welcome.greeting);

export default router;
