# Design: Teacher Dashboard View

## UI Layout
- **標題**: 試卷上傳情形
- **空狀態 (Empty State)**: 使用 Bootstrap/Tailwind Alert 或 Card 顯示「您目前沒有需要上傳試卷檔案的科目」與提示 icon。
- **列表狀態 (List State)**:
  - 每個待辦科目顯示：考試名稱 (如：113-1第一次定期考)、年級、科別、科目名稱。
  - 右側或下方有一個藍色的「上傳試卷」大按鈕。

## Logic Flow
1. `onMounted` 時觸發 `loadPendingExams(userEmail)` 函數。
2. 該函數迭代四張考卷表，進行條件過濾：
   - `Exam_Settings.isOpen(now) === true`
   - `ExamSheet.teacherEmail === userEmail`
   - `ExamSheet.fileUrl === ""` (尚未上傳)
3. 將結果存入 State，畫面根據 State Render。
