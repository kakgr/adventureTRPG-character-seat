import { describe, expect, it } from "vitest";
import { CURRENT_VERSION, MAX_UPDATE_NEWS, getVisibleUpdateNews, updateNews } from "./updateNews";

describe("update news", () => {
  it("現在のバージョンを1.2.0として公開する", () => {
    expect(CURRENT_VERSION).toBe("1.2.0");
  });

  it("最初のニュースで1.2.0の更新内容を知らせる", () => {
    expect(updateNews[0]).toMatchObject({
      version: "1.2.0",
      title: "お金と装備品を更新しました",
      description:
        "・お金を統一の数値に変更しました。\n・ココフォリアで直接お金の数値を確認/変更できるようにしました。\n・装備品欄を追加し、武器欄を統合しました。\n・装備品欄から最大6つ装備を選んで装備する形になりました。",
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
