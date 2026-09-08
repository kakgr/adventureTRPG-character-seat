import { useEffect, useRef, useState } from 'react'
import { CURRENT_VERSION, getVisibleUpdateNews, updateNews } from '../lib/updateNews'
import { Icon } from './Icons'

export function UpdateNews() {
  const [open, setOpen] = useState(false)
  const newsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (newsRef.current && !newsRef.current.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return <div className="update-news" ref={newsRef}>
    <button
      type="button"
      className="icon-button update-news-trigger"
      aria-label="更新ニュースを開く"
      aria-expanded={open}
      aria-controls="update-news-panel"
      title="更新ニュース"
      onClick={() => setOpen((isOpen) => !isOpen)}
    >
      <Icon name="message" />
    </button>
    {open && <section className="update-news-panel" id="update-news-panel" aria-label="更新ニュース">
      <div className="update-news-heading">
        <div>
          <span className="eyebrow">CHANGELOG</span>
          <h2>更新ニュース</h2>
        </div>
        <span className="update-news-version">v{CURRENT_VERSION}</span>
      </div>
      <div className="update-news-list">
        {getVisibleUpdateNews(updateNews).map((item) => <article className="update-news-item" key={`${item.version}-${item.title}`}>
          <span className="update-news-item-version">v{item.version}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>)}
      </div>
    </section>}
  </div>
}
