"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function WishForm({ friendToken }: { friendToken: string }) {
  const router = useRouter();

  const [senderName, setSenderName] = useState("");
  const [contentType, setContentType] = useState<"text" | "voice">("text");
  const [message, setMessage] = useState("");
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice-note.webm", { type: "audio/webm" });
        setVoiceFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setError("Tidak bisa mengakses mikrofon. Cek izin browser kamu.");
    }
  }

  function switchType(type: "text" | "voice") {
    setContentType(type);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!senderName.trim()) {
      setError("Nama kamu wajib diisi");
      return;
    }
    if (contentType === "text" && !message.trim()) {
      setError("Tulis pesan kamu dulu");
      return;
    }
    if (contentType === "voice" && !voiceFile) {
      setError("Rekam voice note kamu dulu");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("friend_token", friendToken);
    formData.append("sender_name", senderName.trim());

    if (contentType === "text") {
      formData.append("message", message.trim());
    } else if (voiceFile) {
      formData.append("voice", voiceFile);
    }

    try {
      const res = await fetch("/api/wishes", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal mengirim ucapan");
        setIsSubmitting(false);
        return;
      }

      setMessage("");
      setVoiceFile(null);
      setContentType("text");
      setJustSent(true);
      setTimeout(() => setJustSent(false), 2500);

      router.refresh();
    } catch {
      setError("Gagal mengirim ucapan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Nama kamu</label>
        <Input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Nama kamu"
          className="h-9 text-sm"
        />
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => switchType("text")}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
            contentType === "text"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Teks
        </button>
        <button
          type="button"
          onClick={() => switchType("voice")}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
            contentType === "voice"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Voice note
        </button>
      </div>

      {contentType === "text" ? (
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Pesan</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis ucapan..."
            rows={3}
            className="text-sm"
          />
        </div>
      ) : (
        <div>
          <Button
            type="button"
            variant={isRecording ? "default" : "outline"}
            className={`h-9 w-full text-sm ${
              isRecording ? "bg-neutral-900 hover:bg-black" : ""
            }`}
            onClick={toggleRecording}
          >
            {isRecording ? "Stop rekam" : voiceFile ? "Rekam ulang" : "Rekam voice note"}
          </Button>

          {voiceFile && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-neutral-50 px-2.5 py-2 text-xs">
              <audio controls src={URL.createObjectURL(voiceFile)} className="h-8 flex-1" />
              <button
                type="button"
                onClick={() => setVoiceFile(null)}
                className="text-neutral-400 hover:text-neutral-900"
                aria-label="Hapus voice note"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {justSent && (
        <p className="text-xs font-medium text-emerald-600">Ucapan terkirim ✓</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-9 bg-neutral-900 text-sm hover:bg-black"
      >
        {isSubmitting ? "Mengirim..." : "Kirim ucapan"}
      </Button>
    </form>
  );
}