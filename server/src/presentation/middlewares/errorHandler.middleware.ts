import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../utils/errors/custom.error';
import { sendResponse } from '../../utils/response/sendResponse.utils';
import { HttpResCode, HttpResMsg } from '../../utils/constants/httpResponseCode.utils';


/**
 * @function errorHandler
 * @description A global error handling middleware to catch and standardize
 * error responses across the application.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return sendResponse(res, err.statusCode, err.message);
  }

  return sendResponse(res, HttpResCode.INTERNAL_SERVER_ERROR, HttpResMsg.INTERNAL_SERVER_ERROR);
};