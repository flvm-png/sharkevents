import Link from "next/link";
import { Event } from "@/types/event";

export default function EventCard({ event }: { event: Event }) {
  const formattedLocation = event.location ?? "Sem local";
  const registered = event.registered_count ?? 0;
  const capacity = event.capacity ?? 0;

  return (
    <Link href={`/events/${event.slug ?? event.id}`}>
      <div
        className="
        rounded-lg
        border border-white/10
        bg-zinc-900
        p-4
        hover:bg-zinc-800
        transition
      "
      >
        <h2 className="font-semibold text-lg text-white">
          {event.title}
        </h2>

        <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
          {event.description}
        </p>

        <div className="flex gap-2 mt-3 text-xs text-zinc-300">
          <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1">
            📍 {formattedLocation}
          </span>

          <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1">
            🧑‍🤝‍🧑 {registered} / {capacity}
          </span>
        </div>
      </div>
    </Link>
  );
}