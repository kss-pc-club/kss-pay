# KSS Pay

## KSS Payって？
第3期生の Asa が製作した文化祭での会計システム。<br>
2020年に公開しようと思ったが、某感染症のせいで中止になってしまった。<br>
そこで、これから使ってほしい・みんなで作り上げようという願いでオープンソースにした。

## 開発方法
1. プロジェクトを [Fork](https://github.com/kss-pc-club/kss-pay/fork) します。
2. Forkしたプロジェクトをダウンロードします（`git clone https://github.com/(あなたのユーザー名)/kss-pay.git`）
3. [Node.js](https://nodejs.org/ja/) と [yarn](https://classic.yarnpkg.com/ja/) をインストール
4. 依存関係をインストール（`yarn install --frozen-lockfile`）
5. ローカルサーバーを立てる（`yarn start`）
6. 開発しましょう！
7. 変更をステージ（`git add [変更したファイル]`）
8. 変更をコミット（`git commit -m [変更についてのコメント]`）
9. コミットをアップロード（`git push origin main`）
10. 変更した箇所について [Issue](https://github.com/kss-pc-club/kss-pay/issues) を立ててから、[Pull Request](https://github.com/kss-pc-club/kss-pay/pulls) を送信します。

## アイコンフォントのビルド方法
1. アイコンSVGを `public/fonts/svg` に入れます
2. `meta.json` にnameとcodepointを入力します（codepointは https://pictogrammers.github.io/@mdi/font/4.9.95/ を参照）。
3. `yarn font-build` を実行

## 必要環境
[SECURITY.md](./SECURITY.md) を見てください

## 行動規範
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) を見てください

## 貢献したい方
[CONTRIBUTING.md](./CONTRIBUTING.md) を見てください

## 製作者
 - [Asa](https://github.com/a01sa01to/)
