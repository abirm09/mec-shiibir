import config from "@/config";
import { LoginClientWrapper } from "@/features/login";
import { TSearchParams } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<TSearchParams>;
}) => {
  const { redirect_path } = await searchParams;
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(config.token.refresh_token_cookie);
  const callbackPath =
    (Array.isArray(redirect_path) ? redirect_path[0] : redirect_path) || "/";

  if (authCookie) {
    redirect("/dashboard");
  }

  return (
    <main className="bg-[#F3F7FE] w-full h-screen flex justify-center items-center">
      <LoginClientWrapper callbackPath={callbackPath} />
    </main>
  );
};

export default LoginPage;
