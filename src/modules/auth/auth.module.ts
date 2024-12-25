import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ClinicEntity} from "../clinic/entity/clinic.entity";
import {UserEntity} from "../user/entity/user.entity";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ClinicEntity])],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
