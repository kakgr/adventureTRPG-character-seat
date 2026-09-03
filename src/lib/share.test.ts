import { describe, expect, it } from 'vitest'
import { buildShareUrl, buildSharePortraitPath } from './share'

describe('character share helpers', () => {
  it('builds a share URL under the configured app base path', () => {
    expect(buildShareUrl('https://kakgr.github.io', '/adventureTRPG-character-seat/', 'abc123')).toBe('https://kakgr.github.io/adventureTRPG-character-seat/share/abc123')
  })

  it('encodes tokens and keeps portrait copies scoped to the owner', () => {
    expect(buildShareUrl('https://example.com/', '/', 'token/with spaces')).toBe('https://example.com/share/token%2Fwith%20spaces')
    expect(buildSharePortraitPath('user-1', 'share-token', 'user-1/character-1/uuid-portrait.webp')).toBe('user-1/share-token.webp')
  })
})
