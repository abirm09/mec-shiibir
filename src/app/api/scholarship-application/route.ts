import { PrismaClient } from "@/generated/prisma";
import { catchAsync, SuccessResponse } from "@/lib";
import { ScholarshipApplication } from "@/lib/zod/scholarshipApplication/scholarshipApplication.schema";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const data = ScholarshipApplication.parse(body);

    await prisma.scholarshipApplication.create({
      data: {
        ...data,
        requestId: Date.now().toString(),
      },
    });

    return SuccessResponse(
      200,
      "Scholarship application created successfully!"
    );
  },
  { checkAuth: false }
);
