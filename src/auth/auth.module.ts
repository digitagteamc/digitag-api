import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { UserAuthService } from "./user-auth.service";
import { UserAuthController } from "./user-auth.controller";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
        }),
    ],
    controllers: [AuthController, UserAuthController],
    providers: [AuthService, JwtStrategy, UserAuthService],
    exports: [AuthService],
})
export class AuthModule { }
