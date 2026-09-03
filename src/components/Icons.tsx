export function Icon({ name }: { name: 'arrow' | 'back' | 'check' | 'plus' | 'minus' | 'trash' | 'edit' | 'logout' | 'upload' | 'book' | 'bag' | 'spark' }) {
  const paths: Record<string, string> = {
    arrow: 'M5 12h14m-6-6 6 6-6 6', back: 'M19 12H5m6 6-6-6 6-6', check: 'm5 12 4 4L19 6', plus: 'M12 5v14m-7-7h14', minus: 'M5 12h14', trash: 'm6 6 12 12M18 6 6 18', edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z', logout: 'M10 17l5-5-5-5m5 5H3m12-7V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2', upload: 'M12 16V4m0 0L8 8m4-4 4 4M4 16v4h16v-4', book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V5a2 2 0 0 1 2.5-2.45L20 5v12M4 19.5A2.5 2.5 0 0 0 6.5 22H20V5', bag: 'M6 8h12l1 13H5L6 8Zm3 0a3 3 0 0 1 6 0', spark: 'm12 3-1.3 5.7L5 10l5.7 1.3L12 17l1.3-5.7L19 10l-5.7-1.3L12 3Z',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon"><path d={paths[name]} /></svg>
}
