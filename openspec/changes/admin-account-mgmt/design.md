# Design: Admin Account Management

## Data Structure
對應 Mock 的 `users` 表格，包含以下欄位：
- Email (主鍵/識別碼)
- 教師代碼 (String)
- 姓名 (String)
- 角色/權限 (Teacher / Admin)

## UI Layout
- **標題區**: 標題「帳號管理」與右上角的「+ 新增帳號」按鈕。
- **列表區**: 
  - 表格欄位：教師代碼、姓名、Email、角色、操作 (編輯/刪除)。
- **表單區 (Modal)**: 
  - 欄位：Email (必填)、姓名 (必填)、教師代碼、角色下拉選單。
  - 點擊「儲存」後驗證必填，通過則呼叫 Mock API 並更新畫面 Table。
