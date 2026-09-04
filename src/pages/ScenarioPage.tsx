import { Link } from 'react-router-dom'
import { WORLD_IMAGES } from '../constants/world'
import { scenarioSections } from './scenarioContent'

export function ScenarioPage() {
  return <div className="page world-page scenario-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="scenario-hero page-intro"><div><h1>シナリオ</h1><p>シナリオを区分ごとに並べています。表紙を選ぶと、シナリオ情報を確認できます。</p></div></section>

    <div className="scenario-section-list">{scenarioSections.map((section) => <section className="scenario-section" id={section.id} key={section.id}><div className="scenario-section-heading"><h2>{section.title}</h2><span>{section.scenarios.length}件</span></div>{section.scenarios.length === 0 ? <div className="scenario-empty"><span className="scenario-empty-book" aria-hidden="true" /><p>この区分のシナリオはまだありません。</p></div> : <div className="scenario-book-grid">{section.scenarios.map((scenario) => <ScenarioBook scenario={scenario} key={scenario.id} />)}</div>}</section>)}</div>
  </div>
}

function ScenarioBook({ scenario }: { scenario: (typeof scenarioSections)[number]['scenarios'][number] }) {
  return <Link className="scenario-book" to={`/scenarios/${scenario.id}`}><div className="scenario-cover">{scenario.cover ? <img src={scenario.cover} alt="" loading="lazy" decoding="async" width="240" height="320" /> : <span>表紙未設定</span>}</div><h3>{scenario.title}</h3></Link>
}
