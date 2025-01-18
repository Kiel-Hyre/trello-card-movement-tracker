import express from 'express';
import cors from 'cors';
import xssClean from 'xss-clean'; // Correct import syntax
import router from './routes/v1/index.js'; // Adjust the path to where your router is saved
import ApiError from './utils/APIError.js';
import httpStatus from 'http-status';
import { errorConverter, errorHandler } from './middlewares/error.js';

const app = express();

// Middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(xssClean()); // Add XSS protection middleware

// v1 api routes
app.use('/v1', router);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
