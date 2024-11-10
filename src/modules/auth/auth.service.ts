import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../user/entity/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  async signup() {}
  async login() {}
  async sendOtp() {}
  async checkOtp() {}
  async refreshToken() {}
  async forgetPassword() {}
}
