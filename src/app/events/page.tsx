import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";

export default async function HomePage() {
  const supabase = createClient();

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: registrations, error: registrationsError } = await supabase
    .from("event_registrations")
    .select("event_id");

  if (eventsError) {
    console.error("Erro a carregar eventos:", eventsError);
    return (
      <div className="max-w-4xl mx-auto mt-10 text-red-500">
        Erro ao carregar eventos.
      </div>
    );
  }

  if (registrationsError) {
    console.error("Erro a carregar inscrições:", registrationsError);
  }

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