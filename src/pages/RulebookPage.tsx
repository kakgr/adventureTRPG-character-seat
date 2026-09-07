import { WORLD_IMAGES } from '../constants/world'
import { commonSkills, currencyRules, insanityTable, luckRules, magicMpRules, playerTerm, resourceRecoveryRule, rulebookSections, skillRules, specializedSkills, statDefinitions } from './rulebookContent'

export function RulebookPage() {
  return <div className="page world-page rulebook-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 78%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="rulebook-hero page-intro">
      <div><h1>ルールブック</h1><p>adventureTRPG 第1版の基本ルールを一覧で確認できます。</p></div>
    </section>

    <div className="rulebook-layout">
      <nav className="rulebook-nav" aria-label="ルールブック目次">
        {rulebookSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}
      </nav>

      <main className="rulebook-content">
        <RuleSection id="trpg" title="TRPGとは">
          <p className="rulebook-lead"><Keyword>TRPG</Keyword>は、参加者同士の会話と想像力で物語を作っていくゲームです。</p>
          <RuleCard title="遊び方"><p><Keyword>GM</Keyword>が世界や状況を説明し、<Keyword>PL</Keyword>が自分のキャラクターの行動を決めます。行動の結果は、会話による演技とルールによる判定を組み合わせて決まります。</p><p>決められた正解を探すのではなく、キャラクターならどう動くかを考えながら、参加者全員でひとつの物語を作ります。</p></RuleCard>
        </RuleSection>

        <RuleSection id="features" title="アドベンチャーTRPGの特徴">
          <p className="rulebook-lead">魔法と機械技術が共存する世界を、旅をするキャラクターとして探索します。</p>
          <div className="rulebook-columns">
            <RuleCard title="渡り手"><p>{playerTerm}</p><p>渡り手は、汚染された土地や異形と関わりながら、さまざまな場所を旅します。</p></RuleCard>
            <RuleCard title="裁定"><p>ルールにない状況は、<Keyword>GM</Keyword>がその場で判断します。必要に応じて参加者と相談し、物語が進むことを優先します。</p><p>PvP、蘇生、発狂内容なども、シナリオと卓の方針に合わせて決定します。</p></RuleCard>
          </div>
        </RuleSection>

        <RuleSection id="parameters" title="パラメーター">
          <p className="rulebook-lead">初期作成では、<Keyword>能力値</Keyword>に18ポイントを自由に割り振ります。能力値に上限はなく、成長によって上昇します。</p>
          <div className="stat-rule-grid">{statDefinitions.map((stat) => <div className="stat-rule-card" key={stat.name}><span>{stat.effect}</span><strong>{stat.name}</strong></div>)}</div>
          <RuleCard title="作成時の注意"><ul><li>初期能力値はすべて1から開始</li><li>能力値ポイント18点を使い切る</li><li><Keyword>能力値</Keyword>は基本的に通常の技能判定へ加えない</li></ul></RuleCard>
          <div className="resource-rule-grid"><RuleCard title="HP"><div className="formula">体力 × 3</div><p>最大値と現在値を管理します。0になると死亡・ロストです。休息していた時間に応じて自動的に回復し、ぐっすり眠る、または半日休憩するなどすれば半分以上を回復できます。</p><p>{resourceRecoveryRule}</p></RuleCard><RuleCard title="MP"><div className="formula">魔力 × 3</div><p>最大値と現在値を管理します。休息していた時間に応じて自動的に回復し、ぐっすり眠る、または半日休憩するなどすれば半分以上を回復できます。</p><p>{resourceRecoveryRule}</p></RuleCard><RuleCard title="正気度"><div className="formula">精神力 × 3</div><p>最大値と現在値を管理します。精神を壊すようなイベントで減少します。</p></RuleCard></div>
          <RuleCard title="その他の派生値"><p><Keyword>ダメージボーナス</Keyword> ＝ ⌊(体力＋筋力) / 6⌋。<Keyword>速力</Keyword>は戦闘の行動順に使います。</p></RuleCard>
        </RuleSection>

        <RuleSection id="skills" title="技能について">
          <p className="rulebook-lead">技能は、キャラクターが身につけている知識や技術を表します。行動に適した技能を選び、技能値を使って判定します。</p>
          <RuleCard title="技能値"><p>初期値は0です。キャラクター作成時に<Keyword>技能ポイント</Keyword>400点を、各技能0〜100の範囲で自由に配分します。</p><p>初期作成の400点とは別に、各技能へ<Keyword>追加値</Keyword>を加えることもできます。追加値は初期値の400点とは別に管理します。</p></RuleCard>
          <div className="rulebook-columns">
            <RuleCard title="通常技能"><p>{commonSkills.join(' / ')}</p></RuleCard>
            <RuleCard title="専門技能"><p>{specializedSkills.join(' / ')} / カスタム技能</p><p>専門技能は、必要な分野や武器などを個別に設定して使用します。</p></RuleCard>
          </div>
        </RuleSection>

        <RuleSection id="growth" title="成長">
          <div className="growth-grid"><RuleCard title="きっかけ"><p><Keyword>クリティカル</Keyword>を出したとき、または成長につながるイベントが起きたとき、GM判断で成長します。</p></RuleCard><RuleCard title="目安"><div className="growth-value"><strong>+1</strong><span>能力値 / 1シナリオ</span></div><div className="growth-value"><strong>+3</strong><span>技能値の合計 / 1シナリオ程度</span></div></RuleCard></div>
          <p className="rulebook-note">成長の有無・タイミング・具体的な配分はGMが判断します。</p>
        </RuleSection>

        <RuleSection id="checks" title="判定">
          <div className="check-rule-grid">
            <RuleCard title="技能判定" variant="mechanics"><div className="rulebook-number"><strong>D100</strong><span>{skillRules.success}</span></div><p><Keyword>初期値</Keyword>の上限は{skillRules.maximum}。初期値は{skillRules.initial}です。<Keyword>技能ポイント</Keyword>{skillRules.points}点を、各技能0〜100の範囲で自由に配分します。初期作成の400点とは別に、各技能へ<Keyword>追加値</Keyword>を加えることもできます。</p><div className="critical-line"><span><Keyword>クリティカル</Keyword> {skillRules.critical}</span><span><Keyword>ファンブル</Keyword> {skillRules.fumble}</span></div><p className="rulebook-note">クリティカル・ファンブルの具体的な効果は、各自の判断に委ねます。</p></RuleCard>
            <RuleCard title="対抗判定" variant="mechanics"><p><Keyword>対抗判定</Keyword>は技能ではなく、基本能力値を使います。</p><p>双方の能力値の差1点につき、成功率を±5%します。能力値が同じなら基準値は50%です。</p></RuleCard>
          </div>
          <RuleCard title="組み付け" variant="mechanics"><p><Keyword>組み付き</Keyword>を仕掛ける側の筋力と、対象の筋力の差で判定します。</p><div className="formula">50% ＋（仕掛ける側の筋力 − 対象側の筋力）× 5%</div><p>効果は主に1ターンまたは1分程度。継続する場合は再度判定します。</p></RuleCard>
        </RuleSection>

        <RuleSection id="sanity" title="正気度">
          <p className="rulebook-lead"><Keyword>正気度</Keyword>は、精神を壊すような出来事にどこまで耐えられるかを表します。</p>
          <RuleCard title="正気度の扱い"><p>最大値は<Keyword>精神力 × 3</Keyword>です。成功率・減少量・回復方法は、シナリオの指定に従います。</p><p>正気度が0になると発狂します。発狂内容はその場のGM判断とし、キャラクターやシナリオに合う内容を決めます。</p></RuleCard>
          <details className="insanity-details"><summary>発狂表（任意使用）</summary><p className="rulebook-note">迷ったときだけD20。効果の強さ・継続時間・終了条件はGM判断です。</p><div className="insanity-table">{insanityTable.map((entry) => <div key={entry.roll}><b>{entry.roll}</b><span>{entry.text}</span></div>)}</div></details>
        </RuleSection>

        <RuleSection id="luck" title="幸運">
          <RuleCard title="幸運の決定" variant="mechanics"><div className="rulebook-number"><strong>{luckRules.minimum}〜{luckRules.maximum}</strong><span>乱数で決定</span></div><p><Keyword>幸運</Keyword>は技能ポイントを使わず、0〜90の乱数で決定します。キャラクター作成時は何度でも振り直せます。</p></RuleCard>
        </RuleSection>

        <RuleSection id="money" title="お金について">
          <p className="rulebook-lead">世界で使われる通貨は、カッパー、シルバー、ゴールド、プラチナの4種類です。</p>
          <RuleCard title="通貨の単位" variant="mechanics"><p><Keyword>{currencyRules.copper}</Keyword>。100カッパーで1シルバー、100シルバーで1ゴールド、100ゴールドで1プラチナになります。</p><p><Keyword>{currencyRules.platinum}</Keyword>です。</p></RuleCard>
        </RuleSection>

        <RuleSection id="combat" title="戦闘">
          <div className="formation-grid">{['前衛', '中衛', '後衛'].map((position, index) => <div className="formation-card" key={position}><span>0{index + 1}</span><strong>{position}</strong><small>{index === 0 ? '近接攻撃' : index === 1 ? '遠距離 −10%' : '遠距離 −20%'}</small></div>)}</div>
          <RuleCard title="配置と行動順"><ul><li>味方・敵ともに<Keyword>前衛／中衛／後衛</Keyword>へ配置</li><li>開始時に自分の配置を宣言</li><li>味方・敵をまとめて<Keyword>速力</Keyword>の速い順に行動</li><li>同速なら筋力、場所に応じた技能、RPで決定</li><li><Keyword>配置変更</Keyword>は1ターンを消費</li></ul></RuleCard>
          <RuleCard title="ターン"><ul><li>自分の<Keyword>ターン</Keyword>の最初に行動を宣言</li><li><Keyword>攻撃</Keyword>、回避専念、回復など自由に選択</li><li>攻撃以外の行動はGM裁量</li><li>戦闘終了まで各ターンを繰り返す</li></ul></RuleCard>
          <RuleCard title="攻撃の流れ" variant="mechanics"><ol><li><Keyword>攻撃側</Keyword>が技能判定</li><li>対象が<Keyword>回避</Keyword>または<Keyword>防御</Keyword></li><li>攻撃が通れば<Keyword>ダメージ処理</Keyword></li></ol><p>近接攻撃は前衛からのみ。遠距離攻撃は中衛で命中率−10%、後衛で−20%。回避は回避技能、防御はキャラクターシートの防御数値を参照します。</p></RuleCard>
          <RuleCard title="受け流し" variant="mechanics"><p>攻撃を受ける際、<Keyword>近接武器または銃</Keyword>を装備していれば、その武器に設定した技能で判定できます。</p><p>判定に成功すると、受けるダメージの半分（端数切り捨て）を武器の<Keyword>耐久値</Keyword>へ移し、残りをHPから減らします。失敗した場合は、通常どおり全ダメージを受けます。</p><p>耐久値が0になった武器は、修理されるまで受け流しには使えません。</p></RuleCard>
        </RuleSection>

        <RuleSection id="weapons" title="武器">
          <RuleCard title="武器の使い方"><p>武器ごとの<Keyword>ダメージ</Keyword>、射程、必要な技能、特殊効果に従って使用します。記載がない場合は、武器の性質に合う技能を選び、GMと相談して判定します。</p><p>ダメージは武器に記載された計算方法を使い、命中後に処理します。</p><p>キャラクターシートに登録する武器には耐久値を設定します。受け流しに使う近接武器と銃には、必ず耐久値を設定してください。</p></RuleCard>
          <RuleCard title="武器に関わる技能"><p><Keyword>武器</Keyword>は近接武器などの扱い、<Keyword>射撃・投擲</Keyword>は遠距離武器や投擲物の扱いに使います。専門的な武器は、個別の専門技能として追加できます。</p></RuleCard>
        </RuleSection>

        <RuleSection id="magic" title="魔術">
          <RuleCard title="魔術の扱い"><p><Keyword>魔術</Keyword>は、対応する道具がなければ発動できません。使用時には<Keyword>MP</Keyword>を消費して効果を発揮します。</p><p>魔術を使用する道具には、<Keyword>杖</Keyword>、<Keyword>魔道具</Keyword>、<Keyword>銃</Keyword>などが含まれます。</p><p>魔術ごとの効果・消費量・判定方法は、シナリオや魔術の記載を参照します。記載がない場合は、GMと相談して決定します。</p></RuleCard>
          <RuleCard title="銃と魔術"><p><Keyword>銃</Keyword>は、MPを消費して弾を発射します。通常の弾薬を使う銃とは異なり、魔術として扱う銃の発射にはMPが必要です。</p></RuleCard>
          <RuleCard title="MP消費の考え方" variant="mechanics"><p><Keyword>{magicMpRules.principle}</Keyword></p><p>{magicMpRules.alchemyExample}一方、{magicMpRules.gunExample}</p></RuleCard>
          <RuleCard title="特殊技能"><p><Keyword>特殊技能</Keyword>の使用方法や効果は、GMと相談して決めます。専門知識、武器、射撃・投擲、魔術なども、必要に応じて個別に定義します。</p></RuleCard>
        </RuleSection>
      </main>
    </div>
  </div>
}

function RuleSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="rulebook-section" id={id}><div className="rulebook-section-heading"><h2>{title}</h2></div>{children}</section>
}

function RuleCard({ title, children, variant = 'plain' }: { title: string; children: React.ReactNode; variant?: 'plain' | 'mechanics' }) {
  return <article className={`rulebook-card ${variant === 'mechanics' ? 'rulebook-card-mechanics' : ''}`}><h3>{title}</h3>{children}</article>
}

function Keyword({ children }: { children: React.ReactNode }) {
  return <strong className="rulebook-keyword">{children}</strong>
}
