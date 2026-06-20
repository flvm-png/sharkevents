"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import RegisterButton from "@/app/events/[slug]/register-button";
import CheckInQRCode from "@/app/events/[slug]/CheckInQRCode";

export default function EventClient({ event }: any) {
  const supabase = createClient();

  const [data, setData] = useState(event);
  const [formattedDate, setFormattedDate] = useState("");
  const [count, setCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  // 🔥 CARREGAR ESTADO REAL DO EVENTO
  async function refreshEvent() {
    const { data: updatedEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", event.id)
      .single();

    const { count } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", event.id);

    if (updatedEvent) {
      setData(updatedEvent);
    }

    setCount(count ?? 0);
  }

  useEffect(() => {
    setData(event);
  }, [event]);

  useEffect(() => {
    if (data?.date) {
      setFormattedDate(
        new Date(data.date).toISOString().split("T")[0]
      );
    }
  }, [data?.date]);

  useEffect(() => {
    refreshEvent();

    const handler = () => refreshEvent();

    window.addEventListener("refresh-events", handler);

    return () =>
      window.removeEventListener("refresh-events", handler);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-2">
        {data.title}
      </h1>

      <p className="text-zinc-400 mb-6">
        {data.description}
      </p>

      <div className="flex flex-wrap gap-3 mb-6 text-sm text-zinc-300">
        <span className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900">
          📍 {data.location}
        </span>

        <span className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900">
          🧑‍🤝‍🧑 {count} / {data.capacity}
        </span>

        <span className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900">
          📅 {formattedDate}
        </span>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 space-y-4">
        <RegisterButton
          eventId={data.id}
          capacity={data.capacity}
          onChange={() => refreshEvent()}
        />

        {/* 🔥 QR só aparece se estiver inscrito */}
        {isRegistered && (
          <CheckInQRCode eventId={data.id} />
        )}
      </div>
    </div>
  );
}