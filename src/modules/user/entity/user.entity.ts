import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column()
  mobile: string;
  @Column({nullable: true})
  username: string;
  @Column({nullable: true})
  password: string;
  @Column({nullable: true})
  otp_code: string;
  @Column({nullable: true})
  otp_expires_in: Date;
  @Column({nullable: true})
  last_change_password: Date;
}
