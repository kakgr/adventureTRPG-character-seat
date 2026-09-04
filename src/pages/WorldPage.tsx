import { WORLD_IMAGES } from '../constants/world'

export function WorldPage() {
  return <div className="page world-page world-overview-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 84%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="world-hero page-intro">
      <div><h1>世界</h1><p>魔術と機械が共存する、汚染に脅かされた近代ファンタジー世界。</p></div>
    </section>

    <section className="world-section world-overview-section" id="overview">
      <div className="world-section-heading"><h2>全体の世界観説明</h2></div>
      <p className="world-overview-copy">この世界は、<strong>魔術と機械が共存する近代ファンタジー世界</strong>です。<br /><br />文明水準は現実でいう1800〜1900年代頃。産業革命や蒸気機関、自動車の誕生、黒船来航の時代に近く、魔力で動く機械と、道具を介して魔力を制御する魔術が共存しています。<br /><br />一方で、世界は<strong>「汚染」</strong>と呼ばれる脅威にさらされています。汚染された土地では動植物を含む物質が変異し、濃度が高くなると危険域になります。<br /><br />そして汚染は、<strong>異形</strong>という存在を通して人々にも直接影響を及ぼします。異形たちは、旅をする<strong>「渡り手」</strong>たちにさまざまな脅威や異変をもたらします。</p>
    </section>

  </div>
}
