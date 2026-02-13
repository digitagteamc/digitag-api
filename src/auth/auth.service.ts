import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async adminLogin(email: string, password: string) {
        const user = await this.prisma.adminUser.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException("Invalid credentials");

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException("Invalid credentials");

        const payload = { sub: user.id, role: user.role, email: user.email };
        const token = await this.jwt.signAsync(payload);

        return { token, user: { id: user.id, email: user.email, role: user.role } };
    }
}
