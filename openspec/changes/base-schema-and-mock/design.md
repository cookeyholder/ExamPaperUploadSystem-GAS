# Design: Base Schema and Mock Data

## Data Schema (Spreadsheet Columns)
未來對應的 GAS Spreadsheet 結構如下，Mock 資料需完全符合此 Schema：
- `設定`：年份, 學期, 考試名稱, 開放上傳時間, 截止上傳時間
- `帳號名單`：Email, 教師代碼, 姓名, 角色(admin/teacher)
- `群科班級`：代碼, 名稱
- `定期考 (4張工作表)`：流水號, 科別, 年級, 科目, 教師(Email), 試卷檔案(Hyperlink公式), 閱卷方式, 張數

## Module Implementation
- `src/services/MockApiService.js`:
  - `getUserInfo()`: 回傳目前的登入者 mock 資訊。
  - `getTableData(tableName)`
  - `updateTableRow(tableName, id, data)` 
  ※ 這將為了未來的 `GasApiService` 預留相同的介面。
