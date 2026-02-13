import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { UserAuthService } from "./user-auth.service";

@Controller("auth")
export class UserAuthController {
    constructor(private readonly userAuth: UserAuthService) { }

    // user requests OTP (creator/brand)
    @Post("request-otp")
    async requestOtp(@Body() body: { phoneNumber: string }) {
        return this.userAuth.requestOtp(body.phoneNumber);
    }

    // user verifies OTP
    @Post("verify-otp")
    async verifyOtp(
        @Body() body: { phoneNumber: string; otp: string },
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.userAuth.verifyOtp(body.phoneNumber, body.otp);

        // ✅ If user not in DB -> force registration; DO NOT set cookie
        if (result.needsRegistration) {
            return { needsRegistration: true, phoneNumber: result.phoneNumber };
        }

        // ✅ Existing user -> set HttpOnly cookie
        res.cookie("user_token", result.token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // true in production https
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { needsRegistration: false, user: result.user };
    }

    @Post("register")
    async register(
        @Body() body: { phoneNumber: string; role: "CREATOR" | "BRAND" },
        @Res({ passthrough: true }) res: Response
    ) {
        const { token, user } = await this.userAuth.register(body.phoneNumber, body.role);

        res.cookie("user_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { user };
    }

    @Post("user/logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("user_token", { path: "/" });
        return { ok: true };
    }
}
