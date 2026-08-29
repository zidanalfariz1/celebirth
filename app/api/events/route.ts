import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { z } from "zod";

const createEventSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  birthday_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  description: z.string().max(500).optional(),
  cover_image: z.string().url().optional(),
});

type EventRow = {
  id: string;
  name: string;
  birthday_date: string;
  friend_token: string;
  surprise_token: string;
  status: string;
  created_at: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = createEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const insertPayload = {
    name: parsed.data.name,
    birthday_date: parsed.data.birthday_date,
    description: parsed.data.description ?? null,
    cover_image: parsed.data.cover_image ?? null,
  };

  const { data, error } = await supabaseServer
    .from("birthday_events")
    .insert(insertPayload)
    .select("id, name, birthday_date, friend_token, surprise_token, status, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Gagal membuat event" },
      { status: 500 }
    );
  }

  const event = data as EventRow;

  return NextResponse.json(
    {
      event,
      friend_link: `/e/${event.friend_token}`,
      surprise_link: `/s/${event.surprise_token}`,
    },
    { status: 201 }
  );
}