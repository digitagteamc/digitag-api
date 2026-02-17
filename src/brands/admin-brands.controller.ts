import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { BrandsService } from "./brands.service";

@UseGuards(AdminGuard)
@Controller("admin/brands")
export class AdminBrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  list(@Query("status") status?: "PENDING" | "APPROVED" | "REJECTED") {
    return this.brandsService.adminList(status);
  }

  @Patch(":id/approve")
  approve(@Param("id") id: string) {
    return this.brandsService.approve(id);
  }

  @Patch(":id/reject")
  reject(@Param("id") id: string) {
    return this.brandsService.reject(id);
  }
}
