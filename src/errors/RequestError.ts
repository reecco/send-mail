import BaseError from "./BaseError";

class RequestError extends BaseError {
  constructor(message: string = "Invalid request.") {
    super(message, 400);
  }
}

export default RequestError;