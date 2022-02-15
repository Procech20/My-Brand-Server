import '@babel/polyfill';
import express, { json } from 'express';
import fileupload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';
import 'colors';

import logger from './middlewares/logger';
import routes from './routes/index';
import welcome from './routes/welcome';
import connectDB from './config/db.config';

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
