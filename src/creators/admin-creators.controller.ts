import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { CreatorsService } from "./creators.service";
import { AdminGuard } from "../auth/admin.guard";

@UseGuards(AdminGuard)
@Controller("admin/creators")
export class AdminCreatorsController {
    constructor(private readonly creatorsService: CreatorsService) { }

    @Get()
    list(@Query("status") status?: "PENDING" | "APPROVED" | "REJECTED") {
        return this.creatorsService.adminList(status);
    }

    @Patch(":id/approve")
    approve(@Param("id") id: string) {
        return this.creatorsService.approve(id);
    }

    @Patch(":id/reject")
    reject(@Param("id") id: string) {
        return this.creatorsService.reject(id);
    }
}
