// extend standard error with custom errors

import { ErrorTypes } from "./types";

export default class CustomError extends Error {
  status: number = 500;
  constructor(message: string) {
    super();
    this.name = "CustomError";
    this.message = message;
  }
  AuthError() {
    this.name = ErrorTypes.AuthError;
    this.status = 401;
    return this;
  }
  ValidationError() {
    this.name = ErrorTypes.ValidationError;
    this.status = 400;
    return this
  }
  NotFoundError(){
    this.name = ErrorTypes.NotFoundError;
    this.status = 404;
    return this;
  }
}
