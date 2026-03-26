# Proposal: Admin Exam Plan Management

## Context
這是 SPA 遷移專案的第 8 個提案 (Phase 2 最後一步)。

## Problem
每次段考前，註冊組長需要到系統建立一個新的「考試分項」(例如：113-1 第四次定期考)，定義該次考試的設定，包含學期資訊與最關鍵的「開放上傳區間」。

## Solution
1. 建立 `AdminExamPlanMgmt` 元件，掛載於路徑 `#/admin/exam-plans`。
2. 對接 Mock API 中的 `settings` 表格。每次系統在判定「目前正在進行哪些考試」就是倚賴這張表的紀錄。
3. 實作新增、編輯（修改開放時間）、刪除考試分項的 CRUD 表單。
