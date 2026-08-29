import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SurpriseNav } from "@/components/surprise-nav";
import { MemoriesLightbox } from "@/components/memories-lightbox";
import { getMemories } from "@/lib/get-memories";

type EventRow = {
  id: string;
};

export default async function MemoriesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: eventData } = await supabaseServer
    .from("birthday_events")
    .select("id")
    .eq("surprise_token", token)
    .single();

  if (!eventData) notFound();

  const memories = getMemories();

  return (
    <div>
      <SurpriseNav token={token} active="memories" />

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-16">
        <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-neutral-900 lg:text-4xl">
          Syafila's Memories
        </h1>
        <p className="mb-8 text-sm text-neutral-500">
          Kumpulan kenangan dari masa kecil sampai sekarang
        </p>

        <MemoriesLightbox
          memories={memories}
          gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      </main>
    </div>
  );
}