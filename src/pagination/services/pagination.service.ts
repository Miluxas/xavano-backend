import { ListBody } from "@/common/types/list-body.type";
import { PaginatedList } from "@/common/types/paginated-list.type";
import { Injectable } from "@nestjs/common";
import {
  Between,
  FindOperator,
  ILike,
  In,
  ObjectLiteral,
  Repository,
} from "typeorm";
import { FindAndPaginateOptions } from "../types/find-and-paginate-options";

@Injectable()
export class PaginationService<E extends ObjectLiteral> {
  async findAndPaginate(
    repository: Repository<E>,
    listBody: ListBody,
    options: Partial<FindAndPaginateOptions<E>>
  ): Promise<PaginatedList<any>> {
    const completeOptions = new FindAndPaginateOptions<E>();
    Object.assign(completeOptions, options);

    const take = listBody.take ?? 10;
    const skip = listBody.skip ?? 0;
    let queryObject;
    if (listBody.filter) {
      Object.assign(
        completeOptions.filterQuery,
        this.stdFilterForTypeOrm(listBody.filter)
      );
    }
    if (
      completeOptions.textSearchFields.length > 0 &&
      listBody.search &&
      listBody.search.length > 0
    ) {
      const fullTextSearch = completeOptions.textSearchFields.join(",");
      const isFullTextSearchable = repository.metadata.indices.find(
        (index) =>
          index.isFulltext &&
          index.columns.map((col) => col.propertyName).join(",") ==
            fullTextSearch
      );
      if (isFullTextSearchable) {
        console.log("Full Text Search");
        queryObject = {
          id: new FindOperator("raw", fullTextSearch, true, true, () => {
            return ` MATCH(${fullTextSearch}) AGAINST ('*${listBody.search}*' IN BOOLEAN MODE) `;
          }),
          ...completeOptions.filterQuery,
        };
      } else {
        queryObject = completeOptions.textSearchFields.map((field) => ({
          ...this.formatSearchString(field, listBody.search!),
          ...completeOptions.filterQuery,
        }));
      }
    } else {
      queryObject = completeOptions.filterQuery;
    }
    listBody.sort = listBody.sort ?? { createdAt: -1 };
    const result = await repository.findAndCount({
      where: queryObject,
      relations: completeOptions.relations,
      order: listBody.sort,
      take: take,
      skip: skip,
      withDeleted: completeOptions.withDeleted,
      loadEagerRelations: completeOptions.loadEagerRelations,
      cache: completeOptions.cache,
    });
    const number = result[1];
    const pureItems = result[0];
    const totalPages = Math.floor(number / take) + (number % take > 0 ? 1 : 0);
    const currentPage = Math.floor(skip / take) + 1;
    const itemCount = currentPage < totalPages ? take : number % take;
    const items: any[] = [];
    await Promise.all(
      pureItems.map(async (element, index) => {
        items[index] = await completeOptions.convertor(element);
      })
    );
    return {
      items,
      pagination: {
        itemCount,
        totalItems: number,
        itemsPerPage: take,
        totalPages,
        currentPage,
        search: listBody.search ?? "",
      },
    };
  }

  paginateList(list: E[]) {
    return {
      items: list,
      pagination: {
        itemCount: list.length,
        totalItems: list.length,
        itemsPerPage: list.length,
        totalPages: 1,
        currentPage: 1,
        sort: {},
        filters: {},
        search: "",
      },
    };
  }

  public stdFilterForTypeOrm(filter: any) {
    const result = {};
    Object.keys(filter).forEach((key) => {
      if (Array.isArray(filter[key])) {
        if (key.endsWith(".#period")) {
          Object.assign(result, {
            [key.replace(".#period", "")]: Between(
              filter[key][0],
              filter[key][1]
            ),
          });
        } else {
          Object.assign(result, { [key]: In(filter[key]) });
        }
      } else if (
        Object.keys(filter[key]).length > 0 &&
        typeof filter[key] !== "string"
      ) {
        Object.assign(result, { [key]: this.stdFilterForTypeOrm(filter[key]) });
      } else {
        Object.assign(result, { [key]: filter[key] });
      }
    });
    return result;
  }

  formatSearchString(
    field: string,
    searchStr: string,
    language?: string
  ): Record<string, any> {
    const strArray = field.split(".");
    if (strArray.length < 2) {
      if (field.startsWith("ml_")) {
        if (language) {
          return { [field]: ILike(`"${language}": "%${searchStr}%`) };
        }
        return { [field]: ILike(`%: "%${searchStr}%`) };
      }
      return { [field]: ILike(`%${searchStr}%`) };
    }
    return {
      [strArray[0]]: this.formatSearchString(
        field.substring(strArray[0].length + 1),
        searchStr,
        language
      ),
    };
  }

  search(filterQuery: any, search: string, textSearchFields: string[]) {
    let queryObject: {};

    if (textSearchFields.length > 0 && search && search.length > 0) {
      queryObject = textSearchFields.map((field) => ({
        ...this.formatSearchString(field, search),
        ...filterQuery,
      }));

      return queryObject;
    }
    return filterQuery;
  }
}
