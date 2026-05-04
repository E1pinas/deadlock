import Image from "next/image";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import StatCard from "@/components/StatCard";
import { getShopItemDetail } from "@/lib/deadlock-api";

const formatCost = (cost: number) => new Intl.NumberFormat("es-ES").format(cost);

type ItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const item = await getShopItemDetail(Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 lg:px-8 lg:pt-16">
        <BackLink href="/objetos" label="Volver a objetos" />

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <div className="relative h-40 w-40 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)]">
              <Image
                src={item.icon}
                alt={item.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <h1 className="mt-6 font-[family-name:var(--font-cormorant)] text-5xl font-semibold text-[var(--foreground)]">
              {item.name}
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#d3c3a5]">
              {item.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <StatCard
                label="Categoría"
                value={item.category}
                className="rounded-[22px] bg-[rgba(255,255,255,0.03)] shadow-none"
              />
              <StatCard
                label="Coste"
                value={formatCost(item.cost)}
                className="rounded-[22px] bg-[rgba(255,255,255,0.03)] shadow-none"
              />
              <StatCard
                label="Tier"
                value={item.tier}
                className="rounded-[22px] bg-[rgba(255,255,255,0.03)] shadow-none"
              />
            </div>
          </article>

          <div>
            <SectionHeading
              eyebrow="Estadísticas del objeto"
              title="Propiedades principales"
              titleAs="h2"
              compact
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {item.stats.length ? (
                item.stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                  />
                ))
              ) : (
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:col-span-2">
                  <p className="text-sm leading-7 text-[#d3c3a5]">
                    Este objeto no expone estadísticas legibles en el API actual,
                    pero se mantiene accesible con su coste, categoría y tier.
                  </p>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
