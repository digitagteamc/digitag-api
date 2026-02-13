import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

function cookieExtractor(req: any) {
    return req?.cookies?.admin_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const secret = process.env.JWT_SECRET;

        // Fail fast + satisfy TypeScript
        if (!secret) {
            throw new Error("JWT_SECRET is missing in .env");
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: secret, // ✅ Type is string (narrowed)
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
