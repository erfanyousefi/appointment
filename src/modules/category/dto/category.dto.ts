import {ApiProperty, PartialType} from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  slug: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
