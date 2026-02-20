import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCollabDto } from "./dto/create-collab.dto";

@Injectable()
export class CollaborationsService {
    constructor(private prisma: PrismaService) { }

    /** Brand: see all requests they've sent */
    async sentByBrand(brandUser: { id: string; role: string }) {
        if (brandUser.role !== "BRAND") {
            throw new ForbiddenException("Only BRAND users can view sent requests");
        }
        const brand = await this.prisma.brandProfile.findUnique({
            where: { userId: brandUser.id },
            select: { id: true },
        });
        if (!brand) return [];

        return this.prisma.collabRequest.findMany({
            where: { brandId: brand.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                requirement: true,
                budget: true,
                timeline: true,
                message: true,
                status: true,
                createdAt: true,
                creator: {
                    select: { id: true, name: true, instagram: true, category: true },
                },
            },
        });
    }

    /** Brand: check if already contacted a specific creator */
    async checkContact(brandUser: { id: string; role: string }, creatorId: string) {
        if (brandUser.role !== "BRAND") return { contacted: false };
        const brand = await this.prisma.brandProfile.findUnique({
            where: { userId: brandUser.id },
            select: { id: true },
        });
        if (!brand) return { contacted: false, status: null };

        const req = await this.prisma.collabRequest.findFirst({
            where: { brandId: brand.id, creatorId },
            select: { id: true, status: true },
            orderBy: { createdAt: "desc" },
        });
        return { contacted: !!req, status: req?.status ?? null };
    }

    /** Brand sends a collaboration request to a creator */
    async send(brandUser: { id: string; role: string }, dto: CreateCollabDto) {
        if (brandUser.role !== "BRAND") {
            throw new ForbiddenException("Only BRAND users can send collaboration requests");
        }

        // Verify the brand is APPROVED
        const brand = await this.prisma.brandProfile.findUnique({
            where: { userId: brandUser.id },
            select: { id: true, status: true, brandName: true },
        });
        if (!brand) throw new BadRequestException("Brand profile not found. Please complete registration.");
        if (brand.status !== "APPROVED") {
            throw new ForbiddenException("Your brand profile must be approved before contacting creators.");
        }

        // Verify creator exists
        const creator = await this.prisma.creator.findUnique({
            where: { id: dto.creatorId },
            select: { id: true },
        });
        if (!creator) throw new NotFoundException("Creator not found");

        // Create the request
        const req = await this.prisma.collabRequest.create({
            data: {
                brandId: brand.id,
                creatorId: dto.creatorId,
                requirement: dto.requirement.trim(),
                budget: dto.budget?.trim() || null,
                timeline: dto.timeline?.trim() || null,
                message: dto.message?.trim() || null,
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
            },
        });

        return { ok: true, request: req };
    }

    /** Creator fetches all incoming collaboration requests */
    async inboxForCreator(creatorUser: { id: string; role: string }) {
        if (creatorUser.role !== "CREATOR") {
            throw new ForbiddenException("Only CREATOR users can view their inbox");
        }

        const creator = await this.prisma.creator.findUnique({
            where: { userId: creatorUser.id },
            select: { id: true },
        });
        if (!creator) throw new NotFoundException("Creator profile not found");

        return this.prisma.collabRequest.findMany({
            where: { creatorId: creator.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                requirement: true,
                budget: true,
                timeline: true,
                message: true,
                status: true,
                createdAt: true,
                brand: {
                    select: {
                        id: true,
                        brandName: true,
                        city: true,
                        state: true,
                    },
                },
            },
        });
    }

    /** Creator approves or rejects a collaboration request */
    async respond(
        creatorUser: { id: string; role: string },
        requestId: string,
        action: "approve" | "reject",
    ) {
        if (creatorUser.role !== "CREATOR") {
            throw new ForbiddenException("Only CREATOR users can respond to requests");
        }

        const creator = await this.prisma.creator.findUnique({
            where: { userId: creatorUser.id },
            select: { id: true },
        });
        if (!creator) throw new NotFoundException("Creator profile not found");

        const request = await this.prisma.collabRequest.findUnique({
            where: { id: requestId },
            select: { id: true, creatorId: true, status: true },
        });
        if (!request) throw new NotFoundException("Request not found");
        if (request.creatorId !== creator.id) throw new ForbiddenException("Not your request");
        if (request.status !== "PENDING") {
            throw new BadRequestException("Request has already been responded to");
        }

        const updated = await this.prisma.collabRequest.update({
            where: { id: requestId },
            data: { status: action === "approve" ? "APPROVED" : "REJECTED" },
            select: { id: true, status: true },
        });

        return { ok: true, request: updated };
    }
}
