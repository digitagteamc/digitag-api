import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CreatorsModule } from "./creators/creators.module";
import { BrandsModule } from "./brands/brands.module";
import { CollaborationsModule } from "./collaborations/collaborations.module";

@Module({
  imports: [PrismaModule, AuthModule, CreatorsModule, BrandsModule, CollaborationsModule],
})
export class AppModule { }

