import '@babel/polyfill';
import express, { json } from 'express';
import dotenv, { config} from 'dotenv';
import morgan from 'morgan';
import 'colors';


import logger from './App/middlewares/logger';
import routes from './App/routes/index';
import welcome from './App/routes/welcome';
import connectDB from './Database/config/db.config'

// Load env vars
config();

// Initialising the app with express
const app = express();

app.use(express.urlencoded({ extended: false }));

// Initialise logger middleware
app.use(logger);

// Mounting express json
app.use(json());

// Mounting routes
app.use('/', welcome);
app.use('/api', routes);

// Test DB Connection
connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.blue.bgGreen.bold));
