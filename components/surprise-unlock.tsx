"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Phase = "loading" | "countdown" | "ready";

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function SurpriseUnlock({
  token,
  eventName,
  birthdayDate,
  coverImage,
}: {
  token: string;
  eventName: string;
  birthdayDate: string;
  coverImage: string | null;
}) {
  const router = useRouter();
  const [target] = useState(() => new Date(`${birthdayDate}T00:00:00`));
  const searchParams = useSearchParams();
  const forcePreview = searchParams.get("preview") === "1";

  const [phase, setPhase] = useState<Phase>("loading");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    setPhase("countdown");

    const tick = () => {
      const left = getTimeLeft(target);
      setTimeLeft(left);
      const ready = forcePreview || Date.now() >= target.getTime();
      if (ready) {
        setPhase("ready");
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target, forcePreview]);

  function handleUnlock() {
    setIsUnlocking(true);
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => {
      router.push(`/s/${token}/home${forcePreview ? "?preview=1" : ""}`);
    }, 650);
  }

  if (phase === "loading") {
    return <div className="min-h-screen bg-neutral-950" />;
  }

  if (phase === "countdown") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={eventName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        <div className="relative flex min-h-screen flex-col justify-start px-6 pt-20 sm:pt-24 lg:px-16 lg:pt-32">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-7xl">
              Ada sesuatu yang
              <br />
              spesial buat kamu.
            </h1>
            <p className="mt-3 text-sm text-white/70 sm:text-base lg:text-lg">
              Surprise-nya akan terbuka dalam
            </p>

            <div className="mt-6 flex items-end gap-1.5 sm:gap-3 lg:gap-5">
              <CountdownBlock label="Hari" value={timeLeft.days} />
              <span className="pb-1.5 text-xl font-extrabold text-white/40 sm:pb-3 sm:text-3xl lg:text-5xl">:</span>
              <CountdownBlock label="Jam" value={timeLeft.hours} />
              <span className="pb-1.5 text-xl font-extrabold text-white/40 sm:pb-3 sm:text-3xl lg:text-5xl">:</span>
              <CountdownBlock label="Menit" value={timeLeft.minutes} />
              <span className="pb-1.5 text-xl font-extrabold text-white/40 sm:pb-3 sm:text-3xl lg:text-5xl">:</span>
              <CountdownBlock label="Detik" value={timeLeft.seconds} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-center text-white">
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={eventName}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-400">
          Hari ini harinya <span>♡</span>
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
          Akhirnya
          <br className="lg:hidden" /> sampai juga!
        </h1>
        <p className="mt-3 text-sm text-white/70 sm:mt-4 sm:text-base lg:text-lg">
          Siap untuk surprise-mu, {eventName}?
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleUnlock}
          disabled={isUnlocking}
          className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-70 lg:text-base"
        >
          {isUnlocking ? "Membuka..." : "Buka surprise-mu"} <span>🎁</span>
        </motion.button>
      </div>
    </div>
  );
}

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-left">
      <div className="text-3xl font-extrabold tabular-nums sm:text-4xl lg:text-7xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/60 sm:mt-1.5 sm:text-xs">
        {label}
      </div>
    </div>
  );
}