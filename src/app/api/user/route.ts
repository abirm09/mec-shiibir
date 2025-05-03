import { PrismaClient, User } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { userSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const POST = catchAsync(async (req: Request) => {
  const body = await req.json();
  const partialData = userSchema.parse(body);

  const hashedPassword = await bcrypt.hash(partialData.password, 12);
  const userData = {
    ...partialData,
    userId: partialData.email.split("@")[0],
    password: hashedPassword,
    needsPasswordChange: false,
    role: "admin",
    status: "active",
  };

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) throw new ApiError(400, "This email is already taken!");

    await tx.user.create({
      data: userData as User,
    });

    return SuccessResponse(200, "Admin created successfully!");
  });
});
