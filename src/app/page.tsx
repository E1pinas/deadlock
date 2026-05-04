import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import {
  getPlayableHeroes,
  getShopItems,
  type DeadlockItemCategory,
} from "@/lib/deadlock-api";

export const dynamic = "force-dynamic";

const features = [
  {
    id: "01",
    title: "Consultar héroes del juego",
    description:
      "Accede a retratos, roles y perfiles de combate en una portada pensada para lectura rápida.",
  },
  {
    id: "02",
    title: "Ver objetos disponibles",
    description:
      "Explora mejoras de tienda con coste, categoría y jerarquía visual clara desde el primer vistazo.",
  },
  {
    id: "03",
    title: "Buscar información rápidamente",
    description:
      "La navegación condensa lo esencial con una composición inspirada en carteles, marquesinas y dossiers noir.",
  },
];

const categoryOrder: DeadlockItemCategory[] = ["Weapon", "Vitality", "Spirit"];

const categoryDescriptions: Record<DeadlockItemCategory, string> = {
  Weapon: "Arsenal ofensivo y presión de disparo",
  Vitality: "Aguante, blindaje y presencia en línea",
  Spirit: "Poder arcano, tempo y control sobrenatural",
};

const formatCost = (cost: number) => new Intl.NumberFormat("es-ES").format(cost);

const pickRandom = <T,>(source: T[], amount: number) => {
  const pool = [...source];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool.slice(0, amount);
};

function skylineHeights() {
  return [38, 62, 48, 74, 54, 82, 44, 68, 52, 88, 46, 70];
}

function getCategoryCount(
  items: Awaited<ReturnType<typeof getShopItems>>,
  category: DeadlockItemCategory,
) {
  return items.filter((item) => item.category === category).length;
}



export default async function Home() {
  const [heroes, items] = await Promise.all([getPlayableHeroes(), getShopItems()]);

  const featuredHeroes = pickRandom(heroes, 3);
  const featuredItems = pickRandom(items, 3);
  const marqueeHero = featuredHeroes[0] ?? heroes[0];
  const categoryCounts = categoryOrder.map((category) => ({
    category,
    total: getCategoryCount(items, category),
  }));

  return (
    <main className="min-h-screen overflow-hidden text-[var(--foreground)]">
      <Header />

      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(215,168,95,0.16),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(180deg,transparent,rgba(5,4,3,0.72))]" />
        </div>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[rgba(76,49,31,0.25)] px-4 py-2 text-[11px] tracking-[0.34em] text-[var(--muted)] uppercase">
              New York noir, 1954
            </p>

            <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-6xl font-semibold leading-none tracking-[0.04em] text-[var(--foreground)] sm:text-7xl lg:text-8xl">
              Deadlock 
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Explora héroes y objetos de Deadlock de forma simple y visual.
            </p>

            

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/heroes"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-7 py-3 text-sm font-semibold tracking-[0.18em] text-[#1a120c] uppercase transition hover:bg-[#e3bc7b]"
              >
                Ver héroes
              </Link>
              <Link
                href="/objetos"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-7 py-3 text-sm font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase transition hover:bg-[#e3bc7b] "
              >
                Ver objetos
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
                <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                  Héroes activos
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
                  {heroes.length}
                </p>
              </article>
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
                <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                  Objetos útiles
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
                  {items.length}
                </p>
              </article>
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
                <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                  Categorías
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
                  {categoryCounts.length}
                </p>
              </article>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(216,174,103,0.16),transparent_48%)]" />
            <div className="absolute inset-x-0 bottom-0 flex h-32 items-end gap-2 px-5 opacity-60">
              {skylineHeights().map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="flex-1 rounded-t-sm bg-[linear-gradient(180deg,rgba(216,174,103,0.35),rgba(49,31,23,0.92))]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="relative z-10 grid gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-[var(--muted)] uppercase">
                    Portada destacada
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-[var(--foreground)]">
                    {marqueeHero?.name}
                  </h2>
                </div>
               
              </div>

              <div className="relative min-h-[26rem] overflow-hidden rounded-[28px] border border-[var(--border)] bg-[#120d09]">
                {marqueeHero ? (
                  <>
                    <div
                      className="absolute inset-0 opacity-45"
                      style={{
                        background: `radial-gradient(circle at top, ${marqueeHero.accent}, transparent 55%)`,
                      }}
                    />
                    <Image
                      src={marqueeHero.image}
                      alt={marqueeHero.name}
                      fill
                      unoptimized
                      className="object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0.18),rgba(8,6,5,0.86))]" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="max-w-sm rounded-[22px] border border-[var(--border)] bg-[rgba(17,11,8,0.82)] p-5 backdrop-blur-sm">
                        <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                          Rol
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                          {marqueeHero.role}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#ddceb3]">
                          {marqueeHero.playstyle || marqueeHero.lore}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section
          id="que-puedes-hacer"
          className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.32em] text-[var(--muted)] uppercase">
                Qué puedes hacer
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                Una portada con ritmo de dossier y cartel de avenida
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#d3c3a5]">
              La composición toma la atmósfera de una Nueva York oculta de mitad
              de siglo: señalética clara, bloques editoriales y foco en el dato.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
              >
                <p className="text-[11px] tracking-[0.32em] text-[var(--accent)] uppercase">
                  {feature.id}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#d3c3a5]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="estadisticas"
          className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8"
        >
          <div className="rounded-[34px] border border-[var(--border)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] tracking-[0.32em] text-[var(--muted)] uppercase">
                  Estadísticas
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                  Inventario del distrito
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#d3c3a5]">
                Un vistazo al reparto y al arsenal de Deadlock, con categorías
                claras para Weapon, Vitality y Spirit.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-6">
                  <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                    Número total de héroes
                  </p>
                  <p className="mt-4 text-5xl font-semibold text-[var(--foreground)]">
                    {heroes.length}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-6">
                  <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                    Número total de objetos
                  </p>
                  <p className="mt-4 text-5xl font-semibold text-[var(--foreground)]">
                    {items.length}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-6">
                  <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                    Categorías de objetos
                  </p>
                  <p className="mt-4 text-5xl font-semibold text-[var(--foreground)]">
                    {categoryCounts.length}
                  </p>
                </article>
              </div>

              <div className="grid gap-4">
                {categoryCounts.map(({ category, total }) => (
                  <article
                    key={category}
                    className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                          {category}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#d3c3a5]">
                          {categoryDescriptions[category]}
                        </p>
                      </div>
                      <p className="text-4xl font-semibold text-[var(--foreground)]">
                        {total}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="heroes-destacados"
          className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.32em] text-[var(--muted)] uppercase">
                Héroes destacados
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                Tres retratos aleatorios del reparto
              </h2>
            </div>
            
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredHeroes.map((hero) => (
              <Link
                key={hero.id}
                href={`/heroes/${hero.id}`}
                className="block overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div
                    className="absolute inset-0 z-10 opacity-30"
                    style={{
                      background: `radial-gradient(circle at top, ${hero.accent}, transparent 58%)`,
                    }}
                  />
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(7,5,4,0.02),rgba(7,5,4,0.82))]" />
                </div>
                <div className="relative z-30 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                        {hero.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{hero.role}</p>
                    </div>
                    <span className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                      Complejidad {hero.complexity}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#d3c3a5]">
                    {hero.playstyle || hero.lore}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="objetos-destacados"
          className="mx-auto w-full max-w-7xl px-6 pb-24 pt-16 lg:px-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.32em] text-[var(--muted)] uppercase">
                Objetos destacados
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-[var(--foreground)] sm:text-5xl">
                Tres mejoras aleatorias con icono y coste
              </h2>
            </div>
           
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                href={`/objetos/${item.id}`}
                className="block rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)]">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <span className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                      {item.category}
                    </span>
                    <p className="mt-3 text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                      Tier {item.tier}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[var(--border)] pt-5">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                    {item.name}
                  </h3>
                  <p className="mt-4 text-[10px] tracking-[0.26em] text-[var(--muted)] uppercase">
                    Coste
                  </p>
                  <p className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
                    {formatCost(item.cost)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
