import type { Metadata } from "next";
import { UsersPage } from "@/features/users/components/users-page";

export const metadata: Metadata = { title: "Usuários" };

export default function Page() {
  return <UsersPage />;
}
