"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CheckInQRCode from "@/app/events/[slug]/CheckInQRCode";

export default function RegisterButton({
  eventId,
  capacity,
  registeredCount,
  onChange,
}: {
  eventId: string;
  capacity: number;
  registeredCount: number;
  onChange?: (val: boolean) => void;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // 🔍 check if user is registered
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      setRegistered(!!data);
    }

    load();
  }, [eventId]);

  const refreshUI = () => {
    window.dispatchEvent(new Event("refresh-events"));
  };

  // ======================
  // REGISTER
  // ======================
  async function register() {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      setLoading(false);
      return;
    }

    const user = session.user;

    if (registeredCount >= capacity) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        user_id: user.id,
      });

    if (!error) {
      setRegistered(true);
      onChange?.(true);
      refreshUI();
    }

    setLoading(false);
  }

  // ======================
  // UNREGISTER
  // ======================
  async function unregister() {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      setLoading(false);
      return;
    }

    const user = session.user;

    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);

    if (!error) {
      setRegistered(false);
      onChange?.(false);
      refreshUI();
    }

    setLoading(false);
  }

  const isFull = registeredCount >= capacity;

  return (
    <div className="space-y-3">

      {!registered && isFull ? (
        <button
          disabled
          className="px-4 py-2 rounded bg-zinc-700 text-zinc-300 cursor-not-allowed"
        >
          Capacidade máxima atingida
        </button>
      ) : (
        <button
          onClick={registered ? unregister : register}
          disabled={loading}
          className={`px-4 py-2 rounded font-medium transition ${
            registered
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-white text-black hover:bg-zinc-200"
          }`}
        >
          {loading
            ? "A processar..."
            : registered
            ? "Remover inscrição"
            : "Inscrever-se"}
        </button>
      )}

      {registered && (
        <div className="pt-2">
          <CheckInQRCode eventId={eventId} />
        </div>
      )}
    </div>
  );
}