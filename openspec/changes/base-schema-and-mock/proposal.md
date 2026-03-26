# Proposal: Base Schema and Mock Data

## Context
這是 SPA 遷移專案的第 2 個提案 (Phase 1)。依賴 `setup-spa-routing-shell`。

## Problem
在沒有真實綁定 GAS 後端前，我們需要模擬 Google Spreadsheets 會回傳的 2D 陣列資料，以便後續的 UI 元件開發。系統未來會由 7 張工作表構成資料庫。

## Solution
1. 設計一個統一的 `MockApiService`，封裝所有 CRUD 操作（以 Promise 形式模擬延遲）。
2. 在前端專案建立一份 `mockData.json` 或 `mockData.js` 檔案，內部包含 7 種資料結構的陣列：
   - 設定檔 (Settings)
   - 管理員名單 (Admins)
   - 教師名單 (Users)
   - 四個考試分項 (Exam Plans A/B/C/D)
3. 將這份資料在系統初始化時載入記憶體 (Memory Store/State)，供其他畫面讀取。
