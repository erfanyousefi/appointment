import {Column, Entity} from "typeorm";

@Entity()
export class Reserve {
  @Column()
  userId: number;
  @Column()
  clinicId: number;
  @Column()
  doctorId: number;
  @Column()
  datetime: Date;
  @Column()
  status: string;
}
