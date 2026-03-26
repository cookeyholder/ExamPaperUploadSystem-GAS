# Design: GAS API Write Endpoints

## Backend Functions (`Code.js`)
- `addTableRow(sheetName, dataObj)`: Append row to sheet.
- `updateTableRow(sheetName, primaryKey, dataObj)`: Find row by primary key (e.g., Email or Subject ID) and overwrite its columns.
- `deleteTableRow(sheetName, primaryKey)`: Find row and delete it.

## Frontend
- 將 Admin UI (Accounts, Classes, Exam Plans, Subjects) 的 Save 按鈕行為，從調用 `Mock` 改為調用 `GasApiService`。
