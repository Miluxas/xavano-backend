import { HttpStatus } from "@nestjs/common";
import { IMessageList } from "@/error-handler/interfaces/error-handler.interface";

export enum CountryError {
  COUNTRY_NOT_FOUND = "COUNTRY_NOT_FOUND",
}

export const countryErrorMessages: IMessageList<CountryError> = {
  [CountryError.COUNTRY_NOT_FOUND]: {
    message: "country not found",
    status: HttpStatus.NOT_FOUND,
  },
};
