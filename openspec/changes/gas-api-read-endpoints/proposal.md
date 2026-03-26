# Proposal: GAS API Read Endpoints

## Context
這是 SPA 遷移專案的第 9 個提案 (Phase 3 啟動)。

## Problem
前端的 UI 與邏輯已經基於 Mock 跑得很順暢了。現在我們必須讓專案正式連上 Google 試算表，把原本讀取 `mockData.js` 的行為替換為讀取試算表的真實資料。

## Solution
1. 建立 `GasApiService.js` 作為正式版 API 介面。
2. 啟動 `clasp` 將本機程式碼 (`Code.js`) push 到 GAS 專案。
3. 在 `Code.js` 中實作 `getWebsiteData()` 函數（被前端透過 `google.script.run` 呼叫），回傳 7 張工作表的所有資料。
4. 前端掛載時，先判定是否在 GAS 環境 (`typeof google !== 'undefined'`)：如果是，呼叫 GAS API；如果否（本地開發時），繼續使用 Mock。
