import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AdminGuard extends (AuthGuard("jwt") as any) implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const ok = await super.canActivate(context);
        if (!ok) return false;

        const req = context.switchToHttp().getRequest();
        if (req.user?.role !== "ADMIN") throw new ForbiddenException("Admin only");
        return true;
    }
}
