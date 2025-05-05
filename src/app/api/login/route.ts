import config from "@/config";
import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { loginSchema } from "@/lib/zod";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const POST = catchAsync(async (req: Request) => {
  const cookieStore = await cookies();
  const body = await req.json();

  const data = loginSchema.parse(body);

  const findUser = await prisma.user.findFirst({
    where: { email: data.email },
  });

  if (!findUser) throw new ApiError(400, "User not found!");

  const matchPassword = await bcrypt.compare(
    data.password,
    findUser?.password || ""
  );
  if (!matchPassword) throw new ApiError(400, "Invalid password!");
  const tokenId = createId();
  const jwtPayload = {
    userId: findUser.id,
    role: findUser.role,
    tokenId,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    String(config.token.access_token_secret),
    { expiresIn: config.token.access_token_exi }
  );

  const refreshToken = jwt.sign(
    jwtPayload,
    String(config.token.refresh_token_secret),
    { expiresIn: config.token.refresh_token_exi }
  );

  cookieStore.set(config.token.refresh_token_cookie, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: config.token.refresh_token_exi,
  });

  await prisma.user.update({
    where: { userId: findUser.userId },
    data: { sessionTokenId: tokenId },
  });

  return SuccessResponse(200, "Login successfully!", { token: accessToken });
}, {});
