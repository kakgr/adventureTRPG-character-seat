import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { WORLD_IMAGES } from '../constants/world'
import { worldGlossaryGenres } from './worldContent'

const glossaryBackground = {
  backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})`,
}

export function GlossaryIndexPage() {
  return (
    <div className="page world-page world-glossary-page" style={glossaryBackground}>
      <section className="world-hero page-intro">
        <div>
          <h1>用語帳</h1>
          <p>世界観を構成する用語を、ジャンルごとに確認できます。</p>
        </div>
      </section>

      <div className="glossary-index-list">
        {worldGlossaryGenres.map((genre) => (
          <Link className="glossary-index-link" to={`/world/glossary/${genre.id}`} key={genre.id}>
            <span>
              <strong>{genre.title}</strong>
              <small>{genre.entries.length}語</small>
            </span>
            <Icon name="arrow" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function GlossaryPage() {
  const { genreId } = useParams()
  const genre = worldGlossaryGenres.find((candidate) => candidate.id === genreId)

  if (!genre) {
    return (
      <div className="page world-page world-glossary-page" style={glossaryBackground}>
        <section className="world-hero page-intro">
          <div>
            <h1>用語帳</h1>
            <p>指定されたジャンルは見つかりませんでした。</p>
            <Link className="back-link" to="/world/glossary">用語帳のジャンル一覧へ</Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page world-page world-glossary-page" style={glossaryBackground}>
      <section className="world-hero page-intro">
        <div>
          <Link className="back-link" to="/world/glossary">← 用語帳のジャンル一覧</Link>
          <h1>{genre.title}</h1>
          <p>世界観を構成する「{genre.title}」の用語を確認できます。</p>
        </div>
      </section>

      <section className="glossary-genre glossary-genre-page">
        <div className="glossary-entry-list">
          {genre.entries.map((entry) => (
            <article className="glossary-entry" id={`glossary-${entry.id}`} key={entry.id}>
              <h2>{entry.term}</h2>
              <p>{entry.description || '詳細はこれから追加します。'}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
