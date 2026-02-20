import { Module } from "@nestjs/common";
import { CollaborationsController } from "./collaborations.controller";
import { CollaborationsService } from "./collaborations.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [CollaborationsController],
    providers: [CollaborationsService],
})
export class CollaborationsModule { }
