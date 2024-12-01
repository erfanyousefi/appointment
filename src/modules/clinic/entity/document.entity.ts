import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ClinicEntity} from "./clinic.entity";

@Entity("clinic_document")
export class ClinicDocumentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  license: string;
  @Column()
  clinicId: number;
  @Column({nullable: true})
  rent_agreement: string;
  @Column({nullable: true})
  front_image: string;
  @Column({nullable: true})
  side_image: string;
  @Column({nullable: true})
  clinic_image_1: string;
  @Column({nullable: true})
  clinic_image_2: string;
  @OneToOne(() => ClinicEntity, (clinic) => clinic.documents, {
    onDelete: "CASCADE",
  })
  clinic: ClinicEntity;
}
