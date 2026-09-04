import { describe, expect, it } from 'vitest'
import { clearCharacterDraft, loadCharacterDraft, saveCharacterDraft } from './characterDraft'

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
  } as Storage
}

describe('character draft persistence', () => {
  it('saves and restores an in-progress draft per user and character', () => {
    const storage = memoryStorage()
    const data = { profile: { reading: 'ありあ' } } as never

    saveCharacterDraft(storage, 'user-1', 'character-1', 'アリア', data, 123)

    expect(loadCharacterDraft(storage, 'user-1', 'character-1')).toEqual({
      name: 'アリア',
      data: expect.objectContaining({ profile: expect.objectContaining({ reading: 'ありあ' }) }),
      savedAt: 123,
    })
    expect(loadCharacterDraft(storage, 'user-2', 'character-1')).toBeNull()
  })

  it('clears a draft after the character is saved', () => {
    const storage = memoryStorage()
    saveCharacterDraft(storage, 'user-1', null, '新規', {} as never)

    clearCharacterDraft(storage, 'user-1', null)

    expect(loadCharacterDraft(storage, 'user-1', null)).toBeNull()
  })

  it('ignores malformed stored data', () => {
    const storage = memoryStorage()
    storage.setItem('character-draft:user-1:new', '{not-json')

    expect(loadCharacterDraft(storage, 'user-1', null)).toBeNull()
  })
})
