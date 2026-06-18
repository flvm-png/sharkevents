import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RegisterButton from "./register-button";
import CheckInQRCode from "./CheckInQRCode";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = createClient();

  const { slug } = await params;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">

      {/* BACK */}
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-white mb-6 inline-block"
      >
        ← Voltar aos eventos
      </Link>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">
        {event.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-zinc-400 mb-6">
        {event.description}
      </p>

      {/* INFO */}
      <div className="flex flex-wrap gap-3 mb-6 text-sm text-zinc-300">
        <span className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900">
          📍 {event.location}
        </span>

        <span className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900">
          🧑‍🤝‍🧑 {event.registered_count} / {event.capacity}
        </span>

        <span className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900">
          📅 {new Date(event.date).toLocaleDateString()}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 space-y-4">

        <RegisterButton eventId={event.id} />

        <CheckInQRCode
          key={event.registered_count} // 🔥 isto garante refresh do QR
          eventId={event.id}
        />
      </div>
    </div>
  );
}