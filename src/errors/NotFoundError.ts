import BaseError from "./BaseError";

class NotFoundError extends BaseError {
  constructor(message: string = "Not found.") {
    super(message, 404);
  }
}

export default NotFoundError;