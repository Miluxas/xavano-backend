import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { createActor, createMachine } from "xstate";
import { ListQuery } from "../../common/DTOs/list-query.dto";
import { IDeleteResult } from "../../common/interfaces/delete-result.interface";
import { PaginatedList } from "../../common/types/paginated-list.type";
import { PaginationService } from "../../pagination";
import { UserService } from "../../user/services";
import { Role } from "../../user/types/role.type";
import { Comment, CommentStatus } from "../entities";
import { CommentError } from "../errors";

const commentState = {
  id: "comment",
  initial: CommentStatus.PENDING,
  states: {
    [CommentStatus.PENDING]: {
      on: {
        APPROVE: CommentStatus.APPROVED,
        DISAPPROVE: CommentStatus.DISAPPROVED,
      },
    },
    [CommentStatus.APPROVED]: {
      on: {
        DISAPPROVE: CommentStatus.DISAPPROVED,
      },
    },
    [CommentStatus.DISAPPROVED]: {
      on: {
        APPROVE: CommentStatus.APPROVED,
      },
    },
  },
};
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly paginationService: PaginationService<Comment>,
    private readonly userService: UserService
  ) {}
  async getAll(
    query: ListQuery,
    userId: number,
    userRole: Role
  ): Promise<PaginatedList<Comment>> {
    let filterQuery = {};
    if (userRole === "User") {
      filterQuery = [{ status: CommentStatus.APPROVED }, { userId: userId }];
    }
    return this.paginationService.findAndPaginate(
      this.commentRepository,
      query,
      { filterQuery }
    );
  }

  public async getById(
    id: number,
    userId: number,
    role: Role
  ): Promise<Comment> {
    const foundComment = await this.commentRepository.findOneBy({ id });
    if (!foundComment) {
      throw new Error(CommentError.COMMENT_NOT_FOUND);
    }
    if (
      role === "User" &&
      foundComment.userId !== userId &&
      foundComment.status !== CommentStatus.APPROVED
    ) {
      throw new Error(CommentError.ACCESS_DENIED);
    }
    return foundComment;
  }

  public async add(
    userId: number,
    content: string,
    parentId?: number
  ): Promise<Comment> {
    const comment = new Comment();
    comment.userId = userId;
    comment.content = content;
    comment.parentId = parentId;
    const user = await this.userService.getByIdForComment(userId);
    comment.user = user;
    return this.commentRepository.save(comment);
  }

  public async delete(
    id: number,
    userId: number,
    role: Role
  ): Promise<IDeleteResult> {
    const foundComment = await this.commentRepository.findOneBy({ id });
    if (!foundComment) {
      throw new Error(CommentError.COMMENT_NOT_FOUND);
    }
    if (role === "User" && foundComment.userId !== userId) {
      throw new Error(CommentError.ACCESS_DENIED);
    } else {
      await this.commentRepository.delete({ id });
    }
    return { result: "comment deleted" };
  }

  public async edit(
    id: number,
    content: string,
    userId: number,
    role: Role
  ): Promise<Comment> {
    const foundComment = await this.commentRepository.findOneBy({ id });
    if (!foundComment) {
      throw new Error(CommentError.COMMENT_NOT_FOUND);
    }
    if (role === "User" && foundComment.userId !== userId) {
      throw new Error(CommentError.ACCESS_DENIED);
    }
    foundComment.content = content;
    foundComment.status = CommentStatus.PENDING;
    return this.commentRepository.save(foundComment);
  }

  async approveComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new Error(CommentError.COMMENT_NOT_FOUND);
    }
    commentState.initial = comment.status;
    const commentStatusService = createActor(createMachine(commentState)).start();
    commentStatusService.send({ type: "APPROVE" });
    comment.status = commentStatusService.getSnapshot().value as CommentStatus;
    return this.commentRepository.save(comment);
  }

  async disapproveComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new Error(CommentError.COMMENT_NOT_FOUND);
    }
    commentState.initial = comment.status;
    const commentStatusService = createActor(createMachine(commentState)).start();
    commentStatusService.send({ type: "DISAPPROVE" });
    comment.status = commentStatusService.getSnapshot().value as CommentStatus;
    return this.commentRepository.save(comment);
  }
}
