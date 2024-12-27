import { HttpStatus } from "@nestjs/common";
import { IMessageList } from "@/error-handler/interfaces/error-handler.interface";

export enum UserError {
  NOT_FOUND = "NOT_FOUND",
  EMAIL_IS_NOT_SET = "EMAIL_IS_NOT_SET",
  DUPLICATE_USER = "DUPLICATE_USER",
}

export const userErrorMessages: IMessageList<UserError> = {
  [UserError.DUPLICATE_USER]: {
    message: "User is duplicate",
    status: HttpStatus.CONFLICT,
  },
  [UserError.EMAIL_IS_NOT_SET]: {
    message: "Email is not set",
    status: HttpStatus.BAD_REQUEST,
  },
  [UserError.NOT_FOUND]: {
    message: "User not found",
    status: HttpStatus.NOT_FOUND,
  },
};
