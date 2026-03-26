# Design: Setup SPA Routing Shell

## Architecture
- **Bundler**: Vite (`npm create vite@latest`)。
- **Styling**: Bootstrap 5 (為求與原專案一致) 或 Tailwind CSS。
- **Router Layer**:
  - `Router.js`: 監聽 `hashchange` 事件，根據 `#` 後的路徑動態加載對應的 View Component 到 `<main id="app-content">` 容器中。
- **Entry Layout (`index.html`)**:
  - `<nav id="sidebar">` (隱藏/展開邏輯)
  - `<header id="topnav">` (顯示登入人員姓名)
  - `<main id="app-content">` (路由出口)

## Routes Definition (Draft)
- `#/`: 首頁 (教師儀表板)
- `#/admin/users`: 帳號管理
- `#/admin/classes`: 群科班級管理
- `#/admin/subjects`: 科目管理
- `#/admin/exam-plans`: 考試分項管理
