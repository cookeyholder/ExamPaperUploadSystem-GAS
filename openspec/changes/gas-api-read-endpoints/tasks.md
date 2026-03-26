# Tasks: GAS API Read Endpoints

- [ ] Task 1: 撰寫 `Code.js` 的讀取邏輯。
  - **驗收標準**: `getWebsiteData()` 被呼叫時，能正確遍歷 7 張工作表，並將資料轉為 Array of Object 格式後回傳（格式需與 `mockData` 完全一致）。
- [ ] Task 2: 撰寫 `GasApiService.js` 並連接前端應用。
  - **驗收標準**: 將前端部屬到 GAS 測試網址 (`/dev` URL) 後，登入系統能看到真實從試算表讀出的課程與設定資料。
- [ ] Task 3: 實作 GAS 身分驗證
  - **驗收標準**: 系統會依照 `Session.getActiveUser().getEmail()` 自動登入，並比對權限。如果是管理員，左側導覽列才會出現「科目管理、帳號管理」等連結；如果只是一般教師，僅能看到「試卷上傳系統」首頁。

- [ ] Task: 更新文件
  - **驗收標準**: 實作完成後，務必更新 `README.md` 的相關說明；如果涉及架構或業務邏輯的改變，請在 `docs/` 當中加入合適的文件。
