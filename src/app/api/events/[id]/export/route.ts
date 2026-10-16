import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Só utilizadores autenticados podem exportar. A verificação de que é
  // o organizador do evento deve ser feita também dentro da função SQL.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_event_export", {
    event_uuid: id,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const csv =
    "email,created_at\n" +
    (data ?? [])
      .map((r: { email: string; created_at: string }) => `${r.email},${r.created_at}`)
      .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="event-${id}.csv"`,
    },
  });
}
