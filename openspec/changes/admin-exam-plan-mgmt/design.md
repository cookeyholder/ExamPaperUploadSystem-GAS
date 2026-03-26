# Design: Admin Exam Plan Management

## Data Structure
對應 Mock 的 `settings`：
- 學年度 (e.g. 113)
- 學期 (1, 2)
- 考試名稱 (e.g. 第三次定期考)
- 開始上傳時間 (DateTime string)
- 結束上傳時間 (DateTime string)

## UI Layout
- **標題區**: 「考試分項管理」。
- **列表區**: 
  - 欄位：學年度/學期、考試名稱、開放狀態 (以 badge 顯示目前是否開放)、開始時間、結束時間、操作 (進入該考試的科目列表/編輯/刪除)。
- **設定 Modal**:
  - 提供 `datetime-local` 的輸入框讓管理員直覺選擇時間區間。
  - 日期驗證：結束時間必須大於開始時間。
