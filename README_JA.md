# Wicked Alice

これはGit周りのプロジェクトを管理するWebシステムです。

Node.jsで動作します。

## 必要なもの

* git
* Node.js (>= 7.0.0)
    * nvm推奨
* TypeScript (>= 2.0.0)

## Googleによる認証の準備

https://console.developers.google.com/

## インストール

### リポジトリのclone

初回のみ。

```
git clone https://github.com/HirokiMiyaoka/WickedAlice.git
npm install -g typescript
npm install -g pm2
```

### 環境変数の設定



### アップデート

アップデートする際の作業。
初回は上に続けてこちらも実行。

```
cd WickedAlice/
git pull
npm i
npm run build
```

