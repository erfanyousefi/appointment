import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("Appointment System")
    .setDescription("Bootcamp LiveCode-Project ")
    .setVersion("v0.1.0")
    .addBearerAuth(
      {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer",
      },
      "Authorization"
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/swagger", app, swaggerDocument);
  await app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
}
bootstrap();
