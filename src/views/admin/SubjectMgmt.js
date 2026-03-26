import { ApiService } from "../../services/api.js";

export class SubjectMgmt {
    static async render() {
        const settings = await ApiService.getTableData("settings");
        const users = await ApiService.getTableData("users");
        const teachers = users.filter((u) => u.role === "teacher" || u.role === "admin");

        // We'll just fetch exam1 for default view, or all exams combined.
        // To keep it simple, let's fetch exam1 as default, but in real app there'd be an Exam switcher.
        const examRows = await ApiService.getTableData("exam1");
        const activeSetting = settings.find((s) => s.id === "1") || { examName: "第一次定期考" };

        // Task 1: Table Layout
        const rowsHtml = examRows
            .map((row) => {
                const assignedTeacher = teachers.find((t) => t.email === row.teacherEmail);
                const teacherName = assignedTeacher
                    ? assignedTeacher.name
                    : '<span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>尚未指派</span>';

                return `
      <tr>
        <td class="align-middle">${row.department}</td>
        <td class="align-middle text-center">${row.grade}</td>
        <td class="align-middle fw-semibold text-primary">${row.subject}</td>
        <td class="align-middle">${teacherName} <small class="text-muted d-block">${row.teacherEmail || ""}</small></td>
        <td class="align-middle text-end">
          <button class="btn btn-sm btn-light text-primary me-2 edit-subject-btn" data-id="${row.id}" data-subject="${row.subject}">
            <i class="bi bi-person-fill-add me-1"></i>指派教師
          </button>
          <button class="btn btn-sm btn-light text-danger delete-subject-btn" data-id="${row.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      `;
            })
            .join("");

        // Task 2: Assign Teacher Modal
        const teacherOptions = teachers
            .map((t) => `<option value="${t.email}">${t.name} (${t.email})</option>`)
            .join("");

        const modalHtml = `
      <div class="modal fade" id="assignTeacherModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-0">
              <h5 class="modal-title fw-bold">設定命題教師</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="assignTeacherForm">
                <input type="hidden" id="s-id">
                <div class="alert alert-info border-0 mb-4">
                  正在為 <strong id="s-subject-name" class="text-primary"></strong> 指派命題教師
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">選擇教師</label>
                  <select class="form-select" id="s-teacher-email" required>
                    <option value="" selected disabled>請選擇...</option>
                    ${teacherOptions}
                  </select>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">取消</button>
                  <button type="submit" class="btn btn-primary px-4 fw-bold">儲存設定</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

        setTimeout(() => this.bindEvents(examRows), 0);

        return `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">科目與命題教師管理</h2>
          <p class="text-muted mb-0">目前顯示：<span class="badge bg-primary bg-opacity-10 text-primary">${activeSetting.academicYear}-${activeSetting.semester} ${activeSetting.examName}</span></p>
        </div>
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
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light text-muted small text-uppercase">
              <tr>
                <th class="ps-4">類別(群科)</th>
                <th class="text-center">年級</th>
                <th>科目名稱</th>
                <th>命題教師</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              ${rowsHtml}
            </tbody>
          </table>
          ${examRows.length === 0 ? '<div class="text-center py-5 text-muted">目前沒有資料</div>' : ""}
        </div>
      </div>
      ${modalHtml}
    `;
    }

    static bindEvents(examRows) {
        const modalEl = document.getElementById("assignTeacherModal");
        if (!modalEl) return;
        const modal = new bootstrap.Modal(modalEl);
        const form = document.getElementById("assignTeacherForm");

        // Assign Teacher Buttons
        document.querySelectorAll(".edit-subject-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                const subjectName = e.currentTarget.getAttribute("data-subject");
                const rowData = examRows.find((r) => r.id === id);

                if (rowData) {
                    form.reset();
                    document.getElementById("s-id").value = id;
                    document.getElementById("s-subject-name").textContent = subjectName;
                    if (rowData.teacherEmail) {
                        document.getElementById("s-teacher-email").value = rowData.teacherEmail;
                    }
                    modal.show();
                }
            });
        });

        // Delete Buttons
        document.querySelectorAll(".delete-subject-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                if (confirm(`確定要刪除該筆考科資料嗎？`)) {
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

        // Form Submit (Assign Teacher)
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>儲存中...';

            const id = document.getElementById("s-id").value;
            const teacherEmail = document.getElementById("s-teacher-email").value;

            try {
                await ApiService.updateTableRow("exam1", "id", id, { teacherEmail });
                modal.hide();
                window.location.reload();
            } catch (err) {
                alert("儲存失敗: " + err.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "儲存設定";
            }
        });
    }
}
