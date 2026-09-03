import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { characterService } from '../lib/characters'
import { calculateHp, calculateMp } from '../lib/characterRules'
import { COMMON_SKILLS, SPECIALIZED_SKILLS, STAT_LABELS } from '../constants/game'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../components/Icons'
import { StatusMessage } from '../components/StatusMessage'
import type { CharacterRecord, SpecializedSkill } from '../types/character'

export function CharacterDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [character, setCharacter] = useState<CharacterRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

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

  return <div className="page detail-page">
    <div className="editor-top">
      <Link to="/characters" className="back-link"><Icon name="back" /> 一覧に戻る</Link>
      <div className="detail-actions"><Link className="button button-outline button-small" to={`/characters/${character.id}/edit`}><Icon name="edit" /> 編集</Link><button className="icon-button danger-icon" onClick={() => void remove()} disabled={deleting}><Icon name="trash" /></button></div>
    </div>

    <section className="detail-hero">
      <div className="detail-portrait">{character.portrait_url ? <img src={character.portrait_url} alt="" /> : <span>✦</span>}</div>
      <div className="detail-identity"><span className="eyebrow">CHARACTER SHEET / {character.id.slice(0, 4).toUpperCase()}</span><h1>{character.name || '名前未設定'}</h1><p className="reading">{data.profile.reading}</p><p className="hero-summary">{data.profile.summary || '一言説明はまだありません。'}</p><div className="tag-row">{data.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
      <div className="hero-resources"><div><span>HP</span><strong>{calculateHp(data.stats)}</strong><small>体力 × 3</small></div><div><span>MP</span><strong>{calculateMp(data.stats)}</strong><small>精神力 × 3</small></div></div>
    </section>

    <div className="detail-grid">
      <section className="detail-card"><CardHeading icon="spark" title="能力値"/><div className="detail-stats">{(Object.keys(STAT_LABELS) as Array<keyof typeof STAT_LABELS>).map((statId) => <div key={statId}><span>{STAT_LABELS[statId]}</span><b>{data.stats[statId]}</b></div>)}</div></section>

      <section className="detail-card detail-card-wide"><CardHeading icon="book" title="技能一覧"/><div className="skill-catalog">{COMMON_SKILLS.length > 0 && <div className="skill-category"><div className="category-heading"><span>STANDARD</span><h3>標準技能</h3></div>{COMMON_SKILLS.map((skill) => <DetailSkill key={skill.id} label={skill.label} value={data.skills.common[skill.id]}/>)}</div>}{SPECIALIZED_SKILLS.map((group) => <div className="skill-category" key={group.id}><div className="category-heading"><span>SPECIALTY</span><h3>{group.label}</h3></div>{data.skills[group.id].length > 0 ? data.skills[group.id].map((skill: SpecializedSkill) => <DetailSkill key={skill.id} label={skill.specialty || '専門未設定'} value={skill.value} prefix={group.label}/>) : <p className="skill-empty">専門技能は未登録</p>}</div>)}<div className="skill-category"><div className="category-heading"><span>CUSTOM</span><h3>カスタム</h3></div>{data.skills.custom.length > 0 ? data.skills.custom.map((skill) => <DetailSkill key={skill.id} label={skill.name || '技能名未設定'} value={skill.value}/>) : <p className="skill-empty">カスタム技能は未登録</p>}</div></div></section>

      <section className="detail-card"><CardHeading icon="bag" title="持ち物"/><div className="detail-items">{data.items.length ? data.items.map((item) => <div className="detail-item" key={item.id}><b>{item.name || '名称未設定'}</b><span>× {item.quantity}</span><small>{item.description}</small></div>) : <p className="muted-copy">持ち物はまだありません。</p>}</div></section>

      <section className="detail-card"><CardHeading icon="spark" title="プロフィール"/><div className="profile-facts"><div><span>年齢</span><b>{data.profile.age ?? '—'}</b></div><div><span>性別</span><b>{data.profile.gender || '—'}</b></div><div><span>職業</span><b>{data.profile.occupation || '—'}</b></div></div><p className="description">{data.profile.description || 'プロフィールはまだ記入されていません。'}</p><div className="experience-notes"><span>通過シナリオ</span><p>{data.experience.notes || '通過シナリオはまだ記録されていません。'}</p></div></section>
    </div>
    <p className="updated-at">最終更新：{new Date(character.updated_at).toLocaleString('ja-JP')}</p>
  </div>
}

function DetailSkill({ label, value, prefix }: { label: string; value: number; prefix?: string }) { return <div className="detail-skill"><span>{prefix && <small>{prefix}</small>}{label}</span><b>{value}</b></div> }
function CardHeading({ icon, title }: { icon: 'spark' | 'book' | 'bag'; title: string }) { return <div className="card-heading"><Icon name={icon} /><h2>{title}</h2></div> }
