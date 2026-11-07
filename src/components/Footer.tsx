export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-10 text-sm text-muted sm:flex-row">
        <span className="font-serif text-lg text-fg">
          Wander<span className="text-accent">Kash</span>
        </span>
        <span>A concept project. Costs are sample estimates.</span>
      </div>
    </footer>
  );
}