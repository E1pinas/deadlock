import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import { getShopItems, type DeadlockItemCategory } from "@/lib/deadlock-api";

const categoryOrder: DeadlockItemCategory[] = ["Weapon", "Vitality", "Spirit"];
const formatCost = (cost: number) => new Intl.NumberFormat("es-ES").format(cost);

export default async function ObjetosPage() {
  const items = await getShopItems();

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 lg:px-8 lg:pt-16">
        <SectionHeading
          eyebrow="Archivo de objetos"
          title="Todos los objetos"
          description="Organizados por categoría y tier en acordeones desplegables."
        />

        <div className="mt-12 grid gap-5">
          {categoryOrder.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            const tiers = [...new Set(categoryItems.map((item) => item.tier))].sort(
              (left, right) => left - right,
            );

            return (
              <details
                key={category}
                open={category === "Weapon"}
                className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
              >
                <summary className="flex cursor-pointer list-none items-end justify-between gap-4 px-6 py-5">
                  <div>
                    <p className="text-[11px] tracking-[0.32em] text-[var(--muted)] uppercase">
                      Categoría
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-[var(--foreground)]">
                      {category}
                    </h2>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    {categoryItems.length} objetos
                  </p>
                </summary>

                <div className="border-t border-[var(--border)] px-4 py-4">
                  <div className="grid gap-4">
                    {tiers.map((tier) => {
                      const tierItems = categoryItems.filter((item) => item.tier === tier);

                      return (
                        <details
                          key={`${category}-tier-${tier}`}
                          open={tier === 1}
                          className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)]"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                            <div>
                              <p className="text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                                Tier
                              </p>
                              <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                                Tier {tier}
                              </h3>
                            </div>
                            <p className="text-sm text-[var(--muted)]">
                              {tierItems.length} objetos
                            </p>
                          </summary>

                          <div className="border-t border-[var(--border)] px-4 py-4">
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                              {tierItems.map((item) => (
                                <Link
                                  key={item.id}
                                  href={`/objetos/${item.id}`}
                                  className="block rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-1"
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
                                      <p className="text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                                        Tier {item.tier}
                                      </p>
                                      <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                                        {formatCost(item.cost)}
                                      </p>
                                    </div>
                                  </div>

                                  <h3 className="mt-6 font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                                    {item.name}
                                  </h3>
                                  <p className="mt-3 text-sm leading-7 text-[#d3c3a5]">
                                    {item.summary}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </main>
  );
}
