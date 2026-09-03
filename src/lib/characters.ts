import { supabase } from './supabase'
import { normalizeCharacterData } from './characterData'
import type { CharacterData, CharacterRecord, PublicCharacterRecord } from '../types/character'

const decoratePortrait = async (character: CharacterRecord): Promise<CharacterRecord> => {
  const normalized = { ...character, data: normalizeCharacterData(character.data) }
  if (!character.portrait_path) return { ...normalized, portrait_url: null }
  const { data } = await supabase.storage.from('character-portraits').createSignedUrl(character.portrait_path, 60 * 60)
  return { ...normalized, portrait_url: data?.signedUrl ?? null }
}

const decoratePublicPortrait = (character: PublicCharacterRecord): PublicCharacterRecord => {
  const normalized = { ...character, data: normalizeCharacterData(character.data) }
  if (!character.portrait_path) return { ...normalized, portrait_url: null }
  const { data } = supabase.storage.from('character-portraits').getPublicUrl(character.portrait_path)
  return { ...normalized, portrait_url: data.publicUrl }
}

export const characterService = {
  async list(userId: string) {
    const { data, error } = await supabase.from('characters').select('*').eq('user_id', userId).order('updated_at', { ascending: false })
    if (error) throw error
    return Promise.all((data as CharacterRecord[]).map(decoratePortrait))
  },
  async get(id: string, userId: string) {
    const { data, error } = await supabase.from('characters').select('*').eq('id', id).eq('user_id', userId).single()
    if (error) throw error
    return decoratePortrait(data as CharacterRecord)
  },
  async getPublic(id: string) {
    const { data, error } = await supabase.rpc('get_public_character', { p_character_id: id })
    if (error) throw error
    const record = (Array.isArray(data) ? data[0] : data) as PublicCharacterRecord | undefined
    if (!record) throw new Error('キャラクターが見つかりません。')
    return decoratePublicPortrait(record)
  },
  async create(userId: string, name: string, data: CharacterData) {
    const { data: created, error } = await supabase.from('characters').insert({ user_id: userId, name, data }).select().single()
    if (error) throw error
    return created as CharacterRecord
  },
  async update(id: string, userId: string, name: string, data: CharacterData, portraitPath?: string | null) {
    const payload: Record<string, unknown> = { name, data, updated_at: new Date().toISOString() }
    if (portraitPath !== undefined) payload.portrait_path = portraitPath
    const { data: updated, error } = await supabase.from('characters').update(payload).eq('id', id).eq('user_id', userId).select().single()
    if (error) throw error
    return decoratePortrait(updated as CharacterRecord)
  },
  async remove(id: string, userId: string, portraitPath: string | null) {
    if (portraitPath) await supabase.storage.from('character-portraits').remove([portraitPath])
    const { error } = await supabase.from('characters').delete().eq('id', id).eq('user_id', userId)
    if (error) throw error
  },
  async uploadPortrait(userId: string, characterId: string, file: File) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-')
    const path = `${userId}/${characterId}/${crypto.randomUUID()}-${safeName}`
    const { error } = await supabase.storage.from('character-portraits').upload(path, file, { upsert: false, contentType: file.type })
    if (error) throw error
    return path
  },
  async removePortrait(path: string) {
    const { error } = await supabase.storage.from('character-portraits').remove([path])
    if (error) throw error
  },
}
