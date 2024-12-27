import { HttpStatus } from "@nestjs/common";
import { IMessageList } from "@/error-handler/interfaces/error-handler.interface";

export enum AgeRangeError {
  AGE_RANGE_NOT_FOUND = "AGE_RANGE_NOT_FOUND",
}

export const ageRangeErrorMessages: IMessageList<AgeRangeError> = {
  [AgeRangeError.AGE_RANGE_NOT_FOUND]: {
    message: "age range not found",
    status: HttpStatus.NOT_FOUND,
  },
};
