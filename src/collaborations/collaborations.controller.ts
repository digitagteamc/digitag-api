import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CollaborationsService } from "./collaborations.service";
import { CreateCollabDto } from "./dto/create-collab.dto";
import { UserGuard } from "../auth/user.guard";

@Controller("collaborations")
@UseGuards(UserGuard)
export class CollaborationsController {
    constructor(private readonly service: CollaborationsService) { }

    /** Brand: send a collaboration request */
    @Post()
    send(@Req() req: any, @Body() dto: CreateCollabDto) {
        return this.service.send(req.user, dto);
    }

    /** Brand: see all requests they've sent */
    @Get("sent")
    sent(@Req() req: any) {
        return this.service.sentByBrand(req.user);
    }

    /** Brand: check if already contacted a creator */
    @Get("check/:creatorId")
    check(@Req() req: any, @Param("creatorId") creatorId: string) {
        return this.service.checkContact(req.user, creatorId);
    }

    /** Creator: get all incoming requests */
    @Get("inbox")
    inbox(@Req() req: any) {
        return this.service.inboxForCreator(req.user);
    }

    /** Creator: approve or reject a request */
    @Patch(":id")
    respond(
        @Req() req: any,
        @Param("id") id: string,
        @Body("action") action: "approve" | "reject",
    ) {
        return this.service.respond(req.user, id, action);
    }
}
