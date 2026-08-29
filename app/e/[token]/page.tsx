import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { WishForm } from "@/components/wish-form";
import { WishWall } from "@/components/wish-wall";

type EventRow = {
  id: string;
  name: string;
  status: string;
};

type WishRow = {
  id: string;
  sender_name: string;
  message: string | null;
  voice_url: string | null;
  created_at: string;
};

export default async function FriendPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: eventData } = await supabaseServer
    .from("birthday_events")
    .select("id, name, status")
    .eq("friend_token", token)
    .single();

  if (!eventData) notFound();

  const event = eventData as EventRow;

  if (event.status !== "active") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-neutral-900">Event ini sudah tidak aktif</p>
        <p className="mt-1 text-xs text-neutral-500">
          Tautan ini tidak lagi menerima ucapan baru.
        </p>
      </div>
    );
  }

  const { data } = await supabaseServer
    .from("wishes")
    .select("id, sender_name, message, voice_url, created_at")
    .eq("event_id", event.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const wishes = (data ?? []) as WishRow[];

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-[#f7f3ec]/90">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center px-6 lg:px-10">
          <span className="text-sm font-extrabold tracking-tight text-neutral-900">
            for you<span className="text-rose-500">.</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-16">
        <div className="mb-8 lg:mb-12">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rose-500">
            Celebirth
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 lg:text-4xl">
            Ucapan untuk {event.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Lihat ucapan dari teman-teman lain, atau tulis ucapanmu sendiri
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:w-96 lg:shrink-0">
            <p className="mb-4 text-base font-bold text-neutral-900">Tulis ucapan</p>
            <WishForm friendToken={token} />
          </div>

          <div className="flex-1">
            <WishWall eventName={event.name} wishes={wishes} />
          </div>
        </div>
      </main>
    </div>
  );
}