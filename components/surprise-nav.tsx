import Link from "next/link";

export function SurpriseNav({
  token,
  active,
}: {
  token: string;
  active: "home" | "memories" | "letter" | "wishes";
}) {
  const items = [
    { key: "home", label: "Home", href: `/s/${token}/home` },
    { key: "memories", label: "Memories", href: `/s/${token}/memories` },
    { key: "letter", label: "Letter", href: `/s/${token}/letter` },
    { key: "wishes", label: "Wishes", href: `/s/${token}/wishes` },
  ] as const;

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-[#f7f3ec]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <span className="text-lg font-extrabold tracking-tight text-neutral-900">
          Celebirth
        </span>

        <nav className="flex gap-8">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`text-xs font-bold uppercase tracking-wide transition ${
                active === item.key
                  ? "text-neutral-900 underline underline-offset-8"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}