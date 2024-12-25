import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {DoctorStatus} from "../enum/status.enum";
import {WeekDays} from "../enum/week-days";

@Entity("doctor_schedule")
export class DoctorScheduleEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  doctorId: number;
  @Column({type: "enum", enum: WeekDays})
  day: string;
  @Column()
  start_time: string;
  @Column()
  end_time: string;
  @Column({type: "enum", enum: DoctorStatus})
  status: string;
}
