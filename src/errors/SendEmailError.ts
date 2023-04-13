import BaseError from "./BaseError";

class SendEmailError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}

export default SendEmailError;