"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Wish = {
  id: string;
  sender_name: string;
  message: string | null;
  voice_url: string | null;
  created_at: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "?";
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function WishWall({
  eventName,
  wishes,
}: {
  eventName: string;
  wishes: Wish[];
}) {
  const [activeTab, setActiveTab] = useState<"semua" | "pesan" | "voice">("semua");

  const filteredWishes = wishes.filter((w) => {
    if (activeTab === "pesan") return !!w.message;
    if (activeTab === "voice") return !!w.voice_url;
    return true;
  });

  return (
    <div>
      <h2 className="mb-1 text-3xl font-extrabold tracking-tight text-neutral-900 lg:text-4xl">
        Ucapan buat {eventName}
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        {wishes.length} orang udah kirim ucapan
      </p>

      <div className="mb-5 flex gap-1 rounded-full bg-neutral-100 p-1 md:w-fit">
        <TabButton active={activeTab === "semua"} onClick={() => setActiveTab("semua")}>
          Semua
        </TabButton>
        <TabButton active={activeTab === "pesan"} onClick={() => setActiveTab("pesan")}>
          Pesan
        </TabButton>
        <TabButton active={activeTab === "voice"} onClick={() => setActiveTab("voice")}>
          Voice note
        </TabButton>
      </div>

      <motion.div
        className="flex flex-col gap-2.5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filteredWishes.length === 0 && (
          <p className="py-8 text-center text-xs text-neutral-400">
            Belum ada ucapan di kategori ini
          </p>
        )}
        {filteredWishes.map((wish) => (
          <motion.div key={wish.id} variants={itemVariants}>
            <WishCard wish={wish} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition md:flex-none ${
        active ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
      }`}
    >
      {children}
    </button>
  );
}

function WishCard({ wish }: { wish: Wish }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
          {initials(wish.sender_name)}
        </div>
        <div>
          <p className="text-base font-bold text-neutral-900">{wish.sender_name}</p>
          <p className="text-xs text-neutral-400">{formatDate(wish.created_at)}</p>
        </div>
      </div>

      {wish.message && (
        <p className="text-base leading-relaxed text-neutral-600">{wish.message}</p>
      )}
      {wish.voice_url && (
        <audio controls src={wish.voice_url} className="mt-3 h-9 w-full" />
      )}
    </div>
  );
}