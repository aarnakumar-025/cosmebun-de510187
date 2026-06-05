// Mock ingredient database & toxicity engine for DermaSim AI MVP

export type Ingredient = {
  inci: string;
  cas?: string;
  category: "preservative" | "surfactant" | "humectant" | "active" | "emollient" | "fragrance" | "colorant" | "emulsifier" | "other";
  alpha: number;
  irritation: number;
  ocular: number;
  sensitization: number;
  comedogenic: number;
  banned?: ("EU" | "FDA" | "CSAR")[];
  notes?: string;
  cleanAlternative?: string;
};

export const INGREDIENT_DB: Ingredient[] = [
  { inci: "Aqua (Water)", cas: "7732-18-5", category: "other", alpha: 0, irritation: 0, ocular: 0, sensitization: 0, comedogenic: 0 },
  { inci: "Glycerin", cas: "56-81-5", category: "humectant", alpha: 0.2, irritation: 0.1, ocular: 0.2, sensitization: 0.1, comedogenic: 0 },
  { inci: "Hyaluronic Acid", category: "humectant", alpha: 0.1, irritation: 0, ocular: 0, sensitization: 0.1, comedogenic: 0 },
  { inci: "Niacinamide", cas: "98-92-0", category: "active", alpha: 0.6, irritation: 1.2, ocular: 0.5, sensitization: 0.4, comedogenic: 0 },
  { inci: "Retinol", cas: "68-26-8", category: "active", alpha: 3.8, irritation: 6.5, ocular: 4.2, sensitization: 3.2, comedogenic: 1.0, notes: "Photosensitizing. Restrict ≤0.3% leave-on (EU 2024)." },
  { inci: "Alpha Arbutin", category: "active", alpha: 0.8, irritation: 1.0, ocular: 1.2, sensitization: 0.8, comedogenic: 0 },
  { inci: "Salicylic Acid", cas: "69-72-7", category: "active", alpha: 2.4, irritation: 4.0, ocular: 3.5, sensitization: 1.6, comedogenic: 0 },
  { inci: "Ascorbic Acid", cas: "50-81-7", category: "active", alpha: 1.2, irritation: 2.4, ocular: 2.0, sensitization: 0.6, comedogenic: 0 },
  { inci: "Methylparaben", cas: "99-76-3", category: "preservative", alpha: 4.0, irritation: 2.0, ocular: 1.5, sensitization: 5.5, comedogenic: 0.2, banned: ["EU"], notes: "Endocrine disruption concern.", cleanAlternative: "Sodium Benzoate" },
  { inci: "Propylparaben", cas: "94-13-3", category: "preservative", alpha: 4.6, irritation: 2.2, ocular: 1.8, sensitization: 6.0, comedogenic: 0.2, banned: ["EU"], cleanAlternative: "Potassium Sorbate" },
  { inci: "Sodium Benzoate", cas: "532-32-1", category: "preservative", alpha: 1.2, irritation: 1.0, ocular: 1.5, sensitization: 1.0, comedogenic: 0 },
  { inci: "Potassium Sorbate", category: "preservative", alpha: 1.0, irritation: 0.8, ocular: 1.0, sensitization: 0.8, comedogenic: 0 },
  { inci: "Phenoxyethanol", cas: "122-99-6", category: "preservative", alpha: 2.0, irritation: 2.4, ocular: 3.0, sensitization: 2.6, comedogenic: 0, notes: "Restricted ≤1% (EU)." },
  { inci: "Sodium Lauryl Sulfate", cas: "151-21-3", category: "surfactant", alpha: 5.2, irritation: 7.5, ocular: 7.8, sensitization: 3.5, comedogenic: 2.0, notes: "Strong cleanser; high stratum corneum disruption.", cleanAlternative: "Decyl Glucoside" },
  { inci: "Sodium Laureth Sulfate", cas: "9004-82-4", category: "surfactant", alpha: 4.0, irritation: 5.5, ocular: 6.2, sensitization: 2.8, comedogenic: 1.6, cleanAlternative: "Coco-Glucoside" },
  { inci: "Decyl Glucoside", category: "surfactant", alpha: 1.0, irritation: 1.2, ocular: 1.8, sensitization: 0.8, comedogenic: 0 },
  { inci: "Coco-Glucoside", category: "surfactant", alpha: 1.0, irritation: 1.4, ocular: 2.0, sensitization: 0.9, comedogenic: 0 },
  { inci: "Cetearyl Alcohol", category: "emulsifier", alpha: 0.6, irritation: 0.8, ocular: 1.0, sensitization: 0.6, comedogenic: 2.0 },
  { inci: "Isopropyl Myristate", cas: "110-27-0", category: "emollient", alpha: 2.0, irritation: 1.4, ocular: 1.0, sensitization: 0.8, comedogenic: 5.0, cleanAlternative: "Squalane" },
  { inci: "Squalane", cas: "111-01-3", category: "emollient", alpha: 0.2, irritation: 0.1, ocular: 0.2, sensitization: 0.2, comedogenic: 0.5 },
  { inci: "Coconut Oil", category: "emollient", alpha: 0.6, irritation: 0.4, ocular: 0.3, sensitization: 0.6, comedogenic: 4.0 },
  { inci: "Jojoba Oil", category: "emollient", alpha: 0.2, irritation: 0.1, ocular: 0.2, sensitization: 0.3, comedogenic: 1.0 },
  { inci: "Parfum (Fragrance)", category: "fragrance", alpha: 3.2, irritation: 3.5, ocular: 2.8, sensitization: 7.0, comedogenic: 0.4, notes: "Top allergen class (contact dermatitis)." },
  { inci: "Linalool", cas: "78-70-6", category: "fragrance", alpha: 2.8, irritation: 2.5, ocular: 2.2, sensitization: 6.2, comedogenic: 0, notes: "EU 26-allergen label trigger." },
  { inci: "Limonene", cas: "5989-27-5", category: "fragrance", alpha: 2.6, irritation: 2.2, ocular: 2.0, sensitization: 5.8, comedogenic: 0 },
  { inci: "Tocopherol (Vitamin E)", cas: "59-02-9", category: "active", alpha: 0.3, irritation: 0.2, ocular: 0.2, sensitization: 0.4, comedogenic: 1.0 },
  { inci: "Titanium Dioxide", cas: "13463-67-7", category: "colorant", alpha: 1.4, irritation: 0.6, ocular: 1.0, sensitization: 0.4, comedogenic: 0, notes: "Nano grade requires labeling." },
  { inci: "Zinc Oxide", cas: "1314-13-2", category: "colorant", alpha: 1.0, irritation: 0.4, ocular: 0.8, sensitization: 0.3, comedogenic: 0 },
  { inci: "Hydroquinone", cas: "123-31-9", category: "active", alpha: 8.5, irritation: 7.0, ocular: 6.0, sensitization: 6.5, comedogenic: 0, banned: ["EU", "CSAR"], notes: "Banned in EU cosmetics (Annex II).", cleanAlternative: "Alpha Arbutin" },
  { inci: "Triclosan", cas: "3380-34-5", category: "preservative", alpha: 7.8, irritation: 5.5, ocular: 5.0, sensitization: 6.0, comedogenic: 0.4, banned: ["EU", "FDA"], cleanAlternative: "Sodium Benzoate" },
  { inci: "Formaldehyde", cas: "50-00-0", category: "preservative", alpha: 9.5, irritation: 8.5, ocular: 9.0, sensitization: 9.5, comedogenic: 0, banned: ["EU", "FDA", "CSAR"], cleanAlternative: "Phenoxyethanol" },
];

export function searchIngredients(query: string, limit = 8): Ingredient[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return INGREDIENT_DB.filter(
    (i) => i.inci.toLowerCase().includes(q) || i.cas?.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function findIngredient(inci: string): Ingredient | undefined {
  return INGREDIENT_DB.find((i) => i.inci.toLowerCase() === inci.toLowerCase());
}

export type FormulaRow = { id: string; ingredient: Ingredient; concentration: number };

// Synergy matrix β_ij — non-linear interaction multipliers by category pairing
const SYNERGY: Record<string, number> = {
  "active+active": 1.8,
  "active+surfactant": 1.4,
  "fragrance+active": 1.6,
  "fragrance+surfactant": 1.5,
  "preservative+preservative": 1.3,
  "surfactant+surfactant": 1.3,
};

function pairKey(a: string, b: string) {
  return [a, b].sort().join("+");
}

export type Biomarkers = {
  irritation: number;
  ocular: number;
  sensitization: number;
  comedogenic: number;
};

export type Prediction = {
  ghi: number; // 0..100, lower = safer
  band: "low" | "mid" | "high";
  biomarkers: Biomarkers;
  flagged: { row: FormulaRow; reasons: string[] }[];
  alternatives: { for: string; suggest: string; reason: string }[];
  compliance: { region: "EU" | "FDA" | "CSAR"; status: "pass" | "warn" | "fail"; notes: string[] }[];
  totalConcentration: number;
};

export function predict(rows: FormulaRow[]): Prediction {
  const totalConcentration = rows.reduce((s, r) => s + r.concentration, 0);

  // Linear contribution — log-dose response so low-% actives matter and
  // bulk excipient sliders still produce visible movement.
  let base = 0;
  const bm: Biomarkers = { irritation: 0, ocular: 0, sensitization: 0, comedogenic: 0 };
  for (const r of rows) {
    const c = Math.max(0, r.concentration);
    // dose factor: ~1 at 1%, ~2 at 10%, ~3 at 100%; non-zero at 0.1%
    const w = Math.log10(1 + c * 9);
    base += r.ingredient.alpha * w * 3.2;
    bm.irritation += r.ingredient.irritation * w * 3.0;
    bm.ocular += r.ingredient.ocular * w * 3.0;
    bm.sensitization += r.ingredient.sensitization * w * 3.0;
    bm.comedogenic += r.ingredient.comedogenic * w * 3.0;
  }

  // Synergy β_ij — non-linear pair interaction
  let synergy = 0;
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i], b = rows[j];
      const key = pairKey(a.ingredient.category, b.ingredient.category);
      const mult = SYNERGY[key] ?? 0;
      if (!mult) continue;
      const cI = Math.max(0, a.concentration), cJ = Math.max(0, b.concentration);
      const dose = Math.sqrt(Math.log10(1 + cI * 9) * Math.log10(1 + cJ * 9));
      synergy += mult * dose * (a.ingredient.alpha + b.ingredient.alpha) * 1.4;
    }
  }

  const raw = base + synergy;
  const ghi = Math.max(0, Math.min(100, Math.round(raw)));

  const band: Prediction["band"] = ghi < 30 ? "low" : ghi < 65 ? "mid" : "high";

  // Flag rows
  const flagged: Prediction["flagged"] = [];
  const alternatives: Prediction["alternatives"] = [];
  for (const r of rows) {
    const reasons: string[] = [];
    if (r.ingredient.banned?.length) reasons.push(`Restricted in ${r.ingredient.banned.join(", ")}`);
    if (r.ingredient.alpha * (r.concentration / 100) * 10 > 2) reasons.push("High weighted toxicity index");
    if (r.ingredient.sensitization >= 5) reasons.push("Sensitization risk (allergen class)");
    if (r.ingredient.comedogenic >= 4) reasons.push("High comedogenicity");
    if (reasons.length) flagged.push({ row: r, reasons });
    if (r.ingredient.cleanAlternative && (r.ingredient.banned?.length || r.ingredient.alpha >= 3)) {
      alternatives.push({
        for: r.ingredient.inci,
        suggest: r.ingredient.cleanAlternative,
        reason: r.ingredient.notes ?? "Lower baseline toxicity, retains functional class.",
      });
    }
  }

  // Compliance
  const compliance: Prediction["compliance"] = (["EU", "FDA", "CSAR"] as const).map((region) => {
    const banned = rows.filter((r) => r.ingredient.banned?.includes(region));
    if (banned.length) {
      return {
        region,
        status: "fail" as const,
        notes: banned.map((b) => `${b.ingredient.inci} not permitted`),
      };
    }
    if (ghi >= 65) return { region, status: "warn" as const, notes: ["Cumulative hazard exceeds review threshold"] };
    return { region, status: "pass" as const, notes: ["No banned substances detected"] };
  });

  // clamp biomarkers
  (Object.keys(bm) as (keyof Biomarkers)[]).forEach((k) => {
    bm[k] = Math.max(0, Math.min(100, Math.round(bm[k] * 10) / 10));
  });

  return { ghi, band, biomarkers: bm, flagged, alternatives, compliance, totalConcentration };
}
