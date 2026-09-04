import { normalizeCharacterData } from './characterData'
import type { CharacterData } from '../types/character'

export type CharacterDraft = {
  name: string
  data: CharacterData
  savedAt: number
}

type DraftStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const draftKey = (userId: string, characterId: string | null) => `character-draft:${userId}:${characterId ?? 'new'}`

export function loadCharacterDraft(storage: Pick<DraftStorage, 'getItem'> | null | undefined, userId: string, characterId: string | null): CharacterDraft | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(draftKey(userId, characterId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CharacterDraft>
    if (typeof parsed.name !== 'string' || !parsed.data || typeof parsed.data !== 'object') return null
    return {
      name: parsed.name,
      data: normalizeCharacterData(parsed.data),
      savedAt: typeof parsed.savedAt === 'number' && Number.isFinite(parsed.savedAt) ? parsed.savedAt : 0,
    }
  } catch {
    return null
  }
}

export function saveCharacterDraft(storage: Pick<DraftStorage, 'setItem'> | null | undefined, userId: string, characterId: string | null, name: string, data: CharacterData, savedAt = Date.now()) {
  if (!storage) return
  try {
    storage.setItem(draftKey(userId, characterId), JSON.stringify({ name, data, savedAt }))
  } catch {
    // 下書き保存の失敗で編集中の操作を止めない。
  }
}

export function clearCharacterDraft(storage: Pick<DraftStorage, 'removeItem'> | null | undefined, userId: string, characterId: string | null) {
  if (!storage) return
  try {
    storage.removeItem(draftKey(userId, characterId))
  } catch {
    // Storageが利用できない環境でも保存済みデータの操作は継続する。
  }
}
