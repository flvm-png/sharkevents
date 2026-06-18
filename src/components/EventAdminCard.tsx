"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EventAdminCard({ event }: { event: any }) {
  const supabase = createClient();

  const [stats, setStats] = useState({
    registrations: 0,
    checkedIn: 0,
  });

  useEffect(() => {
    async function loadStats() {
      // inscritos
      const { count: regCount } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id);

      // check-ins
      const { data: checkins } = await supabase
        .from("event_registrations")
        .select("checked_in")
        .eq("event_id", event.id);

      const checkedIn =
        checkins?.filter((c) => c.checked_in).length ?? 0;

      setStats({
        registrations: regCount ?? 0,
        checkedIn,
      });
    }

    loadStats();
  }, [event.id]);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg p-4">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">
            {event.title}
          </h2>

          <p className="text-sm text-zinc-400">
            {event.location}
          </p>
        </div>

        <Link
          href={`/dashboard/events/${event.id}`}
          className="text-sm px-3 py-1 bg-white text-zinc-900 rounded-lg"
        >
          Detalhe
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">

        <div className="bg-zinc-800 p-3 rounded-lg">
          <p className="text-zinc-400">Inscritos</p>
          <p className="text-xl font-bold">
            {stats.registrations}
          </p>
        </div>

        <div className="bg-zinc-800 p-3 rounded-lg">
          <p className="text-zinc-400">Check-ins</p>
          <p className="text-xl font-bold text-green-400">
            {stats.checkedIn}
          </p>
        </div>

        <div className="bg-zinc-800 p-3 rounded-lg">
          <p className="text-zinc-400">Capacidade</p>
          <p className="text-xl font-bold">
            {event.capacity}
          </p>
        </div>
      </div>

      {/* ACTION HINT */}
      <p className="text-xs text-zinc-500 mt-3">
        Clica em “Detalhe” para ver lista de inscritos e check-ins
      </p>
    </div>
  );
}