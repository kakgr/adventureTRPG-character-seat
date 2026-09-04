export type WorldGlossaryEntry = {
  id: string
  term: string
  description: string
}

export type WorldGlossaryGenre = {
  id: string
  title: string
  entries: WorldGlossaryEntry[]
}

export const worldGlossaryGenres: WorldGlossaryGenre[] = [
  {
    id: 'magic-technology',
    title: '魔法・機械',
    entries: [
      { id: 'magic', term: '魔法', description: '' },
      { id: 'technology', term: '機械技術', description: '' },
    ],
  },
  {
    id: 'pollution-anomalies',
    title: '汚染・異形',
    entries: [
      { id: 'pollution', term: '汚染', description: '' },
      { id: 'anomalies', term: '異形', description: '' },
    ],
  },
  {
    id: 'people',
    title: '人物・役割',
    entries: [{ id: 'wanderers', term: '渡り手', description: '' }],
  },
]
