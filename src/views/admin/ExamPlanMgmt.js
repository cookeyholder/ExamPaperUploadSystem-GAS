import { ApiService } from "../../services/api.js";

export class ExamPlanMgmt {
    static async render() {
        const settings = await ApiService.getTableData("settings");

        // Task 1: Table Layout
        const rowsHtml = settings
            .map((row) => {
                let statusHtml = "";
                const now = new Date();
                const start = new Date(row.uploadStart);
                const end = new Date(row.uploadEnd);

                if (!row.uploadStart || !row.uploadEnd) {
                    statusHtml =
                        '<span class="badge bg-secondary bg-opacity-10 text-secondary"><i class="bi bi-dash-circle me-1"></i>未設定</span>';
                } else if (now < start) {
                    statusHtml =
                        '<span class="badge bg-warning bg-opacity-10 text-warning"><i class="bi bi-clock me-1"></i>尚未開始</span>';
                } else if (now > end) {
                    statusHtml =
                        '<span class="badge bg-danger bg-opacity-10 text-danger"><i class="bi bi-x-circle me-1"></i>已截止</span>';
                } else {
                    statusHtml =
                        '<span class="badge bg-success bg-opacity-10 text-success"><i class="bi bi-check-circle me-1"></i>開放中</span>';
                }

                const formatDt = (dtStr) => {
                    if (!dtStr) return "尚未設定";
                    const d = new Date(dtStr);
                    return d.toLocaleString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                };

                return `
      <tr>
        <td class="align-middle fw-semibold">${row.academicYear}-${row.semester}</td>
        <td class="align-middle fw-bold text-primary">${row.examName}</td>
        <td class="align-middle">
          <div class="mb-1 fs-6"><span class="text-muted d-inline-block" style="width:44px;">開始:</span> ${formatDt(row.uploadStart)}</div>
          <div class="fs-6"><span class="text-muted d-inline-block" style="width:44px;">結束:</span> ${formatDt(row.uploadEnd)}</div>
        </td>
        <td class="align-middle">
          ${statusHtml}
        </td>
        <td class="align-middle text-end pe-4">
          <button class="btn btn-sm btn-light text-primary me-2 edit-plan-btn fs-6 fw-medium" data-id="${row.id}">
            <i class="bi bi-calendar-range me-1"></i>設定時間
          </button>
        </td>
      </tr>
      `;
            })
            .join("");

        // Task 2: Edit Modal Form
        const modalHtml = `
      <div class="modal fade" id="examPlanModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-0">
              <h5 class="modal-title fw-bold">設定上傳時間開放窗</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="examPlanForm">
                <input type="hidden" id="ep-id">
                <div class="alert alert-info border-0 mb-4">
                  設定 <strong id="ep-name" class="text-primary"></strong> 的試卷上傳期間。
                </div>
                
                <div class="mb-3">
                  <label class="form-label fw-semibold">開始時間</label>
                  <input type="datetime-local" class="form-control" id="ep-start" required>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">結束時間 (截止期限)</label>
                  <input type="datetime-local" class="form-control" id="ep-end" required>
                  <div class="form-text text-danger mt-2" id="ep-error" style="display:none;">結束時間必須晚於開始時間！</div>
                </div>

                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">取消</button>
                  <button type="submit" class="btn btn-primary px-4 fw-bold" id="ep-submit-btn">儲存設定</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

        setTimeout(() => this.bindEvents(settings), 0);

        return `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">考試分項管理</h2>
          <p class="text-muted mb-0">管理系統內各項考試的開放時間窗</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover mb-0 align-middle fs-6">
            <thead class="table-light text-muted text-uppercase">
              <tr>
                <th class="ps-4">學年度學期</th>
                <th>考試名稱</th>
                <th>上傳時間起迄</th>
                <th>狀態</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              ${rowsHtml}
            </tbody>
          </table>
          ${settings.length === 0 ? '<div class="text-center py-5 text-muted">目前沒有資料</div>' : ""}
        </div>
      </div>
      ${modalHtml}
    `;
    }

    static bindEvents(settingsRows) {
        const modalEl = document.getElementById("examPlanModal");
        if (!modalEl) return;
        const modal = new bootstrap.Modal(modalEl);
        const form = document.getElementById("examPlanForm");
        const startInput = document.getElementById("ep-start");
        const endInput = document.getElementById("ep-end");
        const errorMsg = document.getElementById("ep-error");
        const submitBtn = document.getElementById("ep-submit-btn");

        // Validation functionality (Task 2)
        const validateDates = () => {
            const start = new Date(startInput.value);
            const end = new Date(endInput.value);
            if (start && end && start >= end) {
                errorMsg.style.display = "block";
                submitBtn.disabled = true;
            } else {
                errorMsg.style.display = "none";
                submitBtn.disabled = false;
            }
        };

        startInput.addEventListener("change", validateDates);
        endInput.addEventListener("change", validateDates);

        // Edit Plan Buttons
        document.querySelectorAll(".edit-plan-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                const rowData = settingsRows.find((r) => r.id === id);

                if (rowData) {
                    form.reset();
                    document.getElementById("ep-id").value = id;
                    document.getElementById("ep-name").textContent =
                        `${rowData.academicYear}-${rowData.semester} ${rowData.examName}`;

                    if (rowData.uploadStart) {
                        // Convert "2026-03-25T00:00:00" -> "2026-03-25T00:00" for datetime-local
                        startInput.value = rowData.uploadStart.slice(0, 16);
                    }
                    if (rowData.uploadEnd) {
                        endInput.value = rowData.uploadEnd.slice(0, 16);
                    }

                    validateDates();
                    modal.show();
                }
            });
        });

        // Form Submit (Update Date Range)
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const start = new Date(startInput.value);
            const end = new Date(endInput.value);
            if (start >= end) return;

            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>儲存中...';

            const id = document.getElementById("ep-id").value;

            try {
                // Appending :00 to format properly for backend mock (ISO standard-ish check)
                const startStr = startInput.value + ":00";
                const endStr = endInput.value + ":00";

                await ApiService.updateTableRow("settings", "id", id, {
                    uploadStart: startStr,
                    uploadEnd: endStr,
                });

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
