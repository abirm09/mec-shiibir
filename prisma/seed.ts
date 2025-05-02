/* eslint-disable no-console */
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findMany({
    where: { role: "superAdmin" },
  });
  if (existingAdmin.length) {
    console.log("✅ Super Admin user already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    String(process.env.SUPER_ADMIN_PASSWORD),
    12
  );

  await prisma.user.create({
    data: {
      userId: "superadmin",
      fullName: "Super Admin",
      email: "superadmin@mecshibir.com",
      password: hashedPassword,
      role: "superAdmin",
      status: "active",
    },
  });

  console.log("✅ Super Admin user created.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
