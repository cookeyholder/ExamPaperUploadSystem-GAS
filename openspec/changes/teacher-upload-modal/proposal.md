# Proposal: Teacher Upload Modal

## Context
這是 SPA 遷移專案的第 4 個提案 (Phase 1 最後一步)。依賴 `teacher-dashboard-view`。

## Problem
當教師點開「上傳試卷」時，系統必須引導他們選擇「閱卷方式」、「填寫張數」並「上傳小於 10MB 的 PDF」。為了防止教師誤傳，必須在前端做到最嚴謹的表單防呆機制，只有所有條件滿足，按鈕才會解鎖。

## Solution
1. 建立一個浮動視窗 (Modal) 元件 `UploadExamModal`。
2. 內含三個核心表單欄位：閱卷方式 (Radio)、PDF 檔案 (Input type=file)、張數 (Input type=number)。
3. 使用響應式狀態 (Reactivity/State) 監控這三個欄位的合法性，合法時才解鎖 Sumbit 按鈕。
4. 結合 Base64 API (FileReader)，將檔案轉為字串後呼叫 `MockApiService.updateTableRow` 完成上傳。
