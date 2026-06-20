import { createClient } from "@/lib/supabase/client";

export async function getEventCount(eventId: string) {
  const supabase = createClient();

  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  return count ?? 0;
}