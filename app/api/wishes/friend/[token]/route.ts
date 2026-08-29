import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type EventRow = {
  id: string;
  name: string;
};

type WishRow = {
  id: string;
  sender_name: string;
  message: string | null;
  voice_url: string | null;
  created_at: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data: eventData, error: eventError } = await supabaseServer
    .from("birthday_events")
    .select("id, name")
    .eq("friend_token", token)
    .single();

  if (eventError || !eventData) {
    return NextResponse.json({ error: "Link tidak valid" }, { status: 404 });
  }

  const event = eventData as EventRow;

  const { data, error: wishesError } = await supabaseServer
    .from("wishes")
    .select("id, sender_name, message, voice_url, created_at")
    .eq("event_id", event.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (wishesError) {
    return NextResponse.json({ error: wishesError.message }, { status: 500 });
  }

  const wishes = (data ?? []) as WishRow[];

  return NextResponse.json({ eventName: event.name, wishes });
}