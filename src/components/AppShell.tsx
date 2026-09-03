import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Icon } from './Icons'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isEditor = location.pathname.includes('/new') || location.pathname.includes('/edit')
  const handleSignOut = async () => { await signOut(); navigate('/login') }
  return <div className="app-frame">
    <header className="topbar">
      <Link to="/characters" className="brand"><span className="brand-mark">F</span><span>FOLIO</span></Link>
      <div className="topbar-right">
        {!isEditor && <Link className="button button-primary button-small" to="/characters/new"><Icon name="plus" /> 新しいシート</Link>}
        <span className="user-email">{user?.email}</span>
        <button className="icon-button" onClick={() => void handleSignOut()} title="ログアウト"><Icon name="logout" /></button>
      </div>
    </header>
    <div className="app-body"><aside className="sidebar"><div className="sidebar-label">WORKSPACE</div><Link className={`nav-link ${location.pathname.startsWith('/characters') ? 'nav-link-active' : ''}`} to="/characters"><span className="nav-indicator" />キャラクター</Link><div className="sidebar-rule" /><div className="sidebar-caption">PRIVATE ARCHIVE<br /><span>身内向けキャラクター管理</span></div></aside><main className="app-content">{children}</main></div>
    <footer className="footer">FOLIO <span>•</span> PRIVATE TABLETOP ARCHIVE</footer>
  </div>
}
