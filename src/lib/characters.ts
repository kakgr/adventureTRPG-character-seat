import { supabase } from './supabase'
import type { CharacterData, CharacterRecord, CharacterShare, SharedCharacterRecord } from '../types/character'
import { buildSharePortraitPath } from './share'

const decoratePortrait = async (character: CharacterRecord): Promise<CharacterRecord> => {
  if (!character.portrait_path) return { ...character, portrait_url: null }
  const { data } = await supabase.storage.from('character-portraits').createSignedUrl(character.portrait_path, 60 * 60)
  return { ...character, portrait_url: data?.signedUrl ?? null }
}

const decorateSharedPortrait = (character: SharedCharacterRecord): SharedCharacterRecord => {
  if (!character.portrait_path) return { ...character, portrait_url: null }
  const { data } = supabase.storage.from('character-share-portraits').getPublicUrl(character.portrait_path)
  return { ...character, portrait_url: data.publicUrl }
}

const syncSharePortrait = async (share: Pick<CharacterShare, 'token' | 'portrait_path'>, userId: string, privatePortraitPath: string | null) => {
  if (!privatePortraitPath) {
    if (share.portrait_path) {
      const { error: removeError } = await supabase.storage.from('character-share-portraits').remove([share.portrait_path])
      if (removeError) throw removeError
    }
    if (share.portrait_path !== null) {
      const { error } = await supabase.from('character_shares').update({ portrait_path: null }).eq('token', share.token).eq('owner_id', userId)
      if (error) throw error
    }
    return
  }

  const { data: file, error: downloadError } = await supabase.storage.from('character-portraits').download(privatePortraitPath)
  if (downloadError || !file) throw downloadError ?? new Error('立ち絵を共有用に準備できませんでした')
  const publicPortraitPath = buildSharePortraitPath(userId, share.token, privatePortraitPath)
  const { error: uploadError } = await supabase.storage.from('character-share-portraits').upload(publicPortraitPath, file, { upsert: true, contentType: file.type || 'application/octet-stream' })
  if (uploadError) throw uploadError
  if (share.portrait_path && share.portrait_path !== publicPortraitPath) {
    const { error: removeError } = await supabase.storage.from('character-share-portraits').remove([share.portrait_path])
    if (removeError) throw removeError
  }
  const { error } = await supabase.from('character_shares').update({ portrait_path: publicPortraitPath }).eq('token', share.token).eq('owner_id', userId)
  if (error) throw error
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
  async getShared(token: string) {
    const { data, error } = await supabase.rpc('get_shared_character', { share_token: token })
    if (error) throw error
    const record = (Array.isArray(data) ? data[0] : data) as SharedCharacterRecord | undefined
    if (!record) throw new Error('共有リンクが無効か、公開が停止されています。')
    return decorateSharedPortrait(record)
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
    const { data: shares, error: shareError } = await supabase.from('character_shares').select('portrait_path').eq('character_id', id).eq('owner_id', userId)
    if (shareError) throw shareError
    const publicPortraitPaths = (shares as Array<Pick<CharacterShare, 'portrait_path'>>).flatMap((share) => share.portrait_path ? [share.portrait_path] : [])
    if (publicPortraitPaths.length) await supabase.storage.from('character-share-portraits').remove(publicPortraitPaths)
    if (shares?.length) {
      const { error } = await supabase.from('character_shares').delete().eq('character_id', id).eq('owner_id', userId)
      if (error) throw error
    }
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
  async getActiveShare(characterId: string, userId: string) {
    const { data, error } = await supabase.from('character_shares').select('token, character_id, owner_id, portrait_path, created_at, revoked_at').eq('character_id', characterId).eq('owner_id', userId).is('revoked_at', null).maybeSingle()
    if (error) throw error
    return data as CharacterShare | null
  },
  async createShare(characterId: string, userId: string, privatePortraitPath: string | null) {
    const existing = await this.getActiveShare(characterId, userId)
    if (existing) {
      await syncSharePortrait(existing, userId, privatePortraitPath)
      return { ...existing, portrait_path: privatePortraitPath ? buildSharePortraitPath(userId, existing.token, privatePortraitPath) : null }
    }
    const { data, error } = await supabase.from('character_shares').insert({ character_id: characterId, owner_id: userId }).select('token, character_id, owner_id, portrait_path, created_at, revoked_at').single()
    if (error) throw error
    const share = data as CharacterShare
    try {
      await syncSharePortrait(share, userId, privatePortraitPath)
    } catch (syncError) {
      await supabase.from('character_shares').delete().eq('token', share.token).eq('owner_id', userId)
      throw syncError
    }
    return { ...share, portrait_path: privatePortraitPath ? buildSharePortraitPath(userId, share.token, privatePortraitPath) : null }
  },
  async syncSharePortraits(characterId: string, userId: string, privatePortraitPath: string | null) {
    const { data, error } = await supabase.from('character_shares').select('token, portrait_path').eq('character_id', characterId).eq('owner_id', userId).is('revoked_at', null)
    if (error) throw error
    await Promise.all((data as Array<Pick<CharacterShare, 'token' | 'portrait_path'>>).map((share) => syncSharePortrait(share, userId, privatePortraitPath)))
  },
  async revokeShare(token: string, userId: string, portraitPath: string | null) {
    const { error } = await supabase.from('character_shares').update({ revoked_at: new Date().toISOString() }).eq('token', token).eq('owner_id', userId).is('revoked_at', null)
    if (error) throw error
    if (portraitPath) {
      const { error: removeError } = await supabase.storage.from('character-share-portraits').remove([portraitPath])
      if (removeError) throw removeError
    }
  },
}
