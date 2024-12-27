import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  PaginatedListStandardResponseFactory,
  StandardResponseFactory,
} from "../../interceptors/formatter/standard-response.factory";

import { Authorization } from "../../common/decorators/authorization.decorator";
import { DeleteDefaultResponse, IdParam } from "../../common/DTOs";
import { ListQuery } from "../../common/DTOs/list-query.dto";
import { AuthorizedRequest } from "../../common/types/authorized-request.type";
import { PaginatedList } from "../../common/types/paginated-list.type";
import { ErrorHandlerService } from "../../error-handler";
import {
  AddCommentBodyDto,
  EditCommentBodyDto,
  GetCommentResponseDto,
} from "../DTOs";
import { CommentError } from "../errors";
import { CommentService } from "../services/comment.service";

@ApiTags("Comment")
@Controller("comments")
@Authorization()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly errorHandlerService: ErrorHandlerService<CommentError>
  ) {}

  @Post("")
  @ApiCreatedResponse({
    type: StandardResponseFactory(GetCommentResponseDto),
  })
  async add(@Req() req: AuthorizedRequest, @Body() body: AddCommentBodyDto) {
    return this.commentService
      .add(req.user.id, body.content, body.parentId)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }

  @Get("")
  @ApiCreatedResponse({
    type: PaginatedListStandardResponseFactory(GetCommentResponseDto),
  })
  async list(
    @Req() req: AuthorizedRequest,
    @Query() query: ListQuery
  ): Promise<PaginatedList<GetCommentResponseDto> | void> {
    return this.commentService
      .getAll(query, req.user.id, req.user.role)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }

  @Get("/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(GetCommentResponseDto),
  })
  getDetail(@Req() req: AuthorizedRequest, @Param() param: IdParam) {
    return this.commentService
      .getById(param.id, req.user.id, req.user.role)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }

  @Delete("/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(DeleteDefaultResponse),
  })
  delete(
    @Req() req: AuthorizedRequest,
    @Param() param: IdParam
  ): Promise<DeleteDefaultResponse | void> {
    return this.commentService
      .delete(param.id, req.user.id, req.user.role)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }

  @Put("/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(GetCommentResponseDto),
  })
  edit(
    @Req() req: AuthorizedRequest,
    @Param() param: IdParam,
    @Body() body: EditCommentBodyDto
  ): Promise<GetCommentResponseDto | void> {
    return this.commentService
      .edit(param.id, body.content, req.user.id, req.user.role)
      .catch((error) => {
        this.errorHandlerService.getMessage(error);
      });
  }

  @Put("/approve/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(GetCommentResponseDto),
  })
  approve(@Param() param: IdParam): Promise<GetCommentResponseDto | void> {
    return this.commentService.approveComment(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }

  @Put("/disapprove/:id")
  @ApiOkResponse({
    type: StandardResponseFactory(GetCommentResponseDto),
  })
  disapprove(@Param() param: IdParam): Promise<GetCommentResponseDto | void> {
    return this.commentService.disapproveComment(param.id).catch((error) => {
      this.errorHandlerService.getMessage(error);
    });
  }
}
