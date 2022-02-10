import '@babel/polyfill';
import express, { json } from 'express';
import fileupload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';
import 'colors';

import logger from './App/middlewares/logger';
import routes from './App/routes/index';
import welcome from './App/routes/welcome';
import connectDB from './Database/config/db.config';

// Initialising the app with express
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Initialise logger middleware
app.use(logger);
app.use(morgan('dev'));
app.use(fileupload({ useTempFiles: true }));

// Mounting express json
app.use(json());

// Mounting routes
app.use('/', welcome);
app.use('/api', routes);

// Test DB Connection
connectDB();

export default app;
