import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SurpriseUnlock } from "@/components/surprise-unlock";

type EventRow = {
  id: string;
  name: string;
  birthday_date: string;
  surprise_token: string;
  cover_image: string | null;
};

export default async function SurprisePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data } = await supabaseServer
    .from("birthday_events")
    .select("id, name, birthday_date, surprise_token, cover_image")
    .eq("surprise_token", token)
    .single();

  if (!data) notFound();

  const event = data as EventRow;

  return (
    <SurpriseUnlock
      token={event.surprise_token}
      eventName={event.name}
      birthdayDate={event.birthday_date}
      coverImage={event.cover_image}
    />
  );
}