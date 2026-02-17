import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserGuard extends (AuthGuard("user-jwt") as any) implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const ok = await super.canActivate(context);
    if (!ok) return false;

    const req = context.switchToHttp().getRequest();
    if (!req.user?.id) throw new ForbiddenException("Invalid session");
    if (req.user.role !== "CREATOR" && req.user.role !== "BRAND") {
      throw new ForbiddenException("App user only");
    }
    return true;
  }
}
