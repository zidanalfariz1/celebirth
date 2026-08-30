import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SurpriseNav } from "@/components/surprise-nav";
import { WishWall } from "@/components/wish-wall";

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

export default async function SurpriseWishesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: eventData } = await supabaseServer
    .from("birthday_events")
    .select("id, name")
    .eq("surprise_token", token)
    .single();

  if (!eventData) notFound();

  const event = eventData as EventRow;

  const { data } = await supabaseServer
    .from("wishes")
    .select("id, sender_name, message, voice_url, created_at")
    .eq("event_id", event.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const wishes = (data ?? []) as WishRow[];

  return (
    <div>
      <SurpriseNav token={token} active="wishes" />

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <WishWall eventName={event.name} wishes={wishes} />
        </div>
      </main>
    </div>
  );
}