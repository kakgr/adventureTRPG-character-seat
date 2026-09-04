import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { CharactersPage } from './pages/CharactersPage'
import { CharacterEditorPage } from './pages/CharacterEditorPage'
import { CharacterDetailPage } from './pages/CharacterDetailPage'
import { AppShell } from './components/AppShell'
import { useAuth } from './hooks/useAuth'
import { RulebookPage } from './pages/RulebookPage'
import { WorldPage } from './pages/WorldPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { ScenarioPage } from './pages/ScenarioPage'
import { ScenarioDetailPage } from './pages/ScenarioDetailPage'

function Protected({ children }: { children: React.ReactNode }) { const { user, loading, allowed } = useAuth(); if (loading || (user && allowed === null)) return <div className="loading-state">アクセスを確認しています…</div>; return user && allowed ? <AppShell>{children}</AppShell> : <Navigate to="/login" replace /> }
export default function App() { return <Routes><Route path="/" element={<Navigate to="/login" replace />} /><Route path="/login" element={<AuthPage />} /><Route path="/characters" element={<Protected><CharactersPage /></Protected>} /><Route path="/characters/new" element={<Protected><CharacterEditorPage /></Protected>} /><Route path="/characters/:id" element={<CharacterDetailPage publicView />} /><Route path="/characters/:id/edit" element={<Protected><CharacterEditorPage /></Protected>} /><Route path="/scenarios/:id" element={<Protected><ScenarioDetailPage /></Protected>} /><Route path="/scenarios" element={<Protected><ScenarioPage /></Protected>} /><Route path="/world/glossary" element={<Protected><GlossaryPage /></Protected>} /><Route path="/world" element={<Protected><WorldPage /></Protected>} /><Route path="/rulebooks" element={<Protected><RulebookPage /></Protected>} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes> }
