import { Authorization } from "@/common/decorators/authorization.decorator";
import { DeleteDefaultResponse } from "@/common/DTOs/delete-default-response.dto";
import { IdParam } from "@/common/DTOs/id-param.dto";
import { ListQuery } from "@/common/DTOs/list-query.dto";
import { AuthorizedRequest } from "@/common/types/authorized-request.type";
import { PaginatedList } from "@/common/types/paginated-list.type";
import { ErrorHandlerService } from "@/error-handler";
import {
  PaginatedListStandardResponseFactory,
  StandardResponseFactory,
} from "@/interceptors/formatter/standard-response.factory";
import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GetUserDetailResponse } from "../DTOs";
import { UserError } from "../errors/user.error";
import { UserService } from "../services/user.service";

@ApiTags("User")
@Authorization()
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly errorHandlerService: ErrorHandlerService<UserError>
  ) {}

  @Get(":id")
  @ApiOkResponse({
    type: StandardResponseFactory(GetUserDetailResponse),
    description: "Get user detail",
  })
  getById(
    @Param() param: IdParam,
    @Req() req: AuthorizedRequest
  ): Promise<GetUserDetailResponse | void> {
    return this.userService.getById(param.id, req.roleBasedFilter).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Get()
  @ApiOkResponse({
    type: PaginatedListStandardResponseFactory(GetUserDetailResponse),
    description: "User list",
  })
  async getListByGet(
    @Query() query: ListQuery,
    @Req() req: AuthorizedRequest
  ): Promise<PaginatedList<GetUserDetailResponse> | void> {
    return this.userService.getList(query, req.roleBasedFilter).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Delete("/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(DeleteDefaultResponse),
    description: "Delete panel user",
  })
  async deleteUser(
    @Param() params: IdParam,
    @Req() req: AuthorizedRequest
  ): Promise<DeleteDefaultResponse | void> {
    return this.userService
      .deleteUser(req.user.id, params.id)
      .catch((error) => this.errorHandlerService.getMessage(error));
  }
}
