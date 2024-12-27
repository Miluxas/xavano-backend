import { HttpStatus } from "@nestjs/common";
import { IMessageList } from "@/error-handler/interfaces/error-handler.interface";

export enum ProfileError {
  PROFILE_NOT_FOUND = "PROFILE_NOT_FOUND",
}

export const profileErrorMessages: IMessageList<ProfileError> = {
  [ProfileError.PROFILE_NOT_FOUND]: {
    message: "Profile not found",
    status: HttpStatus.NOT_FOUND,
  },
};
