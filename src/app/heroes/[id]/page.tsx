import Image from "next/image";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Header from "@/components/Header";
import SectionHeading from "@/components/SectionHeading";
import StatCard from "@/components/StatCard";
import { getHeroDetail } from "@/lib/deadlock-api";

type HeroDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HeroDetailPage({ params }: HeroDetailPageProps) {
  const { id } = await params;
  const hero = await getHeroDetail(Number(id));

  if (!hero) {
    notFound();
  }

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 lg:px-8 lg:pt-16">
        <BackLink href="/heroes" label="Volver a héroes" />

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
            <div className="relative min-h-[34rem]">
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
                className="object-contain object-top p-6"
              />
              <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(7,5,4,0.08),rgba(7,5,4,0.88))]" />
              <div className="absolute inset-x-0 bottom-0 z-30 p-6">
                <div className="rounded-[24px] border border-[var(--border)] bg-[rgba(17,11,8,0.84)] p-5">
                  <p className="text-[10px] tracking-[0.28em] text-[var(--muted)] uppercase">
                    Rol
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {hero.role}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#d3c3a5]">
                    {hero.playstyle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Expediente de héroe" title={hero.name} />
            <p className="mt-6 text-sm leading-8 text-[#d3c3a5]">{hero.lore}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {hero.stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  valueClassName="text-3xl"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading
            eyebrow="Poderes"
            title="Habilidades y estadísticas"
            titleAs="h2"
            compact
          />

          <div className="mt-10 grid gap-6">
            {hero.abilities.length ? (
              hero.abilities.map((ability) => (
                <article
                  key={ability.id}
                  className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
                >
                  <div className="grid gap-6 lg:grid-cols-[0.3fr_0.7fr]">
                    <div>
                      <div className="relative h-24 w-24 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)]">
                        <Image
                          src={ability.icon}
                          alt={ability.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="mt-4 inline-flex rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
                        {ability.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-[var(--foreground)]">
                        {ability.name}
                      </h3>
                      <p className="mt-3 text-sm font-medium text-[var(--muted)]">
                        {ability.summary}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-[#d3c3a5]">
                        {ability.description}
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {ability.stats.map((stat) => (
                          <StatCard
                            key={`${ability.id}-${stat.label}`}
                            label={stat.label}
                            value={stat.value}
                            className="rounded-[20px] bg-[rgba(255,255,255,0.03)] p-4 shadow-none"
                            valueClassName="text-xl"
                          />
                        ))}
                      </div>

                      {!!ability.upgrades.length && (
                        <div className="mt-6 grid gap-4 lg:grid-cols-3">
                          {ability.upgrades.map((upgrade) => (
                            <div
                              key={`${ability.id}-tier-${upgrade.tier}`}
                              className="rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-4"
                            >
                              <p className="text-[10px] tracking-[0.24em] text-[var(--accent)] uppercase">
                                Mejora {upgrade.tier}
                              </p>
                              <div className="mt-3 grid gap-2 text-sm leading-6 text-[#d3c3a5]">
                                {upgrade.bonuses.map((bonus) => (
                                  <p key={bonus}>{bonus}</p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
                <p className="text-sm leading-7 text-[#d3c3a5]">
                  Este héroe no expone poderes completos en el API actual o se ha
                  cargado desde el fallback local.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
