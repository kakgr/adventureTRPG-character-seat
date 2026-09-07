import { describe, expect, it } from 'vitest'
import { normalizeCurrency, updateCurrency } from './currency'

describe('currency', () => {
  it('carries every 100 lower coins into the next denomination', () => {
    expect(normalizeCurrency({ platinum: 0, gold: 0, silver: 100, copper: 100 })).toEqual({ platinum: 0, gold: 1, silver: 1, copper: 0 })
    expect(normalizeCurrency({ platinum: 0, gold: 100, silver: 0, copper: 0 })).toEqual({ platinum: 1, gold: 0, silver: 0, copper: 0 })
  })

  it('normalizes a changed denomination before saving it', () => {
    expect(updateCurrency({ platinum: 0, gold: 0, silver: 0, copper: 99 }, 'copper', 100)).toEqual({ platinum: 0, gold: 0, silver: 1, copper: 0 })
  })
})
