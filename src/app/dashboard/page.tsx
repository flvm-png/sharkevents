"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import EventAdminCard from "@/components/EventAdminCard";

export default function DashboardPage() {
  const supabase = createClient();

  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // EVENTOS ONDE ESTOU INSCRITO
      const { data: registrations } = await supabase
        .from("event_registrations")
        .select(`
          event_id,
          events (
            id,
            title,
            description,
            location,
            date,
            slug
          )
        `)
        .eq("user_id", user.id);

      const registered =
        registrations?.map((r: any) => r.events).filter(Boolean) ?? [];

      setRegisteredEvents(registered);

      // EVENTOS QUE CRIEI
      const { data: createdEvents } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      setOrganizedEvents(createdEvents ?? []);

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-white">
        A carregar dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">

      {/* DASHBOARD USER */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">
          Dashboard
        </h1>

        <p className="text-zinc-400 mb-6">
          Eventos em que estás inscrito.
        </p>

        {registeredEvents.length === 0 ? (
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 text-zinc-400">
            Ainda não estás inscrito em nenhum evento.
          </div>
        ) : (
          <div className="grid gap-3">
            {registeredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
              >
                <div className="
                  bg-zinc-900
                  border border-white/10
                  rounded-lg
                  p-4
                  hover:bg-zinc-800
                  transition
                ">
                  <h2 className="font-semibold text-lg">
                    {event.title}
                  </h2>

                  <p className="text-sm text-zinc-400 mt-2">
                    {event.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FERRAMENTAS ORGANIZADOR */}
      <section>
        <h1 className="text-3xl font-bold mb-2">
          Ferramentas do Organizador
        </h1>

        <p className="text-zinc-400 mb-6">
          Gere os eventos que criaste.
        </p>

        {organizedEvents.length === 0 ? (
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 text-zinc-400">
            Ainda não criaste eventos.
          </div>
        ) : (
          <div className="grid gap-4">
            {organizedEvents.map((event) => (
              <div key={event.id} className="space-y-2">

                <EventAdminCard event={event} />

                {/* BOTÃO EXPORT CSV (SÓ ORGANIZADOR) */}
                <div className="flex gap-3">
                  <a
                    href={`/api/events/${event.id}/export`}
                    className="px-3 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition text-sm"
                  >
                    Exportar Inscritos (CSV)
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}