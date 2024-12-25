import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNumber, Matches} from "class-validator";
import {DoctorStatus} from "../enum/status.enum";
import {WeekDays} from "../enum/week-days";

export class ScheduleDto {
  @ApiProperty()
  @IsNumber(
    {allowInfinity: false, allowNaN: false},
    {message: "شناسه دکتر را به درستی وارد کنید"}
  )
  doctorId: number;
  @ApiProperty({enum: WeekDays})
  @IsEnum(WeekDays, {message: "روز هفته را به درستی وارد کنید"})
  day: string;
  @ApiProperty()
  @Matches(new RegExp(/\d{2}\:\d{2}/), {
    message: "زمان شروع را به درستی وارد کنید",
  })
  start_time: string;
  @ApiProperty()
  @Matches(new RegExp(/\d{2}\:\d{2}/), {
    message: "زمان پایان را به درستی وارد کنید",
  })
  end_time: string;
  @ApiProperty({enum: DoctorStatus})
  @IsEnum(DoctorStatus, {message: "وضعیت روز را به درستی وارد کنید"})
  status: string;
}
