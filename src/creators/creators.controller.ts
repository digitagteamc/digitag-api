import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreatorsService } from "./creators.service";
import { CreateCreatorDto } from "./dto/create-creator.dto";

@Controller("creators")
export class CreatorsController {
    constructor(private readonly creatorsService: CreatorsService) { }

    @Post()
    create(@Body() dto: CreateCreatorDto) {
        return this.creatorsService.create(dto);
    }

    @Get()
    list() {
        return this.creatorsService.list();
    }
}
