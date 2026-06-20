"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEventCount } from "@/lib/events/getEventCounts";

export default function EventCard({ event }: any) {
  const [count, setCount] = useState(0);

  async function load() {
    const c = await getEventCount(event.id);
    setCount(c);
  }

  useEffect(() => {
    load();

    const handler = () => load();

    window.addEventListener("refresh-events", handler);

    return () =>
      window.removeEventListener("refresh-events", handler);
  }, [event.id]);

  return (
    <Link href={`/events/${event.slug ?? event.id}`}>
      <div className="rounded-lg border border-white/10 bg-zinc-900 p-4 hover:bg-zinc-800 transition">
        <h2 className="text-white font-semibold text-lg">
          {event.title}
        </h2>

        <p className="text-sm text-zinc-400 mt-2">
          {event.description}
        </p>

        <div className="flex gap-2 mt-3 text-xs text-zinc-300">
          <span>📍 {event.location ?? "Sem local"}</span>

          <span>
            🧑‍🤝‍🧑 {count} / {event.capacity ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}