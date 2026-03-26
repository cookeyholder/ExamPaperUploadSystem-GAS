# Tasks: Setup SPA Routing Shell

- [x] Task 1: 初始化 Vite 專案並安裝必要的 CSS 框架 (Tailwind/Bootstrap)。
  - **驗收標準**: 執行 `npm run dev` 可以在本機 `http://localhost:5173` 看到預設成功畫面。
- [x] Task 2: 撰寫全局的 Layout (包含左側/頂部導覽列與主要的內容區塊 `<main>`)。
  - **驗收標準**: 畫面呈現典型的後台佈局，左側有選單列表，且在手機版能縮放或隱藏。
- [x] Task 3: 實作前端 Hash Router 系統。
  - **驗收標準**: 點擊左側選單的「帳號管理」時，網址列變為 `#/admin/users`，且 `<main>` 區塊的內容會抽換為該頁面的 Placeholder 訊息（如：正在開發中），並且不會引發整個網頁重新整理 (No full page reload)。

- [x] Task: 更新文件
  - **驗收標準**: 實作完成後，務必更新 `README.md` 的相關說明；如果涉及架構或業務邏輯的改變，請在 `docs/` 當中加入合適的文件。
