import '@babel/polyfill';
import express, { json } from 'express';
import dotenv from 'dotenv';
import 'colors';
import logger from './App/middlewares/logger';
import routes from './App/routes/index';
import welcome from './App/routes/welcome';
import connectDB from './Database/config/db.config'

// Load env vars
dotenv.config();

// Initialising the app with express
const app = express();

app.use(express.urlencoded({ extended: false }));

// Initialise logger middleware
app.use(logger);

// Mounting express json
app.use(json());

// Mounting routes
app.use('/', welcome);
app.use('/api/v1', routes);

// Test DB Connection
connectDB()

export default app;
