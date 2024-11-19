import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ClinicEntity} from "./clinic.entity";

@Entity("clinic_doctor")
export class ClinicDoctorEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  medical_code: string;
  @Column()
  degree: string;
  @Column()
  majors: string;
  @Column()
  image: string;
  @Column()
  experience: string;
  @Column()
  clinicId: number;
  @ManyToOne(() => ClinicEntity, (clinic) => clinic.doctors, {
    onDelete: "CASCADE",
  })
  clinic: ClinicEntity;
}
