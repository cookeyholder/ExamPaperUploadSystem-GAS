# Design: GAS Drive Upload Flow & Versioning

## Backend Functions (`Code.js`)
- `uploadExamPaper({ base64Data, examName, department, subject, markingType, pageCount, teacherEmail })`:
  1. 轉換 Blob: `Utilities.base64Decode` -> `Utilities.newBlob(..., 'application/pdf')`
  2. 尋找根資料夾 (從系統參數取得 Folder ID)。
  3. 檔案命名: `{examName}-{department}-{subject}-{teacherEmail}.pdf`
  4. 檢查是否存在同名檔案，若有則覆蓋或移除舊檔。
  5. 寫入到 Drive，設定權限為「知道連結的人即可檢視」(如果需要讓列印室的人直接批量下載)。
  6. 取得 URL。
  7. 呼叫 `updateTableRow`，將該科目的 `試卷檔案` 欄位更新為 URL，並將 `閱卷方式` 與 `張數` 也記錄進去。
