import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class ListQuery {
  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  take?: number;

  @ApiProperty({ required: false, example: "" })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, example: "" })
  @IsOptional()
  sort?: string | Record<string, any>;

  @ApiProperty({ required: false, example: "" })
  @IsOptional()
  filter?: Record<string, any>;

  @ApiProperty({ required: false, enum: ["entertainment", "education"] })
  @IsString()
  @IsOptional()
  @IsIn(["entertainment", "education"])
  category?: string;
}
