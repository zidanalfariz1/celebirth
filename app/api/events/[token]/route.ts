import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

type EventRow = {
  id: string;
  name: string;
  birthday_date: string;
  description: string | null;
  cover_image: string | null;
  status: string;
  friend_token: string;
  surprise_token: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data, error } = await supabaseServer
    .from("birthday_events")
    .select(
      "id, name, birthday_date, description, cover_image, status, friend_token, surprise_token"
    )
    .or(`friend_token.eq.${token},surprise_token.eq.${token}`)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
  }

  const event = data as EventRow;
  const isSurpriseLink = event.surprise_token === token;

  return NextResponse.json({
    event: {
      id: event.id,
      name: event.name,
      birthday_date: event.birthday_date,
      description: event.description,
      cover_image: event.cover_image,
      status: event.status,
      access: isSurpriseLink ? "surprise" : "friend",
    },
  });
}