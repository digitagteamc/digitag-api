import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CreatorsModule } from "./creators/creators.module";

@Module({
  imports: [PrismaModule, AuthModule, CreatorsModule],
})
export class AppModule { }
