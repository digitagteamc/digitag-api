import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  private normalizePhone(phone: string) {
    const p = String(phone || "").replace(/\s+/g, "");
    if (!/^\+?\d{10,15}$/.test(p)) throw new BadRequestException("Invalid phoneNumber");
    return p.startsWith("+") ? p : `+91${p}`;
  }
async myStatus(user: { id: string; role: "CREATOR" | "BRAND" }) {
  const brand = await this.prisma.brandProfile.findUnique({
    where: { userId: user.id },
    select: { status: true },
  });}
  async registerBrand(body: {
    phoneNumber: string;
    brandName: string;
    pan: string;
    gstin?: string;
    city?: string;
    state?: string;
  }) {
    const phone = this.normalizePhone(body.phoneNumber);

    const user = await this.prisma.appUser.findUnique({
      where: { phoneNumber: phone },
      select: { id: true, role: true },
    });

    if (!user) throw new BadRequestException("User not registered. Do OTP + role register first.");
    if (user.role !== "BRAND") throw new ForbiddenException("Only BRAND users can submit brand profile");

    const brand = await this.prisma.brandProfile.upsert({
      where: { userId: user.id },
      update: {
        phoneNumber: phone,
        brandName: body.brandName.trim(),
        pan: body.pan.trim().toUpperCase(),
        gstin: body.gstin?.trim().toUpperCase() || null,
        city: body.city?.trim() || null,
        state: body.state?.trim() || null,
      },
      create: {
        userId: user.id,
        phoneNumber: phone,
        brandName: body.brandName.trim(),
        pan: body.pan.trim().toUpperCase(),
        gstin: body.gstin?.trim().toUpperCase() || null,
        city: body.city?.trim() || null,
        state: body.state?.trim() || null,
      },
      select: { id: true, status: true },
    });

    return { ok: true, brand };
  }

  // ✅ ADMIN: list brands by status
  adminList(status?: "PENDING" | "APPROVED" | "REJECTED") {
    return this.prisma.brandProfile.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        phoneNumber: true,
        brandName: true,
        pan: true,
        gstin: true,
        city: true,
        state: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ✅ ADMIN: approve brand
  approve(id: string) {
    return this.prisma.brandProfile.update({
      where: { id },
      data: { status: "APPROVED" },
      select: { id: true, status: true },
    });
  }

  // ✅ ADMIN: reject brand
  reject(id: string) {
    return this.prisma.brandProfile.update({
      where: { id },
      data: { status: "REJECTED" },
      select: { id: true, status: true },
    });
  }
}
