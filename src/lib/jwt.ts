//create sign and verify tokens.
import jwt from "jsonwebtoken";
import CustomError from "../errors/errors";

//create token

export const createToken = (payload: any) => {
  try {
    const secret = process.env.JWT_SEC;
    if (!secret) {
      throw new CustomError("No JWT Secret");
    }
    return jwt.sign(payload, secret!, { expiresIn: "1h" });
  } catch (error) {
    throw error;
  }
};

export const verifyToken = (accessKey: string) => {
  try {
    const secret = process.env.JWT_SEC;
    if (!secret) {
      throw new CustomError("No JWT Secret");
    }
    return jwt.verify(accessKey, secret!);
  } catch (error) {
    throw error;
  }
};
