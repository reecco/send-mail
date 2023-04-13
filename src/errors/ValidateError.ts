import BaseError from "./BaseError";

class ValidateError extends BaseError {
  constructor(message: string = "Validate error.") {
    super(message, 500);
  }
}

export default ValidateError;