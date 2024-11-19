import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("clinic_detail")
export class ClinicDetailEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
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
}
