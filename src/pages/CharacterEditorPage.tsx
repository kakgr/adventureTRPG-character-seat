import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { COMMON_SKILL_GENRES, COMMON_SKILLS, DEFAULT_DATA, INITIAL_SKILL_POINTS, LUCK_MAX, LUCK_MIN, MAX_SKILL_BONUS, MAX_SKILL_VALUE, SKILL_GENRE_LABELS, SPECIALIZED_SKILL_GENRES, SPECIALIZED_SKILLS, STAT_LABELS } from '../constants/game'
import { characterService } from '../lib/characters'
import { clearCharacterDraft, loadCharacterDraft, saveCharacterDraft } from '../lib/characterDraft'
import { calculateDamageBonus, calculateHp, calculateMp, calculateSanity, isInitialDataValid, remainingSkillPoints, remainingStatPoints, rollLuck, totalSkillValue, updateSkillBonus, updateStat } from '../lib/characterRules'
import { useAuth } from '../hooks/useAuth'
import { Icon } from '../components/Icons'
import { StatusMessage } from '../components/StatusMessage'
import { NumericInput } from '../components/NumericInput'
import type { CharacterData, CharacterRecord, SpecializedSkillId, StatId } from '../types/character'
import { WORLD_IMAGES } from '../constants/world'

const freshData = (): CharacterData => {
  const data = structuredClone(DEFAULT_DATA) as CharacterData
  return { ...data, skills: { ...data.skills, luck: rollLuck() } }
}
const newId = () => crypto.randomUUID()
const getDraftStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null
  try { return window.localStorage } catch { return null }
}

export function CharacterEditorPage() {
  const { id } = useParams(); const isNew = !id; const { user } = useAuth(); const navigate = useNavigate()
  const draftId = isNew ? null : id ?? null
  const [character, setCharacter] = useState<CharacterRecord | null>(null); const [data, setData] = useState<CharacterData>(() => freshData()); const [name, setName] = useState(''); const [portraitFile, setPortraitFile] = useState<File | null>(null); const [loading, setLoading] = useState(!isNew); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState(''); const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!user) return
    const storage = getDraftStorage()
    if (isNew) {
      const draft = loadCharacterDraft(storage, user.id, draftId)
      if (draft) { setName(draft.name); setData(draft.data); setDirty(true) }
      return
    }
    if (!id) return
    void characterService.get(id, user.id).then((record) => {
      const draft = loadCharacterDraft(storage, user.id, draftId)
      setCharacter(record)
      setName(draft?.name ?? record.name)
      setData(draft?.data ?? { ...record.data, statBonuses: { ...DEFAULT_DATA.statBonuses, ...record.data.statBonuses } })
      if (draft) setDirty(true)
    }).catch((e) => setError(e instanceof Error ? e.message : 'キャラクターを読み込めませんでした')).finally(() => setLoading(false))
  }, [id, isNew, user])
  useEffect(() => {
    if (!dirty || !user) return
    saveCharacterDraft(getDraftStorage(), user.id, draftId, name, data)
  }, [data, dirty, draftId, name, user])
  useEffect(() => {
    const persistDraft = () => {
      if (dirty && user && !saving) saveCharacterDraft(getDraftStorage(), user.id, draftId, name, data)
    }
    const beforeUnload = (event: BeforeUnloadEvent) => {
      persistDraft()
      if (dirty && !saving) { event.preventDefault(); event.returnValue = '' }
    }
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') persistDraft() }
    window.addEventListener('beforeunload', beforeUnload)
    window.addEventListener('pagehide', persistDraft)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      persistDraft()
      window.removeEventListener('beforeunload', beforeUnload)
      window.removeEventListener('pagehide', persistDraft)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [data, dirty, draftId, name, saving, user])
  const statRemaining = remainingStatPoints(data.stats); const skillRemaining = remainingSkillPoints(data.skills)
  const canSave = name.trim().length > 0 && (!isNew || isInitialDataValid(data)) && !saving

  const update = (next: CharacterData) => { setData(next); setDirty(true); setSaved(false) }
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setSaved(false); if (!canSave || !user) return; setSaving(true)
    try {
      if (isNew) {
        const created = await characterService.create(user.id, name.trim(), data)
        let portraitPath: string | null = null
        if (portraitFile) portraitPath = await characterService.uploadPortrait(user.id, created.id, portraitFile)
        if (portraitPath) await characterService.update(created.id, user.id, name.trim(), data, portraitPath)
        clearCharacterDraft(getDraftStorage(), user.id, null)
        navigate(`/characters/${created.id}`, { replace: true })
      } else if (id) {
        const previousPortraitPath = character?.portrait_path ?? null
        let portraitPath = previousPortraitPath
        if (portraitFile) portraitPath = await characterService.uploadPortrait(user.id, id, portraitFile)
        await characterService.update(id, user.id, name.trim(), data, portraitPath)
        if (portraitFile && previousPortraitPath && previousPortraitPath !== portraitPath) await characterService.removePortrait(previousPortraitPath)
        clearCharacterDraft(getDraftStorage(), user.id, id)
        setPortraitFile(null); setDirty(false); setSaved(true)
      }
    } catch (e) { setError(e instanceof Error ? e.message : '保存に失敗しました') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="loading-state">キャラクターを読み込んでいます…</div>
  return <div className="page page-editor world-page world-harbor" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 74%, transparent), color-mix(in srgb, var(--background) 88%, transparent)), url(${WORLD_IMAGES.harborCity})` }}>
    <div className="editor-top"><Link to={isNew ? '/characters' : `/characters/${id}`} className="back-link"><Icon name="back" /> 一覧に戻る</Link><div className="save-state">{saving ? '保存中…' : saved ? <><Icon name="check" /> 保存しました</> : dirty ? '未保存の変更（下書き保存済み）' : '変更を保存していません'}</div></div>
    <section className="editor-heading"><h1>{isNew ? '新しいキャラクター' : 'キャラクターを編集'}</h1><div className="resource-pills"><span>能力 <b>{Math.max(0, statRemaining)}</b> / 18</span><span>技能 <b>{Math.max(0, skillRemaining)}</b> / {INITIAL_SKILL_POINTS}</span></div></section>
    {error && <StatusMessage tone="error">{error}</StatusMessage>}
    <form onSubmit={save} className="editor-form">
      <section className="form-section portrait-section"><SectionTitle title="立ち絵"/><PortraitEditor character={character} file={portraitFile} onChange={(file) => { if (file && file.size > 5 * 1024 * 1024) { setError('立ち絵は5MB以下の画像を選択してください。'); return } setError(''); setPortraitFile(file); setDirty(true) }} /></section>
      <section className="form-section"><SectionTitle title="基本情報"/><div className="basic-grid"><label className="field field-wide">名前 *<input required value={name} onChange={(e) => { setName(e.target.value); setDirty(true) }} placeholder="例：アリア・ノクス" /></label><label className="field">読み方<input value={data.profile.reading} onChange={(e) => update({ ...data, profile: { ...data.profile, reading: e.target.value } })} placeholder="例：ありあ・のくす" /></label><label className="field">年齢<input type="number" min="0" max="999" value={data.profile.age ?? ''} onChange={(e) => update({ ...data, profile: { ...data.profile, age: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) } })} placeholder="—" /></label><label className="field">性別<input value={data.profile.gender} onChange={(e) => update({ ...data, profile: { ...data.profile, gender: e.target.value } })} placeholder="自由記述" /></label><label className="field">職業<input value={data.profile.occupation} onChange={(e) => update({ ...data, profile: { ...data.profile, occupation: e.target.value } })} placeholder="例：遺跡調査員" /></label><label className="field field-wide">一言説明<input value={data.profile.summary} onChange={(e) => update({ ...data, profile: { ...data.profile, summary: e.target.value } })} placeholder="このキャラクターを一言で表すと？" /></label><label className="field field-full">プロフィール<textarea rows={5} value={data.profile.description} onChange={(e) => update({ ...data, profile: { ...data.profile, description: e.target.value } })} placeholder="生い立ち、性格、目標など自由に記録できます。" /></label></div></section>
      <section className="form-section"><SectionTitle title="能力値"/><div className="stat-layout"><div className="stat-list">{(Object.keys(STAT_LABELS) as StatId[]).map((statId) => <StatRow key={statId} id={statId} value={data.stats[statId]} bonus={data.statBonuses?.[statId] ?? 0} onChange={(delta) => update({ ...data, stats: updateStat(data.stats, statId, delta, isNew) })} onBonusChange={(bonus) => update({ ...data, statBonuses: { ...data.statBonuses, [statId]: bonus } })} />)}</div><div className="derived-card"><div className="derived-row"><span>HP</span><strong>{calculateHp(data.stats, data.statBonuses)}</strong></div><div className="derived-row"><span>MP</span><strong>{calculateMp(data.stats, data.statBonuses)}</strong></div><div className="derived-row"><span>正気度</span><strong>{calculateSanity(data.stats, data.statBonuses)}</strong></div><div className="derived-row"><span>ダメージボーナス</span><strong>{calculateDamageBonus(data.stats, data.statBonuses)}</strong></div><div className={`points-left ${statRemaining === 0 ? 'points-done' : ''}`}><span>残り能力ポイント</span><b>{Math.max(0, statRemaining)} <small>/ 18</small></b></div></div></div></section>
      <section className="form-section"><SectionTitle title="技能"/><LuckField value={data.skills.luck} onChange={(luck) => update({ ...data, skills: { ...data.skills, luck } })} /><div className="skill-total"><span>残り技能ポイント</span><b className={skillRemaining < 0 ? 'negative' : ''}>{skillRemaining} <small>/ {INITIAL_SKILL_POINTS}</small></b></div><SkillTable data={data} update={update} /></section>
      <section className="form-section"><SectionTitle title="持ち物"/><ItemsEditor data={data} update={update} /></section>
      <section className="form-section compact-section"><SectionTitle title="通過シナリオ"/><div className="experience-grid"><label className="field field-full"><textarea aria-label="通過シナリオ" rows={8} value={data.experience.notes ?? ''} onChange={(e) => update({ ...data, experience: { ...data.experience, notes: e.target.value } })} /></label></div></section>
      <section className="form-section"><SectionTitle title="タグ"/><TagsEditor data={data} update={update} /></section>
      <div className="form-actions"><Link to={isNew ? '/characters' : `/characters/${id}`} className="button button-ghost">キャンセル</Link><button className="button button-dark" disabled={!canSave}>{saving ? '保存中…' : 'キャラクターを保存する'} <Icon name="arrow" /></button></div>
      {isNew && !isInitialDataValid(data) && <p className="form-hint">能力ポイントをすべて割り振ると保存できます。</p>}
    </form>
  </div>
}

function SectionTitle({ title }: { title: string }) { return <div className="section-title"><h2>{title}</h2></div> }
function LuckField({ value, onChange }: { value: number; onChange: (value: number) => void }) { return <div className="luck-field"><div><strong>幸運</strong><p>技能ポイントを使わず、{LUCK_MIN}〜{LUCK_MAX}の乱数で決定します。</p></div><output aria-label="幸運の値">{value}</output><button type="button" className="button button-outline button-small" onClick={() => onChange(rollLuck())}>振り直す</button></div> }
function StatRow({ id, value, bonus, onChange, onBonusChange }: { id: StatId; value: number; bonus: number; onChange: (delta: number) => void; onBonusChange: (value: number) => void }) { return <div className="stat-row"><span className="stat-label">{STAT_LABELS[id]}</span><div className="stat-cell"><small>初期値</small><div className="stat-stepper"><button type="button" className="stepper-button" onClick={() => onChange(-1)} disabled={value <= 1}><Icon name="minus" /></button><output>{value}</output><button type="button" className="stepper-button" onClick={() => onChange(1)}><Icon name="plus" /></button></div></div><div className="stat-cell stat-bonus-cell"><small>追加値</small><NumericInput aria-label={`${STAT_LABELS[id]}追加値`} min={0} max={100} value={bonus} onChange={onBonusChange} /></div><div className="stat-cell stat-total-cell"><small>合計</small><output>{value + bonus}</output></div></div> }

type SkillTableRow = { key: string; genre: keyof typeof SKILL_GENRE_LABELS; category: string; label: string; hint?: string; value: number; bonus: number; editableLabel: boolean; onLabelChange?: (value: string) => void; onValueChange: (value: number) => void; onBonusChange: (value: number) => void; onDelete?: () => void }

function SkillTable({ data, update }: { data: CharacterData; update: (next: CharacterData) => void }) {
  const rows: SkillTableRow[] = [
    ...COMMON_SKILLS.map((skill) => ({ genre: COMMON_SKILL_GENRES[skill.id], key: skill.id, category: '通常', label: skill.label, hint: skill.hint, value: data.skills.common[skill.id], bonus: data.skills.bonuses.common[skill.id], editableLabel: false, onValueChange: (value: number) => updateSkill(data, update, value, data.skills.common[skill.id], (nextSkillValue) => ({ ...data, skills: { ...data.skills, common: { ...data.skills.common, [skill.id]: nextSkillValue } } })), onBonusChange: (value: number) => update({ ...data, skills: { ...data.skills, bonuses: { ...data.skills.bonuses, common: { ...data.skills.bonuses.common, [skill.id]: updateSkillBonus(value) } } } }) })),
    ...SPECIALIZED_SKILLS.flatMap((group) => data.skills[group.id].map((skill) => ({ genre: SPECIALIZED_SKILL_GENRES[group.id], key: skill.id, category: group.label, label: skill.specialty, value: skill.value, bonus: data.skills.bonuses[group.id][skill.id] ?? 0, editableLabel: true, onLabelChange: (label: string) => update({ ...data, skills: { ...data.skills, [group.id]: data.skills[group.id].map((item) => item.id === skill.id ? { ...item, specialty: label } : item) } }), onValueChange: (value: number) => updateSkill(data, update, value, skill.value, (nextSkillValue) => ({ ...data, skills: { ...data.skills, [group.id]: data.skills[group.id].map((item) => item.id === skill.id ? { ...item, value: nextSkillValue } : item) } })), onBonusChange: (value: number) => update({ ...data, skills: { ...data.skills, bonuses: { ...data.skills.bonuses, [group.id]: { ...data.skills.bonuses[group.id], [skill.id]: updateSkillBonus(value) } } } }), onDelete: () => update({ ...data, skills: { ...data.skills, [group.id]: data.skills[group.id].filter((item) => item.id !== skill.id) } }) }))),
    ...data.skills.custom.map((skill) => ({ genre: 'custom' as const, key: skill.id, category: 'カスタム', label: skill.name, value: skill.value, bonus: data.skills.bonuses.custom[skill.id] ?? 0, editableLabel: true, onLabelChange: (label: string) => update({ ...data, skills: { ...data.skills, custom: data.skills.custom.map((item) => item.id === skill.id ? { ...item, name: label } : item) } }), onValueChange: (value: number) => updateSkill(data, update, value, skill.value, (nextSkillValue) => ({ ...data, skills: { ...data.skills, custom: data.skills.custom.map((item) => item.id === skill.id ? { ...item, value: nextSkillValue } : item) } })), onBonusChange: (value: number) => update({ ...data, skills: { ...data.skills, bonuses: { ...data.skills.bonuses, custom: { ...data.skills.bonuses.custom, [skill.id]: updateSkillBonus(value) } } } }), onDelete: () => update({ ...data, skills: { ...data.skills, custom: data.skills.custom.filter((item) => item.id !== skill.id) } }) })),
  ]
  const groupedRows = (Object.keys(SKILL_GENRE_LABELS) as Array<keyof typeof SKILL_GENRE_LABELS>).map((genre) => ({ title: SKILL_GENRE_LABELS[genre], rows: rows.filter((row) => row.genre === genre) })).filter(({ rows: genreRows }) => genreRows.length > 0)
  const addSpecialized = (id: SpecializedSkillId) => { const skillId = newId(); update({ ...data, skills: { ...data.skills, [id]: [...data.skills[id], { id: skillId, specialty: '', value: 0 }], bonuses: { ...data.skills.bonuses, [id]: { ...data.skills.bonuses[id], [skillId]: 0 } } } }) }
  const addCustom = () => { const skillId = newId(); update({ ...data, skills: { ...data.skills, custom: [...data.skills.custom, { id: skillId, name: '', value: 0 }], bonuses: { ...data.skills.bonuses, custom: { ...data.skills.bonuses.custom, [skillId]: 0 } } } }) }
  return <div className="skill-table-panel"><div className="skill-table-wrap"><table className="skill-table"><thead><tr><th>区分</th><th>技能名</th><th>初期値</th><th>追加値</th><th>合計</th><th aria-label="操作" /></tr></thead>{groupedRows.map((group) => <SkillTableBody key={group.title} title={group.title} rows={group.rows} />)}</table></div><div className="skill-add-actions">{SPECIALIZED_SKILLS.map((group) => <button type="button" className="add-link" key={group.id} onClick={() => addSpecialized(group.id)}><Icon name="plus" />{group.label}を追加</button>)}<button type="button" className="add-link" onClick={addCustom}><Icon name="plus" />カスタム技能を追加</button></div></div>
}

function SkillTableBody({ title, rows }: { title: string; rows: SkillTableRow[] }) { return <tbody><tr className="skill-genre-row"><th colSpan={6}>{title}</th></tr>{rows.map((row) => <tr key={row.key}><td><span className="skill-category-chip">{row.category}</span></td><td>{row.editableLabel ? <input aria-label={`${row.category}技能名`} value={row.label} onChange={(event) => row.onLabelChange?.(event.target.value)} placeholder="技能名" /> : <span className="skill-label-with-hint"><b className="skill-name">{row.label}</b>{row.hint && <small>（{row.hint}）</small>}</span>}</td><td><div className="skill-value-input"><NumericInput aria-label={`${row.label || row.category}初期値`} min={0} max={MAX_SKILL_VALUE} value={row.value} onChange={row.onValueChange} /><span>/ 100</span></div></td><td><NumericInput aria-label={`${row.label || row.category}追加値`} min={0} max={MAX_SKILL_BONUS} value={row.bonus} onChange={row.onBonusChange} /></td><td><output className="skill-total-value">{totalSkillValue(row.value, row.bonus)}</output></td><td>{row.onDelete && <button type="button" className="text-button danger" onClick={row.onDelete}><Icon name="trash" />削除</button>}</td></tr>)}</tbody> }

function updateSkill(data: CharacterData, update: (next: CharacterData) => void, value: number, current: number, build: (nextValue: number) => CharacterData) { const nextValue = Math.max(0, Math.min(MAX_SKILL_VALUE, Math.round(Number.isFinite(value) ? value : 0))); if (nextValue > current && remainingSkillPoints(data.skills) < nextValue - current) return; update(build(nextValue)) }

function ItemsEditor({ data, update }: { data: CharacterData; update: (next: CharacterData) => void }) { const add = () => update({ ...data, items: [...data.items, { id: newId(), name: '', quantity: 1, description: '' }] }); return <div className="items-editor">{data.items.length === 0 && <p className="muted-copy">まだ持ち物がありません。</p>}{data.items.map((item) => <div className="item-row" key={item.id}><input aria-label="持ち物名" value={item.name} onChange={(e) => update({ ...data, items: data.items.map((i) => i.id === item.id ? { ...i, name: e.target.value } : i) })} placeholder="アイテム名" /><input aria-label="個数" type="number" min="1" value={item.quantity} onChange={(e) => update({ ...data, items: data.items.map((i) => i.id === item.id ? { ...i, quantity: Math.max(1, Number(e.target.value)) } : i) })} /><textarea aria-label="持ち物の説明" rows={2} value={item.description} onChange={(e) => update({ ...data, items: data.items.map((i) => i.id === item.id ? { ...i, description: e.target.value } : i) })} placeholder="備考" /><button type="button" className="icon-button danger-icon" onClick={() => update({ ...data, items: data.items.filter((i) => i.id !== item.id) })}><Icon name="trash" /></button></div>)}<button type="button" className="add-link" onClick={add}><Icon name="plus" /> 持ち物を追加</button></div> }
function TagsEditor({ data, update }: { data: CharacterData; update: (next: CharacterData) => void }) { const [value, setValue] = useState(''); const add = () => { const tag = value.trim(); if (!tag || data.tags.includes(tag)) return; update({ ...data, tags: [...data.tags, tag] }); setValue('') }; return <div className="tags-editor"><div className="tag-input"><input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} placeholder="タグを入力してEnter" /><button type="button" className="button button-outline" onClick={add}>追加</button></div><div className="tag-row large-tags">{data.tags.map((tag) => <button type="button" className="tag removable-tag" key={tag} onClick={() => update({ ...data, tags: data.tags.filter((item) => item !== tag) })}>{tag} ×</button>)}</div></div> }
function PortraitEditor({ character, file, onChange }: { character: CharacterRecord | null; file: File | null; onChange: (file: File | null) => void }) { const preview = file ? URL.createObjectURL(file) : character?.portrait_url; return <div className="portrait-editor"><div className="portrait-preview">{preview ? <img src={preview} alt="立ち絵プレビュー" /> : <span>✦</span>}</div><div><label className="upload-button"><Icon name="upload" /> {file ? '画像を変更' : '画像を選択'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => onChange(e.target.files?.[0] ?? null)} /></label>{file && <button type="button" className="text-button danger" onClick={() => onChange(null)}>選択を取り消す</button>}</div></div> }
