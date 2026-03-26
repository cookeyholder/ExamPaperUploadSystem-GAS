# Proposal: Admin Account Management

## Context
這是 SPA 遷移專案的第 5 個提案 (Phase 2)。依賴 `setup-spa-routing-shell` 與 `base-schema-and-mock`。

## Problem
註冊組長需要一個後台介面來管理系統內所有的使用者（教師、管理員）。在原本的 Django 中，這依賴內建的 Admin 或特定的 Views，而在 SPA 中，我們需要建立一個專屬的 Data Table 與表單。

## Solution
1. 建立 `AdminAccountMgmt` 元件，掛載於路徑 `#/admin/users`。
2. 開發一個共用的 `DataTable` UI 元件，用來渲染帳號列表。
3. 提供「新增教師帳號」與「編輯」功能按鈕。
4. CRUD 動作皆透過呼叫 `MockApiService.getTableData('users')` / `updateTableRow` 等方法，保證 UI 能即時響應。
