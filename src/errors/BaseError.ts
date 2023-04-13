import { Response } from "express";

class BaseError extends Error {
  public code: number;
  
  constructor(message: string = "Internal server error.", code: number = 500) {
    super();
    this.message = message;
    this.code = code;
  }

  public sendResponse(res: Response) {
    res.status(this.code).json({ message: this.message, code: this.code });
  }
}

export default BaseError;