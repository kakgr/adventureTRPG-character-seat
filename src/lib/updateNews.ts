export const CURRENT_VERSION = '0.2.1'
export const MAX_UPDATE_NEWS = 5

export type UpdateNewsItem = {
  version: string
  title: string
  description: string
}

export const updateNews: UpdateNewsItem[] = [
  {
    version: CURRENT_VERSION,
    title: '更新ニュースを追加しました',
    description: '画面右上のメッセージマークから、更新内容を確認できるようになりました。',
  },
]

/** ニュースは新しい順に並べ、表示対象を最新5件に限定する。 */
export function getVisibleUpdateNews(items: UpdateNewsItem[]): UpdateNewsItem[] {
  return items.slice(0, MAX_UPDATE_NEWS)
}
