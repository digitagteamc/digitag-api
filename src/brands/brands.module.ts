import { Module } from "@nestjs/common";
import { BrandsController } from "./brands.controller";
import { AdminBrandsController } from "./admin-brands.controller";
import { BrandsService } from "./brands.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [BrandsController, AdminBrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
