import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic"; // 🔥 IMPORTANTÍSSIMO

export default async function EventsPage() {
  const supabase = createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("event_id");

  const countMap: Record<string, number> = {};

  registrations?.forEach((r) => {
    countMap[r.event_id] = (countMap[r.event_id] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-4 px-4">
      {events?.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          registrations={countMap[event.id] || 0}
        />
      ))}
    </div>
  );
}