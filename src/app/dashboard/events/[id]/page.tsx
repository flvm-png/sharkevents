"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EventDetail({ params }: any) {
  const supabase = createClient();

  const [id, setId] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // 🔥 resolver params (Next 16)
  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setId(resolved.id);
    }

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      const { data: regs } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", id);

      setEvent(eventData);
      setRegistrations(regs ?? []);
    }

    load();
  }, [id]);

  if (!event) {
    return (
      <div className="text-white p-10">
        Loading event...
      </div>
    );
  }

  const checkedIn = registrations.filter((r) => r.checked_in).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">

      <h1 className="text-3xl font-bold mb-2">
        {event.title}
      </h1>

      <p className="text-zinc-400 mb-6">
        {event.description}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 p-4 rounded-lg">
          Inscritos: {registrations.length}
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg text-green-400">
          Check-ins: {checkedIn}
        </div>

        <div className="bg-zinc-900 p-4 rounded-lg">
          Capacidade: {event.capacity}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">
        Inscritos
      </h2>

      <div className="space-y-2">
        {registrations.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-900 p-3 rounded-lg flex justify-between"
          >
            <span>{r.user_id}</span>

            <span className={r.checked_in ? "text-green-400" : "text-zinc-500"}>
              {r.checked_in ? "Checked-in" : "Pendente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}