import { ApiService } from "../../services/api.js";
import { updatePageHeader } from "../../utils/ui.js";

export class SubjectMgmt {
    static async render() {
        const settings = await ApiService.getTableData("settings");
        const examRows = await ApiService.getTableData("exam1");
        // Get unique departments/grades for suggestions/dropdowns
        const departments = [...new Set(examRows.map(r => r.department))].sort();
        const grades = [...new Set(examRows.map(r => r.grade))].sort((a,b) => a-b);

        // Table rows
        const rowsHtml = examRows
            .map(
                (row) => `
      <tr>
        <td class="align-middle ps-4">${row.department}</td>
        <td class="align-middle text-center">${row.grade}</td>
        <td class="align-middle fw-semibold text-primary">${row.subject}</td>
        <td class="align-middle text-end pe-4">
          <button class="btn btn-sm btn-light text-primary me-1 edit-subject-btn" 
            data-id="${row.id}" data-dept="${row.department}" data-grade="${row.grade}" data-subject="${row.subject}" title="編輯">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-light text-success me-1 copy-subject-btn" 
            data-dept="${row.department}" data-grade="${row.grade}" data-subject="${row.subject}" title="複製">
            <i class="bi bi-copy"></i>
          </button>
          <button class="btn btn-sm btn-light text-danger delete-subject-btn" data-id="${row.id}" title="刪除">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      `,
            )
            .join("");

        const deptOptions = departments.map(d => `<option value="${d}">${d}</option>`).join("");

        // Modal HTML
        const modalHtml = `
      <div class="modal fade" id="subjectModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-header border-bottom-0 px-4 pt-4 pb-0">
              <h5 class="modal-title fw-bold" id="sm-title">新增科目</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="subjectForm">
                <input type="hidden" id="sm-id">
                <div class="mb-3">
                  <label class="form-label fw-semibold">科別</label>
                  <input type="text" class="form-control" id="sm-dept" list="dept-list" required placeholder="例如：共同科目">
                  <datalist id="dept-list">${deptOptions}</datalist>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">年級</label>
                  <select class="form-select" id="sm-grade" required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">科目名稱</label>
                  <input type="text" class="form-control" id="sm-subject" required placeholder="例如：國語文">
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-light fw-bold rounded-pill px-4 me-2" data-bs-dismiss="modal">取消</button>
                  <button type="submit" class="btn btn-primary fw-bold rounded-pill px-4" id="sm-submit-btn">儲存</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

        setTimeout(() => this.bindEvents(examRows), 0);

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
                <th class="ps-4">科別</th>
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
      ${modalHtml}
    `;
    }

    /**
     * 綁定事件
     */
    static bindEvents(allSubjects) {
        const modalEl = document.getElementById("subjectModal");
        if (!modalEl) return;
        const modal = new bootstrap.Modal(modalEl);
        const form = document.getElementById("subjectForm");

        // Add
        document.getElementById("add-subject-btn")?.addEventListener("click", () => {
            form.reset();
            document.getElementById("sm-id").value = "";
            document.getElementById("sm-title").textContent = "新增科目";
            modal.show();
        });

        // Edit
        document.querySelectorAll(".edit-subject-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const b = e.currentTarget;
                document.getElementById("sm-id").value = b.dataset.id;
                document.getElementById("sm-dept").value = b.dataset.dept;
                document.getElementById("sm-grade").value = b.dataset.grade;
                document.getElementById("sm-subject").value = b.dataset.subject;
                document.getElementById("sm-title").textContent = "編輯科目";
                modal.show();
            });
        });

        // Copy
        document.querySelectorAll(".copy-subject-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const b = e.currentTarget;
                document.getElementById("sm-id").value = ""; // No ID for copy
                document.getElementById("sm-dept").value = b.dataset.dept;
                document.getElementById("sm-grade").value = b.dataset.grade;
                document.getElementById("sm-subject").value = b.dataset.subject;
                document.getElementById("sm-title").textContent = "複製科目 (請修改後儲存)";
                modal.show();
            });
        });

        // Delete
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

        // Form Submit
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("sm-id").value;
            const dept = document.getElementById("sm-dept").value.trim();
            const grade = parseInt(document.getElementById("sm-grade").value);
            const subject = document.getElementById("sm-subject").value.trim();

            // Uniqueness Validation
            const isDuplicate = allSubjects.some(s => 
                s.id !== id && 
                s.department === dept && 
                s.grade === grade && 
                s.subject === subject
            );

            if (isDuplicate) {
                alert("儲存失敗：已存在相同屬性的科目（群科、年級、科目名稱皆相同）！");
                return;
            }

            const submitBtn = document.getElementById("sm-submit-btn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>處理中...';

            try {
                if (id) {
                    await ApiService.updateTableRow("exam1", "id", id, {
                        department: dept,
                        grade: grade,
                        subject: subject
                    });
                } else {
                    await ApiService.addTableRow("exam1", {
                        department: dept,
                        grade: grade,
                        subject: subject,
                        teacherEmail: "",
                        fileUrl: "",
                        markingType: "",
                        pageCount: 0
                    });
                }
                modal.hide();
                window.location.reload();
            } catch (err) {
                alert("儲存失敗: " + err.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "儲存";
            }
        });
    }
}
