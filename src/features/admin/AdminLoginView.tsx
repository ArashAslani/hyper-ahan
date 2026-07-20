"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/shared/ui/Button";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import { ApiError } from "@/lib/api-client";
import { useAdminAuth } from "./auth/AdminAuthProvider";

const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, login } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const returnUrl = searchParams.get("returnUrl");
  const destination =
    returnUrl && returnUrl.startsWith("/admin") ? returnUrl : routes.admin.dashboard;

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(destination);
    }
  }, [status, router, destination]);

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values);
      router.replace(destination);
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "ورود ناموفق بود. لطفاً دوباره تلاش کنید.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-text md:text-2xl">
            ورود به پنل مدیریت
          </h1>
          <p className="mt-2 text-sm text-text-muted">{siteConfig.name}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {formError ? (
            <div
              role="alert"
              className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {formError}
            </div>
          ) : null}

          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              نام کاربری
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted"
              />
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                {...register("username")}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={
                  errors.username ? "username-error" : undefined
                }
                className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-surface pr-10 pl-4 text-base text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            {errors.username ? (
              <p id="username-error" className="mt-1 text-xs text-danger">
                {errors.username.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              رمز عبور
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-surface pr-10 pl-10 text-base text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"
                }
                className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted hover:text-accent"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="mt-1 text-xs text-danger">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                در حال ورود...
              </>
            ) : (
              "ورود"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
