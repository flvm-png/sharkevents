import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: any) {
  const supabase = createClient();
  const { userId } = await req.json();

  // ✅ FIX NEXT 15+: params is async
  const { params } = context;
  const { id: eventId } = await params;

  // 1. buscar evento
  const { data: event } = await supabase
    .from("events")
    .select("capacity")
    .eq("id", eventId)
    .single();

  if (!event) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404 }
    );
  }

  // 2. já inscrito?
  const { data: existing } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Already registered" },
      { status: 400 }
    );
  }

  // 3. count
  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  const current = count ?? 0;

  // 4. capacity check
  if (current >= event.capacity) {
    return NextResponse.json(
      { error: "Capacity full" },
      { status: 400 }
    );
  }

  // 5. insert
  const { error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      user_id: userId,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}