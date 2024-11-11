import {Body, Controller, Post} from "@nestjs/common";
import {ApiConsumes} from "@nestjs/swagger";
import {FormType} from "src/common/enum/formtype.enum";
import {AuthService} from "./auth.service";
import {
  CheckOtpDto,
  ForgetPasswordDto,
  LoginDto,
  RefreshTokenDto,
  SendOtpDto,
  SignupDto,
} from "./dto/auth.dto";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post("signup")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }
  @Post("login")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Post("send-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }
  @Post("check-otp")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  checkOtp(@Body() dto: CheckOtpDto) {
    return this.authService.checkOtp(dto);
  }
  @Post("forget-password")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  forgetPassword(@Body() dto: ForgetPasswordDto) {}
  @Post("refreshtoken")
  @ApiConsumes(FormType.Urlencoded, FormType.Json)
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
