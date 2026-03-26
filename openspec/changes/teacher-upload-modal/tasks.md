# Tasks: Teacher Upload Modal

- [ ] Task 1: 實作 Upload Modal 靜態佈局。
  - **驗收標準**: 點擊 `teacher-dashboard-view` 的「上傳試卷」按鈕時，會成功彈出包含科目名稱、警告語、表單的浮動視窗。
- [ ] Task 2: 實作表單響應式驗證邏輯與防呆按鈕。
  - **驗收標準**: 初始狀態「確認上傳」必須是 `disabled`。只有當選擇了閱卷方式，填入大於 0 的張數，並且選取了 `.pdf` 且小於 10MB 的檔案時，該按鈕才會即刻解鎖。
- [ ] Task 3: 實作 Base64 轉換與 Mock Submit。
  - **驗收標準**: 點擊「確認上傳」後，按鈕會變成 Spinning/Loading 狀態。透過 `FileReader` 將 PDF 轉為 Base64 列印於 Console，呼叫 `MockApiService.updateTableRow` 後，視窗自動關閉，並且儀表板的該科會更新為「已上傳」狀態（或直接消失），最後彈出 Toast 成功提示。

- [ ] Task: 更新文件
  - **驗收標準**: 實作完成後，務必更新 `README.md` 的相關說明；如果涉及架構或業務邏輯的改變，請在 `docs/` 當中加入合適的文件。
