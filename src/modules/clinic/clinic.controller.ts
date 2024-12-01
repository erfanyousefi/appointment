import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {AnyFilesInterceptor} from "@nestjs/platform-express";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {memoryStorage} from "multer";
import {Pagination} from "src/common/decorators/pagination.decorator";
import {PaginationDto} from "src/common/dto/pagination.dto";
import {FormType} from "src/common/enum/formtype.enum";
import {ClinicService} from "./clinic.service";
import {ClinicFilter} from "./decorators/filter.decorator";
import {CreateClinicDto} from "./dto/clinic.dto";
import {ClinicFilterDto} from "./dto/filter.dto";
import {RejectDto} from "./dto/reject.dto";

@Controller("clinic")
@ApiTags("Clinic")
export class ClinicController {
  constructor(private clinicService: ClinicService) {}
  @Post("register")
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
    })
  )
  register(@Body() dto: CreateClinicDto, @UploadedFiles() files: any) {
    return this.clinicService.register(dto, files);
  }
  @Get("/")
  @Pagination()
  @ClinicFilter()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ClinicFilterDto
  ) {
    return this.clinicService.find(paginationDto, filterDto);
  }
  @Put("/accept/:id")
  async accept(@Param("id", ParseIntPipe) id: number) {
    return this.clinicService.accept(id);
  }
  @Put("/reject/:id")
  async reject(
    @Param("id", ParseIntPipe) id: number,
    @Body() {reason}: RejectDto
  ) {
    return this.clinicService.reject(id, reason);
  }
}
