import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { WishForm } from "@/components/wish-form";

type EventRow = {
  id: string;
  name: string;
  status: string;
};

export default async function NewWishPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data } = await supabaseServer
    .from("birthday_events")
    .select("id, name, status")
    .eq("friend_token", token)
    .single();

  if (!data) notFound();

  const event = data as EventRow;

  if (event.status !== "active") {
    return (
      <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center px-5 text-center">
        <p className="text-sm font-medium text-white">Event ini sudah tidak aktif</p>
        <p className="mt-1 text-xs text-neutral-400">
          Tautan ini tidak lagi menerima ucapan baru.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[420px] px-5 py-10">
      <div className="mb-5 text-center">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Celebirth
        </p>
        <h1 className="text-base font-semibold text-white">
          Kirim ucapan untuk {event.name}
        </h1>
        <p className="mt-1 text-xs text-neutral-400">
          Dia akan lihat ini pas hari ulang tahunnya
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <WishForm friendToken={token} />
      </div>
    </div>
  );
}