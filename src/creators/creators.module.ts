import { Module } from "@nestjs/common";
import { CreatorsController } from "./creators.controller";
import { CreatorsService } from "./creators.service";
import { AdminCreatorsController } from "./admin-creators.controller";

@Module({
    controllers: [CreatorsController, AdminCreatorsController],
    providers: [CreatorsService],
})
export class CreatorsModule { }
