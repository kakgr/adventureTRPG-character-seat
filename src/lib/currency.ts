import type { Currency, LegacyCurrency } from "../types/character";

export const EMPTY_CURRENCY: Currency = 0;
const COPPER_PER_SILVER = 100;
const COPPER_PER_GOLD = COPPER_PER_SILVER * 100;
const COPPER_PER_PLATINUM = COPPER_PER_GOLD * 100;

const safeAmount = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;

export function normalizeCurrency(source: unknown): Currency {
  if (typeof source === "number") return safeAmount(source);
  if (!source || typeof source !== "object") return 0;

  const value = source as Partial<LegacyCurrency> & { amount?: unknown };
  if ("amount" in value) return safeAmount(value.amount);

  return (
    safeAmount(value.platinum) * COPPER_PER_PLATINUM +
    safeAmount(value.gold) * COPPER_PER_GOLD +
    safeAmount(value.silver) * COPPER_PER_SILVER +
    safeAmount(value.copper)
  );
}
