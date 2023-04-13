import BaseError from "./BaseError";

class NotAllowedError extends BaseError {
  constructor(message: string = "Unavailable.") {
    super(message, 405);
  }
}

export default NotAllowedError;