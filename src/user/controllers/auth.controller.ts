import { Authorization } from "@/common/decorators/authorization.decorator";
import { AuthorizedRequest } from "@/common/types/authorized-request.type";
import { ErrorHandlerService } from "@/error-handler";
import {
  StandardResponseFactory
} from "@/interceptors/formatter/standard-response.factory";
import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserLoginBody, UserLoginResponse, UserLogoutResponse } from "../DTOs";
import { AuthError } from "../errors";
import { AuthService } from "../services";

@ApiTags("Auth")
@Controller("auth")
@Authorization()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly errorHandlerService: ErrorHandlerService<AuthError>
  ) {}

  @Post("/login")
  @ApiOkResponse({
    type: StandardResponseFactory(UserLoginResponse),
    description: "User login",
  })
  async login(
    @Body() body: UserLoginBody,
    @Req() req: AuthorizedRequest
  ): Promise<UserLoginResponse | void> {
    return this.authService
      .login(body)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }

  @Get("/logout")
  @ApiOkResponse({
    type: StandardResponseFactory(UserLogoutResponse),
    description: "Logout user",
  })
  async logout(
    @Req() req: AuthorizedRequest
  ): Promise<UserLogoutResponse | void> {
    return this.authService
      .logout(req.user.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
