import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SurpriseNav } from "@/components/surprise-nav";

type EventRow = {
  name: string;
};

export default async function LetterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data } = await supabaseServer
    .from("birthday_events")
    .select("name")
    .eq("surprise_token", token)
    .single();

  if (!data) notFound();

  const event = data as EventRow;

  return (
    <div>
      <SurpriseNav token={token} active="letter" />

      <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-500">
            Untuk {event.name}
          </p>
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-neutral-900 lg:text-4xl">
            Surat kecil ini buat kamu
          </h1>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-10">
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700 lg:text-base">
{`Hai beb

Selamat ulang tahun ke-21 ya sayang. udah kepala 2 + 1 aja memang udah tua ya kamu, aku tahu mungkin tahun ini tahun yang bagi kamu harus extra lebih kerja keras lagi, cuma aku yakin kamu bisa ngelewatin ini semua, buat tahun ini yang kamu mungkin anggap berat menjadi tahun yang memberi kesan baik buat kamu yaitu lulus 3.5 tahun.

Aku harap di tahun ke 21 ini kamu makin dewasa lagi secara pemikiran, emosional, dan tindakan. Aku juga harap kamu sehat selalu, panjang umur, dan rezekinya lancar dan yang pasti kamu harus tetep sayang sama aku yaa. selalu sayang sama ayah bunda juga sama adik adik kamu, semoga kamu bisa menjadi contoh yang baik juga buat adik adik kamu, maka dari itu kamu harus tetep semangat jelanin hidup jangan gampang nyerah okai, aku selalu ada di samping kamu kok.

Semoga kamu tetep menjadi syafila yang aku kenal ya jangan pernah berubah sikap sama aku, kalo ada apa apa cerita sama aku, jangan dipendem sendiri terus yaah. semoga apa yang kamu inginkan di tahun ini tercapai semua dan dijauhkan dari hal hal yang ga kamu inginkan, semangat kuliahnya sisa dikit lagi lulus yaaaa tungguin aku jugaa huuuuu tapi dia lulus duluan bes gapapa, semangattttttt aku nanti dateng ke sempro kamu makanya kamu harus cepet sempronya okehhh, buktiin klo ini tahunnya kamu.

i loveee uu soo muchhhhh`}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}