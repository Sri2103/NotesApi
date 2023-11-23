import { NextFunction, Request, Response, Router } from "express";
import { user } from "../types/user";
import { login, register } from "../services/auth/user";
import { createToken } from "../lib/jwt";
import CustomError from "../errors/errors";
const router = Router({
  mergeParams: true,
});

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as user;
      if (!body || !body.name || !body.password || !body.email)
        throw new CustomError("Missing fields").ValidationError();
      const userId = await register(body);
      const accessToken = createToken({ email: body.email, id: userId });
      res.status(200).json({
        message: `${body.name} registered successfully!`,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: { email: string; password: string } = req.body;
      const userId = await login(body.email, body.password);
      if (!userId) {
        throw new CustomError("Invalid email or password").AuthError();
      }
      const accessToken = createToken({ email: body.email, id: userId });
      res.status(200).json({
        message: "Login successful!",
       accessToken ,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
