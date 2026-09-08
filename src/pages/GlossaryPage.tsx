import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { WORLD_IMAGES } from '../constants/world'
import { groupGlossaryEntries, worldGlossaryGenres, type WorldGlossaryEntry } from './worldContent'

const glossaryBackground = {
  backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})`,
}

function GlossaryEntries({ entries }: { entries: WorldGlossaryEntry[] }) {
  const subgroups: Array<{ title: string; entries: WorldGlossaryEntry[] }> = []
  for (const entry of entries) {
    const title = entry.subcategory ?? ''
    const subgroup = subgroups.find((candidate) => candidate.title === title)
    if (subgroup) subgroup.entries.push(entry)
    else subgroups.push({ title, entries: [entry] })
  }

  return <>
    {subgroups.map((subgroup) => <div className="glossary-subgroup" key={subgroup.title || 'uncategorized'}>
      {subgroup.title && <h3 className="glossary-subgroup-heading">{subgroup.title}</h3>}
      <div className="glossary-entry-list">
        {subgroup.entries.map((entry) => (
          <article className="glossary-entry" id={`glossary-${entry.id}`} key={entry.id}>
            <h3>{entry.term}</h3>
            <p>{entry.description || '詳細はこれから追加します。'}</p>
          </article>
        ))}
      </div>
    </div>)}
  </>
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
          <p>世界観を構成する「{genre.title}」の用語を、小分類ごとに確認できます。</p>
        </div>
      </section>

      <section className="glossary-genre glossary-genre-page">
        <div className="glossary-entry-groups">
          {groupGlossaryEntries(genre.entries).map((group, groupIndex) => (
            <section className="glossary-entry-group" key={group.title}>
              <div className="glossary-group-heading">
                <span className="section-number">{String(groupIndex + 1).padStart(2, '0')}</span>
                <h2>{group.title}</h2>
                <span className="glossary-group-count">{group.entries.length}語</span>
              </div>
              {group.entries.length ? <GlossaryEntries entries={group.entries} /> : <p className="glossary-group-empty">この小分類の用語はまだありません。</p>}
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
