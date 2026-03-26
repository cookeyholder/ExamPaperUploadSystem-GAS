# Proposal: GAS Drive Upload Flow & Versioning

## Context
這是 SPA 遷移專案的第 11 個提案（也是最後一個，Phase 3）。

## Problem
上傳的試卷 PDF 必須存入指定的 Google Drive 資料夾，自動套用特定的檔名規則（依據原始 Django 系統的 `ESP` models 邏輯），而且要將該檔案的分享連結 (Hyperlink) 回寫到試算表該考試科目的記錄中。此處還要處理「重複上傳」的覆蓋問題。

## Solution
1. 前端在 `teacher-upload-modal` 完成 Base64 轉換後，呼叫 `Code.js` 的 `uploadExamPaper(base64Data, metadata)`。
2. 後端解碼 Base64，並透過 `DriveApp.getFolderById()` 存入指定年份學期的子資料夾內。
3. 檔名必須依循規則：`[考試分項]_[科別]_[科目].pdf` 或是 `[命題教師Email]_[科目名稱].pdf` (以原 Django 規定為主)。
4. 如果檔名已存在，則將舊檔案移至「封存/歷史」資料夾，或直接刪除舊檔案建立新檔（達到最新版本的目的）。
5. 寫入試算表儲存格資料為 `=HYPERLINK("https://...", "下載檔案")`。
