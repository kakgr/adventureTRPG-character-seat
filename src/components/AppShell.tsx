import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Icon } from './Icons'
import { getDisplayName } from '../lib/userDisplay'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isEditor = location.pathname.includes('/new') || location.pathname.includes('/edit')
  const handleSignOut = async () => { await signOut(); navigate('/login') }
  return <div className="app-frame">
    <header className="topbar">
      <Link to="/characters" className="brand"><span className="brand-mark">A</span><span>adventureTRPG</span></Link>
      <div className="topbar-right">
        {!isEditor && <Link className="button button-primary button-small" to="/characters/new"><Icon name="plus" /> 新しいシート</Link>}
        <span className="user-name">{getDisplayName(user?.user_metadata)}</span>
        <button className="icon-button" onClick={() => void handleSignOut()} title="ログアウト"><Icon name="logout" /></button>
      </div>
    </header>
    <div className="app-body"><aside className="sidebar"><Link className={`nav-link ${location.pathname.startsWith('/characters') ? 'nav-link-active' : ''}`} to="/characters"><span className="nav-indicator" />キャラクター</Link><Link className={`nav-link ${location.pathname.startsWith('/scenarios') ? 'nav-link-active' : ''}`} to="/scenarios"><span className="nav-indicator" />シナリオ</Link><Link className={`nav-link ${location.pathname.startsWith('/world') ? 'nav-link-active' : ''}`} to="/world"><span className="nav-indicator" />世界</Link><Link className={`nav-link ${location.pathname.startsWith('/rulebooks') ? 'nav-link-active' : ''}`} to="/rulebooks"><span className="nav-indicator" />ルールブック</Link></aside><main className="app-content">{children}</main></div>
  </div>
}
