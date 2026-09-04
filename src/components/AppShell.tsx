import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Icon } from './Icons'
import { getDisplayName } from '../lib/userDisplay'
import { worldGlossaryGenres } from '../pages/worldContent'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [worldOpen, setWorldOpen] = useState(location.pathname.startsWith('/world'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isEditor = location.pathname.includes('/new') || location.pathname.includes('/edit')
  useEffect(() => { if (location.pathname.startsWith('/world')) setWorldOpen(true); setMobileMenuOpen(false) }, [location.pathname, location.hash])
  const handleSignOut = async () => { await signOut(); navigate('/login') }
  return <div className="app-frame">
    <header className="topbar">
      <Link to="/characters" className="brand"><span className="brand-mark">A</span><span>adventureTRPG</span></Link>
      <div className="topbar-right">
        {!isEditor && <Link className="button button-primary button-small" to="/characters/new"><Icon name="plus" /> 新しいシート</Link>}
        <span className="user-name">{getDisplayName(user?.user_metadata)}</span>
        <button className="icon-button" onClick={() => void handleSignOut()} title="ログアウト"><Icon name="logout" /></button>
        <button type="button" className="mobile-menu-toggle" aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'} aria-expanded={mobileMenuOpen} aria-controls="primary-navigation" onClick={() => setMobileMenuOpen((open) => !open)}><Icon name="menu" /></button>
      </div>
    </header>
    <div className="app-body"><aside id="primary-navigation" className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}><Link className={`nav-link ${location.pathname.startsWith('/characters') ? 'nav-link-active' : ''}`} to="/characters"><span className="nav-indicator" />キャラクター</Link><Link className={`nav-link ${location.pathname.startsWith('/scenarios') ? 'nav-link-active' : ''}`} to="/scenarios"><span className="nav-indicator" />シナリオ</Link><div className="world-nav-group"><button type="button" className={`nav-link world-nav-toggle ${location.pathname.startsWith('/world') ? 'nav-link-active' : ''}`} aria-expanded={worldOpen} aria-controls="world-submenu" onClick={() => setWorldOpen((open) => !open)}><span className="nav-indicator" />世界<span className={`world-toggle-mark ${worldOpen ? 'world-toggle-mark-open' : ''}`}>{worldOpen ? '−' : '+'}</span></button>{worldOpen && <div className="world-submenu" id="world-submenu"><Link className="world-submenu-link" to="/world">全体の世界観</Link><Link className="world-submenu-link world-submenu-label" to="/world/glossary">用語帳</Link>{worldGlossaryGenres.map((genre) => <Link className="world-submenu-link world-submenu-term" key={genre.id} to={`/world/glossary#genre-${genre.id}`}>{genre.title}</Link>)}</div>}</div><Link className={`nav-link ${location.pathname.startsWith('/rulebooks') ? 'nav-link-active' : ''}`} to="/rulebooks"><span className="nav-indicator" />ルールブック</Link></aside><main className="app-content">{children}</main></div>
  </div>
}
