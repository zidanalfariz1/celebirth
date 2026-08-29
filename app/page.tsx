import { CreateEventForm } from "@/components/create-event-form";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[420px] px-5 py-10">
      <div className="mb-5 text-center">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Celebirth
        </p>
        <h1 className="text-lg font-semibold text-white">Buat surprise ulang tahun</h1>
        <p className="mt-1.5 text-xs text-neutral-400">
          Isi data event, nanti kamu dapat dua link: satu buat dibagikan ke
          teman-teman, satu lagi link privat buat yang ulang tahun.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <CreateEventForm />
      </div>
    </div>
  );
}