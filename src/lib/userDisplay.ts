type Metadata = Record<string, unknown>

const asMetadata = (value: unknown): Metadata => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Metadata : {}

const textValue = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null

export function getDisplayName(metadata: unknown) {
  const root = asMetadata(metadata)
  const customClaims = asMetadata(root.custom_claims)
  const candidates = [
    customClaims.global_name,
    root.global_name,
    root.full_name,
    root.name,
    root.preferred_username,
    root.username,
    root.user_name,
  ]
  return candidates.map(textValue).find((value): value is string => value !== null) ?? 'プレイヤー'
}
