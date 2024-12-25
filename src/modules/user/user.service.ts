import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {DoctorScheduleEntity} from "../clinic/entity/schedula.entity";
import {WeekDays} from "../clinic/enum/week-days";
import {UserEntity} from "./entity/user.entity";

let times = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"];
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DoctorScheduleEntity)
    private scheduleRepository: Repository<DoctorScheduleEntity>
  ) {}
  async reserve() {
    const user = 1;
    const data = {
      date: new Date(),
      clinicId: 1,
      drId: 1,
      time: "13:30",
    };
    const dayList = Object.values(WeekDays);
    const dayNumber = data.date.getDay();
    const dayName = dayList[dayNumber];
    const [hours, minutes] = data.time.split(":");
    const requestTime = new Date(
      new Date(data.date).setUTCHours(+hours, +minutes)
    );

    return {
      requestTime,
    };
  }
}
