import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";

const OTP_DEFAULT = "1234";

@Injectable()
export class UserAuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    private normalizePhone(phone: string) {
        const p = String(phone || "").replace(/\s+/g, "");
        if (!/^\+?\d{10,15}$/.test(p)) throw new BadRequestException("Invalid phoneNumber");
        return p.startsWith("+") ? p : `+91${p}`;
    }

    private async createOtpSession(phoneNumber: string) {
        const otpHash = await bcrypt.hash(OTP_DEFAULT, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this.prisma.otpSession.create({
            data: {
                phoneNumber,
                otpHash,
                expiresAt,
            },
        });
    }

    async requestOtp(phoneNumber: string) {
        const phone = this.normalizePhone(phoneNumber);

        const existing = await this.prisma.appUser.findUnique({
            where: { phoneNumber: phone },
            select: { id: true, role: true },
        });

        await this.createOtpSession(phone);

        return {
            ok: true,
            exists: !!existing,
            role: existing?.role ?? null,
            devOtp: OTP_DEFAULT, // optional, remove later
        };
    }

    async verifyOtp(phoneNumber: string, otp: string) {
        const phone = this.normalizePhone(phoneNumber);

        const session = await this.prisma.otpSession.findFirst({
            where: { phoneNumber: phone, verifiedAt: null },
            orderBy: { createdAt: "desc" },
        });

        if (!session) throw new UnauthorizedException("OTP session not found");
        if (session.expiresAt.getTime() < Date.now()) throw new UnauthorizedException("OTP expired");

        const ok = await bcrypt.compare(String(otp || ""), session.otpHash);
        if (!ok) throw new UnauthorizedException("Invalid OTP");

        await this.prisma.otpSession.update({
            where: { id: session.id },
            data: { verifiedAt: new Date() },
        });

        const user = await this.prisma.appUser.findUnique({
            where: { phoneNumber: phone },
        });

        // ✅ strict rule: if user doesn't exist, must register role (no token)
        if (!user) {
            return { needsRegistration: true as const, phoneNumber: phone };
        }

        if (!user.isActive) throw new UnauthorizedException("User not active");

        const token = await this.jwt.signAsync({
            sub: user.id,
            role: user.role,
            phoneNumber: user.phoneNumber,
            kind: "USER",
        });

        return {
            needsRegistration: false as const,
            token,
            user: { id: user.id, role: user.role, phoneNumber: user.phoneNumber },
        };
    }

    async register(phoneNumber: string, role: "CREATOR" | "BRAND") {
        if (role !== "CREATOR" && role !== "BRAND") throw new BadRequestException("Invalid role");

        const phone = this.normalizePhone(phoneNumber);

        // Require OTP verified recently (last 10 mins)
        const verified = await this.prisma.otpSession.findFirst({
            where: {
                phoneNumber: phone,
                verifiedAt: { not: null },
                createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
            },
            orderBy: { createdAt: "desc" },
        });
        if (!verified) throw new UnauthorizedException("Verify OTP first");

        const user = await this.prisma.appUser.upsert({
            where: { phoneNumber: phone },
            update: { role, isActive: true },
            create: { phoneNumber: phone, role, isActive: true },
        });

        const token = await this.jwt.signAsync({
            sub: user.id,
            role: user.role,
            phoneNumber: user.phoneNumber,
            kind: "USER",
        });

        return { token, user: { id: user.id, role: user.role, phoneNumber: user.phoneNumber } };
    }
}
