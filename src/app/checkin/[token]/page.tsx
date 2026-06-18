import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const supabase = createClient();
  const { token } = await params;

  // 1. procurar inscrição pelo token
  const { data: reg } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("checkin_token", token)
    .single();

  if (!reg) {
    return notFound();
  }

  // 2. se já fez check-in, não repetir
  if (reg.checked_in) {
    return (
      <div className="text-white p-10">
        Já foi feito check-in.
      </div>
    );
  }

  // 3. marcar check-in como feito
  await supabase
    .from("event_registrations")
    .update({
      checked_in: true,
    })
    .eq("checkin_token", token);

  return (
    <div className="text-white p-10">
      ✅ Check-in efetuado com sucesso!
    </div>
  );
}