import { NextFunction, Request, Response } from "express";
import { ErrorTypes } from "../errors/types";
import CustomError from "../errors/errors";
export const handleError = async (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("Calling middleware for error", err.name);
  switch (err.name) {
    case ErrorTypes.AuthError:
      res.status(err.status).json({
        message: err.message,
      });
      break;
    case ErrorTypes.ValidationError:
        console.log(err,"Validation error")
      res.status(err.status).json({
        message: err.message,
      });
      break;
    default:
     console.log(err.message,"unknown error not handled", err.name, err.stack)
      res.status(500).json({
        message: err.message,
      });
  }
};
