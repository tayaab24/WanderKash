import Link from "next/link";
import { getAll } from "@/lib/destinations";
import FooterReveal from "./footer/FooterReveal";
import BestRightNow from "./footer/BestRightNow";
import BackToTop from "./footer/BackToTop";
import CurrentYear from "./footer/CurrentYear";

const link = "text-muted transition-colors hover:text-accent";
const heading = "mb-5 text-xs uppercase tracking-[0.3em] text-accent";

const plan = [
  { href: "/itinerary", label: "My Trip" },
  { href: "/destinations", label: "Destinations" },
  { href: "/#how-it-works", label: "How it works" },
];

export default function Footer() {
  const destinations = getAll();

  return (
    <footer className="border-t border-line bg-bg">
      <FooterReveal className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        {/* Wordmark */}
        <div className="border-b border-line pb-10">
          <Link
            href="/"
            aria-label="WanderKash home"
            className="block font-serif text-6xl leading-[0.9] tracking-tight text-fg sm:text-8xl lg:text-[10rem]"
          >
            Wander<span className="text-accent">Kash</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 md:grid-cols-12">
          <nav aria-label="Explore destinations" className="md:col-span-5">
            <h2 className={heading}>Explore</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
            <ul className="space-y-3 text-sm">
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
            <p className="text-sm text-muted">
              A Kashmir trip planner, built as a concept project.
            </p>
          </div>
        </div>

        {/* Seasonal pick, computed on the client for the visitor's month */}
        <div className="border-t border-line py-6">
          <BestRightNow destinations={destinations} />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <p>
              © <CurrentYear /> WanderKash. A concept project. Costs are sample estimates.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <span>
                Hero photo by{" "}
                <a
                  href="https://www.pexels.com/photo/serene-sunrise-fishing-at-dal-lake-kashmir-31543900/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Shah Faizan
                </a>{" "}
                on Pexels
              </span>
              <span>
                Dal Lake photo by{" "}
                <a
                  href="https://www.pexels.com/photo/a-building-by-a-lake-7743323/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Syed Qaarif Andrabi
                </a>{" "}
                on Pexels
              </span>
              <Link
                href="/credits"
                className="underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                All photo credits
              </Link>
            </p>
          </div>
          <BackToTop />
        </div>
      </FooterReveal>
    </footer>
  );
}
