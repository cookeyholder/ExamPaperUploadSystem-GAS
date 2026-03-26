# Design: Admin Subject Management

## Data Structure
對應 Mock 中的科目結構（可能附屬於某個 Exam Plan，或是獨立的科目庫）。設計上在現有系統中，科目常是綁定於考試分項的 (`ExamSheet`)。
- 科別 (String)
- 年級 (Number)
- 科目名稱 (String)
- 教師Email (String, optional)

## UI Layout
- **標題區**: 標題「科目管理」。
- **列表區**: 
  - 欄位：科別、年級、科目名稱、命題教師、操作。
  - 當「命題教師」為空時，該欄位顯示紅色「未設定」。
- **設定命題教師 Modal**:
  - 包含一個 `<select>`，選項為系統內所有角色為 Teacher 的用戶 (從 `users` 取得 姓名/Email)。
