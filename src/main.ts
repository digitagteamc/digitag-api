import "dotenv/config";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


async function bootstrap() {
  console.log("DATABASE_URL loaded?", !!process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true, // ✅ allow all origins
    credentials: true, // ✅ allow cookies
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 3001, "0.0.0.0");
}
bootstrap();
