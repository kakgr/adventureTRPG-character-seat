import { WORLD_IMAGES } from '../constants/world'
import { commonSkills, insanityTable, rulebookSections, skillRules, specializedSkills, statDefinitions } from './rulebookContent'

export function RulebookPage() {
  return <div className="page world-page rulebook-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 78%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="rulebook-hero page-intro">
      <div><span className="eyebrow">RULEBOOK / EDITION 01</span><h1>ルールブック</h1><p>adventureTRPG 第1版の基本ルールを一覧で確認できます。</p></div>
      <div className="rulebook-stamp"><strong>01</strong><span>FIRST EDITION</span></div>
    </section>

    <div className="rulebook-layout">
      <nav className="rulebook-nav" aria-label="ルールブック目次">
        <span className="rulebook-nav-label">CONTENTS</span>
        {rulebookSections.map((section) => <a href={`#${section.id}`} key={section.id}><span>{section.kicker.split(' / ')[0]}</span>{section.label}</a>)}
      </nav>

      <main className="rulebook-content">
        <RuleSection id="overview" kicker="01 / OVERVIEW" title="基本方針">
          <div className="rulebook-columns">
            <RuleCard title="判定"><p>技能判定はD100で行います。技能値以下なら成功です。</p><p>能力値は、通常の技能判定には基本的に加えません。</p></RuleCard>
            <RuleCard title="裁定"><p>ルールにない状況は、GMがその場で判断します。必要に応じて参加者と相談できます。</p><p>行動の提案は、状況に合う技能や方法を説明して判定につなげます。</p></RuleCard>
          </div>
        </RuleSection>

        <RuleSection id="character" kicker="02 / CHARACTER" title="能力値とキャラクター作成">
          <p className="rulebook-lead">初期作成では、能力値に18ポイントを自由に割り振ります。能力値に上限はなく、成長によって上昇します。</p>
          <div className="stat-rule-grid">{statDefinitions.map((stat) => <div className="stat-rule-card" key={stat.name}><span>{stat.effect}</span><strong>{stat.name}</strong></div>)}</div>
          <div className="rulebook-columns">
            <RuleCard title="派生値"><ul><li>HP ＝ 体力 × 3</li><li>MP ＝ 魔力 × 3</li><li>正気度 ＝ 精神力 × 3</li><li>ダメージボーナス ＝ ⌊(体力＋筋力) / 6⌋</li></ul></RuleCard>
            <RuleCard title="作成時の注意"><ul><li>初期能力値はすべて1から開始</li><li>能力値ポイント18点を使い切る</li><li>能力値の成長上限は設けない</li><li>能力値は基本的に判定の修正値にしない</li></ul></RuleCard>
          </div>
        </RuleSection>

        <RuleSection id="checks" kicker="03 / CHECKS" title="判定">
          <div className="check-rule-grid">
            <RuleCard title="技能判定"><div className="rulebook-number"><strong>D100</strong><span>{skillRules.success}</span></div><p>技能値の上限は{skillRules.maximum}。初期値は{skillRules.initial}です。技能ポイント{skillRules.points}点を、各技能0〜100の範囲で自由に配分します。</p><div className="critical-line"><span>CRITICAL {skillRules.critical}</span><span>FUMBLE {skillRules.fumble}</span></div><p className="rulebook-note">クリティカル・ファンブルの具体的な効果は、各自の判断に委ねます。</p></RuleCard>
            <RuleCard title="対抗判定"><p>対抗判定は技能ではなく、基本能力値を使います。</p><p>双方の能力値の差1点につき、成功率を±5%します。</p><p>能力値が同じなら基準値は50%です。</p></RuleCard>
          </div>
          <RuleCard title="組み付け"><p>組み付きを仕掛ける側の筋力と、対象の筋力の差で判定します。</p><div className="formula">50% ＋（仕掛ける側の筋力 − 対象側の筋力）× 5%</div><p>効果は主に1ターンまたは1分程度。継続する場合は再度判定します。</p></RuleCard>
        </RuleSection>

        <RuleSection id="combat" kicker="04 / COMBAT" title="戦闘">
          <div className="formation-grid">{['前衛', '中衛', '後衛'].map((position, index) => <div className="formation-card" key={position}><span>0{index + 1}</span><strong>{position}</strong><small>{index === 0 ? '近接攻撃' : index === 1 ? '遠距離 −10%' : '遠距離 −20%'}</small></div>)}</div>
          <div className="rulebook-columns">
            <RuleCard title="配置と行動順"><ul><li>味方・敵ともに前衛／中衛／後衛へ配置</li><li>開始時に自分の配置を宣言</li><li>味方・敵をまとめて速力の速い順に行動</li><li>同速なら筋力、場所に応じた技能、RPで決定</li><li>配置変更は1ターンを消費</li></ul></RuleCard>
            <RuleCard title="ターン"><ul><li>自分のターンの最初に行動を宣言</li><li>攻撃、回避専念、回復など自由に選択</li><li>攻撃以外の行動はGM裁量</li><li>戦闘終了まで各ターンを繰り返す</li></ul></RuleCard>
          </div>
          <RuleCard title="攻撃の流れ"><ol><li>攻撃側が技能判定</li><li>対象が回避または防御</li><li>攻撃が通ればダメージ処理</li></ol><p>近接攻撃は前衛からのみ。前衛に敵がいなければ中衛、さらにいなければ後衛へ届きます。最も近い位置の敵を対象にします。</p><p>遠距離攻撃は中衛で命中率−10%、後衛で−20%。敵側にも同じ補正を適用します。</p><p>回避は回避技能。防御はキャラクターシートの防御数値を参照します。ダメージは武器・魔法に記載された計算方法、回復はキャラクターシートを参照します。</p></RuleCard>
        </RuleSection>

        <RuleSection id="resources" kicker="05 / RESOURCES" title="リソース">
          <div className="resource-rule-grid"><RuleCard title="HP"><div className="formula">体力 × 3</div><p>最大値と現在値を管理します。0になると死亡・ロストです。</p></RuleCard><RuleCard title="MP"><div className="formula">魔力 × 3</div><p>最大値と現在値を管理します。0になっても、何らかの手段で回復できます。</p></RuleCard><RuleCard title="正気度"><div className="formula">精神力 × 3</div><p>最大値と現在値を管理します。精神を壊すようなイベントで判定します。</p></RuleCard></div>
          <div className="rulebook-callout"><strong>正気度の成功率・減少量・回復方法はシナリオ指定。</strong><span>正気度が0になると発狂します。発狂内容はその場のGM判断です。</span></div>
          <details className="insanity-details"><summary>発狂表（任意使用）</summary><p className="rulebook-note">迷ったときだけD20。効果の強さ・継続時間・終了条件はGM判断です。</p><div className="insanity-table">{insanityTable.map((entry) => <div key={entry.roll}><b>{entry.roll}</b><span>{entry.text}</span></div>)}</div></details>
        </RuleSection>

        <RuleSection id="growth" kicker="06 / GROWTH" title="成長">
          <div className="growth-grid"><RuleCard title="きっかけ"><p>クリティカルを出したとき、または成長につながるイベントが起きたとき、GM判断で成長します。</p></RuleCard><RuleCard title="目安"><div className="growth-value"><strong>+1</strong><span>能力値 / 1シナリオ</span></div><div className="growth-value"><strong>+3</strong><span>技能値の合計 / 1シナリオ程度</span></div></RuleCard></div>
          <p className="rulebook-note">成長の有無・タイミング・具体的な配分はGMが判断します。</p>
        </RuleSection>

        <RuleSection id="special" kicker="07 / SPECIAL" title="魔術・特殊技能">
          <div className="rulebook-columns"><RuleCard title="魔術"><p>魔術は基本的に、杖や本などの道具を使って発動します。</p><p>魔術ごとの効果・消費・判定方法は、シナリオや魔術の記載を参照します。</p></RuleCard><RuleCard title="特殊技能"><p>特殊技能の使用方法や効果は、GMと相談して決めます。</p><p>専門知識、武器、射撃・投擲、魔術なども、必要に応じて個別に定義します。</p></RuleCard></div>
          <div className="skill-catalog-rule"><span className="rulebook-nav-label">COMMON SKILLS</span><p>{commonSkills.join(' / ')}</p><span className="rulebook-nav-label">SPECIALIZED SKILLS</span><p>{specializedSkills.join(' / ')} / カスタム技能</p></div>
        </RuleSection>

        <RuleSection id="gm" kicker="08 / GM" title="GM裁定">
          <div className="rulebook-callout"><strong>未定義の状況はGMが判断します。</strong><span>判断に迷う場合は、その場で参加者と相談し、必要なら後から調整します。</span></div>
          <div className="rulebook-columns"><RuleCard title="許可されていること"><ul><li>PvP可</li><li>ルールへのこじつけ提案</li><li>状況に応じた発狂内容の決定</li><li>蘇生の可否をGMが判断</li></ul></RuleCard><RuleCard title="第1版の扱い"><p>このルールブックは、現在決まっている基本ルールをまとめた第1版です。戦闘の細部や魔術の個別データは、必要に応じて追加・更新します。</p></RuleCard></div>
        </RuleSection>
      </main>
    </div>
  </div>
}

function RuleSection({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return <section className="rulebook-section" id={id}><div className="rulebook-section-heading"><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{children}</section>
}

function RuleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rulebook-card"><h3>{title}</h3>{children}</article>
}
