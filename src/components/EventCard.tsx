import Link from "next/link";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  registrations: number;
};

export default function EventCard({ event, registrations }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug ?? event.id}`}>
      <div className="rounded-xl border border-white/10 bg-[#111126] p-5 shadow-sm transition hover:border-[#7C3AED]/40 hover:bg-[#16162A]">
        <h2 className="text-white font-semibold text-lg">{event.title}</h2>

        <p className="text-sm text-[#94A3B8] mt-2">{event.description}</p>

        <div className="flex gap-2 mt-3 text-xs">
          <span className="bg-[#16162A] text-[#A855F7] border border-[#7C3AED]/30 px-2 py-1 rounded">
            📍 {event.location ?? "Sem local"}
          </span>

          <span className="bg-[#16162A] text-[#A855F7] border border-[#7C3AED]/30 px-2 py-1 rounded">
            🧑‍🤝‍🧑 {registrations} / {event.capacity ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
