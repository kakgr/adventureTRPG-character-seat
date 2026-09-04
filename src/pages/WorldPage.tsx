import { WORLD_IMAGES } from '../constants/world'

export function WorldPage() {
  return <div className="page world-page world-overview-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="world-hero page-intro">
      <div><h1>世界</h1><p>魔法と機械が共存する、汚染に脅かされた近代ファンタジー世界。</p></div>
    </section>

    <section className="world-section world-overview-section" id="overview">
      <div className="world-section-heading"><h2>全体の世界観説明</h2></div>
      <p className="world-overview-copy">この世界は、<strong>魔法と機械技術が共存する近代ファンタジー世界</strong>です。<br /><br />文明水準は現実でいう1800〜1900年代頃。産業革命や蒸気機関、自動車の誕生、黒船来航の時代に近く、電気の代わりに魔力のようなエネルギーで動く不思議な機械と、古くから伝わる魔術が共存しています。<br /><br />一方で、世界は<strong>「汚染」</strong>と呼ばれる脅威にさらされています。汚染された土地では動植物が姿を消し、奇妙な美しさを持つ荒廃した風景へと変貌します。<br /><br />そして汚染は、<strong>異形</strong>という存在を通して人々にも直接影響を及ぼします。この世のどの生物にも似つかない異形たちは、この世界における神話生物や怪異のような存在であり、旅をする<strong>「渡り手」</strong>たちにさまざまな脅威や異変をもたらします。</p>
    </section>

  </div>
}
