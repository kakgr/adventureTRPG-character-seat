import { Link, useParams } from 'react-router-dom'
import { WORLD_IMAGES } from '../constants/world'
import { scenarioSections } from './scenarioContent'

export function ScenarioDetailPage() {
  const { id } = useParams()
  const scenario = scenarioSections.flatMap((section) => section.scenarios).find((entry) => entry.id === id)

  if (!scenario) return <div className="page world-page scenario-detail-page"><div className="editor-top"><Link className="back-link" to="/scenarios">← シナリオ一覧へ戻る</Link></div><div className="empty-state"><h2>シナリオが見つかりません</h2><Link className="button button-outline" to="/scenarios">一覧へ戻る</Link></div></div>

  return <div className="page world-page scenario-detail-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <div className="editor-top"><Link className="back-link" to="/scenarios">← シナリオ一覧へ戻る</Link></div>
    <section className="scenario-detail-hero"><div className="scenario-detail-cover">{scenario.cover ? <img src={scenario.cover} alt="" decoding="async" width="240" height="320" /> : <span>表紙未設定</span>}</div><div><h1>{scenario.title}</h1><p className="scenario-synopsis">{scenario.synopsis}</p></div></section>
    <section className="scenario-info-panel"><h2>シナリオ情報</h2><dl className="scenario-info-list"><div><dt>ジャンル</dt><dd>{scenario.genre}</dd></div><div><dt>推定プレイ時間</dt><dd>{scenario.playTime}</dd></div><div><dt>推奨人数</dt><dd>{scenario.players}</dd></div><div><dt>推奨技能</dt><dd>{scenario.recommendedSkills.length ? scenario.recommendedSkills.join(' / ') : '未設定'}</dd></div></dl></section>
  </div>
}
