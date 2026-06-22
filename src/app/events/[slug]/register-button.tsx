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

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await fetch(
        `/api/events/${eventId}/status?userId=${user.id}`
      );

      const data = await res.json();

      setRegistered(!!data.registered);
    }

    load();
  }, [eventId]);

  const refreshUI = () => {
    window.dispatchEvent(new Event("refresh-events"));
  };

  async function register() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao inscrever");
      setLoading(false);
      return;
    }

    setRegistered(true);
    onChange?.(true);
    refreshUI();

    setLoading(false);
  }

  async function unregister() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      setLoading(false);
      return;
    }

    await fetch(`/api/events/${eventId}/unregister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    });

    setRegistered(false);
    onChange?.(false);

    refreshUI();
    setLoading(false);
  }

  const isFull = registeredCount >= capacity;

  return (
    <div className="space-y-3">
      {!registered && isFull ? (
        <button disabled className="px-4 py-2 rounded bg-zinc-700 text-zinc-300">
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