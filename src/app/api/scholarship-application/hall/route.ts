import { PrismaClient } from "@/generated/prisma";
import { catchAsync, SuccessResponse } from "@/lib";
import { z } from "zod";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const data = z.string().array().parse(body);

    await prisma.scholarshipApplicationDepartment.createMany({
      data: data.map((item) => ({ name: item })),
    });

    return SuccessResponse(
      200,
      "Scholarship application hall created successfully!"
    );
  },
  { checkAuth: true, superAdminRestricted: true }
);
