import { ApiService } from "../../services/api.js";
import { updatePageHeader } from "../../utils/ui.js";

export class SubjectMgmt {
    static async render() {
        const settings = await ApiService.getTableData("settings");
        const examRows = await ApiService.getTableData("exam1");
        const activeSetting = settings.find((s) => s.id === "1") || { examName: "第一次定期考" };

        // Table rows — subject CRUD only, no teacher assignment
        const rowsHtml = examRows
            .map(
                (row) => `
      <tr>
        <td class="align-middle ps-4">${row.department}</td>
        <td class="align-middle text-center">${row.grade}</td>
        <td class="align-middle fw-semibold text-primary">${row.subject}</td>
        <td class="align-middle text-end pe-4">
          <button class="btn btn-sm btn-light text-danger delete-subject-btn fs-6" data-id="${row.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      `,
            )
            .join("");

        setTimeout(() => this.bindEvents(), 0);

        updatePageHeader("科目管理", "管理系統內的所有科目及其對應的群科年級");

        return `
        <div class="d-flex justify-content-end mb-4">
        <div>
          <button class="btn btn-light shadow-sm text-primary fw-semibold me-2" id="import-subject-btn">
            <i class="bi bi-file-earmark-excel me-1"></i> 匯入名單
          </button>
          <button class="btn btn-primary shadow-sm fw-semibold" id="add-subject-btn">
            <i class="bi bi-plus-lg me-1"></i> 新增科目
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover mb-0 align-middle fs-6">
            <thead class="table-light text-muted text-uppercase">
              <tr>
                <th class="ps-4">類別（群科）</th>
                <th class="text-center">年級</th>
                <th>科目名稱</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              ${rowsHtml}
            </tbody>
          </table>
          ${examRows.length === 0 ? '<div class="text-center py-5 text-muted">目前沒有科目資料</div>' : ""}
        </div>
      </div>
    `;
    }

    /**
     * 綁定科目刪除按鈕事件
     */
    static bindEvents() {
        document.querySelectorAll(".delete-subject-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                if (confirm("確定要刪除該筆科目資料嗎？")) {
                    try {
                        e.currentTarget.disabled = true;
                        await ApiService.deleteTableRow("exam1", "id", id);
                        window.location.reload();
                    } catch (err) {
                        alert("刪除失敗: " + err.message);
                        e.currentTarget.disabled = false;
                    }
                }
            });
        });
    }
}
