import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { StatusMessage } from '../components/StatusMessage'
import { WORLD_IMAGES } from '../constants/world'

export function AuthPage() {
  const { signInWithDiscord, signOut, configured, user, allowed, accessError } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const authError = params.get('error_description') || params.get('error')
    if (authError) {
      setError(authError)
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
    }
  }, [])
  useEffect(() => { if (user && allowed) navigate('/characters', { replace: true }) }, [allowed, navigate, user])
  const signIn = async () => { setError(''); setBusy(true); try { await signInWithDiscord() } catch (e) { setError(e instanceof Error ? e.message : 'Discord認証に失敗しました'); setBusy(false) } }
  const rejected = Boolean(user && allowed === false && !accessError)

  return <div className="auth-page">
    <div className="auth-art" style={{ backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--background) 28%, transparent), color-mix(in srgb, var(--background) 66%, transparent)), url(${WORLD_IMAGES.rainyCity})` }}><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-star">✦</div></div>
    <section className="auth-panel">
      <div className="auth-heading"><h1>adventureTRPG</h1></div>
      {!configured && <StatusMessage tone="error">Supabaseの環境変数が未設定です。<code>.env.local</code> を設定してください。</StatusMessage>}
      {error && <StatusMessage tone="error">{error}</StatusMessage>}
      {accessError && <StatusMessage tone="error">{accessError}</StatusMessage>}
      {rejected && <StatusMessage tone="error">このDiscordアカウントは許可リストに登録されていません。管理者にDiscordユーザーIDを伝えてください。</StatusMessage>}
      <div className="auth-form">{rejected ? <button type="button" className="button button-outline button-full" onClick={() => void signOut()}>ログアウトする</button> : <button type="button" className="button button-dark button-full discord-button" disabled={busy || !configured || Boolean(user)} onClick={() => void signIn()}><span className="discord-logo">☁</span>{busy ? 'Discordへ移動中…' : 'Discordでログインする →'}</button>}</div>
    </section>
  </div>
}
