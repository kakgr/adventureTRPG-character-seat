# adventureTRPG — 身内向けTRPGキャラクターシート

数人〜十数人で使うことを想定した、Supabase連携のTRPGキャラクターシートWebアプリです。

## 実装機能

- Discord OAuthによるログイン・初回アカウント自動作成・ログアウト・セッション維持
- ログインユーザー専用のキャラクター一覧、詳細、作成、編集、削除
- キャラクターID URLによる、ログイン不要の読み取り専用詳細閲覧
- キャラクター、シナリオ、世界、ルールブックの各セクション
- 基本情報、能力値、HP/MP/正気度/ダメージボーナス、技能、専門技能、カスタム技能、持ち物、通過シナリオ、タグ、立ち絵
- 能力値ポイント18（初期値1）と技能ポイント400のリアルタイム計算
- 入力中の離脱警告、保存中/保存済み/失敗表示、二重送信防止、数値バリデーション
- ココフォリアのキャラクター駒JSONへの書き出し（詳細画面からクリップボードへコピー）
- レスポンシブUI（PC / スマートフォン）

## 技術構成

- React 19 / TypeScript / Vite
- Supabase JS v2（PostgreSQL、Auth、Storage）
- CSSは `src/styles.css` に集約。ゲームルールとSupabaseアクセスはUIから分離

## セットアップ

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` には次を設定します。クライアントではPublishable keyだけを使い、service_role keyは絶対に設定しないでください。

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Supabase側で手動で行う作業

1. Supabaseプロジェクトを作成する
2. Project URLを取得する
3. Publishable key（旧anon key）を取得する
4. `.env.local` に2つの環境変数を設定する
5. Supabase DashboardのSQL Editorで [`supabase/schema.sql`](supabase/schema.sql) を実行する
6. `character-portraits` バケットが作成され、公開設定になっていることを確認する（公開詳細画面の立ち絵表示に使用）
7. Storage Policyが4つ作成されていることを確認する
8. Authentication > Sign In / Providers > Discordを有効化し、Discord ApplicationのClient ID / Client Secretを登録する
9. Supabase Authentication > URL Configurationで、ローカルの戻り先（例：`http://127.0.0.1:5174/login`）をRedirect URLsに追加する
10. Discord Developer PortalのOAuth2 > Redirectsには、Supabaseに表示されるCallback URL（`https://<project-ref>.supabase.co/auth/v1/callback`）を登録する
11. Discordの開発者モードを有効にし、許可するユーザーのDiscordユーザーIDを `public.allowed_discord_users` にSQL Editorから登録する
12. Authentication > Hooks > Before User Createdで `public.hook_restrict_discord_signup` を選択して有効化する
13. 既存のSupabaseプロジェクトでは、更新した [`supabase/schema.sql`](supabase/schema.sql) をSQL Editorで再実行する

### 身内限定アクセスの設定

DiscordのユーザーIDは、Discordの開発者モードを有効にして対象ユーザーを右クリックし、「ユーザーIDをコピー」から取得できます。取得したIDをSQL Editorで登録してください。

```sql
insert into public.allowed_discord_users (discord_user_id, display_name)
values ('123456789012345678', '参加者A');
```

`supabase/schema.sql` には、未許可ユーザーの新規作成を拒否するAuth Hookと、許可済みユーザーだけにキャラクター・立ち絵へのアクセスを許可するRLSを含めています。SQLを実行した後、DashboardのAuthentication > Hooksで `Before User Created` に `public.hook_restrict_discord_signup` を設定してください。許可リストの変更はSQL Editorからのみ行えます。

### Discord OAuth設定の整理

リダイレクトURLは2種類あります。Discord側にはSupabaseのCallback URLを登録し、Supabase側にはユーザーを戻すアプリURLを登録します。

```text
Discord Developer Portal:
https://<project-ref>.supabase.co/auth/v1/callback

Supabase URL Configuration:
http://127.0.0.1:5174/login
```

本番公開時は、本番ドメインの `/login` もSupabaseのRedirect URLsへ追加してください。DiscordのClient Secretはブラウザ側の `.env.local` やソースコードに書かず、Supabase Dashboardにだけ入力します。

## GitHub Pagesで公開する場合

1. GitHubリポジトリの `Settings > Pages` を開き、Sourceを `GitHub Actions` にする
2. `Settings > Secrets and variables > Actions > New repository secret` から、次の2つを登録する

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

3. `main` ブランチへpushすると `.github/workflows/deploy.yml` がビルドと公開を実行する
4. 公開URL（通常は `https://kakgr.github.io/adventureTRPG-character-seat/`）をSupabase Authentication > URL ConfigurationのSite URLとRedirect URLsへ追加する

`.env.local` はGitHubへ登録せず、GitHub ActionsのSecretsに値を設定してください。プロジェクトリポジトリのパスに対応したViteのbase設定と、GitHub PagesでのSPAルート再読み込み対策はワークフローに含まれています。

## DB構造

`public.characters` に以下を保存します。

| カラム | 型 | 内容 |
| --- | --- | --- |
| `id` | uuid | キャラクターID |
| `user_id` | uuid | `auth.users.id` |
| `name` | text | 一覧で使うキャラクター名 |
| `data` | jsonb | 能力値・技能・プロフィール等 |
| `portrait_path` | text nullable | Storageのファイルパス |
| `is_public` | boolean | 詳細URLを公開するか（既定値はtrue） |
| `created_at` / `updated_at` | timestamptz | 作成・更新日時 |

## JSON構造

`data` は次の型をTypeScriptで定義しています。

```ts
{
  profile: { reading, age, gender, occupation, summary, description },
  stats: { vitality, strength, magic, speed, mental },
  skills: {
    common: Record<CommonSkillId, number>,
    weapon: { id, specialty, value }[],
    ranged: { id, specialty, value }[],
    knowledge: { id, specialty, value }[],
    magic: { id, specialty, value }[],
    custom: { id, name, value }[]
  },
  items: { id, name, quantity, description }[],
  experience: { notes },
  tags: string[]
}
```

## ルールと定数

ゲームバランスに関わる値は [`src/constants/game.ts`](src/constants/game.ts) にあります。

- `INITIAL_STAT_BASE = 1`
- `INITIAL_STAT_POINTS = 18`
- `INITIAL_SKILL_POINTS = 400`
- `MAX_SKILL_VALUE = 100`
- 能力値は `体力・筋力・魔力・速力・精神力` の5項目。初期値はすべて1
- `HP = 体力 × 3` / `MP = 魔力 × 3` / `正気度 = 精神力 × 3`
- `ダメージボーナス = floor((体力 + 筋力) / 6)`
- 初期作成時は能力値ポイントを18すべて使用して保存。技能ポイントは使い切らなくても保存可能
- 通過シナリオは、シナリオ名やそのキャラクターに起きた出来事・得た経験を自由記述で記録
- 編集時は同じ入力UIを使い、成長ルールを追加しやすいよう作成時の必須判定を分離

計算処理は [`src/lib/characterRules.ts`](src/lib/characterRules.ts) に集約しています。

## RLS / Storage

`characters` はRLSを有効化し、SELECT / INSERT / UPDATE / DELETEすべてでログインユーザーの `auth.uid() = user_id` とDiscord許可リストを保証します。Storageは公開bucketですが、アップロード・更新・削除はパスの先頭をユーザーIDにしたPolicyで許可済みユーザーだけに制限しています。

立ち絵パスは `ユーザーID / キャラクターID / UUID付きファイル名` です。画像本体をPostgreSQLには保存しません。

キャラクター詳細URL（`/characters/<id>`）は `get_public_character` RPCで公開項目だけを読み取り、ログイン不要で表示します。公開立ち絵を表示するため、`character-portraits` バケットは公開設定です。前回実行した共有用のテーブル・RPC・バケットが残っていても、新しい公開詳細画面とは別経路のため動作には影響しません。

## 未実装事項

シナリオ履歴、成長履歴、人間関係、GM編集、複製、JSON入力、技能成長、能力値成長は未実装です。履歴用テーブルは現時点では追加せず、将来 `character_history` 等の別テーブルで扱える構成にしています。

### ココフォリアへの書き出し

キャラクター詳細画面の「ココフォリアにコピー」を押し、ココフォリアの盤面をクリックして貼り付けます。能力値・技能・ダメージボーナスはパラメータ、HP/MP/正気度はステータス、キャラクター名と最低限のリソース値はキャラクターメモ、技能判定と正気度チェックはチャットパレットとして出力します。能力値判定コマンドは出力しません。正気度チェックの成功率はシナリオ指定のため、出力された `1d100` の結果を判定値と照合してください。立ち絵はココフォリア側の画像管理から設定してください。

ココフォリア公式ドキュメントはキャラクターの項目と貼り付け操作を説明していますが、生のクリップボードJSONスキーマは公開していません。そのため、出力のトップレベル `kind: "character"` と `data` 内の項目は、現行のココフォリア互換出力実装に合わせています。

## 確認コマンド

```bash
npm test
npm run build
```
