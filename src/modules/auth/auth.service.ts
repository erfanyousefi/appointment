import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {compareSync} from "bcrypt";
import {isMobilePhone} from "class-validator";
import {randomInt} from "crypto";
import {
  A_JWT_SECRET,
  ForgetPassword_JWT_SECRET,
  R_JWT_SECRET,
} from "src/common/constant/jwt.const";
import {mobileValidation} from "src/common/util/mobile.util";
import {hashPassword, randomPassword} from "src/common/util/password.util";
import {Repository} from "typeorm";
import {UserEntity} from "../user/entity/user.entity";
import {
  ChangePasswordDto,
  CheckOtpDto,
  ForgetPasswordDto,
  LoginDto,
  RefreshTokenDto,
  SendOtpDto,
  SignupDto,
} from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto) {
    const {firstname, lastname, mobile} = signupDto;
    const {phoneNumber} = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({mobile: phoneNumber});
    if (user)
      throw new ConflictException(
        "شماره موبایل وارد شده قبلا توسط شخص دیگری استفاده شده"
      );
    let {password, hashed} = randomPassword(8);
    await this.userRepository.insert({
      firstname,
      lastname,
      mobile: phoneNumber,
      password: hashed,
    });
    return {
      message:
        "حساب کاربری شما با موفقیت ایجاد شده، در بخش ورود وارد حساب کاربری خود شوید",
      password,
    };
  }
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const {confirmPassword, newPassword, token} = changePasswordDto;
    const data = this.verifyPasswordToken(token);
    const user = await this.userRepository.findOneBy({id: data.userId});
    if (!user) throw new NotFoundException("اطلاعات ارسال شده صحیح نمیباشد");
    if (user.last_change_password) {
      const lastChanges = new Date(
        user.last_change_password.getTime() + 1000 * 60 * 60
      );
      if (lastChanges > new Date())
        throw new BadRequestException(
          "شما  هر یک ساعت یکبا قادر به ویرایش رمز عبور خود هستید"
        );
    }
    if (newPassword !== confirmPassword)
      throw new BadRequestException("رمز عبور با تکرار آن برابر نیست");
    user.password = hashPassword(newPassword);
    user.last_change_password = new Date();
    await this.userRepository.save(user);
    return {
      message: "ویرایش رمز عبور با موفقیت انجام شد",
    };
  }
  async login(loginDto: LoginDto) {
    const {password, username} = loginDto;
    let user = await this.userRepository.findOneBy({username});
    if (!user && isMobilePhone(username, "fa-IR"))
      user = await this.userRepository.findOneBy({mobile: username});
    if (!user)
      throw new UnauthorizedException("نام کاربری یا رمز عبور اشتباه میباشد");
    if (compareSync(password, user.password)) {
      return this.tokenGenerator(user.id);
    }
    throw new UnauthorizedException("نام کاربری یا رمز عبور اشتباه میباشد");
  }
  async sendOtp(sendOtpDto: SendOtpDto) {
    const {mobile} = sendOtpDto;
    const {phoneNumber} = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({mobile: phoneNumber});
    if (!user) throw new NotFoundException("حساب کاربری یافت نشد");
    if (user.otp_expires_in >= new Date()) {
      throw new BadRequestException("کد قبلی هنوز منقضی نشده است");
    }
    const otpCode = randomInt(10000, 99999);
    user.otp_code = String(otpCode);
    user.otp_expires_in = new Date(new Date().getTime() + 1000 * 60);
    await this.userRepository.save(user);
    return {
      message: "رمز یکبار مصرف برای شما ارسال شد",
      code: otpCode,
    };
  }
  async checkOtp(checkOtpDto: CheckOtpDto) {
    const {mobile, code} = checkOtpDto;
    const {phoneNumber} = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({mobile: phoneNumber});
    if (!user) throw new NotFoundException("حساب کاربری یافت نشد");
    if (user.otp_expires_in < new Date())
      throw new UnauthorizedException("کد ارسال شده منقضی شده است");
    if (code === user.otp_code) {
      return this.tokenGenerator(user.id);
    }
    throw new UnauthorizedException("کد ارسال شده صحیح نمییاشد");
  }
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const {refreshToken} = refreshTokenDto;
    const userId = this.verifyRefreshToken(refreshToken);
    if (userId) return this.tokenGenerator(+userId);
    throw new UnauthorizedException("مجددا وارد حساب کاربری خود شوید");
  }
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const {mobile} = forgetPasswordDto;
    let user = await this.userRepository.findOneBy({mobile});
    if (!user) user = await this.userRepository.findOneBy({username: mobile});
    if (!user)
      throw new UnauthorizedException(
        "نام کاربری یا موبایل وارد شده اشتباه میباشد"
      );
    const link = this.forgetPasswordLinkGenerator(user);
    //send - sms link
    return {
      message: "لینک بازگردانی رمز عبور برای شما اس ام اس شد",
      link,
    };
  }
  async tokenGenerator(userId: number) {
    const accessToken = this.jwtService.sign(
      {userId},
      {secret: A_JWT_SECRET, expiresIn: "1d"}
    );
    const refreshToken = this.jwtService.sign(
      {userId},
      {secret: R_JWT_SECRET, expiresIn: "30d"}
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  forgetPasswordLinkGenerator(user: UserEntity) {
    const token = this.jwtService.sign(
      {userId: user.id, mobile: user.mobile},
      {secret: ForgetPassword_JWT_SECRET, expiresIn: "1m"}
    );
    const link = `http://localhost:3000/auth/changeme?token=${token}`;
    return link;
  }
  verifyRefreshToken(refreshToken: string) {
    try {
      const verified = this.jwtService.verify(refreshToken, {
        secret: R_JWT_SECRET,
      });
      if (verified?.userId && !isNaN(parseInt(verified.userId)))
        return verified?.userId;
      throw new UnauthorizedException("وارد حساب کاربری خود شوید");
    } catch (err) {
      throw new UnauthorizedException("مجددا وارد حساب کاربری خود شوید");
    }
  }
  verifyPasswordToken(token: string) {
    try {
      const verified = this.jwtService.verify(token, {
        secret: ForgetPassword_JWT_SECRET,
      });
      if (verified?.userId && !isNaN(parseInt(verified.userId)))
        return verified;
      throw new UnauthorizedException(
        "لینک مورد نظر منقضی شده مجددا تلاش کنید"
      );
    } catch (err) {
      throw new UnauthorizedException(
        "لینک مورد نظر منقضی شده مجددا تلاش کنید"
      );
    }
  }
}
