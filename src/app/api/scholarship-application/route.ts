import { PrismaClient, ScholarshipApplicationStatus } from "@/generated/prisma";
import { catchAsync, SuccessResponse } from "@/lib";
import { paginationHelper } from "@/lib/paginationHelper/paginationHelper";
import {
  ScholarshipApplication,
  ScholarshipApplicationUpdateSchema,
} from "@/lib/zod/scholarshipApplication/scholarshipApplication.schema";
import { TAccessTokenPayload } from "@/types";
import _ from "lodash";
import { z } from "zod";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const data = ScholarshipApplication.parse(body);

    const result = await prisma.scholarshipApplication.create({
      data: {
        ...data,
        requestId: Date.now().toString(),
      },
    });

    return SuccessResponse(
      201,
      "Scholarship application created successfully!",
      { request: result }
    );
  },
  { checkAuth: false }
);

export const GET = catchAsync(
  async (req: Request) => {
    const status =
      (new URL(req.url).searchParams.get(
        "status"
      ) as ScholarshipApplicationStatus) || "pending";

    const { page, limit, skip } = paginationHelper(req.url);

    const result = await prisma.scholarshipApplication.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      include: {
        hall: {
          select: { id: true, name: true },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        approvedByUser: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const count = await prisma.scholarshipApplication.count();

    return SuccessResponse(
      200,
      "Scholarship application retrieved successfully!",
      { photoGallery: result },
      undefined,
      { page, limit, total: count }
    );
  },
  { checkAuth: true }
);

export const PUT = catchAsync(
  async (req: Request) => {
    const user = _.get(req, "user") as unknown as TAccessTokenPayload;
    const body = await req.json();
    const id = z.string({ required_error: "Id is required!" }).parse(body?.id);
    const status = z
      .string()
      .optional()
      .parse(body?.status) as ScholarshipApplicationStatus;
    const data = ScholarshipApplicationUpdateSchema.parse(body);

    const result = await prisma.scholarshipApplication.update({
      where: { id },
      data: {
        ...data,
        status,
        approvedByUserId: status === "approved" ? user.userId : null,
      },
    });

    return SuccessResponse(
      201,
      "Scholarship application created successfully!",
      { request: result }
    );
  },
  { checkAuth: true }
);
