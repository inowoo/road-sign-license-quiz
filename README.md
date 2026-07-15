# 標識トレーニング

日本の普通自動車免許の取得を目指す人が、道路標識を4択クイズで予習するためのWebサイトです。標識を見て意味を答えるモードと、意味から標識を選ぶモードを備えています。

## 主な機能

- 40種類の道路標識からランダム出題
- 「標識 → 意味」と「意味 → 標識」の2モード
- 正解数、連続正解数、習得度の表示
- 間違えた問題の優先的な再出題
- `localStorage` による学習履歴の保存
- 学習履歴のリセット
- 正式名称と意味を確認できる標識一覧・検索・絞り込み
- iPhone、iPad、Windowsブラウザ向けのレスポンシブ表示

## ローカルでの起動方法

外部ライブラリやビルド作業は不要です。プロジェクトフォルダで次を実行します。

```powershell
python -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開いてください。Pythonがない場合は、`index.html` を直接ブラウザで開いても利用できます。

## ファイル構成

```text
.
├── index.html   # 画面構造
├── styles.css   # レイアウト、レスポンシブ表示、標識のCSS描画
├── signs.js     # 問題データと標識描画用マークアップ
├── app.js       # クイズ、履歴保存、一覧表示の処理
└── README.md    # このファイル
```

## 問題を追加する方法

1. `signs.js` の `signs` 配列に問題オブジェクトを追加します。
2. `id`、`number`、`name`、`meaning`、`explanation`、`category`、`shape`、`visual` を指定します。
3. 新しい図柄が必要な場合は、`visualMarkup()` にマークアップを追加し、`styles.css` に対応するCSSを追加します。
4. 正式名称と意味は、警察庁、国土交通省、e-Gov法令検索などの公的資料で照合します。

## GitHub Pagesの公開方法

1. GitHubへこのリポジトリをpushします。
2. リポジトリの **Settings → Pages** を開きます。
3. **Build and deployment** の Source を **Deploy from a branch** にします。
4. Branch に `main`、フォルダに `/(root)` を選び、保存します。
5. 公開処理の完了後、Pages画面に表示されるURLを確認します。

## 公開URL

https://inowoo.github.io/road-sign-license-quiz/

## 内容の基準

- [警察庁「交通の方法に関する教則」](https://www.npa.go.jp/bureau/traffic/20241113kyousoku.pdf)
- [国土交通省「道路標識一覧」](https://www.mlit.go.jp/road/sign/sign/douro/ichiran.pdf)
- [e-Gov法令検索「道路標識、区画線及び道路標示に関する命令」](https://laws.e-gov.go.jp/law/335M50004002003)

このサイトは学習用教材です。実際の交通では、現地の道路標識・道路標示と交通法規に従ってください。
