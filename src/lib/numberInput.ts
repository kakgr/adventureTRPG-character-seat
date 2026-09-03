export const normalizeNumberInput = (raw: string, min: number, max: number) => {
  if (raw.trim() === '') return min
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return min
  return Math.max(min, Math.min(max, Math.round(parsed)))
}
