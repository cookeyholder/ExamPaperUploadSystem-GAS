#  Django 遷移 GAS - 實作藍圖與順序 (Roadmap)

這個文件用於追蹤我們 11 個 OpenSpec 提案的實作順序與狀態。每次開始一個新提案前，請先確認前置提案已經 **實作完畢(Implemented)** 並通過測試。

## 🧱 階段一：底層路由與教師核心流程 (前端先行)
| 順序 | 提案資料夾 | 說明 | 狀態 |
|---|---|---|---|
| 01 | `setup-spa-routing-shell` | 建立 Vite 前端架構、全局 Sidebar 側邊導覽列與 Router 機制 | ✅ 完成 |
| 02 | `base-schema-and-mock` | 建立 7 張工作表結構的完整 JSON Mock 資料引擎 | ✅ 完成 |
| 03 | `teacher-dashboard-view` | 實作教師登入後的儀表板空狀態與考試清單渲染 | ✅ 完成 |
| 04 | `teacher-upload-modal` | 實作核心的上傳對話框（包含閱卷方式、張數寫寫與防呆機制） | 🔄 進行中 |

## 🛠️ 階段二：管理端介面復刻 (CRUD Tables 組件化)
| 順序 | 提案資料夾 | 說明 | 狀態 |
|---|---|---|---|
| 05 | `admin-account-mgmt` | 實作帳號管理頁面 (新增、編輯教師與權限) | ⏳ 未開始 |
| 06 | `admin-class-mgmt` | 實作群科班級管理頁面 | ⏳ 未開始 |
| 07 | `admin-subject-mgmt` | 實作科目管理與「設定命題教師」功能 | ⏳ 未開始 |
| 08 | `admin-exam-plan-mgmt` | 實作考試分項管理 | ⏳ 未開始 |

## 🔌 階段三：GAS 後端真實串接
| 順序 | 提案資料夾 | 說明 | 狀態 |
|---|---|---|---|
| 09 | `gas-api-read-endpoints` | 撰寫 GAS 後端讀取端點，替換掉前端的 GET Mock Data | ⏳ 未開始 |
| 10 | `gas-api-write-endpoints` | 撰寫 GAS 後端寫入/刪除端點，替換掉前端的 POST/DELETE Mock Data | ⏳ 未開始 |
| 11 | `gas-drive-upload-flow` | 實作Base64 試卷轉 PDF，寫入 Drive 並更新試算表 | ⏳ 未開始 |

---

## 📌 實作與驗證守則
1. **單向推進**：每個提案都必須使用 `@[/openspec-apply-change] <name>` 進行實作。
2. **嚴格驗證**：實作完成後，必須對照該提案 `tasks.md` 裡的**驗收標準**，在前端介面上執行手動或自動化測試（例如參考我們撰寫的 `frontend_behavior_specs.md`）。
3. **封存結案**：如果功能正確無誤，請使用 `@[/openspec-archive-change] <name>` 封存該提案，然後再進入下一個。
4. **追溯修改**：如果未來的提案發現過去的架構有缺陷，**不要回去改舊提案**，而是直接在**當下提案的 `design.md` 裡記錄「重構決定」**，然後實作掉即可。
