import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/errors";
import { verifyToken } from "../lib/jwt";

export const handleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify the token
    const token = req.header("x-auth-token");
    if (!token) {
      throw new CustomError("Auth failed no token").AuthError();
    }

    const decoded = verifyToken(token); 
    res.locals.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
  //   }
};
