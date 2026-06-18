"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterButton({
  eventId,
}: {
  eventId: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState<number>(0);
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [isRegistered, setIsRegistered] = useState(false);

  const isFull = capacity > 0 && registeredCount >= capacity;
  const isBlocked = !isRegistered && isFull;

  useEffect(() => {
    async function loadData() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      const { data: event } = await supabase
        .from("events")
        .select("capacity, registered_count")
        .eq("id", eventId)
        .single();

      if (event) {
        setCapacity(event.capacity ?? 0);
        setRegisteredCount(event.registered_count ?? 0);
      }

      if (user) {
        const { data: reg } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("event_id", eventId)
          .eq("user_id", user.id)
          .maybeSingle();

        setIsRegistered(!!reg);
      }
    }

    loadData();
  }, [eventId]);

  async function handleClick() {
    if (isBlocked) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tens de fazer login");
      setLoading(false);
      return;
    }

    // REMOVE INSCRIÇÃO
    if (isRegistered) {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      await supabase.rpc("decrement_event_count", {
        event_id_input: eventId,
      });

      setRegisteredCount((prev) => Math.max(0, prev - 1));
      setIsRegistered(false);

      setLoading(false);
      router.refresh();
      return;
    }

    // INSCRIÇÃO
    const { error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        user_id: user.id,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    await supabase.rpc("increment_event_count", {
      event_id_input: eventId,
    });

    setRegisteredCount((prev) => prev + 1);
    setIsRegistered(true);

    setLoading(false);
    router.refresh();
  }

  // TEXTO DO BOTÃO
  let text = "";
  let style = "";

  if (isRegistered) {
    text = loading ? "A remover..." : "Remover inscrição";
    style =
      "bg-red-900 text-red-200 hover:bg-red-800";
  } else if (isBlocked) {
    text = "Lotação máxima atingida";
    style =
      "bg-zinc-700 text-zinc-400 cursor-not-allowed";
  } else if (loading) {
    text = "A inscrever...";
    style =
      "bg-white text-zinc-900 opacity-70";
  } else {
    text = "Inscrever-se";
    style =
      "bg-white text-zinc-900 hover:bg-zinc-200";
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || isBlocked}
      className={`
        px-4 py-2 rounded-lg font-medium transition
        ${style}
      `}
    >
      {text}
    </button>
  );
}