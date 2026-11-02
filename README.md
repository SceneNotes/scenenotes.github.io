# Scene Notes — 写真サイト

完成イメージをもとに制作した、**静かなモダンフォトノート**風のレスポンシブサイトです。
ビルドツールやフレームワークは不要です。`index.html` を開くだけで確認できます。

## 実装済み

- PC：固定左サイドバー、SNSアイコンの少し上にテーマ切り替え、横長のメイン写真、3列の紙片風のカテゴリーカード
- スマホ：ロゴ＋テーマ切り替え＋右上ハンバーガーメニュー、余白付きのメイン写真、**画像を右側に置いた横型カード**
- 写真もカードも角丸なし。テープを使わず、薄い縁と影で紙片を重ねたような表現
- `View More ›`：丸ボタンを使わない控えめなリンク
- ライト / ダークモード切り替え（PCとスマホで状態を共有し、ブラウザーに設定を記憶）
- Landscape / Wildlife / Objects の写真一覧（写真も直角の紙片風フレーム）
- 一覧の写真タップで拡大表示、前後移動、Escキーで閉じる
- About のサンプルページ（同じ紙片風の縁・影を適用）
- キーボード操作、スクリーンリーダー向けの基本的な対応

## ファイル構成

```text
scene-notes/
├── index.html         # サイト本体
├── styles.css         # レイアウト / 配色 / レスポンシブ
├── app.js             # メニュー / テーマ / ページ切替 / 写真表示
├── assets/
│   ├── hero.webp
│   ├── landscape.webp
│   ├── wildlife.webp
│   ├── objects.webp
│   └── ...             # 写真サンプルと紙の質感
└── README.md
```

## 写真と文章の変更方法

現在の写真素材は、デザイン検討時に作成した**イメージ画像から切り出した仮素材**です。公開時にはご自身の写真に差し替えてください。

1. `assets/` に写真を保存します（例：`my-landscape.jpg`）。
2. `index.html` の `<img src="./assets/landscape.webp">` を新しいファイル名へ変更します。トップ画像は `hero.webp` です。
3. カテゴリーの写真一覧は `app.js` 冒頭の `galleries` にある `photos` の `src`, `title`, `alt` を編集してください。写真を増やす際はオブジェクトを追加するだけです。
4. カードの説明文は `index.html` の `.card-description`、紹介文は `app.js` の `renderAbout` を編集します。

**おすすめ写真サイズ**：トップ写真 1600×600px 前後、カード写真 1000×560px 前後。画像形式は WebP または JPEG が扱いやすいです。

## Instagram・GitHubのリンク設定

`app.js` の冒頭にある `socialLinks` の空欄に、それぞれのURLを入力します。

```js
const socialLinks = {
  instagram: 'https://instagram.com/ユーザー名',
  github: 'https://github.com/ユーザー名'
};
```

空欄のアイコンはリンク無効のまま表示されます。設定後は `app.js` をGitHubのリポジトリへ反映してください。公開済みサイトで古い設定が残る場合は、`index.html` の `app.js?v=6` の数字を増やすと新しい設定を読み込めます。

## GitHub Pages で公開

1. GitHub に新しいリポジトリを作成します（例：`scene-notes`）。
2. このフォルダの中身（`index.html`・`styles.css`・`app.js`・`assets/`）をリポジトリ直下にアップロードします。
3. リポジトリの **Settings → Pages → Build and deployment** を開きます。
4. **Deploy from a branch**、Branch `main`、Folder `/(root)` を選んで保存します。
5. 公開URL（通常 `https://ユーザー名.github.io/scene-notes/`）からアクセスできます。

サイト内リンクは `#/landscape` のような形式なので、GitHub Pages で追加のルーティング設定は不要です。

## 調整する際のポイント

- 全体の色：`styles.css` の `:root` と `html[data-theme='dark']` 内のCSS変数
- 紙片の質感：`.category-card, .gallery-tile, .note-card, .about-photo` と `--sheet-*` のCSS変数（角丸なし）
- PCサイドバー幅：`.sidebar` と `.main-column` の `width` / `margin-left`
- スマホ画像の幅：`@media (max-width:800px)` 内の `.category-card` の `grid-template-columns: minmax(0,1fr) 40%`
- スマホメニュー切り替え基準：CSSの `800px` と `app.js` の `window.innerWidth > 800`

Google Fonts が読み込めない環境でも、端末にある代替フォントで表示できます。写真はすべてローカル保存しているため、写真表示に外部サービスは必要ありません。
