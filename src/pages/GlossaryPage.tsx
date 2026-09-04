import { WORLD_IMAGES } from '../constants/world'
import { worldGlossaryGenres } from './worldContent'

export function GlossaryPage() {
  return <div className="page world-page world-glossary-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="world-hero page-intro">
      <div><h1>用語帳</h1><p>世界観を構成する用語を、ジャンルごとに確認できます。</p></div>
    </section>

    <div className="glossary-genre-list">{worldGlossaryGenres.map((genre) => <section className="glossary-genre" id={`genre-${genre.id}`} key={genre.id}><div className="world-section-heading"><h2>{genre.title}</h2></div><div className="glossary-entry-list">{genre.entries.map((entry) => <article className="glossary-entry" id={`glossary-${entry.id}`} key={entry.id}><h3>{entry.term}</h3><p>{entry.description || '詳細はこれから追加します。'}</p></article>)}</div></section>)}</div>
  </div>
}
