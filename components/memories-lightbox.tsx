"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Memory = {
  id: string;
  image_url: string;
  caption: string | null;
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function MemoriesLightbox({
  memories,
  gridClassName,
  showCaptionInGrid = false,
}: {
  memories: Memory[];
  gridClassName: string;
  showCaptionInGrid?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? null : (i + 1) % memories.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) =>
          i === null ? null : (i - 1 + memories.length) % memories.length
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, memories.length]);

  if (memories.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 py-8 text-center text-xs text-neutral-400">
        Belum ada foto kenangan
      </p>
    );
  }

  const active = activeIndex !== null ? memories[activeIndex] : null;

  return (
    <>
      <motion.div
        className={gridClassName}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {memories.map((memory, index) => (
          <motion.button
            key={memory.id}
            type="button"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveIndex(index)}
            className="text-left"
          >
            <div className="aspect-square overflow-hidden rounded-xl bg-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={memory.image_url}
                alt={memory.caption ?? "Kenangan"}
                className="h-full w-full object-cover"
              />
            </div>
            {showCaptionInGrid && memory.caption && (
              <p className="mt-1.5 text-xs text-neutral-500">{memory.caption}</p>
            )}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Tutup"
            >
              ✕
            </button>

            {memories.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) =>
                      i === null ? null : (i - 1 + memories.length) % memories.length
                    );
                  }}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 lg:left-6"
                  aria-label="Sebelumnya"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) =>
                      i === null ? null : (i + 1) % memories.length
                    );
                  }}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 lg:right-6"
                  aria-label="Berikutnya"
                >
                  →
                </button>
              </>
            )}

            <motion.img
              key={active.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              src={active.image_url}
              alt={active.caption ?? "Kenangan"}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />

            {active.caption && (
              <p className="mt-4 text-sm text-neutral-300">{active.caption}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              {activeIndex !== null ? activeIndex + 1 : 0} / {memories.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}