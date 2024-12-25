import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DoctorScheduleEntity} from "../clinic/entity/schedula.entity";
import {UserEntity} from "./entity/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DoctorScheduleEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
