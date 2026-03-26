# Proposal: GAS API Write Endpoints

## Context
這是 SPA 遷移專案的第 10 個提案 (Phase 3)。

## Problem
前端 Admin CRUD 所做的任何資料變更，必須真正修改到試算表上（新增行、編輯行、刪除行），才能完成完整的後台功能。

## Solution
1. 在 `Code.js` 中補充對應的 CRUD 函數，如 `addTableRow`, `updateTableRow`, `deleteTableRow`。
2. 前端 `GasApiService.js` 實作上傳邏輯。
3. 為確保高併發或資料一致性，修改 GAS 試算表時最好使用 `LockService`，不過此專案規模較小，可視情況添加。
