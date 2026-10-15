import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin/guard";
import { PasswordForm } from "@/components/admin/password-form";

export const metadata = { title: "Choose a new password" };

/** Required at first sign-in and after an Admin resets your password. */
export default async function ChangePassword() {
  const s = await getAdminSession();
  if (!s) redirect("/admin/login");
  return (
    <div>
      <h1 className="text-2xl">Choose a new password</h1>
      <p className="mt-2 text-[0.9375rem] text-gli-slate">You signed in with a temporary password. Choose your own to continue.</p>
      <div className="mt-5">
        <PasswordForm mode="first" />
      </div>
    </div>
  );
}
