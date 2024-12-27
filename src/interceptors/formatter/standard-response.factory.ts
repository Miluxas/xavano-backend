import { ApiProperty } from "@nestjs/swagger";

function changeClassName(classInst: any, value: string) {
  Object.defineProperty(classInst, "name", {
    value,
  });
}

class Meta {
  @ApiProperty({ type: Number })
  code: number = 0;

  @ApiProperty({ type: String })
  message: string = "";
}

export function StandardResponseFactory(data: any): any {
  class StandardResponse {
    @ApiProperty({
      type: data,
    })
    readonly data: any;

    @ApiProperty({
      type: Meta,
    })
    readonly meta: any;
  }
  changeClassName(StandardResponse, data.name + "-Data");
  return StandardResponse;
}

export function ListStandardResponseFactory(data: any): any {
  class ListResponse {
    @ApiProperty({
      type: data,
      isArray: true,
    })
    readonly items = [];
  }

  class ArrayResponse {
    @ApiProperty({
      type: ListResponse,
    })
    readonly data = new ListResponse();

    @ApiProperty({
      type: Meta,
    })
    readonly meta = new Meta();
  }
  changeClassName(ListResponse, "List-Items-" + data.name + "-Data");
  changeClassName(ArrayResponse, "List-" + data.name + "-Data");
  return ArrayResponse;
}

export function PaginatedListStandardResponseFactory(data: any): any {
  class Paginated {
    @ApiProperty({ type: Number })
    itemCount: number = 0;

    @ApiProperty({ type: Number })
    totalItems: number = 0;

    @ApiProperty({ type: Number })
    itemsPerPage: number = 0;

    @ApiProperty({ type: Number })
    totalPages: number = 0;

    @ApiProperty({ type: Number })
    currentPage: number = 0;

    @ApiProperty()
    sort: any;

    @ApiProperty()
    filters: any;

    @ApiProperty()
    searchQuery: string = "";
  }

  class PaginatedListResponse {
    @ApiProperty({
      type: data,
      isArray: true,
    })
    readonly items = [];

    @ApiProperty({
      type: Paginated,
    })
    readonly paginate = new Paginated();
  }

  class PaginatedListDataResponse {
    @ApiProperty({
      type: PaginatedListResponse,
    })
    readonly data = new PaginatedListResponse();

    @ApiProperty({
      type: Meta,
    })
    readonly meta = new Meta();
  }
  changeClassName(PaginatedListResponse, "Paginated-List-" + data.name);
  changeClassName(
    PaginatedListDataResponse,
    "Paginated-List-" + data.name + "-Data"
  );
  return PaginatedListDataResponse;
}
