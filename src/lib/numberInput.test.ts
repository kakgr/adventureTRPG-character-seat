import { describe, expect, it } from 'vitest'
import { normalizeNumberInput } from './numberInput'

describe('normalizeNumberInput', () => {
  it('treats an empty input as zero', () => {
    expect(normalizeNumberInput('', 0, 100)).toBe(0)
  })

  it('clamps numeric input to the configured range', () => {
    expect(normalizeNumberInput('120', 0, 100)).toBe(100)
    expect(normalizeNumberInput('-4', 0, 100)).toBe(0)
  })

  it('uses zero for non-numeric input', () => {
    expect(normalizeNumberInput('not-a-number', 0, 100)).toBe(0)
  })
})
