import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCreatorDto } from "./dto/create-creator.dto";

@Injectable()
export class CreatorsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCreatorDto) {
        try {
            const cleanPhone = dto.phoneNumber.replace(/\s+/g, "");

            return await this.prisma.creator.create({
                data: {
                    name: dto.name.trim(),
                    email: dto.email.trim().toLowerCase(),
                    instagram: dto.instagram.trim(),
                    category: dto.category.trim(),
                    phoneNumber: cleanPhone,
                    user: {
                        // Connect via ID is much safer than phone number
                        connect: { id: dto.userId },
                    },
                },
            });
        } catch (e: any) {
            // Prisma error code for "Record to connect not found"
            if (e.code === 'P2025') {
                throw new ConflictException("The AppUser account was not found.");
            }
            if (String(e?.message || "").includes("Unique constraint")) {
                throw new ConflictException("Email or Phone Number already exists");
            }
            throw e;
        }
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

    async list() {
        return this.prisma.creator.findMany({
            where: { status: "APPROVED" },
            orderBy: { createdAt: "desc" },
            take: 10,
        });

    }
}
