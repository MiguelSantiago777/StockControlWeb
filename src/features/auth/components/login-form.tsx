"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      const response = await authService.login(values);
      setSession(response.user, response.accessToken, response.refreshToken);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        isAxiosError(err) && err.response?.status === 401
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente novamente."
      );
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <PackageSearch className="mb-2 h-9 w-9 text-primary" aria-hidden />
        <CardTitle className="text-xl">StockControl</CardTitle>
        <CardDescription>Entre com sua conta para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" autoFocus {...register("email")} />
          </FormField>
          <FormField label="Senha" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          </FormField>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Entrar
          </Button>

          <p className="text-center text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Esqueci minha senha
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
