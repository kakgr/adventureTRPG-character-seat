export function StatusMessage({ tone, children }: { tone: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  return <div className={`status-message status-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>
}
