import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import {FormType} from "src/common/enum/formtype.enum";
import {CategoryService} from "./category.service";
import {CreateCategoryDto, UpdateCategoryDto} from "./dto/category.dto";

@Controller("category")
@ApiTags("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post("/")
  @ApiCreatedResponse({example: {message: "created"}})
  @ApiOperation({summary: "created category"})
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }
  @Put("/:id")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto
  ) {
    return this.categoryService.update(id, dto);
  }
  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }
  @Get("/")
  find() {
    return this.categoryService.find();
  }
  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }
}
