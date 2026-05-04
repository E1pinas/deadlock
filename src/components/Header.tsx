import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/heroes", label: "Héroes" },
  { href: "/objetos", label: "Objetos" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(12,8,6,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-[0.16em] text-[var(--foreground)] uppercase"
        >
          Deadlock 
        </Link>

        <nav className="hidden items-center gap-6 text-xs tracking-[0.18em] text-[var(--muted)] uppercase md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
