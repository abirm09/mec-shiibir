import config from "@/config";
import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { TAccessTokenPayload } from "@/types";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

const prisma = new PrismaClient();

export const GET = catchAsync(
  async () => {
    const cookieStore = await cookies();
    const token = z
      .string({ required_error: "Invalid request!" })
      .parse(cookieStore.get(config.token.refresh_token_cookie)?.value);

    let payload: TAccessTokenPayload;
    try {
      payload = verify(
        token,
        String(config.token.refresh_token_secret)
      ) as unknown as TAccessTokenPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new ApiError(401, "Authentication failed.");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, sessionTokenId: payload.tokenId },
    });

    if (!user) throw new ApiError(400, "Invalid request!");

    if (user.status === "banned")
      throw new ApiError(403, "You have been banned!");
    if (user.status === "deleted") throw new ApiError(403, "No user found!");

    const jwtPayload = {
      userId: user.id,
      role: user.role,
      tokenId: user.sessionTokenId,
    };

    const accessToken = sign(
      jwtPayload,
      String(config.token.access_token_secret),
      { expiresIn: Number(config.token.access_token_exi) }
    );

    return SuccessResponse(200, "Blog retrieved successfully!", {
      accessToken,
    });
  },
  { checkAuth: false }
);
