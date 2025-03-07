import { Inject, Injectable } from "@nestjs/common";
import { ErrorHandler, IMessageList } from "../interfaces/error-handler.interface";
import { ERROR_MESSAGES } from "../constants/constant";

@Injectable()
export class ErrorHandlerService<T extends string> implements ErrorHandler {
  constructor(
    @Inject(ERROR_MESSAGES) private readonly errorMessageList: IMessageList<T>
  ) {}

  getMessage(error: Error): void {
    if (this.errorMessageList[error.message]) {
      throw this.errorMessageList[error.message];
    }
    throw error;
  }
}
