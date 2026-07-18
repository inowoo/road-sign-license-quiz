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

- 御池高倉付近から京都駅までのデモコース
- 自動走行、チェックポイント停止、出題、解説、走行再開の進行
- Google Street Viewの実写パノラマ、注目枠と拡大ビュー、周辺地図、自車・進行方向、自由ルート入力、問題UI、スコア、コンボ、ランク、進捗
- 道路標識、危険予測、車線変更という異なる問題種別
- Route、Checkpoint、Questionを分離したJSONデータ

実写表示にはGoogle Maps Embed APIを使用します。各チェックポイントへ進むと、JSONに保存した地上車道の `streetViewPano`、`streetViewLocation`、向きに応じてStreet Viewが切り替わります。Google撮影の地上車道パノラマIDを優先することで、地下駅や施設内の画像へ吸着しない構成にしています。`focusAreas` がある地点ではパノラマ上の対象を点滅枠で示し、`focusZoom` がある小さな対象は同じパノラマを狭い画角で拡大表示します。同じ地点データから周辺地図、自車位置、次地点への方角と距離も更新します。自由ルート設定では、開始・到着に住所、施設名、緯度経度を入力して運転ルートを表示できます。地点・進行データはプロトタイプ用です。

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

リポジトリ内の `maps-config.js` はAPIキーを含まない初期状態です。そのため、ローカルではStreet Viewの設定案内が表示されますが、コース進行と問題回答は確認できます。公開環境ではGitHub ActionsがGitHub Secretから設定ファイルを生成します。

## Google Street Viewの設定

1. Google Cloudでプロジェクトを作成または選択し、必要に応じて請求先アカウントを関連付けます。
2. **Maps Embed API**を有効にしてAPIキーを作成します。
3. キーのアプリケーション制限を**ウェブサイト**にし、`https://inowoo.github.io/*` を許可します。
4. キーのAPI制限を**Maps Embed API**だけにします。
5. GitHubリポジトリの **Settings → Secrets and variables → Actions** で、`GOOGLE_MAPS_API_KEY` というRepository secretを作成します。

APIキーはブラウザから利用されるため、配信後の通信では確認可能です。Git履歴には保存せず、ウェブサイト制限とAPI制限の両方を必ず設定してください。Maps Embed APIのリクエスト自体は公式ドキュメント上、無料かつ利用回数無制限です。

- [Maps Embed APIの使用量と料金](https://developers.google.com/maps/documentation/embed/usage-and-billing)
- [Street Viewモードの埋め込み](https://developers.google.com/maps/documentation/embed/embedding-map)
- [Google Maps PlatformのAPIキー保護](https://developers.google.com/maps/api-security-best-practices)

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
├── maps-config.js             # APIキー未設定時の公開用設定
├── signs.js                   # 道路標識問題データ
├── .github/workflows/
│   └── deploy-pages.yml       # Secretを反映してPagesへ配信
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
  "start": {
    "name": "御池高倉南側・高倉通",
    "lat": 35.010235,
    "lng": 135.7632063,
    "streetViewLocation": { "lat": 35.010235, "lng": 135.7632063 },
    "streetViewPano": "TSJC5eosVryEh15CGZ6-jA",
    "heading": 180
  },
  "end": {
    "name": "京都駅前・塩小路通",
    "lat": 34.9858,
    "lng": 135.7588,
    "streetViewLocation": { "lat": 34.9872574, "lng": 135.7611114 },
    "streetViewPano": "8BxXSBlZSH3jIwQ-p8gXig",
    "heading": 270
  },
  "checkpointIds": ["cp-shijo-karasuma"]
}
```

### Checkpoint

```json
{
  "id": "cp-shijo-karasuma",
  "routeId": "kyoto-central-01",
  "location": { "lat": 35.0038611, "lng": 135.763278 },
  "streetViewLocation": { "lat": 35.0038611, "lng": 135.763278 },
  "streetViewPano": "yDE66eAzhG4hQEM0pzpFqw",
  "heading": 180,
  "focusAreas": [
    { "label": "車両（組合せ）通行止めと補助標識", "left": 31, "top": 34, "width": 13, "height": 21 }
  ],
  "focusZoom": { "label": "車両（組合せ）通行止め・7-20", "heading": 176, "pitch": -4, "fov": 22 },
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

- Maps Embed APIによる実写Street Viewとチェックポイント連動
- 緯度経度と向きを利用したパノラマ切り替え
- Google Maps JavaScript APIを利用した連続的なルート自動進行
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
2. `GOOGLE_MAPS_API_KEY` Repository secretを登録します。
3. リポジトリの **Settings → Pages** を開きます。
4. Sourceを **GitHub Actions** にします。
5. `Deploy GitHub Pages` workflowの完了を確認します。

## 公開URL

https://inowoo.github.io/road-sign-license-quiz/

## 内容の基準

- [警察庁「交通の方法に関する教則」](https://www.npa.go.jp/bureau/traffic/20241113kyousoku.pdf)
- [国土交通省「道路標識一覧」](https://www.mlit.go.jp/road/sign/sign/douro/ichiran.pdf)
- [e-Gov法令検索「道路標識、区画線及び道路標示に関する命令」](https://laws.e-gov.go.jp/law/335M50004002003)

標識画像は国土交通省道路局作成の「道路標識一覧」に掲載された図版を表示用に処理したものです。標識画像にAI生成画像や絵文字は使用していません。

このサイトは学習用教材です。実際の交通では、現地の道路標識・道路標示、交通法規、警察官の指示、周囲の交通状況に従ってください。
