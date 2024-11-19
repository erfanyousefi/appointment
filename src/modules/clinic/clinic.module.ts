import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
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
    ]),
  ],
  controllers: [ClinicController],
  providers: [ClinicService],
})
export class ClinicModule {}
