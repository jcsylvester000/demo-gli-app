import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin/guard";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <LoginForm />;
}
