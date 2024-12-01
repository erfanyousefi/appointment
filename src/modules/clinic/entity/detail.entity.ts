import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ClinicEntity} from "./clinic.entity";

@Entity("clinic_detail")
export class ClinicDetailEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({unique: true})
  clinicId: number;
  @Column()
  province: string;
  @Column()
  city: string;
  @Column()
  address: string;
  @Column()
  tel_1: string;
  @Column({nullable: true})
  tel_2: string;
  @Column({nullable: true})
  instagram: string;
  @Column({nullable: true})
  telegram: string;
  @OneToOne(() => ClinicEntity, (clinic) => clinic.detail, {
    onDelete: "CASCADE",
  })
  clinic: ClinicEntity;
}
