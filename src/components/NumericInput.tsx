import { useEffect, useState } from 'react'
import { normalizeNumberInput } from '../lib/numberInput'

interface NumericInputProps {
  'aria-label': string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function NumericInput({ value, min, max, onChange, 'aria-label': ariaLabel }: NumericInputProps) {
  const [draft, setDraft] = useState(String(value))
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!editing) setDraft(String(value))
  }, [editing, value])

  return <input
    aria-label={ariaLabel}
    type="number"
    min={min}
    max={max}
    value={draft}
    onFocus={() => setEditing(true)}
    onChange={(event) => {
      const raw = event.target.value
      setDraft(raw)
      onChange(normalizeNumberInput(raw, min, max))
    }}
    onBlur={() => {
      setEditing(false)
      const normalized = normalizeNumberInput(draft, min, max)
      setDraft(String(normalized))
      onChange(normalized)
    }}
  />
}
