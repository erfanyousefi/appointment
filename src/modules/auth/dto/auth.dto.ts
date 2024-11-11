import {ApiProperty} from "@nestjs/swagger";
import {IsJWT, IsMobilePhone, Length, Matches} from "class-validator";

export class SignupDto {
  @ApiProperty()
  @Length(3, 50, {message: "نام باید بین ۳ الی ۵۰ کاراکتر باشد"})
  firstname: string;
  @ApiProperty()
  @Length(3, 50, {message: "نام خانوادگی باید بین ۳ الی ۵۰ کاراکتر باشد"})
  lastname: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: "شماره وارد شده صحیح نمیباشد"})
  mobile: string;
}
export class LoginDto {
  @ApiProperty()
  @Matches(/[a-z0-9\_\.\-]{5,50}/gi, {
    message: "فرمت وارد شده نام کاربری صحیح نمیباشد",
  })
  username: string;
  @ApiProperty()
  @Length(8, 16, {message: "رمز عبور باید بین ۸ الی ۱۶ کاراکتر باشد"})
  password: string;
}
export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: "شماره وارد شده صحیح نمیباشد"})
  mobile: string;
}
export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: "شماره وارد شده صحیح نمیباشد"})
  mobile: string;
  @ApiProperty()
  @Length(5, 5, {message: "رمز یکبار مصرف باید ۵ کاراکتر باشد"})
  code: string;
}
export class ForgetPasswordDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, {message: "شماره وارد شده صحیح نمیباشد"})
  mobile: string;
}
export class RefreshTokenDto {
  @ApiProperty()
  @IsJWT({message: "توکن ارسال شده صحیح نمیباشد"})
  refreshToken: string;
}
