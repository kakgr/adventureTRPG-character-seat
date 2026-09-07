import type { Currency, CurrencyDenomination } from '../types/character'

export const EMPTY_CURRENCY: Currency = { platinum: 0, gold: 0, silver: 0, copper: 0 }
const COPPER_PER_SILVER = 100
const COPPER_PER_GOLD = COPPER_PER_SILVER * 100
const COPPER_PER_PLATINUM = COPPER_PER_GOLD * 100

const safeAmount = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

export function normalizeCurrency(source: Partial<Currency> | null | undefined): Currency {
  const totalCopper = safeAmount(source?.platinum) * COPPER_PER_PLATINUM
    + safeAmount(source?.gold) * COPPER_PER_GOLD
    + safeAmount(source?.silver) * COPPER_PER_SILVER
    + safeAmount(source?.copper)

  const platinum = Math.floor(totalCopper / COPPER_PER_PLATINUM)
  const afterPlatinum = totalCopper % COPPER_PER_PLATINUM
  const gold = Math.floor(afterPlatinum / COPPER_PER_GOLD)
  const afterGold = afterPlatinum % COPPER_PER_GOLD
  const silver = Math.floor(afterGold / COPPER_PER_SILVER)
  const copper = afterGold % COPPER_PER_SILVER
  return { platinum, gold, silver, copper }
}

export function updateCurrency(currency: Currency, denomination: CurrencyDenomination, value: number): Currency {
  return normalizeCurrency({ ...currency, [denomination]: value })
}
