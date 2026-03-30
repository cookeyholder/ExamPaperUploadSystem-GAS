# ExamPaperUploadSystem-GAS

Google Apps Script（GAS）版的「試卷上傳系統」，目標是逐步對齊 Django 專案 `Exam_Paper_Delivery_System`。

本專案採用：
- 前端：Vanilla JS SPA + Bootstrap 5
- 後端：GAS `Code.js`
- 資料來源：Google 試算表
- 開發方式：Vite 建置 + clasp 推送

## 目前狀態（先看這段）

目前已可使用：
- 教師端「試卷上傳情形」儀表板（含倒數、上傳表單前端驗證）
- 管理端頁面：考試分項管理、科目管理、群科班級管理、帳號管理（含部分 CRUD）
- GAS 讀寫 API：`apiGetTableData`、`apiGetUserInfo`、`apiAddTableRow`、`apiUpdateTableRow`、`apiDeleteTableRow`

目前尚未補齊（重點）：
- `apiUploadExamPaper` 後端函式尚未實作（前端已有呼叫）
- Django 的完整登入安全流程（OTP/Captcha）、統計匯出、封存流程等尚在補齊中

相關文件入口：
- [Django功能比對與GAS待實作清單.md](./docs/Django功能比對與GAS待實作清單.md)
- [部署前檢查清單.md](./docs/部署前檢查清單.md)

---

## 快速開始（本機開發）

### 1. 環境需求
- Node.js 18+
- npm
- `@google/clasp`

```bash
npm install -g @google/clasp
```

### 2. 安裝套件

```bash
npm install
```

### 3. 啟動前端開發模式

```bash
npm run dev
```

Vite 預設會開在本機開發網址（通常是 `http://localhost:5173`）。

### 4. 建置單檔版本（給 GAS 使用）

```bash
npm run build
```

建置結果會輸出到 `dist/index.html`。

### 5. 更新 GAS 入口頁

`doGet()` 會回傳根目錄的 `index.html`，因此部署前請把建置結果覆蓋回根目錄：

```bash
cp dist/index.html index.html
```

---

## 部署到 GAS（首次）

### 1. 建立（或準備）Google Apps Script 專案
- 建議使用「綁定 Google 試算表」的 GAS 專案。

### 2. 設定 `.clasp.json`

把 [`.clasp.json`](./.clasp.json) 內的 `scriptId` 改成你的 GAS Script ID：

```json
{
  "scriptId": "你的 Script ID",
  "rootDir": "."
}
```

### 3. 登入 clasp

```bash
clasp login
```

### 4. 建置並推送

```bash
npm run build
cp dist/index.html index.html
clasp push
```

### 5. 發佈 Web App
1. 到 GAS 編輯器按「部署」->「新增部署作業」
2. 類型選「網頁應用程式」
3. 執行身分：`我`
4. 存取對象：依你的需求設定（例如網域內）
5. 取得 Web App URL

---

## 試算表設定

### A. 系統會使用的工作表

目前程式會讀寫下列工作表（英文名稱為前端呼叫名，右側是實際工作表）：

- `settings` -> `網站參數設定`
- `users` -> `帳號管理`
- `classes` -> `群科班級`
- `exam1` -> `第一次定期考`
- `exam2` -> `第二次定期考`
- `exam3` -> `第三次定期考`
- `exam4` -> `期末考`

### B. 必要欄位（目前版本）

#### 1) `網站參數設定`
建議至少有以下資料列：
- `網站名稱`
- `網站網域`
- `OAuth Client ID`

#### 2) `帳號管理`
建議欄位：
- `Email`, `姓名`, `人員編號`, `部門單位`, `群組`, `狀態`, `備註`

> `群組` 目前主要使用 `admin` / `teacher`。

#### 3) `群科班級`
建議欄位：
- `班級代碼`, `班級名稱`

#### 4) `第一次定期考` ~ `期末考`
建議欄位：
- `ID`, `類別`, `年級`, `科目名稱`, `命題教師`, `閱卷方式`, `試卷張數`, `檔案連結`, `適用班級`, `英聽加考`

---

## OAuth 設定（Google 登入）

請先在 Google Cloud Console 建立 OAuth 2.0 Client ID，並填入「網站參數設定」的 `OAuth Client ID`。

詳細步驟請看：
- [docs/OAUTH_GUIDE.md](./docs/OAUTH_GUIDE.md)

---

## 專案結構（重點）

- `Code.js`：GAS 後端（Web App 入口與試算表 API）
- `src/`：SPA 原始碼
  - `src/main.js`：前端入口與路由
  - `src/views/`：各頁面
  - `src/services/`：Mock/GAS API 介接
- `index.html`：GAS 實際載入頁（部署前要更新）
- `dist/index.html`：Vite 打包輸出

---

## 常用指令

```bash
# 本機開發
npm run dev

# 建置單檔
npm run build

# 更新 GAS 入口頁
cp dist/index.html index.html

# 推送到 GAS
clasp push
```

---

## 已知限制與注意事項

1. 目前前端上傳流程會呼叫 `apiUploadExamPaper`，但 `Code.js` 尚未提供此函式。
2. 管理頁有部分欄位仍依賴 mock 資料結構，正式資料欄位需持續對齊。
3. 本專案尚未完全對齊 Django 全功能，請參考差異清單規劃開發順序。

---

## 授權

本專案目前沿用既有儲存庫設定（`package.json` 顯示 `ISC`）。
