import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import AddToTripButton from "@/components/AddToTripButton";
import { dayCost, getAll, getById } from "@/lib/destinations";
import { formatINR } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAll().map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const d = getById(id);
  if (!d) return { title: "Destination not found | WanderKash" };
  return {
    title: `${d.name} | WanderKash`,
    description: d.description,
    openGraph: { title: `${d.name} | WanderKash`, description: d.tagline },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { id } = await params;
  const destination = getById(id);
  if (!destination) notFound();

  const all = getAll();
  const index = all.findIndex((d) => d.id === destination.id);
  const next = all[(index + 1) % all.length];
  const { stay, food, transport } = destination.costPerDay;

  const costRows = [
    { label: "Stay", value: stay },
    { label: "Food", value: food },
    { label: "Transport", value: transport },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[70vh] min-h-115 items-end overflow-hidden supports-[height:1svh]:h-[70svh]">
        <SafeImage
          src={destination.image}
          alt={destination.name}
          label={destination.name}
          preload
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-bg/20" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14">
          <Link
            href="/destinations"
            className="mb-4 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-fg"
          >
            ← All destinations
          </Link>
          <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] leading-none">
            {destination.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{destination.tagline}</p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-20 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            About
          </p>
          <p className="mt-5 font-serif text-3xl leading-snug md:text-4xl">
            {destination.description}
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-accent">
                Highlights
              </h2>
              <ul className="mt-5 space-y-3">
                {destination.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-fg">
                    <span className="text-accent">—</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-accent">
                Best season
              </h2>
              <p className="mt-5 text-fg">{destination.bestSeason}</p>
            </div>
          </div>
        </div>

        {/* Cost card */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-7 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl">Cost per day</h2>
          <p className="mt-1 text-sm text-muted">
            Per person, sample estimates
          </p>

          <dl className="mt-6 space-y-3">
            {costRows.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <dt className="text-muted">{r.label}</dt>
                <dd>{formatINR(r.value)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-4">
              <dt>Total</dt>
              <dd className="font-serif text-2xl text-accent">
                {formatINR(dayCost(destination))}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <AddToTripButton id={destination.id} />
          </div>
        </aside>
      </section>

      {/* Next destination */}
      <section className="border-t border-line px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Next</p>
          <Link
            href={`/destination/${next.id}`}
            className="mt-4 inline-block font-serif text-5xl transition-colors hover:text-accent md:text-7xl"
          >
            {next.name} →
          </Link>
        </div>
      </section>
    </>
  );
}