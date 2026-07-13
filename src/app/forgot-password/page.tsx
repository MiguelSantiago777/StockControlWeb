"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { authService } from "@/services/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas/login-schema";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordValues) {
    await authService.forgotPassword(values.email);
    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recuperar senha</CardTitle>
          <CardDescription>
            Informe seu e-mail e enviaremos as instruções para redefinir a senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-sm">
              <p>Se o e-mail estiver cadastrado, você receberá as instruções em instantes.</p>
              <Button asChild className="w-full">
                <Link href="/login">Voltar para o login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" autoComplete="email" autoFocus {...register("email")} />
              </FormField>
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Enviar instruções
              </Button>
              <p className="text-center text-sm">
                <Link href="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
