import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {AnyFilesInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {memoryStorage} from "multer";
import {Pagination} from "src/common/decorators/pagination.decorator";
import {PaginationDto} from "src/common/dto/pagination.dto";
import {FormType} from "src/common/enum/formtype.enum";
import {ClinicService} from "./clinic.service";
import {ClinicAuth} from "./decorators/clinic.decorator";
import {ClinicFilter} from "./decorators/filter.decorator";
import {CreateClinicDto, CreateDoctorDto} from "./dto/clinic.dto";
import {ClinicFilterDto} from "./dto/filter.dto";
import {RejectDto} from "./dto/reject.dto";
import {ScheduleDto} from "./dto/schedule.dto";

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
  @Post("/create-doctor")
  @ClinicAuth()
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: memoryStorage(),
    })
  )
  createDoctor(
    @Body() doctorDto: CreateDoctorDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.clinicService.createDoctor(doctorDto, image);
  }
  @Post("/add-doctor-schedule")
  @ClinicAuth()
  @ApiConsumes(FormType.Json, FormType.Urlencoded)
  addSchedule(@Body() scheduleDto: ScheduleDto) {
    return this.clinicService.addSchedule(scheduleDto);
  }
  @Get("/get-doctor-schedule/:doctorId")
  @ClinicAuth()
  getSchedule(@Param("doctorId", ParseIntPipe) doctorId: number) {
    return this.clinicService.getSchedule(doctorId);
  }
}
