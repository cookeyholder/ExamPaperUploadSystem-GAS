# Tasks: Base Schema and Mock Data

- [ ] Task 1: 建立硬編碼的靜態模擬資料庫 (`mockData.js`)，包含至少 5 位教師、2 個管理員、與若干考科設定。
  - **驗收標準**: `mockData.js` 檔案中匯出包含了 `settings`, `users`, `classes`, 以及 `exam1` 到 `exam4` 的屬性，陣列結構等同於試算表的 Row/Col。
- [ ] Task 2: 實作 `MockApiService` 類別，提供非同步 (async) 的讀取與寫入方法。
  - **驗收標準**: 在 `index.html` 或任何 js entry 執行 `await MockApiService.getTableData('users')` 時，能在一秒後成功取得對應的 JSON 陣列。
- [ ] Task 3: 在前端啟動時，印出 Mock 資料以茲證明。
  - **驗收標準**: 重整頁面時，Console 應印出 `[Mock API] System initialized with X users and Y active exams.` 不拋出錯誤。

- [ ] Task: 更新文件
  - **驗收標準**: 實作完成後，務必更新 `README.md` 的相關說明；如果涉及架構或業務邏輯的改變，請在 `docs/` 當中加入合適的文件。
