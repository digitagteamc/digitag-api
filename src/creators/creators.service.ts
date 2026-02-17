import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCreatorDto } from "./dto/create-creator.dto";

@Injectable()
export class CreatorsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCreatorDto) {
        try {
            return await this.prisma.creator.create({
                data: {
                    name: dto.name.trim(),
                    email: dto.email.trim().toLowerCase(),
                    instagram: dto.instagram.trim(),
                    category: dto.category.trim(),
                    phoneNumber: dto.phoneNumber.replace(/\s+/g, ""),
                    user: {
                        connect: { phoneNumber: dto.phoneNumber },
                    },
                },
            });
        } catch (e: any) {
            if (String(e?.message || "").includes("Unique constraint")) {
                throw new ConflictException("Email already exists");
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
