"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/shared/form-field";
import { PageHeader } from "@/components/shared/page-header";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/lib/utils";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(values: ChangePasswordValues) {
    await authService.changePassword(values.currentPassword, values.newPassword);
    toast.success("Senha alterada");
    reset();
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Perfil" breadcrumbs={[{ label: "Perfil" }]} />

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-5">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className="mt-1">{user.role}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alterar senha</CardTitle>
          <CardDescription>Use uma senha forte e exclusiva para esta conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField label="Senha atual" htmlFor="currentPassword" error={errors.currentPassword?.message}>
              <Input id="currentPassword" type="password" autoComplete="current-password" {...register("currentPassword")} />
            </FormField>
            <FormField label="Nova senha" htmlFor="newPassword" error={errors.newPassword?.message}>
              <Input id="newPassword" type="password" autoComplete="new-password" {...register("newPassword")} />
            </FormField>
            <FormField label="Confirmar nova senha" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
              <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
            </FormField>
            <Button type="submit" loading={isSubmitting}>
              Salvar nova senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
