import { getUser } from "@/lib/supabase/getUser";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="text-white space-y-4">
      <h1 className="text-2xl font-bold">
        Bem-vindo ao Dashboard 👋
      </h1>

      <p className="text-zinc-300">
        Email: {user.email}
      </p>
    </div>
  );
}