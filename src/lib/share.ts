export function buildShareUrl(origin: string, basePath: string, token: string) {
  const normalizedOrigin = origin.replace(/\/+$/, '')
  const normalizedBase = basePath.replace(/^\/+/, '').replace(/\/*$/, '')
  const root = `${normalizedOrigin}/${normalizedBase ? `${normalizedBase}/` : ''}`
  return new URL(`share/${encodeURIComponent(token)}`, root).toString()
}

export function buildSharePortraitPath(userId: string, token: string, privatePortraitPath: string) {
  const extension = privatePortraitPath.match(/\.(png|jpe?g|webp)$/i)?.[0].toLowerCase() ?? '.bin'
  return `${userId}/${token}${extension}`
}
