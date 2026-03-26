# Proposal: Admin Class Management

## Context
這是 SPA 遷移專案的第 6 個提案 (Phase 2)。

## Problem
管理員需要管理學校現有的群科與班級。系統在上傳試卷時會需要知道該試卷「適用班級」，因此我們需要建立一個介面來維護班級清單。

## Solution
1. 建立 `AdminClassMgmt` 元件，掛載於路徑 `#/admin/classes`。
2. 沿用在 `admin-account-mgmt` 建立的 UI 模式與元件。
3. 提供班級的列表、新增、編輯與刪除功能 (CRUD 對接 Mock API)。
