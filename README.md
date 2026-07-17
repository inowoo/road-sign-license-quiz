# DRIVE READY

教習所へ行く前から免許取得後まで、安全な運転判断を継続して学ぶための総合学習Webアプリです。

目標は免許試験の合格だけではありません。道路標識、交通法規、危険予測、実技の予習、トラブル対応などを通じて、周囲をよく見て余裕を持って判断できるドライバーになることを目指します。

## 現在利用できる機能

### 学習ホーム

- 標識クイズの履歴から経験値、レベル、ランクを算出
- 回答数、ベストコンボ、習得率を表示
- 当日に学習した標識数をデイリーミッションとして表示
- 間違いやヒント使用の履歴から苦手な標識を表示
- 将来追加する7分野の学習メニュー

### 道路標識トレーニング

- 公的資料に基づく40種類の道路標識
- 「標識から意味」と「意味から標識」の2モード
- 正式名称と意味を表示する4択問題
- 適用条件、時間指定、似た標識との違いを含む解説
- ヒント、正解数、連続正解数、標識ごとの正解率
- 間違えた問題とヒントを使った問題の優先的な再出題
- `localStorage` による端末内の学習履歴保存

### StreetViewDriveプロトタイプ

- 烏丸御池駅から京都駅までのデモコース
- 自動走行、チェックポイント停止、出題、解説、走行再開の進行
- Street View表示予定領域、ミニマップ、問題UI、スコア、コンボ、ランク、進捗
- 道路標識、危険予測、車線変更という異なる問題種別
- Route、Checkpoint、Questionを分離したJSONデータ

現在の街路表示はGoogle Maps API接続前のダミー画面です。地点・進行データもプロトタイプ用です。

## 将来の学習メニュー

1. 道路標識
2. 交通法規
3. 実技教習の予習
4. 危険予測（KYT）
5. 事故・故障・トラブル対応
6. 初心者向け運転ノウハウ
7. ベテランドライバーのコツ

## ローカルでの起動方法

外部フレームワークやビルド作業は不要です。JSONを読み込むため、ファイルを直接開かず、プロジェクトフォルダでローカルサーバーを起動してください。

```powershell
python -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。

## ファイル構成

```text
.
├── index.html                 # 総合学習ホーム
├── quiz.html                  # 道路標識クイズと標識一覧
├── street-view-drive.html     # 疑似ドライブ学習画面
├── styles.css                 # 共通UIと道路標識画面
├── hub.css                    # 学習ホーム専用スタイル
├── drive.css                  # 疑似ドライブ専用スタイル
├── dashboard.js               # XP、ランク、苦手分野の集計
├── app.js                     # 道路標識クイズの進行と履歴保存
├── street-view-drive.js       # コース進行と問題エンジン
├── signs.js                   # 道路標識問題データ
├── data/
│   ├── routes.json            # コース情報
│   ├── checkpoints.json       # 停止地点と問題の関連付け
│   └── drive-questions.json   # 問題、選択肢、正解、解説
├── assets/signs/              # 公的資料に基づく標識画像40枚
└── README.md
```

画面、進行ロジック、学習データを分離しています。新しい問題種別はJSONの `type` を追加し、必要な場合だけ表示コンポーネントを拡張します。

## コースデータ設計

### Route

```json
{
  "id": "kyoto-central-01",
  "name": "京都まちなか基礎コース",
  "start": { "name": "烏丸御池駅", "lat": 35.0106, "lng": 135.7597 },
  "end": { "name": "京都駅", "lat": 34.9858, "lng": 135.7588 },
  "checkpointIds": ["cp-shijo-karasuma"]
}
```

### Checkpoint

```json
{
  "id": "cp-shijo-karasuma",
  "routeId": "kyoto-central-01",
  "location": { "lat": 35.0037, "lng": 135.7595 },
  "heading": 180,
  "questionId": "drive-sign-time-01",
  "type": "road-sign"
}
```

### Question

```json
{
  "id": "drive-sign-time-01",
  "type": "road-sign",
  "prompt": "問題文",
  "options": [{ "id": "a", "text": "選択肢" }],
  "correctOptionId": "a",
  "explanation": "解説"
}
```

今後追加する問題種別の例は `traffic-law`、`hazard-prediction`、`turning`、`lane-change`、`accident-response`、`beginner-tips`、`expert-tips` です。

## 道路標識問題を追加する方法

1. `signs.js` の `signs` 配列に問題オブジェクトを追加します。
2. `id`、`number`、`name`、`meaning`、`explanation`、`category` を指定します。
3. `learningDetails` に同じ `id` で `hint`、`detail`、`confusion` を追加します。
4. `assets/signs/<id>.png` に同じ `id` の標識画像を追加します。
5. 画像、正式名称、意味、適用条件を公的資料で照合します。

## 開発ロードマップ

### Phase 1: 学習基盤

- 総合学習ホームと分野別メニュー
- 学習履歴、経験値、ランク、苦手問題
- 道路標識トレーニング
- JSON駆動の疑似ドライブプロトタイプ

### Phase 2: 学習分野の拡張

- 交通法規、実技教習、危険予測の問題データ
- 事故・故障時の行動手順
- 初心者と経験者向けの運転ノウハウ
- 分野横断の復習キューとデイリーミッション

### Phase 3: Google Street View連携

- Google Maps JavaScript APIとStreet View Panoramaの導入
- 緯度経度、向き、移動間隔を利用したルート自動進行
- チェックポイントでの停止と問題表示
- 実在地点データの確認、API利用量の管理、利用規約への対応

### Phase 4: 高度なゲーム学習

- コース選択、難易度、バッジ、連続学習記録
- 危険箇所のクリックや複数正解など、問題UIの拡張
- 学習データの同期と複数端末対応
- 教習指導員や安全運転管理者向けのコース作成機能

### Phase 5: Unity・VR展開

- 共通JSONスキーマを利用するUnity版
- ハンドル、ペダル、視線入力に対応するVR版
- Web版とUnity・VR版で共通利用できるコース／問題API

## GitHub Pagesの公開方法

1. GitHubへこのリポジトリをpushします。
2. リポジトリの **Settings → Pages** を開きます。
3. Sourceを **Deploy from a branch** にします。
4. Branchに `main`、フォルダに `/(root)` を指定します。

## 公開URL

https://inowoo.github.io/road-sign-license-quiz/

## 内容の基準

- [警察庁「交通の方法に関する教則」](https://www.npa.go.jp/bureau/traffic/20241113kyousoku.pdf)
- [国土交通省「道路標識一覧」](https://www.mlit.go.jp/road/sign/sign/douro/ichiran.pdf)
- [e-Gov法令検索「道路標識、区画線及び道路標示に関する命令」](https://laws.e-gov.go.jp/law/335M50004002003)

標識画像は国土交通省道路局作成の「道路標識一覧」に掲載された図版を表示用に処理したものです。標識画像にAI生成画像や絵文字は使用していません。

このサイトは学習用教材です。実際の交通では、現地の道路標識・道路標示、交通法規、警察官の指示、周囲の交通状況に従ってください。
