import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";

export default async function HomePage() {
  const supabase = createClient();

  const { data: events } = await supabase.from("events").select("*");

  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("event_id");

  const countMap: Record<string, number> = {};

  registrations?.forEach((r) => {
    countMap[r.event_id] = (countMap[r.event_id] || 0) + 1;
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
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