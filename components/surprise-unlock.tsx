"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Phase = "loading" | "countdown" | "final" | "ready";

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function secondsToTimeLeft(totalSeconds: number): TimeLeft {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { days, hours, minutes, seconds };
}

// Titik start "dramatis" buat animasi turun cepat, dan durasi animasinya (ms)
const UNLOCK_START_SECONDS = 365 * 24 * 60 * 60; // 365 hari
const UNLOCK_DURATION = 6000; // ms

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
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
  const searchParams = useSearchParams();
  const forcePreview = searchParams.get("preview") === "1";

  const [target] = useState(() =>
    forcePreview
      ? new Date(Date.now() - 1000) // udah lewat, langsung trigger animasi "final"
      : new Date(`${birthdayDate}T00:00:00`)
  );

  const [phase, setPhase] = useState<Phase>("loading");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [unlockTimeLeft, setUnlockTimeLeft] = useState<TimeLeft>(
    secondsToTimeLeft(UNLOCK_START_SECONDS)
  );
  const [isUnlocking, setIsUnlocking] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setPhase("countdown");

    const tick = () => {
      const left = getTimeLeft(target);
      setTimeLeft(left);
      const ready = Date.now() >= target.getTime();
      if (ready) {
        setPhase((prev) => (prev === "countdown" || prev === "loading" ? "final" : prev));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target, forcePreview]);

  // Animasi "final": angka jalan cepat turun dari 365 hari -> 00:00:00:00 (bukan random)
  useEffect(() => {
    if (phase !== "final") return;

    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / UNLOCK_DURATION);
      const eased = easeOutCubic(progress);
      const remainingSeconds = UNLOCK_START_SECONDS * (1 - eased);

      setUnlockTimeLeft(secondsToTimeLeft(remainingSeconds));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setUnlockTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimeout(() => setPhase("ready"), 400);
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

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

  // countdown, final, dan ready pakai satu layout yang sama —
  // tidak ada pindah halaman/pop up, cuma teks & angka yang berubah.
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
          <AnimatePresence mode="wait">
            {phase !== "ready" ? (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-7xl">
                  Ada sesuatu yang
                  <br />
                  spesial buat kamu.
                </h1>
                <p className="mt-3 text-sm text-white/70 sm:text-base lg:text-lg">
                  {phase === "countdown"
                    ? "Surprise-nya akan terbuka dalam"
                    : "Surprise-nya sedang dibuka..."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ready-title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {phase !== "ready" ? (
            <div className="mt-6 flex items-end gap-1.5 sm:gap-3 lg:gap-5">
              <CountdownBlock
                label="Hari"
                value={phase === "countdown" ? timeLeft.days : unlockTimeLeft.days}
              />
              <span className="pb-1.5 text-xl font-extrabold text-white/40 sm:pb-3 sm:text-3xl lg:text-5xl">:</span>
              <CountdownBlock
                label="Jam"
                value={phase === "countdown" ? timeLeft.hours : unlockTimeLeft.hours}
              />
              <span className="pb-1.5 text-xl font-extrabold text-white/40 sm:pb-3 sm:text-3xl lg:text-5xl">:</span>
              <CountdownBlock
                label="Menit"
                value={phase === "countdown" ? timeLeft.minutes : unlockTimeLeft.minutes}
              />
              <span className="pb-1.5 text-xl font-extrabold text-white/40 sm:pb-3 sm:text-3xl lg:text-5xl">:</span>
              <CountdownBlock
                label="Detik"
                value={phase === "countdown" ? timeLeft.seconds : unlockTimeLeft.seconds}
              />
            </div>
          ) : (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-70 lg:text-base"
            >
              {isUnlocking ? "Membuka..." : "Buka surprise-mu"} <span>🎁</span>
            </motion.button>
          )}
        </div>
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