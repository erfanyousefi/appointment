import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {InjectRepository} from "@nestjs/typeorm";
import {isDate, isEnum, isMobilePhone, isPhoneNumber} from "class-validator";
import {Request} from "express";
import slugify from "slugify";
import {WeekDayNames} from "src/common/constant/week";
import {PaginationDto} from "src/common/dto/pagination.dto";
import {getCityAndProvinceNameByCode} from "src/common/util/city.util";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/util/pagination.util";
import {
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import {CategoryService} from "../category/category.service";
import {S3Service} from "../s3/s3.service";
import {CreateClinicDto, CreateDoctorDto} from "./dto/clinic.dto";
import {ClinicFilterDto} from "./dto/filter.dto";
import {ScheduleDto} from "./dto/schedule.dto";
import {ClinicEntity} from "./entity/clinic.entity";
import {ClinicDetailEntity} from "./entity/detail.entity";
import {ClinicDoctorEntity} from "./entity/doctors.entity";
import {ClinicDocumentEntity} from "./entity/document.entity";
import {DoctorScheduleEntity} from "./entity/schedula.entity";
import {ClinicStatus} from "./enum/status.enum";

@Injectable({scope: Scope.REQUEST})
export class ClinicService {
  constructor(
    @InjectRepository(ClinicDetailEntity)
    private detailRepository: Repository<ClinicDetailEntity>,
    @InjectRepository(ClinicEntity)
    private clinicRepository: Repository<ClinicEntity>,
    @InjectRepository(ClinicDocumentEntity)
    private docsRepository: Repository<ClinicDocumentEntity>,
    @InjectRepository(ClinicDoctorEntity)
    private doctorsRepository: Repository<ClinicDoctorEntity>,
    @InjectRepository(DoctorScheduleEntity)
    private scheduleRepository: Repository<DoctorScheduleEntity>,
    private categoryService: CategoryService,
    private s3Service: S3Service,
    @Inject(REQUEST) private request: Request
  ) {}
  async register(dto: CreateClinicDto, files: Express.Multer.File[]) {
    const {
      manager_name,
      name,
      manager_mobile,
      tel_1,
      location_type,
      province,
      city,
      address,
      categoryId,
    } = dto;
    await this.checkMobile(manager_mobile);
    await this.checkTelephone(tel_1);
    const category = await this.categoryService.findOne(categoryId);
    const {provinceName, cityName} = getCityAndProvinceNameByCode(
      province,
      city
    );
    const slug = slugify(name);
    console.log(slug);

    await this.checkSlug(slug);
    let filesObject: {[key: string]: {Location: string; Key: string}} = {};
    for (const file of files) {
      filesObject[file.fieldname] = await this.s3Service.uploadFile(
        file,
        "clinic"
      );
      console.log(filesObject[file.fieldname]);
    }
    let clinic = this.clinicRepository.create({
      name,
      slug,
      manager_mobile,
      manager_name,
      categoryId: category.id,
      location_type,
    });
    clinic = await this.clinicRepository.save(clinic);
    let detail = this.detailRepository.create({
      tel_1,
      city: cityName,
      province: provinceName,
      address,
      clinicId: clinic.id,
    });
    detail = await this.detailRepository.save(detail);
    clinic.detailId = detail.id;
    let document = this.docsRepository.create({
      clinic_image_1: filesObject?.["clinic_image_1"]?.Location,
      clinic_image_2: filesObject?.["clinic_image_2"]?.Location,
      license: filesObject?.["license"]?.Location,
      rent_agreement: filesObject?.["rent_agreement"]?.Location,
      side_image: filesObject?.["side_image"]?.Location,
      front_image: filesObject?.["front_image"]?.Location,
      clinicId: clinic.id,
    });
    document = await this.docsRepository.save(document);
    clinic.documentsId = document.id;
    clinic = await this.clinicRepository.save(clinic);
    return {
      message: "ثبت نام شما با موفقیت انجام شد منتظر تایید حساب خود باشید",
    };
  }
  async checkTelephone(phone: string) {
    if (phone && isPhoneNumber(phone, "IR")) {
      const existPhone = await this.detailRepository.findOneBy([
        {tel_1: phone},
        {tel_2: phone},
      ]);
      if (existPhone)
        throw new ConflictException("تلفن وارد شده تکراری میباشد");
    }
  }
  async checkSlug(slug: string) {
    const existSlug = await this.clinicRepository.findOneBy({slug});
    if (existSlug)
      throw new ConflictException("اسم کلینیک وارد شده تکراری میباشد");
  }
  async checkMobile(mobile: string) {
    if (mobile && isMobilePhone(mobile, "fa-IR")) {
      const existMobile = await this.clinicRepository.findOneBy({
        manager_mobile: mobile,
      });
      if (existMobile)
        throw new ConflictException("شماره موبایل وارد شده تکراری میباشد");
    }
  }

  async find(paginationDto: PaginationDto, filterDto: ClinicFilterDto) {
    const {limit, page, skip} = paginationSolver(paginationDto);
    const {search, status, from_date, to_date} = filterDto;
    let where: FindOptionsWhere<ClinicEntity> = {};
    if (status && isEnum(status, ClinicStatus)) {
      where["status"] = status;
    }
    if (search && search?.length > 2) {
      where["name"] = ILike(`%${search}%`);
    }
    if (
      to_date &&
      from_date &&
      isDate(new Date(from_date)) &&
      isDate(new Date(to_date))
    ) {
      let from = new Date(new Date(from_date).setUTCHours(0, 0, 0));
      let to = new Date(new Date(to_date).setUTCHours(0, 0, 0));
      where["created_at"] = (MoreThanOrEqual(from), LessThanOrEqual(to));
    } else if (from_date && isDate(new Date(from_date))) {
      let from = new Date(new Date(from_date).setUTCHours(0, 0, 0));
      where["created_at"] = MoreThanOrEqual(from);
    } else if (to_date && isDate(new Date(to_date))) {
      let to = new Date(new Date(to_date).setUTCHours(0, 0, 0));
      where["created_at"] = LessThanOrEqual(to);
    }

    const [clinics, count] = await this.clinicRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {created_at: "DESC"},
    });
    return {
      pagination: paginationGenerator(page, limit, count),
      clinics,
    };
  }
  async findOneById(id: number) {
    const clinic = await this.clinicRepository.findOneBy({id});
    if (!clinic) throw new NotFoundException("حساب کلینیک یافت نشد");
    if (clinic.status !== ClinicStatus.Confirmed) {
      throw new ForbiddenException(
        "حساب کاربری شما تایید نشده یا رد شده است لطفا با پشتیبانی در تماس باشید"
      );
    }
    return clinic;
  }
  async checkExistById(id: number) {
    const clinic = await this.clinicRepository.findOneBy({id});
    if (!clinic) throw new NotFoundException("کلنیک وجود ندارد");
    return clinic;
  }
  async accept(id: number) {
    const clinic = await this.checkExistById(id);
    if (clinic.status === ClinicStatus.Confirmed)
      throw new BadRequestException("کلنیک مورد نظر قبلا تایید شده است");
    clinic.status = ClinicStatus.Confirmed;
    clinic.accepted_at = new Date();
    clinic.reason = null;
    clinic.rejected_at = null;
    await this.clinicRepository.save(clinic);
    return {
      message: "تایید کلنیک با موفقیت انجام شد",
    };
  }
  async reject(id: number, reason: string) {
    const clinic = await this.checkExistById(id);
    if (clinic.status === ClinicStatus.Rejected)
      throw new BadRequestException("کلنیک مورد نظر قبلا رد شده است");
    if (clinic.status === ClinicStatus.Confirmed)
      throw new BadRequestException(
        "کلنیک مورد نظر تایید شده است و غیرقابل رد کردن است"
      );
    clinic.rejected_at = new Date();
    clinic.reason = reason;
    clinic.status = ClinicStatus.Rejected;
    await this.clinicRepository.save(clinic);
    return {
      message: "رد کلنیک با موفقیت انجام شد",
    };
  }
  async createDoctor(doctorDto: CreateDoctorDto, image: Express.Multer.File) {
    const {degree, experience, firstname, lastname, majors, medical_code} =
      doctorDto;
    const {id} = this.request.clinic;
    const doctor = await this.doctorsRepository.findOneBy({medical_code});
    if (doctor) throw new ConflictException("کد نظام پزشکی تکراری میباشد");
    const newDoctor = this.doctorsRepository.create({
      degree,
      experience,
      firstname,
      lastname,
      majors,
      medical_code,
      clinicId: id,
    });
    if (image) {
      const {Location} = await this.s3Service.uploadFile(
        image,
        "clinic/doctor"
      );
      newDoctor.image = Location;
    }
    await this.doctorsRepository.save(newDoctor);
    return {
      message: "دکتر با موفقیت ایجاد شد",
    };
  }
  async addSchedule(scheduleDto: ScheduleDto) {
    const {day, doctorId, end_time, start_time, status} = scheduleDto;
    const doctor = await this.doctorsRepository.findOneBy({id: doctorId});
    if (!doctor) throw new NotFoundException("دکتر وارد شده وجود ندارد");
    const dayItem = await this.scheduleRepository.findOneBy({doctorId, day});
    if (dayItem) {
      throw new ConflictException(
        "روز وارد شده قبلا ثبت شده است اگر نیازی به تغییر دارید در بخش به روزرسانی اعمال کنید"
      );
    }
    await this.scheduleRepository.insert({
      doctorId,
      day,
      start_time,
      end_time,
      status,
    });
    return {
      message: `برنامه روز ${WeekDayNames[day]} با موفقیت ثبت شد`,
    };
  }
  async getSchedule(doctorId: number) {
    return this.scheduleRepository.find({
      where: {doctorId},
    });
  }
}
