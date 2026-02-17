import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

function cookieExtractor(req: any) {
  return req?.cookies?.user_token || null; // <-- match cookie name you set
}

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, "user-jwt") {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate(payload: any) {
    // payload should contain userId OR phoneNumber
    const userId = payload.sub || payload.userId;
    const phoneNumber = payload.phoneNumber;

    const user = await this.prisma.appUser.findFirst({
      where: userId ? { id: userId } : { phoneNumber },
      select: { id: true, role: true, phoneNumber: true },
    });

    if (!user) throw new UnauthorizedException("User not found");
    return user; // ✅ this becomes req.user
  }
}
