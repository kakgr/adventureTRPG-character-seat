import { describe, expect, it } from 'vitest'
import { worldGlossaryGenres } from './worldContent'

describe('world content', () => {
  it('groups the empty glossary slots by genre', () => {
    expect(worldGlossaryGenres.map((genre) => genre.id)).toEqual(['magic-technology', 'pollution-anomalies', 'people'])
    expect(worldGlossaryGenres.map((genre) => genre.title)).toEqual(['魔法・機械', '汚染・異形', '人物・役割'])
    expect(worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.term)).toEqual(['魔法', '機械技術', '汚染', '異形', '渡り手'])
    expect(worldGlossaryGenres.flatMap((genre) => genre.entries).every((entry) => entry.description === '')).toBe(true)
  })
})
