import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, MAX_UPDATE_NEWS, getVisibleUpdateNews, updateNews } from './updateNews'

describe('update news', () => {
  it('現在のバージョンを1.0.0として公開する', () => {
    expect(CURRENT_VERSION).toBe('1.0.0')
  })

  it('最初のニュースで正式版への移行と主な追加内容を知らせる', () => {
    expect(updateNews[0]).toMatchObject({
      version: '1.0.0',
      title: '正式版へ移行しました',
      description: 'テスト版から完全版へ移行しました。用語帳に地理を追加し、サブシナリオ「街歩き」を追加しました。',
    })
  })

  it('表示するニュースを最新5件に絞る', () => {
    const news = Array.from({ length: MAX_UPDATE_NEWS + 1 }, (_, index) => ({
      version: `0.2.${MAX_UPDATE_NEWS - index}`,
      title: `ニュース${index + 1}`,
      description: '更新内容',
    }))

    expect(getVisibleUpdateNews(news)).toHaveLength(MAX_UPDATE_NEWS)
    expect(getVisibleUpdateNews(news)[0].title).toBe('ニュース1')
    expect(getVisibleUpdateNews(news).at(-1)?.title).toBe('ニュース5')
  })
})
