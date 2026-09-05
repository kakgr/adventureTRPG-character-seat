import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { characterService } from '../lib/characters'
import { calculateHp, calculateMp, calculateSanity } from '../lib/characterRules'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../components/Icons'
import { StatusMessage } from '../components/StatusMessage'
import type { CharacterRecord } from '../types/character'

export function CharactersPage() {
  const { user } = useAuth()
  const [characters, setCharacters] = useState<CharacterRecord[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    void characterService.list(user.id).then(setCharacters).catch((e) => setError(e instanceof Error ? e.message : '読み込みに失敗しました')).finally(() => setLoading(false))
  }, [user])

  const filteredCharacters = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return characters
    return characters.filter((character) => [character.name, character.data.profile.summary, character.data.profile.occupation, ...character.data.tags].join(' ').toLowerCase().includes(normalized))
  }, [characters, query])

  return <div className="page page-list world-page">
    <section className="page-intro"><h1>キャラクター</h1><Link className="button button-primary" to="/characters/new"><Icon name="plus" /> 新しいシート</Link></section>
    {error && <StatusMessage tone="error">{error}</StatusMessage>}
    {!loading && characters.length > 0 && <div className="list-toolbar"><label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="名前、職業、タグで検索" aria-label="キャラクターを検索" /></label><span className="list-count">{filteredCharacters.length} / {characters.length} SHEETS</span></div>}
    {loading ? <div className="loading-state">シートを読み込んでいます…</div> : characters.length === 0 ? <div className="empty-state"><div className="empty-symbol">＋</div><h2>まだシートがありません</h2><Link className="button button-dark" to="/characters/new">キャラクターを作成する <Icon name="arrow" /></Link></div> : filteredCharacters.length === 0 ? <div className="empty-state compact-empty"><h2>該当するシートがありません</h2></div> : <CharacterList characters={filteredCharacters} />}
  </div>
}

function CharacterList({ characters }: { characters: CharacterRecord[] }) {
  return <div className="character-card-grid">{characters.map((character) => <Link to={`/characters/${character.id}`} className="character-card" key={character.id}>
    <div className="character-card-cover">
      {character.portrait_url ? <img src={character.portrait_url} alt="" loading="lazy" decoding="async" width="320" height="420" /> : <span className="character-card-placeholder">✦</span>}
      <div className="character-card-overlay"><span>{character.data.profile.occupation || '渡り手'}</span><h2>{character.name || '名前未設定'}</h2>{character.data.profile.reading && <p>{character.data.profile.reading}</p>}</div>
    </div>
    <div className="character-card-body">
      <p className="character-card-summary">{character.data.profile.summary || 'プロフィール未設定'}</p>
      <div className="character-card-tags">{character.data.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}{character.data.tags.length > 3 && <span className="tag tag-muted">+{character.data.tags.length - 3}</span>}</div>
      <div className="character-card-status"><span><b>HP</b>{calculateHp(character.data.stats, character.data.statBonuses)}</span><span><b>MP</b>{calculateMp(character.data.stats, character.data.statBonuses)}</span><span><b>SAN</b>{calculateSanity(character.data.stats, character.data.statBonuses)}</span></div>
    </div>
    <div className="character-card-footer"><time>{new Date(character.updated_at).toLocaleDateString('ja-JP')}</time><Icon name="arrow" /></div>
  </Link>)}</div>
}
