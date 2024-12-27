import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UnAuthorizedResponse } from "../DTOs/un-authorized.dto";

export const Authorization = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      type: UnAuthorizedResponse,
      description: "User is unauthorized",
    })
  );
};
