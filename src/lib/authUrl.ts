export function hasAuthResponseHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return params.has('access_token') || params.has('code') || params.has('error')
}

export function clearAuthResponseHash() {
  if (!hasAuthResponseHash(window.location.hash)) return
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
}
