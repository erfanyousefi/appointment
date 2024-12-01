import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoryService} from "../category/category.service";
import {CategoryEntity} from "../category/entity/category.entity";
import {S3Service} from "../s3/s3.service";
import {ClinicController} from "./clinic.controller";
import {ClinicService} from "./clinic.service";
import {ClinicEntity} from "./entity/clinic.entity";
import {ClinicDetailEntity} from "./entity/detail.entity";
import {ClinicDoctorEntity} from "./entity/doctors.entity";
import {ClinicDocumentEntity} from "./entity/document.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicEntity,
      ClinicDoctorEntity,
      ClinicDocumentEntity,
      ClinicDetailEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService, CategoryService, S3Service],
})
export class ClinicModule {}
