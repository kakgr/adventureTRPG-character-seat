import { describe, expect, it } from "vitest";
import { CURRENT_VERSION, MAX_UPDATE_NEWS, getVisibleUpdateNews, updateNews } from "./updateNews";

describe("update news", () => {
  it("現在のバージョンを1.1.1として公開する", () => {
    expect(CURRENT_VERSION).toBe("1.1.1");
  });

  it("最初のニュースでシークレットキーワードの追加を知らせる", () => {
    expect(updateNews[0]).toMatchObject({
      version: "1.1.1",
      title: "シークレットキーワードの追加",
      description: "ルールブックにシークレットキーワードを追加しました。",
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
