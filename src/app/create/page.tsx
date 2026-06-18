"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateEventPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateEvent() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("You must be logged in to create an event");
      setLoading(false);
      return;
    }

    // validation
    if (!title || !description || !date || !location) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    if (capacity <= 0) {
      alert("Capacity must be greater than 0");
      setLoading(false);
      return;
    }

    const slug =
      title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    const { error } = await supabase.from("events").insert({
      title,
      description,
      location,
      capacity,
      slug,
      organizer_id: user.id,

      // ✅ IMPORTANT: now it's just YYYY-MM-DD
      date,

      created_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">Criar Evento</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
        />

        <input
          type="number"
          placeholder="Capacidade"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
        />

        <input
          type="text"
          placeholder="Localização"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2"
        />

        <button
          onClick={handleCreateEvent}
          disabled={loading}
          className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-zinc-200 transition"
        >
          {loading ? "A criar..." : "Criar Evento"}
        </button>
      </div>
    </div>
  );
}