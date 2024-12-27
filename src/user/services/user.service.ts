import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";

import { IDeleteResult } from "@/common/interfaces/delete-result.interface";
import { ListBody } from "@/common/types/list-body.type";
import { PaginatedList } from "@/common/types/paginated-list.type";
import { PaginationService } from "@/pagination/";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import {  User } from "../entities";
import { AuthError, UserError } from "../errors";
import {  IUpdatedUser } from "../interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}



  public async getById(id: number, roleBasedFilter: any): Promise<User> {
    return this.userRepository
      .findOneBy({ id, ...roleBasedFilter })
      .then(async (user) => {
        if (!user) {
          throw new Error(UserError.NOT_FOUND);
        }

        return user;
      });
  }

  public async getByIdForComment(id: number): Promise<{fullName:string}> {
    return this.userRepository
      .findOne({ where: { id }, withDeleted: true })
      .then((user) => {
        if (!user) {
          throw new Error(UserError.NOT_FOUND);
        }
        return {fullName:`${user.firstName} ${user.lastName}`};
      });
  }

  public async getList(
    listQuery: ListBody,
    roleBasedFilter: any
  ): Promise<PaginatedList<User>> {
    console.log('listQuery',listQuery)
    return this.paginationService.findAndPaginate(
      this.userRepository,
      listQuery,
      {
        filterQuery: { role: Not("User"), ...roleBasedFilter },
        textSearchFields: ["lastName", "firstName"],
      }
    );
  }

  public async getCustomerList(
    listQuery: ListBody,
    roleBasedFilter: any
  ): Promise<PaginatedList<User>> {
    return this.paginationService.findAndPaginate(
      this.userRepository,
      listQuery,
      {
        filterQuery: { role: "User", ...roleBasedFilter },
        textSearchFields: ["lastName", "firstName"],
        withDeleted: true,
      }
    );
  }

  public async update(
    id: number,
    updatedUser: IUpdatedUser
  ): Promise<User | void> {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new Error(UserError.NOT_FOUND);
    }
    if (foundUser.role != "User") {
      updatedUser.email = undefined;
    } else if (updatedUser.email) {
      foundUser.emailVerified = false;
    }

    Object.assign(foundUser, updatedUser);
    await this.userRepository.save(foundUser).catch((error) => {
      if (error.driverError.code === "ER_DUP_ENTRY") {
        throw new Error(UserError.DUPLICATE_USER);
      }
    });

    return foundUser;
  }

  async changeActivation(
    panelUserId: number,
    userId: number,
    active: boolean
  ): Promise<{ result: string }> {
    if (userId == panelUserId) throw new Error(AuthError.UNAUTHORIZED);
    await this.userRepository
      .update({ id: userId }, { active })
      .then((result) => {
        if (result.affected == 1) return { result: "Activation is set" };
      });
    return { result: "Nothing is changed" };
  }

  async deleteUser(
    panelUserId: number,
    userId: number
  ): Promise<IDeleteResult> {
    if (userId == panelUserId) throw new Error(AuthError.UNAUTHORIZED);

    await this.userRepository.update({ id: userId }, { isDeleted: true });
    await this.userRepository.softDelete({ id: userId }).then((result) => {
      if (result.affected == 1) return { result: "User is deleted" };
    });
    return { result: "Nothing is changed" };
  }

  async changeBlockage(
    panelUserId: number,
    userId: number,
    block: boolean
  ): Promise<{ result: string }> {
    if (userId == panelUserId) throw new Error(AuthError.UNAUTHORIZED);
    await this.userRepository
      .update({ id: userId }, { active: block })
      .then((result) => {
        if (result.affected == 1) return { result: "Blockage is set" };
      });
    return { result: "Nothing is changed" };
  }
}
