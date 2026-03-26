# Proposal: Teacher Dashboard View

## Context
這是 SPA 遷移專案的第 3 個提案 (Phase 1)。依賴 `setup-spa-routing-shell` 與 `base-schema-and-mock`。

## Problem
教師登入後的第一個首頁，必須明確針對「該教師」的視角，顯示目前正在開放上傳期間，且該教師有被指派為命題教師的考試科目清單。如果是空狀態也要有明確指示。

## Solution
1. 建立 `TeacherDashboard` 元件，掛載於首頁路由 `#/`。
2. 從 `MockApiService.getUserInfo()` 取得當下登入者的 Email。
3. 掃描四個考試分項表 (`exam1` ~ `exam4`) 與 `settings` 表：
   - 該考試必須在「設定表的開放時間區間內」。
   - 該科目的「命題教師」必須等於當下登入者的 Email。
   - 該科目尚未上傳試卷。
4. 將過濾後的資料以「代辦事項清單 (To-Do List)」或「卡片 (Card)」的 UI 方式呈現，並附上「上傳」按鈕。
5. 若無符合條件的科目，顯示空狀態提示。
