# Design: GAS API Read Endpoints

## Backend Functions (`Code.js`)
- `getWebsiteData()`: 
  - 連接 SpreadsheetID (可寫在參數檔)。
  - 讀取 [設定, 教師, 管理員, 考試1, 考試2, 考試3, 考試4] 表。
  - 將 2D Array 轉為 Array of Objects (JSON format)，然後回傳至前端。
- `validateUser()`:
  - 透過 `Session.getActiveUser().getEmail()` 取得目前執行者的信箱。
  - 檢查是否在教師表或管理員表中，並附帶 Role 回傳給前端。

## Frontend Integration
- 修改前端的資料取得源頭，原本直接拿 `mockData` 改為 await `google.script.run.withSuccessHandler(...).getWebsiteData()`。
