import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsPhoneNumber,
} from "class-validator";
import {LocationType} from "../enum/type.enum";

export class CreateClinicDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  manager_name: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: "شماره موبایل وارد شده صحیح نمیباشد"})
  manager_mobile: string;
  @ApiProperty()
  // @IsNumber()
  @IsNotEmpty({message: "استان نمیتواند خالی  ارسال شود"})
  province: number;
  @ApiProperty()
  // @IsNumber()
  @IsNotEmpty({message: "شهر نمیتواند خالی  ارسال شود"})
  city: number;
  @ApiProperty()
  address: string;
  @ApiProperty()
  @IsPhoneNumber("IR", {message: "تلفن وارد شده صحیح نمیباشد"})
  tel_1: string;
  @ApiProperty({format: "binary"})
  license: string;
  @ApiProperty({enum: LocationType})
  @IsEnum(LocationType, {message: "نوع ملک را به درستی انتخاب کنید"})
  location_type: string;
  @ApiPropertyOptional({format: "binary"})
  rent_agreement: string;
  @ApiProperty({format: "binary"})
  front_image: string;
  @ApiPropertyOptional({format: "binary"})
  side_image: string;
  @ApiProperty({format: "binary"})
  clinic_image_1: string;
  @ApiPropertyOptional({format: "binary"})
  clinic_image_2: string;
}
