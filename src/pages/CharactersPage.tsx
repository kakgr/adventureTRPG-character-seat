import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { characterService } from '../lib/characters'
import { calculateHp, calculateMp } from '../lib/characterRules'
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

  return <div className="page page-list">
    <section className="page-intro"><h1>キャラクター</h1><Link className="button button-primary" to="/characters/new"><Icon name="plus" /> 新しいシート</Link></section>
    {error && <StatusMessage tone="error">{error}</StatusMessage>}
    {!loading && characters.length > 0 && <div className="list-toolbar"><label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="名前、職業、タグで検索" aria-label="キャラクターを検索" /></label><span className="list-count">{filteredCharacters.length} / {characters.length} SHEETS</span></div>}
    {loading ? <div className="loading-state">シートを読み込んでいます…</div> : characters.length === 0 ? <div className="empty-state"><div className="empty-symbol">＋</div><h2>まだシートがありません</h2><Link className="button button-dark" to="/characters/new">キャラクターを作成する <Icon name="arrow" /></Link></div> : filteredCharacters.length === 0 ? <div className="empty-state compact-empty"><h2>該当するシートがありません</h2></div> : <CharacterList characters={filteredCharacters} />}
  </div>
}

function CharacterList({ characters }: { characters: CharacterRecord[] }) {
  return <div className="character-list"><div className="character-list-head"><span>キャラクター</span><span>プロフィール</span><span>タグ</span><span>HP / MP</span><span>更新</span></div>{characters.map((character) => <Link to={`/characters/${character.id}`} className="character-list-row" key={character.id}><div className="list-character"><div className="list-portrait">{character.portrait_url ? <img src={character.portrait_url} alt="" /> : <span>✦</span>}</div><div><h2>{character.name || '名前未設定'}</h2>{character.data.profile.reading && <p>{character.data.profile.reading}</p>}</div></div><p className="list-profile">{character.data.profile.summary || character.data.profile.occupation}</p><div className="list-tags">{character.data.tags.slice(0, 2).map((tag) => <span className="tag" key={tag}>{tag}</span>)}{character.data.tags.length > 2 && <span className="tag tag-muted">+{character.data.tags.length - 2}</span>}</div><div className="list-status"><span><b>HP</b>{calculateHp(character.data.stats, character.data.statBonuses)}</span><span><b>MP</b>{calculateMp(character.data.stats, character.data.statBonuses)}</span></div><time>{new Date(character.updated_at).toLocaleDateString('ja-JP')}</time><Icon name="arrow" /></Link>)}</div>
}
