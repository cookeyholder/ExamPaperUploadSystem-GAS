# Proposal: Admin Subject Management

## Context
這是 SPA 遷移專案的第 7 個提案 (Phase 2)。

## Problem
在考試分項建立前，或是平時考科異動時，註冊組長需要維護系統的「科目清單」。並且為了分配上傳任務，每項科目都必須明確「指定命題教師」。

## Solution
1. 建立 `AdminSubjectMgmt` 元件，掛載於路徑 `#/admin/subjects` (或作為某個 Tab 存在)。
2. 從 Mock 讀取科目列表，欄位包含：年級、科別、科目名稱、命題教師。
3. 提供「設定命題教師」功能，點擊後彈出對話框，可以從 `users` (教師名單) 下拉選單中指派某位教師負責。
4. 提供基礎的新增/刪除科目功能。
