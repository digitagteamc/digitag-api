import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CreatorsService } from "./creators.service";
import { CreateCreatorDto } from "./dto/create-creator.dto";
import { UserGuard } from "../auth/user.guard";

@Controller("creators")
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @UseGuards(UserGuard)
  @Get("me/status")
  myStatus(@Req() req: any) {
    // req.user should be set by UserGuard
    return this.creatorsService.myStatus(req.user);
  }

  @Post()
  create(@Body() dto: CreateCreatorDto) {
    return this.creatorsService.create(dto);
  }

  @Get()
  list() {
    return this.creatorsService.list();
  }
}
