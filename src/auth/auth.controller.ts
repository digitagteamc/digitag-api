import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { AdminGuard } from "./admin.guard";

@Controller("auth")
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post("admin/login")
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response
    ) {
        const { token, user } = await this.auth.adminLogin(body.email, body.password);

        // ✅ HttpOnly cookie (best practice)
        res.cookie("admin_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // set true in production https
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { user };
    }

    @Post("logout")
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("admin_token", { path: "/" });
        return { ok: true };
    }

    @UseGuards(AdminGuard)
    @Get("me")
    me(@Res({ passthrough: true }) res: Response) {
        return { ok: true };
    }
}
