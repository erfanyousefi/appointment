import {CategoryEntity} from "src/modules/category/entity/category.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {LocationType} from "../enum/type.enum";
import {ClinicDoctorEntity} from "./doctors.entity";

@Entity("clinic")
export class ClinicEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({nullable: true})
  categoryId: number;
  @Column()
  name: string;
  @Column()
  manager_name: string;
  @Column()
  manager_mobile: string;
  @Column({type: "enum", enum: LocationType})
  location_type: string;
  @ManyToOne(() => CategoryEntity, (category) => category.clinics, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;
  @OneToMany(() => ClinicDoctorEntity, (doctor) => doctor.clinic)
  doctors: ClinicDoctorEntity[];
}
