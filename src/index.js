import '@babel/polyfill';
import express, { json } from 'express';
import fileupload from 'express-fileupload';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors'
import 'colors';


import logger from './App/middlewares/logger';
import routes from './App/routes/index';
import welcome from './App/routes/welcome';
import connectDB from './Database/config/db.config'

// Load env vars
config();


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
connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.dim));

export default app;
