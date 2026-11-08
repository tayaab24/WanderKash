import Link from "next/link";
import { getAll } from "@/lib/destinations";
import FooterReveal from "./footer/FooterReveal";
import BestRightNow from "./footer/BestRightNow";
import BackToTop from "./footer/BackToTop";
import CurrentYear from "./footer/CurrentYear";

const link =
  "inline-flex min-h-11 items-center text-muted transition-colors hover:text-accent";
const heading = "mb-5 text-xs uppercase tracking-[0.3em] text-accent";

const plan = [
  { href: "/itinerary", label: "My Trip" },
  { href: "/destinations", label: "Destinations" },
  { href: "/#how-it-works", label: "How it works" },
];

export default function Footer() {
  const destinations = getAll();

  return (
    <footer className="relative bg-bg">
      {/* Soft hairline instead of a hard border; fades out at both ends */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line to-transparent" />
      <FooterReveal className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        {/* Wordmark */}
        <div className="border-b border-line pb-10">
          <Link
            href="/"
            aria-label="WanderKash home"
            className="block font-serif text-[clamp(3.25rem,14vw,10rem)] leading-[0.9] tracking-tight text-fg"
          >
            Wander<span className="text-accent">Kash</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 md:grid-cols-12">
          <nav aria-label="Explore destinations" className="md:col-span-5">
            <h2 className={heading}>Explore</h2>
            <ul className="grid grid-cols-2 gap-x-6 text-sm">
              {destinations.map((d) => (
                <li key={d.id}>
                  <Link href={`/destination/${d.id}`} className={link}>
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Plan your trip" className="md:col-span-3">
            <h2 className={heading}>Plan</h2>
            <ul className="text-sm">
              {plan.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={link}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 md:col-span-4">
            <h2 className={heading}>About</h2>
            <p className="text-base text-muted">
              A Kashmir trip planner, built as a concept project.
            </p>
          </div>
        </div>

        {/* Seasonal pick, computed on the client for the visitor's month */}
        <div className="border-t border-line py-6">
          <BestRightNow destinations={destinations} />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> WanderKash. A concept project. Costs are sample
            estimates.
          </p>
          <BackToTop />
        </div>
      </FooterReveal>
    </footer>
  );
}
