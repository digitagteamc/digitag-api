import "dotenv/config";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {
    const email = "admin@digitag.com";
    const password = "Admin@12345"; // change later

    const hash = await bcrypt.hash(password, 12);

    await prisma.adminUser.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash: hash, role: "ADMIN" },
    });

    console.log("✅ Admin created:", email, password);
}

main().finally(() => prisma.$disconnect());
