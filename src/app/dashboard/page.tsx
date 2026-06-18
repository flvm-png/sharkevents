"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import EventAdminCard from "@/components/EventAdminCard";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);

      // 🔥 eventos criados pelo user
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", data.user.id)
        .order("created_at", { ascending: false });

      setEvents(eventsData ?? []);
    }

    load();
  }, []);

  if (!user) {
    return (
      <div className="text-white p-10">
        A carregar dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard do Organizador
      </h1>

      <div className="grid gap-4">
        {events.map((event) => (
          <EventAdminCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}