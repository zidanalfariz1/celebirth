import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

type EventRow = {
  id: string;
  status: string;
};

async function uploadFile(file: File, bucket: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File untuk ${bucket} maksimal 20MB`);
  }

  const ext = file.name.split(".").pop() || "bin";
  const path = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseServer.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabaseServer.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const friendToken = formData.get("friend_token");
  const senderName = formData.get("sender_name");
  const message = formData.get("message");
  const voice = formData.get("voice");

  if (typeof friendToken !== "string" || !friendToken) {
    return NextResponse.json({ error: "friend_token wajib diisi" }, { status: 400 });
  }
  if (typeof senderName !== "string" || !senderName.trim()) {
    return NextResponse.json({ error: "sender_name wajib diisi" }, { status: 400 });
  }
  const hasMessage = typeof message === "string" && message.trim().length > 0;
  const hasVoice = voice instanceof File && voice.size > 0;

  if (!hasMessage && !hasVoice) {
    return NextResponse.json(
      { error: "Isi minimal pesan atau voice note" },
      { status: 400 }
    );
  }

  const { data: eventData, error: eventError } = await supabaseServer
    .from("birthday_events")
    .select("id, status")
    .eq("friend_token", friendToken)
    .single();

  if (eventError || !eventData) {
    return NextResponse.json({ error: "Link tidak valid" }, { status: 404 });
  }

  const event = eventData as EventRow;

  if (event.status !== "active") {
    return NextResponse.json({ error: "Event sudah tidak aktif" }, { status: 403 });
  }

  try {
    const voice_url = hasVoice ? await uploadFile(voice as File, "wish-voice-notes") : null;

    const { data: wish, error: wishError } = await supabaseServer
      .from("wishes")
      .insert({
        event_id: event.id,
        sender_name: senderName.trim(),
        message: hasMessage ? (message as string).trim() : null,
        voice_url,
      })
      .select("id, created_at")
      .single();

    if (wishError) throw new Error(wishError.message);

    return NextResponse.json({ wish }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal mengunggah";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}