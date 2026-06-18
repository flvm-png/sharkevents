"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useEventRealtime(onChange: (payload: any) => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("event-live-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "check_ins",
        },
        (payload) => onChange(payload)
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        (payload) => onChange(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}