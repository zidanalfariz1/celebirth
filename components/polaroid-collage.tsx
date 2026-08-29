type Memory = {
  id: string;
  image_url: string;
  caption: string | null;
};

const LAYOUTS = [
  "left-0 top-10 z-10 -rotate-6",
  "right-0 top-0 z-20 rotate-3",
  "right-10 bottom-0 z-30 -rotate-2",
];

export function PolaroidCollage({ photos }: { photos: Memory[] }) {
  const items = photos.slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-neutral-200 text-xs text-neutral-400">
        Belum ada foto
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-md lg:h-[440px]">
      {items.map((photo, i) => (
        <div
          key={photo.id}
          className={`absolute w-52 rounded-sm bg-white p-2 pb-6 shadow-xl lg:w-64 ${LAYOUTS[i % LAYOUTS.length]}`}
        >
          <span className="absolute -top-3 left-1/2 h-6 w-14 -translate-x-1/2 -rotate-2 bg-amber-100/80" />
          <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.image_url}
              alt={photo.caption ?? "Kenangan"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}