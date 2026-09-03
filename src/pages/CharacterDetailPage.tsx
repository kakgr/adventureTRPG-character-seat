import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { characterService } from '../lib/characters'
import { calculateDamageBonus, calculateHp, calculateMp, calculateSanity, totalStatValue } from '../lib/characterRules'
import { COMMON_SKILLS, SPECIALIZED_SKILLS, STAT_DESCRIPTIONS, STAT_LABELS } from '../constants/game'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../components/Icons'
import { StatusMessage } from '../components/StatusMessage'
import type { CharacterRecord, PublicCharacterRecord, SpecializedSkill } from '../types/character'
import { WORLD_IMAGES } from '../constants/world'
import { buildCocofoliaCharacter, serializeCocofoliaCharacter } from '../lib/ccfolia'

const STAT_SHORT_LABELS: Record<keyof typeof STAT_LABELS, string> = {
  vitality: 'VIT',
  strength: 'STR',
  magic: 'POW',
  speed: 'DEX',
  mental: 'MND',
}

export function CharacterDetailPage({ publicView = false }: { publicView?: boolean }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [character, setCharacter] = useState<CharacterRecord | PublicCharacterRecord | null>(null)
  const [ownerCharacter, setOwnerCharacter] = useState<CharacterRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (!id) return
    const load = publicView ? characterService.getPublic(id) : user ? characterService.get(id, user.id) : null
    if (!load) return
    void load
      .then(setCharacter)
      .catch((e) => setError(e instanceof Error ? e.message : publicView ? '公開シートを読み込めませんでした' : '読み込めませんでした'))
      .finally(() => setLoading(false))
  }, [id, publicView, user])

  useEffect(() => {
    if (!publicView || !user || !id) return
    void characterService.get(id, user.id).then(setOwnerCharacter).catch(() => setOwnerCharacter(null))
  }, [id, publicView, user])

  if (loading) return <div className="loading-state">シートを読み込んでいます…</div>
  if (error || !character) return <div className="page"><StatusMessage tone="error">{error || 'キャラクターが見つかりません。'}</StatusMessage><Link className="button button-ghost" to={publicView ? '/login' : '/characters'}>{publicView ? 'ログイン画面へ' : '一覧に戻る'}</Link></div>

  const displayCharacter = ownerCharacter ?? character
  const { data } = displayCharacter
  const canManage = Boolean(ownerCharacter) || !publicView
  const remove = async () => {
    if (!canManage || !user) return
    if (!window.confirm(`「${character.name}」を削除しますか？この操作は取り消せません。`)) return
    setDeleting(true)
    try {
      await characterService.remove(displayCharacter.id, user.id, displayCharacter.portrait_path)
      navigate('/characters')
    } catch (e) {
      setError(e instanceof Error ? e.message : '削除に失敗しました')
      setDeleting(false)
    }
  }

  const copyToCocofolia = async () => {
    if (!canManage || !ownerCharacter && publicView) return
    try {
      const payload = buildCocofoliaCharacter(displayCharacter as CharacterRecord, window.location.href)
      await navigator.clipboard.writeText(serializeCocofoliaCharacter(payload))
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2400)
    } catch {
      setCopyState('error')
    }
  }

  return <div className={`page detail-page world-page world-rain ${publicView ? 'public-detail-page' : ''}`} style={{ backgroundImage: `linear-gradient(rgba(29, 35, 33, .74), rgba(29, 35, 33, .88)), url(${WORLD_IMAGES.rainyCity})` }}>
    <div className="editor-top">
      <Link to={publicView && !canManage ? '/login' : '/characters'} className="back-link"><Icon name="back" /> {publicView && !canManage ? 'ログイン画面へ' : '一覧に戻る'}</Link>
      {canManage && <div className="detail-actions"><button className="button button-outline button-small" onClick={() => void copyToCocofolia()}><Icon name="copy" /> {copyState === 'copied' ? 'コピーしました' : 'ココフォリアにコピー'}</button><Link className="button button-outline button-small" to={`/characters/${displayCharacter.id}/edit`}><Icon name="edit" /> 編集</Link><button className="icon-button danger-icon" onClick={() => void remove()} disabled={deleting}><Icon name="trash" /></button></div>}
    </div>
    {copyState === 'error' && <StatusMessage tone="error">コピーに失敗しました。ブラウザの権限を確認してください。</StatusMessage>}
    {copyState === 'copied' && <p className="copy-help">ココフォリアの盤面をクリックして貼り付けてください。立ち絵はココフォリア側で設定します。</p>}
    <section className="detail-hero">
      <div className="detail-portrait">{character.portrait_url ? <img src={character.portrait_url} alt="" /> : <span>✦</span>}</div>
      <div className="detail-identity"><h1>{character.name || '名前未設定'}</h1>{data.profile.reading && <p className="reading">{data.profile.reading}</p>}<p className="hero-summary">{data.profile.summary}</p><div className="tag-row">{data.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
      <div className="hero-resources"><div><span>HP</span><strong>{calculateHp(data.stats, data.statBonuses)}</strong></div><div><span>MP</span><strong>{calculateMp(data.stats, data.statBonuses)}</strong></div><div><span>正気度</span><strong>{calculateSanity(data.stats, data.statBonuses)}</strong></div><div><span>DB</span><strong>{calculateDamageBonus(data.stats, data.statBonuses)}</strong></div></div>
    </section>

    <div className="detail-grid">
      <section className="detail-card detail-card-wide detail-stats-card"><div className="detail-stat-strip">{(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map((statId) => <div className="detail-stat-block" key={statId}><div className="detail-stat-label"><span>{STAT_SHORT_LABELS[statId]}</span><button type="button" className="stat-help" aria-label={`${STAT_LABELS[statId]}の説明`} title={STAT_DESCRIPTIONS[statId]} data-tooltip={STAT_DESCRIPTIONS[statId]}>?</button></div><strong>{totalStatValue(data.stats, data.statBonuses, statId)}</strong></div>)}</div></section>

      <section className="detail-card detail-card-wide"><CardHeading icon="book" title="技能一覧"/><div className="skill-detail-table-wrap"><table className="skill-table skill-detail-table"><thead><tr><th>区分</th><th>技能名</th><th>技能値</th></tr></thead><tbody><tr className="skill-genre-row"><th colSpan={3}>通常技能</th></tr>{COMMON_SKILLS.map((skill) => <tr key={skill.id}><td><span className="skill-category-chip">通常</span></td><td><b className="skill-name">{skill.label}</b></td><td><b className="detail-skill-value">{data.skills.common[skill.id]}</b></td></tr>)}</tbody>{SPECIALIZED_SKILLS.filter((group) => data.skills[group.id].length > 0).map((group) => <tbody key={group.id}><tr className="skill-genre-row"><th colSpan={3}>{group.label}</th></tr>{data.skills[group.id].map((skill: SpecializedSkill) => <tr key={skill.id}><td><span className="skill-category-chip">{group.label}</span></td><td><b className="skill-name">{skill.specialty || '専門未設定'}</b></td><td><b className="detail-skill-value">{skill.value}</b></td></tr>)}</tbody>)}{data.skills.custom.length > 0 && <tbody><tr className="skill-genre-row"><th colSpan={3}>カスタム</th></tr>{data.skills.custom.map((skill) => <tr key={skill.id}><td><span className="skill-category-chip">カスタム</span></td><td><b className="skill-name">{skill.name || '技能名未設定'}</b></td><td><b className="detail-skill-value">{skill.value}</b></td></tr>)}</tbody>}</table>{SPECIALIZED_SKILLS.every((group) => data.skills[group.id].length === 0) && data.skills.custom.length === 0 && <p className="skill-empty">追加技能は未登録</p>}</div></section>

      <section className="detail-card"><CardHeading icon="bag" title="持ち物"/><div className="detail-items">{data.items.length ? data.items.map((item) => <div className="detail-item" key={item.id}><b>{item.name || '名称未設定'}</b><span>× {item.quantity}</span><small>{item.description}</small></div>) : <p className="muted-copy">持ち物はまだありません。</p>}</div></section>

      <section className="detail-card"><CardHeading icon="spark" title="プロフィール"/><div className="profile-facts"><div><span>年齢</span><b>{data.profile.age ?? '—'}</b></div><div><span>性別</span><b>{data.profile.gender || '—'}</b></div><div><span>職業</span><b>{data.profile.occupation || '—'}</b></div></div>{data.profile.description && <p className="description">{data.profile.description}</p>}{data.experience.notes && <div className="experience-notes"><span>通過シナリオ</span><p>{data.experience.notes}</p></div>}</section>
    </div>
  </div>
}

function CardHeading({ icon, title }: { icon: 'spark' | 'book' | 'bag'; title: string }) { return <div className="card-heading"><Icon name={icon} /><h2>{title}</h2></div> }
