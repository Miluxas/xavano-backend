import { HttpStatus } from "@nestjs/common";
import { IMessageList } from "@/error-handler/interfaces/error-handler.interface";

export enum AuthError {
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  WRONG_PROFILE_ID = "WRONG_PROFILE_ID",
  WRONG_DEVICE_ID = "WRONG_DEVICE_ID",
  TOKEN_INVALID = "TOKEN_INVALID",
  INVALID_EMAIL = "INVALID_EMAIL",
  EMAIL_IS_NOT_VERIFIED = "EMAIL_IS_NOT_VERIFIED",
  WRONG_PASSWORD = "WRONG_PASSWORD",
  UNAUTHORIZED = "UNAUTHORIZED",
  DEVICE_VALID_COUNT_REACHED = "DEVICE_VALID_COUNT_REACHED",
  RESET_PASSWORD_TOKEN_EXPIRED = "RESET_PASSWORD_TOKEN_EXPIRED",
}

export const authErrorMessages: IMessageList<AuthError> = {
  [AuthError.WRONG_DEVICE_ID]: {
    message: "Device id is wrong",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.WRONG_PROFILE_ID]: {
    message: "Profile id is wrong",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.TOKEN_EXPIRED]: {
    message: "Token is expired",
    status: HttpStatus.UNAUTHORIZED,
  },
  [AuthError.TOKEN_INVALID]: {
    message: "Token is invalid",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.INVALID_EMAIL]: {
    message: "Your password or email is incorrect. Please try again.",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.WRONG_PASSWORD]: {
    message: "Your password or email is incorrect. Please try again.",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.EMAIL_IS_NOT_VERIFIED]: {
    message: "Email is not verified",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.UNAUTHORIZED]: {
    message: "Unauthorized",
    status: HttpStatus.UNAUTHORIZED,
  },
  [AuthError.DEVICE_VALID_COUNT_REACHED]: {
    message: "Account device valid count is reached",
    status: HttpStatus.BAD_REQUEST,
  },
  [AuthError.RESET_PASSWORD_TOKEN_EXPIRED]: {
    message: "Token is expired, Click forgot password and get new link.",
    status: HttpStatus.BAD_REQUEST,
  },
};
