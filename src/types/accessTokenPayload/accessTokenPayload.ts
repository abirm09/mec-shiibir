import { Role } from "@/generated/prisma";

export type TAccessTokenPayload = {
  userId: string;
  role: Role;
  tokenId: string;
};
