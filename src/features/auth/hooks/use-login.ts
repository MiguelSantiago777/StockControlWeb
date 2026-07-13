import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace(searchParams.get("redirect") ?? "/dashboard");
    },
    onError: () => {
      toast.error("Não foi possível entrar", {
        description: "Verifique seu e-mail e senha e tente novamente.",
      });
    },
  });
}
