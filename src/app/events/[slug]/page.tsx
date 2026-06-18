import { createClient } from "@/lib/supabase/server";
import RegisterButton from "./register-button";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event?.id ?? "");

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center text-white">
        <h1 className="text-2xl font-semibold">Evento não encontrado</h1>
        <p className="text-zinc-400 mt-2">
          O evento pode ter sido removido ou o link está incorreto.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 text-white px-4">
      
      {/* HEADER */}
      <div className="border border-white/10 bg-zinc-900 rounded-xl p-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>

        <div className="flex flex-wrap gap-2 mt-4 text-xs text-zinc-300">
          <span className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1">
            📍 {event.location}
          </span>

          <span className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1">
            📅 {new Date(event.date).toLocaleDateString()}
          </span>

          <span className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1">
            👥 {count ?? 0} / {event.capacity}
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-6 border border-white/10 bg-zinc-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Descrição</h2>
        <p className="text-zinc-300 leading-relaxed">
          {event.description || "Sem descrição disponível."}
        </p>
      </div>

      {/* ACTION */}
      <div className="mt-6 flex justify-end">
        <RegisterButton eventId={event.id} />
      </div>
    </div>
  );
}