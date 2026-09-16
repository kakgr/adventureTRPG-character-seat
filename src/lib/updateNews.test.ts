import { describe, expect, it } from "vitest";
import { CURRENT_VERSION, MAX_UPDATE_NEWS, getVisibleUpdateNews, updateNews } from "./updateNews";

describe("update news", () => {
  it("現在のバージョンを1.3.0として公開する", () => {
    expect(CURRENT_VERSION).toBe("1.3.0");
  });

  it("最初のニュースで1.3.0の更新内容を知らせる", () => {
    expect(updateNews[0]).toMatchObject({
      version: "1.3.0",
      title: "戦闘補助サイト向けの仕様変更",
      description:
        "・受け流しの使用変更\n・盾追加\n・ID追加",
    });
  });

  it("表示するニュースを最新5件に絞る", () => {
    const news = Array.from({ length: MAX_UPDATE_NEWS + 1 }, (_, index) => ({
      version: `0.2.${MAX_UPDATE_NEWS - index}`,
      title: `ニュース${index + 1}`,
      description: "更新内容",
    }));

    expect(getVisibleUpdateNews(news)).toHaveLength(MAX_UPDATE_NEWS);
    expect(getVisibleUpdateNews(news)[0].title).toBe("ニュース1");
    expect(getVisibleUpdateNews(news).at(-1)?.title).toBe("ニュース5");
  });
});
