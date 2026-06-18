import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export default async function Home() {
  const events = await getEvents();

  return (
    <div>
      <h1 className="text-3xl font-semibold text-zinc-800 mb-6">
        Próximos Eventos
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}