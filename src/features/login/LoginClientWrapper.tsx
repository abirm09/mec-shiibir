"use client";

import { Button, Input } from "@/components/ui";
import { useAdminLoginMutation } from "@/redux/features/auth/authApi";
import { setAuth } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { TAuthUser, TErrorMessage, TErrorResponse } from "@/types";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const LoginClientWrapper = ({ callbackPath }: { callbackPath: string }) => {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<TErrorMessage[] | null>(null);
  const [adminLoginHandler, { isLoading }] = useAdminLoginMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();
  const onSubmit = async (data: { email: string; password: string }) => {
    setServerError(null);
    try {
      const response = await adminLoginHandler(data).unwrap();
      const user = jwtDecode<TAuthUser>(response?.data?.token);
      dispatch(
        setAuth({
          user,
          token: response.data.token,
          isLoading: false,
        })
      );
      router.push(callbackPath);
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      setServerError(err?.errorMessages || null);
    }
  };
  return (
    <div className="bg-white rounded-md shadow-md p-10 max-w-md w-full">
      <div className="text-center">
        <p className="font-bold text-2xl bg-primary/20 rounded-full py-2 px-5 inline-block text-primary mb-5">
          Shibir MEC
        </p>
      </div>
      <h2 className="text-center font-bold pb-3">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            type="email"
            placeholder="Enter your email email"
            {...register("email", { required: true })}
            autoComplete="email"
            className="rounded-full px-5"
          />
          {errors.email && (
            <span className="text-destructive font-semibold ml-3 mt-2">
              Email is required
            </span>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
            autoComplete="current-password"
            className="rounded-full px-5"
          />
          {errors.password && (
            <span className="text-destructive font-semibold ml-3 mt-2">
              Password is required
            </span>
          )}
        </div>
        {serverError ? (
          <div>
            <ul className="list-disc ml-3">
              {serverError.map((error) => (
                <li
                  className="text-destructive font-semibold ml-3 mt-2"
                  key={error.message}
                >
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <Button className="w-full rounded-full py-5" disabled={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginClientWrapper;
