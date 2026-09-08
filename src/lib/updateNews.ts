export const CURRENT_VERSION = '1.0.0'
export const MAX_UPDATE_NEWS = 5

export type UpdateNewsItem = {
  version: string
  title: string
  description: string
}

export const updateNews: UpdateNewsItem[] = [
  {
    version: CURRENT_VERSION,
    title: '正式版へ移行しました',
    description: 'テスト版から完全版へ移行しました。用語帳に地理を追加し、サブシナリオ「街歩き」を追加しました。',
  },
  {
    version: '0.2.1',
    title: '更新ニュースを追加しました',
    description: '画面右上のメッセージマークから、更新内容を確認できるようになりました。',
  },
]

/** ニュースは新しい順に並べ、表示対象を最新5件に限定する。 */
export function getVisibleUpdateNews(items: UpdateNewsItem[]): UpdateNewsItem[] {
  return items.slice(0, MAX_UPDATE_NEWS)
}
