# Supira 知力会ネットワーク管理

知力会の紹介ネットワークを、求人開拓・OB訪問・学生紹介につなげるための管理システム（MVP）です。

## 特徴

- 知力会側のスプレッドシートを **CSV取り込み**（Facebook自動取得は行いません）
- メンバー分類（学生 / OB / OG / 社会人 / 企業関係者）
- 紹介者ごとのネットワーク可視化
- 求人開拓候補の抽出
- 情報不足メンバーの補完フロー
- 重複候補チェック

## 技術スタック

- Next.js 15（App Router）
- React 19
- TypeScript
- Tailwind CSS
- ローカルモックデータ + localStorage 永続化

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 画面一覧

| パス | 画面 |
|------|------|
| `/` | ダッシュボード |
| `/members` | メンバー一覧 |
| `/members/new` | 新規追加 |
| `/members/[id]` | 詳細 |
| `/members/[id]/edit` | 編集 |
| `/import` | CSVインポート |
| `/incomplete` | 情報不足 |
| `/referrers` | 紹介者別ネットワーク |
| `/recruiting` | 求人開拓候補 |
| `/tasks` | タスク |
| `/duplicates` | 重複チェック |

## サンプルCSV

`public/sample-chiryokukai.csv` をインポート画面でお試しください。

## 今後の拡張

- Supira本体とのAPI連携
- データベース接続
- 紹介ネットワーク図の可視化
- 重複判定の高度化
