# Design: Teacher Upload Modal

## Modal State
- `selectedMarkingType`: string (人工, 電腦, 人工+電腦) | null
- `selectedFile`: File object | null
- `pageCount`: number | null
- **Derived State**: `isFormValid = Boolean(selectedMarkingType && selectedFile && selectedFile.size <= 10485760 && pageCount > 0)`

## UI Layout
- (依據探索 Django 截圖)
- Modal Header: 顯示「上傳試卷」。
- Info Alert: 「操作說明：請先選擇閱卷方式並上傳檔案...」
- Details: 顯示已選中的【科別、科目名稱、年級、適用班級】。
- Error Text (Red): 「請勿上傳解答！請勿上傳解答！」
- Fields: 
  1. 閱卷方式
  2. PDF 選擇鈕
  3. 張數輸入
- Action: 按鈕由 `Disabled` 切換為 `Enabled`。

## Base64 Workflow
前端取得被選擇的 PDF，透過 `FileReader.readAsDataURL` 轉換，並剝除前綴後丟給 `MockApiService` 模擬上送後台。
