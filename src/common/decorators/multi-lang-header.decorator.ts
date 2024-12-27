import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";

export const MultiLangHeader = () => {
  return applyDecorators(
    ApiHeader({ name: "lang", required: false, enum: ["ar", "en"] })
  );
};
