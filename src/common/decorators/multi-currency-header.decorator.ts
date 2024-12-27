import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

export const MultiCurrencyHeader = () => {
  return applyDecorators(
    ApiHeader({ name: "currency", required: false, enum: ["KWD" , "BHD" , "OMR" , "AED" , "SAR"] })
  );
};
