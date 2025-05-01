type TAuthUser = {
  userId: string;
  role: "superAdmin" | "admin";
  tokenId: string;
  iat: number;
  exp: number;
};

type TAuthSlice = {
  user?: TAuthUser | null;
  token?: string | null;
  isLoading?: boolean;
};

export type { TAuthSlice, TAuthUser };
