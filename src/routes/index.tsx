import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  INGREDIENT_DB,
  type FormulaRow,
  type Ingredient,
  predict,
  searchIngredients,
} from "@/lib/toxicity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "cosmeBun — In-Silico Makeup Toxicity Predictor" },
      {
        name: "description",
        content:
          "Predict cellular skin reactions, sensitization, and regulatory compliance of cosmetic formulas before lab mixing. Cruelty-free, in-silico toxicology.",
      },
      { property: "og:title", content: "cosmeBun — In-Silico Makeup Toxicity Predictor" },
      {
        property: "og:description",
        content:
          "QSAR + ensemble ML scoring for cosmetic formulations. Replace animal testing with seconds-fast predictive toxicology.",
      },
    ],
  }),
  component: Workspace,
});

const STARTER: { inci: string; pct: number }[] = [
  { inci: "Aqua (Water)", pct: 62 },
  { inci: "Glycerin", pct: 5 },
  { inci: "Niacinamide", pct: 4 },
  { inci: "Retinol", pct: 0.3 },
  { inci: "Phenoxyethanol", pct: 0.8 },
  { inci: "Parfum (Fragrance)", pct: 0.5 },
  { inci: "Cetearyl Alcohol", pct: 3 },
  { inci: "Squalane", pct: 8 },
];

let RID = 0;
const rid = () => `r${++RID}`;

function makeStarter(): FormulaRow[] {
  return STARTER.map(({ inci, pct }) => {
    const ing = INGREDIENT_DB.find((i) => i.inci === inci)!;
    return { id: rid(), ingredient: ing, concentration: pct };
  });
}

function Workspace() {
  const [rows, setRows] = useState<FormulaRow[]>(() => makeStarter());
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => searchIngredients(query), [query]);
  const prediction = useMemo(() => predict(rows), [rows]);

  function addIngredient(ing: Ingredient) {
    setRows((r) => [...r, { id: rid(), ingredient: ing, concentration: 1 }]);
    setQuery("");
  }
  function removeRow(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }
  function setConc(id: string, v: number) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, concentration: v } : x)));
  }
  function swapTo(currentInci: string, nextInci: string) {
    const next = INGREDIENT_DB.find((i) => i.inci === nextInci);
    if (!next) return;
    setRows((r) =>
      r.map((x) => (x.ingredient.inci === currentInci ? { ...x, ingredient: next } : x))
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto grid max-w-[1500px] gap-4 px-4 pb-12 pt-6 lg:grid-cols-[360px_minmax(0,1fr)_340px] lg:px-6">
        <LeftPanel
          rows={rows}
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          onAdd={addIngredient}
          onRemove={removeRow}
          onChange={setConc}
        />
        <CenterDashboard prediction={prediction} rows={rows} />
        <RightPanel prediction={prediction} onSwap={swapTo} />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="font-display text-xl leading-none text-slate-deep">
              cosme<span className="text-moss">Bun</span>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              In-silico makeup toxicity & dermal-response predictor
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          <NavLink>Workspace</NavLink>
          <NavLink>Synergy Matrix</NavLink>
          <NavLink>Compliance</NavLink>
          <NavLink>Docs</NavLink>
        </nav>
        <button className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
          Export PDF report
        </button>
      </div>
    </header>
  );
}

function NavLink({ children }: { children: React.ReactNode }) {
  return (
    <a className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
      {children}
    </a>
  );
}

function Logo() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-moss to-primary text-primary-foreground shadow-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3c3 4 5 7 5 10a5 5 0 1 1-10 0c0-3 2-6 5-10z" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ───────────── LEFT PANEL ───────────── */

function LeftPanel(props: {
  rows: FormulaRow[];
  query: string;
  setQuery: (v: string) => void;
  suggestions: Ingredient[];
  onAdd: (i: Ingredient) => void;
  onRemove: (id: string) => void;
  onChange: (id: string, v: number) => void;
}) {
  const { rows, query, setQuery, suggestions, onAdd, onRemove, onChange } = props;
  const total = rows.reduce((s, r) => s + r.concentration, 0);

  return (
    <section className="flex flex-col gap-4">
      <Panel title="Ingredient input" subtitle="INCI / CAS bulk-aware lookup">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search INCI name or CAS #…"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/30 transition focus:border-ring focus:ring-2"
          />
          {query && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-popover shadow-lg">
              {suggestions.map((s) => (
                <li key={s.inci}>
                  <button
                    onClick={() => onAdd(s)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-secondary"
                  >
                    <span>
                      <span className="font-medium">{s.inci}</span>
                      {s.cas && (
                        <span className="ml-2 text-xs text-muted-foreground">CAS {s.cas}</span>
                      )}
                    </span>
                    <CategoryChip cat={s.category} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Concentration precision down to 0.001%. Paste a full deck to bulk-import.
        </p>
      </Panel>

      <Panel
        title={`Formula deck`}
        subtitle={`${rows.length} ingredients · total ${total.toFixed(2)}%`}
      >
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <RowCard key={r.id} row={r} onRemove={() => onRemove(r.id)} onChange={(v) => onChange(r.id, v)} />
          ))}
          {rows.length === 0 && (
            <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              Add an ingredient to begin
            </p>
          )}
        </div>
      </Panel>
    </section>
  );
}

function RowCard({
  row,
  onRemove,
  onChange,
}: {
  row: FormulaRow;
  onRemove: () => void;
  onChange: (v: number) => void;
}) {
  const flagged = row.ingredient.banned?.length || row.ingredient.alpha >= 4;
  return (
    <div
      className={`group rounded-lg border bg-card p-3 transition ${
        flagged ? "border-destructive/30 bg-destructive/[0.03]" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{row.ingredient.inci}</p>
            {row.ingredient.banned?.map((b) => (
              <span
                key={b}
                className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-destructive"
              >
                {b} ban
              </span>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <CategoryChip cat={row.ingredient.category} />
            {row.ingredient.cas && (
              <span className="text-[10px] text-muted-foreground">CAS {row.ingredient.cas}</span>
            )}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
          aria-label="Remove"
        >
          ×
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={0.01}
          value={row.concentration}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-[color:var(--moss)]"
        />
        <input
          type="number"
          step={0.001}
          min={0}
          max={100}
          value={row.concentration}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-20 rounded-md border border-input bg-background px-2 py-1 text-right text-xs"
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>
    </div>
  );
}

function CategoryChip({ cat }: { cat: Ingredient["category"] }) {
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
      {cat}
    </span>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

/* ───────────── CENTER DASHBOARD ───────────── */

function CenterDashboard({
  prediction,
  rows,
}: {
  prediction: ReturnType<typeof predict>;
  rows: FormulaRow[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <Panel title="Global Hazard Index" subtitle="Cumulative T_total · scaled 0–100">
          <Gauge value={prediction.ghi} band={prediction.band} />
        </Panel>
        <Panel title="Compliance" subtitle="Regional ban-list cross-reference">
          <ul className="space-y-2">
            {prediction.compliance.map((c) => (
              <li
                key={c.region}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{regionLabel(c.region)}</p>
                  <p className="text-xs text-muted-foreground">{c.notes.join(" · ")}</p>
                </div>
                <StatusPill status={c.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Granular skin biomarker breakdown" subtitle="Epidermal absorption response">
        <Biomarkers bm={prediction.biomarkers} />
      </Panel>

      <Panel title="Epidermal layer absorption" subtitle="Predicted depth penetration by ingredient">
        <AbsorptionChart rows={rows} />
      </Panel>
    </section>
  );
}

function Gauge({ value, band }: { value: number; band: "low" | "mid" | "high" }) {
  const color =
    band === "low"
      ? "var(--hazard-low)"
      : band === "mid"
        ? "var(--hazard-mid)"
        : "var(--hazard-high)";
  const r = 80;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex items-center gap-6">
      <div className="relative h-48 w-48 shrink-0">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={r} stroke="var(--secondary)" strokeWidth="14" fill="none" />
          <circle
            cx="100"
            cy="100"
            r={r}
            stroke={color}
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 600ms ease, stroke 400ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl tracking-tight" style={{ color }}>
            {value}
          </span>
          <span className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">GHI</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">
          {band === "low" && "Within safe formulation envelope"}
          {band === "mid" && "Borderline — review flagged components"}
          {band === "high" && "High cumulative hazard — reformulate"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          T_total combines weighted baseline toxicity (α) and non-linear synergy multipliers (β_ij)
          across the current deck.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wide">
          <BandBadge active={band === "low"} label="Low" color="var(--hazard-low)" />
          <BandBadge active={band === "mid"} label="Mid" color="var(--hazard-mid)" />
          <BandBadge active={band === "high"} label="High" color="var(--hazard-high)" />
        </div>
      </div>
    </div>
  );
}

function BandBadge({ active, label, color }: { active: boolean; label: string; color: string }) {
  return (
    <div
      className={`rounded-md border px-2 py-1.5 font-medium transition ${
        active ? "border-transparent text-primary-foreground" : "border-border text-muted-foreground"
      }`}
      style={active ? { backgroundColor: color } : undefined}
    >
      {label}
    </div>
  );
}

function Biomarkers({ bm }: { bm: ReturnType<typeof predict>["biomarkers"] }) {
  const items = [
    { key: "irritation", label: "Dermal Irritation / Erythema", v: bm.irritation },
    { key: "ocular", label: "Ocular Hazard Profile", v: bm.ocular },
    { key: "sensitization", label: "Sensitization Potential", v: bm.sensitization },
    { key: "comedogenic", label: "Comedogenicity", v: bm.comedogenic },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((i) => (
        <div key={i.key} className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">{i.label}</p>
            <span className="text-xs tabular-nums text-muted-foreground">{i.v.toFixed(1)}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, i.v)}%`,
                backgroundColor:
                  i.v < 25
                    ? "var(--hazard-low)"
                    : i.v < 55
                      ? "var(--hazard-mid)"
                      : "var(--hazard-high)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AbsorptionChart({ rows }: { rows: FormulaRow[] }) {
  const layers = [
    { name: "Stratum Corneum", depth: 1 },
    { name: "Epidermis", depth: 2 },
    { name: "Dermis", depth: 3 },
  ];
  const top = [...rows]
    .sort((a, b) => b.concentration * b.ingredient.alpha - a.concentration * a.ingredient.alpha)
    .slice(0, 5);

  return (
    <div className="flex h-56 items-end gap-4 overflow-x-auto px-1 pb-2">
      {top.map((r) => {
        const depth = Math.min(3, 1 + Math.floor(r.ingredient.alpha / 3));
        return (
          <div key={r.id} className="flex min-w-[88px] flex-col items-center gap-2">
            <div className="relative flex h-40 w-12 flex-col-reverse overflow-hidden rounded-md border border-border bg-background">
              {layers.map((l, idx) => (
                <div
                  key={l.name}
                  className="flex-1 border-t border-border/60 transition"
                  style={{
                    background:
                      idx < depth
                        ? `linear-gradient(180deg, color-mix(in oklch, var(--moss) ${
                            70 - idx * 18
                          }%, transparent), color-mix(in oklch, var(--moss) ${
                            40 - idx * 12
                          }%, transparent))`
                        : "transparent",
                  }}
                  title={l.name}
                />
              ))}
            </div>
            <p className="w-20 truncate text-center text-[10px] text-muted-foreground">
              {r.ingredient.inci}
            </p>
          </div>
        );
      })}
      {top.length === 0 && (
        <p className="text-xs text-muted-foreground">Add ingredients to see absorption depth.</p>
      )}
    </div>
  );
}

/* ───────────── RIGHT PANEL ───────────── */

function RightPanel({
  prediction,
  onSwap,
}: {
  prediction: ReturnType<typeof predict>;
  onSwap: (current: string, next: string) => void;
}) {
  return (
    <aside className="flex flex-col gap-4">
      <Panel
        title="AI clean alternatives"
        subtitle="Structurally similar, lower-toxicity swaps"
      >
        {prediction.alternatives.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            No swaps recommended. Deck looks clean.
          </p>
        ) : (
          <ul className="space-y-3">
            {prediction.alternatives.map((a) => (
              <li key={a.for} className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Replace</p>
                <p className="text-sm font-medium">{a.for}</p>
                <div className="my-2 flex items-center gap-2 text-xs text-moss">
                  <span>↓</span>
                  <span className="font-medium">{a.suggest}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{a.reason}</p>
                <button
                  onClick={() => onSwap(a.for, a.suggest)}
                  className="mt-3 w-full rounded-md bg-moss px-3 py-1.5 text-xs font-medium text-moss-foreground transition hover:opacity-90"
                >
                  Apply swap
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Flagged components" subtitle="Sorted by weighted hazard">
        {prediction.flagged.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Nothing flagged.
          </p>
        ) : (
          <ul className="space-y-2">
            {prediction.flagged.map((f) => (
              <li
                key={f.row.id}
                className="rounded-lg border border-destructive/20 bg-destructive/[0.04] p-3"
              >
                <p className="text-sm font-medium">{f.row.ingredient.inci}</p>
                <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                  {f.reasons.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </aside>
  );
}

function StatusPill({ status }: { status: "pass" | "warn" | "fail" }) {
  const map = {
    pass: { bg: "var(--hazard-low)", label: "Pass" },
    warn: { bg: "var(--hazard-mid)", label: "Review" },
    fail: { bg: "var(--hazard-high)", label: "Fail" },
  }[status];
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground"
      style={{ backgroundColor: map.bg }}
    >
      {map.label}
    </span>
  );
}

function regionLabel(r: "EU" | "FDA" | "CSAR") {
  return r === "EU" ? "EU Cosmetics Reg. (Annex II)" : r === "FDA" ? "US FDA MoCRA" : "China CSAR";
}
