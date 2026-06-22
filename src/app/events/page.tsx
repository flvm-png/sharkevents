import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic"; // 🔥 força dados sempre atualizados
export const revalidate = 0; // 🔥 desativa cache do Next

export default async function HomePage() {
  const supabase = createClient();

  // 🔥 eventos sempre fresh
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  // inscrições (para contagem)
  const { data: registrations, error: regError } = await supabase
    .from("event_registrations")
    .select("event_id");

  if (eventsError) {
    console.error("Events error:", eventsError);
    return (
      <div className="max-w-4xl mx-auto mt-10 text-red-500">
        Erro ao carregar eventos
      </div>
    );
  }

  if (regError) {
    console.error("Registrations error:", regError);
  }

  // contador por evento
  const countMap: Record<string, number> = {};

  registrations?.forEach((r) => {
    countMap[r.event_id] = (countMap[r.event_id] || 0) + 1;
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      {events?.length ? (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            registrations={countMap[event.id] || 0}
          />
        ))
      ) : (
        <p className="text-zinc-400">Ainda não há eventos.</p>
      )}
    </div>
  );
}