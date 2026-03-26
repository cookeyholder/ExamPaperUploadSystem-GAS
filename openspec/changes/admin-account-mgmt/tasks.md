# Tasks: Admin Account Management

- [ ] Task 1: 實作可重用的 `DataTable` 元件或配置好該頁面的原生 Table HTML 佈局。
  - **驗收標準**: 進入 `#/admin/users` 頁面時，畫面能以表格形式正確印出 `mockData` 中的所有教師與管理員資料。
- [ ] Task 2: 實作「新增帳號」表單 Modal 與建立邏輯 (Create)。
  - **驗收標準**: 點擊新增按鈕會跳出 Modal，填寫有效的 Email 與姓名並點擊儲存後，信箱不可與現有重複，成功後呼叫 MockApi，Modal 關閉，表格立刻多出一筆新資料。
- [ ] Task 3: 實作「編輯」與「刪除」邏輯 (Update/Delete)。
  - **驗收標準**: 點擊任一列的「刪除」會跳出確認視窗，確認後該列消失；點擊「編輯」能將資料帶入 Modal 進行修改，儲存後即時反映在表格上。

- [ ] Task: 更新文件
  - **驗收標準**: 實作完成後，務必更新 `README.md` 的相關說明；如果涉及架構或業務邏輯的改變，請在 `docs/` 當中加入合適的文件。
