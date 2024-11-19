import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "./modules/auth/auth.module";
import {CategoryModule} from "./modules/category/category.module";
import {ClinicModule} from "./modules/clinic/clinic.module";
import {UserModule} from "./modules/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      database: "appointment",
      username: "root",
      password: "root",
      synchronize: true,
      entities: ["dist/**/**/**/*.entity{.ts,.js}"],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ClinicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
