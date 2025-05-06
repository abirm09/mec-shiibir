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
      "Scholarship application department created successfully!"
    );
  },
  { checkAuth: true, superAdminRestricted: true }
);

export const GET = catchAsync(
  async () => {
    const result = await prisma.scholarshipApplicationDepartment.findMany();

    return SuccessResponse(
      200,
      "Scholarship application department retrieved successfully!",
      { departments: result }
    );
  },
  { checkAuth: false }
);
