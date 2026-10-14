# SceneNotes

植物、動物、モノ、風景を集める写真ギャラリーです。HTML・CSS・JavaScript だけで動き、GitHub Pages に配置できます。

## 現在の機能

- 全画面のトップ写真
- ジャンルと撮影年の組み合わせによる絞り込み
- 写真の拡大表示、前後移動、スマホの左右スワイプ
- 拡大画面内で開閉できる撮影年・カメラ・レンズの情報

**同梱の6枚は生成したデモ写真です。年と機材情報も表示例であり、実際の撮影記録ではありません。**

## 写真を追加する

1. 公開用の写真を WebP に変換し、`assets/photos/` に入れます。
2. `js/photos.js` の配列に1件追加します。画像の相対パス、説明、タイトル、ジャンル、撮影年、カメラ、レンズを記入します。
3. 最初の1件がトップ写真として使われます。写真の並び順を変える場合は配列の順序を入れ替えます。

記入例：

```js
{
  id: "river-2026",
  src: "assets/photos/river-2026.webp",
  alt: "川面を見つめるカワセミ",
  title: "朝の川辺",
  category: "animal", // plant / animal / object / landscape
  year: "2026",
  camera: "Sony α7 V",
  lens: "FE 200–600mm F5.6–6.3 G OSS"
}
```

`camera` や `lens` が不明なときは空文字にすると、拡大画面でその項目を隠せます。新しい年は自動でフィルターに追加されます。ジャンル自体を増やすときは `index.html` のボタンと `js/app.js` の `categoryNames` に追加してください。

写真を公開するときは、位置情報を含む EXIF や元の RAW ファイルを置かず、公開してよい WebP 画像だけを入れてください。実写真に差し替えたら、`index.html` のデモ表記と `js/app.js` の撮影情報の注記を更新します。

## VS Code と GitHub Desktop での進め方

1. GitHub Desktop で `SceneNotes/scenenotes.github.io` を **Clone repository** します。
2. **Current Branch → New Branch** から、変更内容が分かるブランチ（例：`feature/add-bird-photos`）を作ります。
3. VS Code で編集します。`index.html` を直接ブラウザで開いても動作を確認できます。
4. GitHub Desktop で差分を確認し、コミットして **Publish branch** または **Push origin** します。
5. **Create Pull Request** で `main` への PR を作り、内容を確認してからマージします。

初回公開時には、リポジトリの **Settings → Pages → Build and deployment** で **Deploy from a branch**、`main`、`/(root)` を選びます。マージされた内容が公開対象になります。GitHub Pages は公開設定とアクセス条件を確認してから有効にしてください。

このプロジェクトにビルド作業や依存パッケージのインストールは必要ありません。
