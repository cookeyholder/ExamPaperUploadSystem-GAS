# Proposal: Setup SPA Routing Shell

## Context
這是 SPA 遷移專案的第 1 個提案 (Phase 1)。

## Problem
Django 專案是多頁面路由 (MPA)，而我們的目標是建立一個體驗無縫的單頁應用程式 (SPA)。我們需要一個基礎的專案結構，包含左側導覽列 (Sidebar)、頂部導覽列，以及能動態切換內容的路由中心 (Router)。

## Solution
1. 使用 Vite 初始化 Vanilla JS 或 Vue/React (視開發習慣，本專案以 Vanilla JS/Hash Router 或輕量框架為主) 作為地端開發環境。
2. 配置 Tailwind CSS 或 Bootstrap 5。
3. 建立一個包含 `Sidebar` 與 `TopNav` 的共用 Layout (Main Shell)。
4. 實作基礎的 Client-side Routing 機制，註冊首頁 `/` 與預留的後台路徑 `/admin/...`。
