import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CreatorsModule } from "./creators/creators.module";
import { BrandsModule } from "./brands/brands.module";

@Module({
  imports: [PrismaModule, AuthModule, CreatorsModule, BrandsModule],
})
export class AppModule { }
