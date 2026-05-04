import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { getPlayableHeroes } from "@/lib/deadlock-api";

export const dynamic = "force-dynamic";

export default async function HeroesPage() {
  const heroes = await getPlayableHeroes();

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 lg:px-8 lg:pt-16">
        <SectionHeading
          eyebrow="Archivo de héroes"
          title="Todos los héroes"
          description="Selecciona un personaje para ver su descripción, sus poderes y las estadísticas principales de sus habilidades."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {heroes.map((hero) => (
            <Link
              key={hero.id}
              href={`/heroes/${hero.id}`}
              className="block overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] transition hover:-translate-y-1"
            >
              <div className="relative mx-5 mt-5 aspect-[6/5] overflow-hidden rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)]">
                <div
                  className="absolute inset-0 z-10 opacity-25"
                  style={{
                    background: `radial-gradient(circle at top, ${hero.accent}, transparent 58%)`,
                  }}
                />
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  unoptimized
                  className="object-contain object-top p-2"
                />
                <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(7,5,4,0.04),rgba(7,5,4,0.4))]" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                      {hero.name}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{hero.role}</p>
                  </div>
                  <span className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                    Complejidad {hero.complexity}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
