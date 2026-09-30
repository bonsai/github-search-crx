# github-search-crx

GitHubのrepo検索を素早く行う最小Chrome拡張。

## 使い方

1. chrome://extensions を開く
2. デベロッパーモードをON
3. 「パッケージ化されていない拡張機能を読み込む」でこのディレクトリを選択
4. popupから検索

## 検索

- `bonsai` → `user:bonsai type:repo <q>`
- `org:foo` → `org:foo type:repo <q>`
- 空欄 → `type:repo <q>`

検索結果は正規化JSONとして保存され、sidebarが表示する。

## JSON

```json
{
  "q":"idol",
  "user":"bonsai",
  "org":"",
  "type":"repo",
  "github_query":"user:bonsai type:repo idol",
  "total_count":1,
  "items":[]
}
```

## データフロー

popup → background.js → GitHub API → normalized JSON → chrome.storage → sidebar.html

## JSONL

検索するたびに検索語ログをJSONLとして chrome.storage.local に蓄積する。

```json
{"q":"idol","user":"bonsai","org":"","type":"repo","ts":"2026-09-30T02:30:00.000Z"}
```

スキーマは data/schema.json。
保存先の実ファイルパスは固定しない。後からexport/save adapterを追加する。

## 方針

検索対象が決まっているときはCRXで検索する。
ざっくりした探索・相談はChatGPTで行う。
