import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { characterService } from '../lib/characters'
import { calculateHp, calculateMp, totalStatValue } from '../lib/characterRules'
import { COMMON_SKILLS, SPECIALIZED_SKILLS, STAT_LABELS } from '../constants/game'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../components/Icons'
import { StatusMessage } from '../components/StatusMessage'
import type { CharacterRecord, SpecializedSkill } from '../types/character'
import { WORLD_IMAGES } from '../constants/world'
import { buildCocofoliaCharacter, serializeCocofoliaCharacter } from '../lib/ccfolia'

export function CharacterDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [character, setCharacter] = useState<CharacterRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (!user || !id) return
    void characterService.get(id, user.id)
      .then(setCharacter)
      .catch((e) => setError(e instanceof Error ? e.message : '読み込めませんでした'))
      .finally(() => setLoading(false))
  }, [id, user])

  if (loading) return <div className="loading-state">シートを読み込んでいます…</div>
  if (error || !character) return <div className="page"><StatusMessage tone="error">{error || 'キャラクターが見つかりません。'}</StatusMessage><Link className="button button-ghost" to="/characters">一覧に戻る</Link></div>

  const { data } = character
  const remove = async () => {
    if (!window.confirm(`「${character.name}」を削除しますか？この操作は取り消せません。`)) return
    setDeleting(true)
    try {
      await characterService.remove(character.id, user!.id, character.portrait_path)
      navigate('/characters')
    } catch (e) {
      setError(e instanceof Error ? e.message : '削除に失敗しました')
      setDeleting(false)
    }
  }

  const copyToCocofolia = async () => {
    try {
      const payload = buildCocofoliaCharacter(character, window.location.href)
      await navigator.clipboard.writeText(serializeCocofoliaCharacter(payload))
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2400)
    } catch {
      setCopyState('error')
    }
  }

  return <div className="page detail-page world-page world-rain" style={{ backgroundImage: `linear-gradient(rgba(29, 35, 33, .74), rgba(29, 35, 33, .88)), url(${WORLD_IMAGES.rainyCity})` }}>
    <div className="editor-top">
      <Link to="/characters" className="back-link"><Icon name="back" /> 一覧に戻る</Link>
      <div className="detail-actions"><button className="button button-outline button-small" onClick={() => void copyToCocofolia()}><Icon name="copy" /> {copyState === 'copied' ? 'コピーしました' : 'ココフォリアにコピー'}</button><Link className="button button-outline button-small" to={`/characters/${character.id}/edit`}><Icon name="edit" /> 編集</Link><button className="icon-button danger-icon" onClick={() => void remove()} disabled={deleting}><Icon name="trash" /></button></div>
    </div>
    {copyState === 'error' && <StatusMessage tone="error">コピーに失敗しました。ブラウザの権限を確認してください。</StatusMessage>}
    {copyState === 'copied' && <p className="copy-help">ココフォリアの盤面をクリックして貼り付けてください。立ち絵はココフォリア側で設定します。</p>}
    <section className="detail-hero">
      <div className="detail-portrait">{character.portrait_url ? <img src={character.portrait_url} alt="" /> : <span>✦</span>}</div>
      <div className="detail-identity"><h1>{character.name || '名前未設定'}</h1>{data.profile.reading && <p className="reading">{data.profile.reading}</p>}<p className="hero-summary">{data.profile.summary}</p><div className="tag-row">{data.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
      <div className="hero-resources"><div><span>HP</span><strong>{calculateHp(data.stats, data.statBonuses)}</strong></div><div><span>MP</span><strong>{calculateMp(data.stats, data.statBonuses)}</strong></div></div>
    </section>

    <div className="detail-grid">
      <section className="detail-card"><CardHeading icon="spark" title="能力値"/><div className="detail-stats"><div className="detail-stat-head"><span>能力値</span><span>初期値</span><span>追加値</span><span>合計</span></div>{(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map((statId) => <div className="detail-stat-row" key={statId}><span>{STAT_LABELS[statId]}</span><b>{data.stats[statId]}</b><b>{data.statBonuses?.[statId] ?? 0}</b><b>{totalStatValue(data.stats, data.statBonuses, statId)}</b></div>)}</div></section>

      <section className="detail-card detail-card-wide"><CardHeading icon="book" title="技能一覧"/><div className="skill-detail-table-wrap"><table className="skill-table skill-detail-table"><thead><tr><th>区分</th><th>技能名</th><th>技能値</th></tr></thead><tbody>{COMMON_SKILLS.map((skill) => <tr key={skill.id}><td><span className="skill-category-chip">通常</span></td><td><b className="skill-name">{skill.label}</b></td><td><b className="detail-skill-value">{data.skills.common[skill.id]}</b></td></tr>)}{SPECIALIZED_SKILLS.flatMap((group) => data.skills[group.id].map((skill: SpecializedSkill) => <tr key={skill.id}><td><span className="skill-category-chip">{group.label}</span></td><td><b className="skill-name">{skill.specialty || '専門未設定'}</b></td><td><b className="detail-skill-value">{skill.value}</b></td></tr>))}{data.skills.custom.map((skill) => <tr key={skill.id}><td><span className="skill-category-chip">カスタム</span></td><td><b className="skill-name">{skill.name || '技能名未設定'}</b></td><td><b className="detail-skill-value">{skill.value}</b></td></tr>)}</tbody></table>{SPECIALIZED_SKILLS.every((group) => data.skills[group.id].length === 0) && data.skills.custom.length === 0 && <p className="skill-empty">追加技能は未登録</p>}</div></section>

      <section className="detail-card"><CardHeading icon="bag" title="持ち物"/><div className="detail-items">{data.items.length ? data.items.map((item) => <div className="detail-item" key={item.id}><b>{item.name || '名称未設定'}</b><span>× {item.quantity}</span><small>{item.description}</small></div>) : <p className="muted-copy">持ち物はまだありません。</p>}</div></section>

      <section className="detail-card"><CardHeading icon="spark" title="プロフィール"/><div className="profile-facts"><div><span>年齢</span><b>{data.profile.age ?? '—'}</b></div><div><span>性別</span><b>{data.profile.gender || '—'}</b></div><div><span>職業</span><b>{data.profile.occupation || '—'}</b></div></div>{data.profile.description && <p className="description">{data.profile.description}</p>}{data.experience.notes && <div className="experience-notes"><span>通過シナリオ</span><p>{data.experience.notes}</p></div>}</section>
    </div>
  </div>
}

function CardHeading({ icon, title }: { icon: 'spark' | 'book' | 'bag'; title: string }) { return <div className="card-heading"><Icon name={icon} /><h2>{title}</h2></div> }
