"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CheckInQRCode from "@/app/events/[slug]/CheckInQRCode";

export default function RegisterButton({
  eventId,
  capacity,
  onChange,
}: {
  eventId: string;
  capacity: number;
  onChange?: (val: boolean) => void;
}) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // 🔥 load initial state
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

    if (!user) return;

    await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

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

    if (!user) return;

    await fetch(`/api/events/${eventId}/unregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    setRegistered(false);
    onChange?.(false);

    refreshUI();
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      {/* 🔥 BOTÃO INSCRIÇÃO */}
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

      {/* 🔥 QR CODE SÓ SE INSCRITO */}
      {registered && (
        <div className="pt-2">
          <CheckInQRCode eventId={eventId} />
        </div>
      )}
    </div>
  );
}