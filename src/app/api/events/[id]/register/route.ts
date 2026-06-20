import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validators/event";

export async function POST(req: Request, { params }: any) {
  const supabase = createClient();

  // ✅ Next 16 fix
  const { id } = await params;

  let body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  // 🔥 DEBUG (remove depois)
  console.log("BODY:", body);

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { userId } = parsed.data;

  const { error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: id,
      user_id: userId,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json( 

    { ok: true },
    { status: 200 }
  );
}