"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function RegisterButton({
  eventId,
}: {
  eventId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function register() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tens de fazer login");
      setLoading(false);
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("event_registrations").insert({
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

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={register}
      disabled={loading}
      className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition disabled:opacity-50"
    >
      {loading ? "A inscrever..." : "Inscrever-se"}
    </button>
  );
}