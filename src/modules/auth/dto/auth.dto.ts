import {ApiProperty} from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  mobile: string;
}
export class LoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
export class SendOtpDto {
  @ApiProperty()
  mobile: string;
}
export class CheckOtpDto {
  @ApiProperty()
  mobile: string;
  @ApiProperty()
  code: string;
}
export class ForgetPasswordDto {
  @ApiProperty()
  mobile: string;
}
export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}
