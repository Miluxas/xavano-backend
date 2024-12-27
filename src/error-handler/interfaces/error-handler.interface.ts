import { HttpStatus } from "@nestjs/common";

export interface ErrorHandler {
  getMessage(error: Error): void;
}

export type IMessageList<T extends string> = {
  [key in string]: {
    message: string;
    status: HttpStatus;
  };
};
