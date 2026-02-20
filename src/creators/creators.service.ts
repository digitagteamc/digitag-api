import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCreatorDto } from "./dto/create-creator.dto";

@Injectable()
export class CreatorsService {
    constructor(private prisma: PrismaService) { }

    private normalizePhone(phone: string) {
        const p = String(phone || "").replace(/\s+/g, "");
        if (!/^\+?\d{10,15}$/.test(p)) throw new BadRequestException("Invalid phoneNumber");
        return p.startsWith("+") ? p : `+91${p}`;
    }

    private generateUniqueKey(state: string, district: string, language: string) {
        const s = state.substring(0, 2).toUpperCase();
        const d = district.substring(0, 1).toUpperCase();
        const l = language.substring(0, 1).toUpperCase();
        const r = Math.floor(1000 + Math.random() * 9000); // 4 random digits
        return `${s}${d}${l}${r}`;
    }

    async registerCreator(dto: CreateCreatorDto) {
        const phone = this.normalizePhone(dto.phoneNumber);

        const user = await this.prisma.appUser.findUnique({
            where: { phoneNumber: phone },
            select: { id: true, role: true },
        });

        if (!user) throw new BadRequestException("User not registered. Do OTP + role register first.");
        if (user.role !== "CREATOR") throw new BadRequestException("Only CREATOR users can submit creator profile");

        // Generate unique key only if creating new (or if needed for update, but typically stays same)
        // For simplicity, we check if creator exists to decide on key
        const existing = await this.prisma.creator.findUnique({
            where: { userId: user.id },
            select: { uniqueKey: true } as any
        }) as any;

        const uniqueKey = existing?.uniqueKey || this.generateUniqueKey(dto.state, dto.district, dto.language);

        const data = {
            name: dto.name.trim(),
            email: dto.email.trim().toLowerCase(),
            location: dto.location.trim(),
            creatorName: dto.creatorName.trim(),
            industry: dto.industry.trim(),
            adsPreference: dto.adsPreference.trim(),
            primaryPlatform: dto.primaryPlatform.trim(),
            socialLinks: dto.socialLinks as any,
            followerCount: dto.followerCount,
            profilePicture: dto.profilePicture?.trim(),
            bio: dto.bio?.trim(),
            collaborationInterests: dto.collaborationInterests?.trim(),
            state: dto.state.trim(),
            district: dto.district.trim(),
            language: dto.language.trim(),
            uniqueKey,
            phoneNumber: phone,
            instagram: dto.instagram?.trim() || dto.socialLinks['instagram'] || "",
            category: dto.category?.trim() || dto.industry.trim(),
        };

        return await this.prisma.creator.upsert({
            where: { userId: user.id },
            update: {
                ...data,
                // Preserve status unless we want to reset to PENDING on every edit
            },
            create: {
                ...data,
                userId: user.id,
                status: "PENDING",
            },
        });
    }
    async adminList(status?: "PENDING" | "APPROVED" | "REJECTED") {
        return this.prisma.creator.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: "desc" },
            take: 200,
        });
    }
    async myStatus(user: { id: string; role: "CREATOR" | "BRAND" }) {
        const creator = await this.prisma.creator.findUnique({
            where: { userId: user.id },
            select: { status: true },
        });

        return {
            role: user.role,
            creatorStatus: creator?.status ?? "NOT_APPLIED",
        };
    }
    async approve(id: string) {
        return this.prisma.creator.update({
            where: { id },
            data: { status: "APPROVED" },
        });
    }

    async reject(id: string) {
        return this.prisma.creator.update({
            where: { id },
            data: { status: "REJECTED" },
        });
    }

    async list(status?: "PENDING" | "APPROVED" | "REJECTED") {
        return this.prisma.creator.findMany({
            where: { status: status ?? "APPROVED" },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
    }

    async findOne(id: string) {
        const creator = await this.prisma.creator.findUnique({ where: { id } });
        if (!creator) throw new NotFoundException(`Creator ${id} not found`);
        return creator;
    }
}
