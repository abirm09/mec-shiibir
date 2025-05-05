import config from "@/config";
import { PrismaClient } from "@/generated/prisma";
import { TAccessTokenPayload } from "@/types";
import { verify } from "jsonwebtoken";
import _ from "lodash";
import { ZodError } from "zod";
import ApiError from "../ApiError/ApiError";
import { ErrorResponse } from "../response/response";

const prisma = new PrismaClient();

const catchAsync =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RequestHandler: any,
    {
      checkAuth = false,
      superAdminRestricted = false,
    }: { checkAuth?: boolean; superAdminRestricted?: boolean }
  ) =>
  async (req: Request) => {
    try {
      if (checkAuth) {
        const authHeader = req.headers?.get("authorization");

        if (!authHeader) throw new ApiError(401, "Unauthorized");

        if (!authHeader.startsWith("Bearer "))
          throw new ApiError(401, "Invalid authorization format.");

        const token = authHeader.split(" ")[1];

        let payload: TAccessTokenPayload;
        try {
          payload = verify(
            token,
            String(config.token.access_token_secret)
          ) as TAccessTokenPayload;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          throw new ApiError(401, "Authentication failed.");
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId, sessionTokenId: payload.tokenId },
        });

        if (!user) throw new ApiError(401, "Unauthorized");

        if (user.status === "banned")
          throw new ApiError(403, "You have been banned!");
        if (user.status === "deleted")
          throw new ApiError(403, "No your found!");

        if (superAdminRestricted)
          if (user.role !== "superAdmin")
            throw new ApiError(403, "Not permitted!");

        _.set(req, "user", payload as TAccessTokenPayload);
      }

      return await RequestHandler(req);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      if (error instanceof ZodError) {
        return ErrorResponse(
          400,
          "Validation failed",
          error?.errors?.map((error) => ({
            path: error.path[0],
            message: error.message,
          }))
        );
      } else if (error instanceof ApiError) {
        return ErrorResponse(error.statusCode, error.message, [
          { path: "", message: error.message },
        ]);
      } else {
        return ErrorResponse(400, undefined, [
          { path: "", message: "Something went wrong" },
        ]);
      }
    }
  };

export default catchAsync;
