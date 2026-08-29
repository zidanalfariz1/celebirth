"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CreatedLinks = {
  friendLink: string;
  surpriseLink: string;
};

export function CreateEventForm() {
  const [name, setName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<CreatedLinks | null>(null);
  const [copied, setCopied] = useState<"friend" | "surprise" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !birthdayDate) {
      setError("Nama dan tanggal ulang tahun wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          birthday_date: birthdayDate,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Gagal membuat event, cek data yang diisi"
        );
        return;
      }

      const origin = window.location.origin;
      setLinks({
        friendLink: `${origin}${data.friend_link}`,
        surpriseLink: `${origin}${data.surprise_link}`,
      });
    } catch {
      setError("Gagal membuat event. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyLink(text: string, which: "friend" | "surprise") {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  }

  if (links) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium text-neutral-900">Link untuk teman-teman</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            Bagikan ini supaya mereka bisa kirim ucapan
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <Input readOnly value={links.friendLink} className="h-8 text-[11px]" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyLink(links.friendLink, "friend")}
            >
              {copied === "friend" ? "Tersalin" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium text-neutral-900">Link privat surprise</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            Jangan dibagikan ke orang yang ulang tahun sebelum waktunya
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <Input readOnly value={links.surpriseLink} className="h-8 text-[11px]" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyLink(links.surpriseLink, "surprise")}
            >
              {copied === "surprise" ? "Tersalin" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">
          Nama yang ulang tahun
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sarah"
          className="h-9 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">
          Tanggal ulang tahun
        </label>
        <Input
          type="date"
          value={birthdayDate}
          onChange={(e) => setBirthdayDate(e.target.value)}
          className="h-9 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">
          Deskripsi (opsional)
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Sedikit cerita tentang surprise ini..."
          rows={2}
          className="text-sm"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-9 bg-neutral-900 text-sm hover:bg-black"
      >
        {isSubmitting ? "Membuat..." : "Buat surprise"}
      </Button>
    </form>
  );
}