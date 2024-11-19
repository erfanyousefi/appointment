import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateClinicDto} from "./dto/clinic.dto";
import {ClinicEntity} from "./entity/clinic.entity";
import {ClinicDetailEntity} from "./entity/detail.entity";
import {ClinicDoctorEntity} from "./entity/doctors.entity";
import {ClinicDocumentEntity} from "./entity/document.entity";

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(ClinicDetailEntity)
    private detailRepository: Repository<ClinicDetailEntity>,
    @InjectRepository(ClinicEntity)
    private clinicRepository: Repository<ClinicEntity>,
    @InjectRepository(ClinicDocumentEntity)
    private docsRepository: Repository<ClinicDocumentEntity>,
    @InjectRepository(ClinicDoctorEntity)
    private doctorsRepository: Repository<ClinicDoctorEntity>
  ) {}
  async register(dto: CreateClinicDto) {}
}
