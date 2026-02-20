import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CreatorsService } from "./creators.service";
import { CreateCreatorDto } from "./dto/create-creator.dto";
import { UserGuard } from "../auth/user.guard";

@Controller("creators")
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) { }

  @UseGuards(UserGuard)
  @Get("me/status")
  myStatus(@Req() req: any) {
    // req.user should be set by UserGuard
    return this.creatorsService.myStatus(req.user);
  }

  @UseGuards(UserGuard)
  @Post("register")
  create(@Body() dto: CreateCreatorDto) {
    return this.creatorsService.registerCreator(dto);
  }

  @Get()
  list(@Query("status") status?: string) {
    return this.creatorsService.list(status as any);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.creatorsService.findOne(id);
  }
}
