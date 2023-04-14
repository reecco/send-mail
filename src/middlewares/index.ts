import { Express, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

import env from "../utils/environment";
import BaseError from "../errors/BaseError";
import { UnauthorizedError, ValidateError } from "../errors";

export function errors(error: any, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof BaseError)
    return error.sendResponse(res);

  if (error instanceof mongoose.Error.CastError)
    return new BaseError("Invalid ID: " + error).sendResponse(res);

  return new BaseError().sendResponse(res);
}

export function access(app: Express): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    cors();
    next();
  });
}

export function authorization(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];

  try {
    if (!env.SECRET_JWT)
      throw new ValidateError("There was an error validating the token.");

    if (!token)
      throw new UnauthorizedError("Invalid token.");

    jwt.verify(token, env.SECRET_JWT, (error) => {
      if (error)
        throw new UnauthorizedError("Invalid token.");
    });

    next();
  } catch (error) {
    next(error);
  }
}