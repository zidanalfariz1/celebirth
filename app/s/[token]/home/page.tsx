import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SurpriseNav } from "@/components/surprise-nav";
import { MemoriesLightbox } from "@/components/memories-lightbox";
import { MotionReveal } from "@/components/motion-reveal";
import { PolaroidCollage } from "@/components/polaroid-collage";
import { getMemories, type Memory } from "@/lib/get-memories";

type EventRow = {
  id: string;
  name: string;
};

function getPolaroidPhotos(memories: Memory[], count: number) {
  const nameRegex = /^polaroid \((\d+)\)/i;

  return Array.from({ length: count }, (_, i) => i + 1)
    .map((n) =>
      memories.find((m) => {
        const base = m.id.replace(/\.[^.]+$/, ""); // buang ekstensi
        const match = base.match(nameRegex);
        return match && Number(match[1]) === n;
      })
    )
    .filter((m): m is Memory => Boolean(m));
}

export default async function SurpriseHomePage({
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

  const memories = getMemories();
  const collagePhotos = getPolaroidPhotos(memories, 3);
  const previewPhotos = memories.slice(0, 4);

  return (
    <div>
      <SurpriseNav token={token} active="home" />

      <section className="bg-[#f1e9dd]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <MotionReveal direction="up">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500">
                Happy Birthday
              </p>
              <div className="mt-2 h-px w-6 bg-rose-300" />

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-900 lg:text-6xl">
                Happy Birthday,
                <br />
                {event.name}! ❤️
              </h1>

              <Link
                href={`/s/${token}/letter`}
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-neutral-900 px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-black"
              >
                Baca surat lengkap →
              </Link>
            </MotionReveal>

            <MotionReveal direction="right" delay={0.15}>
              <PolaroidCollage photos={collagePhotos} />
            </MotionReveal>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Memories</h2>
          <Link
            href={`/s/${token}/memories`}
            className="text-xs font-bold uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
          >
            Lihat semua foto →
          </Link>
        </div>

        {previewPhotos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 py-8 text-center text-xs text-neutral-400">
            Belum ada foto kenangan
          </p>
        ) : (
          <MemoriesLightbox
            memories={previewPhotos}
            gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-4"
          />
        )}

        <div className="mt-10 lg:mt-14">
          <Link
            href={`/s/${token}/wishes`}
            className="inline-flex h-11 items-center rounded-lg bg-neutral-900 px-6 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-black"
          >
            Lihat semua ucapan →
          </Link>
        </div>
      </main>
    </div>
  );
}