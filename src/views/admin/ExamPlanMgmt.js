import { ApiService } from "../../services/api.js";

export class ExamPlanMgmt {
    static async render() {
        const settings = await ApiService.getTableData("settings");
        const users = await ApiService.getTableData("users");
        const teachers = users.filter((u) => u.role === "teacher" || u.role === "admin");

        // Pre-fetch all exam tables to build teacher assignment UI
        const allExamData = {};
        for (const row of settings) {
            if (row.table) {
                try {
                    allExamData[row.table] = await ApiService.getTableData(row.table);
                } catch (e) {
                    console.error(`Failed to fetch table ${row.table}:`, e);
                    allExamData[row.table] = [];
                }
            }
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

        // Task 1: Table rows for each exam plan
        const rowsHtml = settings
            .map((row) => {
                const now = new Date();
                const start = new Date(row.uploadStart);
                const end = new Date(row.uploadEnd);
                let statusHtml = "";

                if (!row.uploadStart || !row.uploadEnd) {
                    statusHtml =
                        '<span class="badge bg-secondary bg-opacity-10 text-secondary fs-6"><i class="bi bi-dash-circle me-1"></i>未設定</span>';
                } else if (now < start) {
                    statusHtml =
                        '<span class="badge bg-warning bg-opacity-10 text-warning fs-6"><i class="bi bi-clock me-1"></i>尚未開始</span>';
                } else if (now > end) {
                    statusHtml =
                        '<span class="badge bg-danger bg-opacity-10 text-danger fs-6"><i class="bi bi-x-circle me-1"></i>已截止</span>';
                } else {
                    statusHtml =
                        '<span class="badge bg-success bg-opacity-10 text-success fs-6"><i class="bi bi-check-circle me-1"></i>開放中</span>';
                }

                return `
      <tr>
        <td class="align-middle fw-semibold ps-4">${row.academicYear}-${row.semester}</td>
        <td class="align-middle fw-bold text-primary">${row.examName}</td>
        <td class="align-middle">
          <div class="mb-1 fs-6"><span class="text-muted d-inline-block" style="width:44px;">開始:</span> ${formatDt(row.uploadStart)}</div>
          <div class="fs-6"><span class="text-muted d-inline-block" style="width:44px;">結束:</span> ${formatDt(row.uploadEnd)}</div>
        </td>
        <td class="align-middle">${statusHtml}</td>
        <td class="align-middle text-end pe-4">
          <button class="btn btn-sm btn-light text-success me-2 assign-teacher-btn fs-6 fw-medium"
            data-id="${row.id}" data-table="${row.table}" data-name="${row.academicYear}-${row.semester} ${row.examName}">
            <i class="bi bi-person-fill-add me-1"></i>指派教師
          </button>
          <button class="btn btn-sm btn-light text-primary me-2 edit-plan-btn fs-6 fw-medium" data-id="${row.id}">
            <i class="bi bi-calendar-range me-1"></i>設定時間
          </button>
        </td>
      </tr>
      `;
            })
            .join("");

        // Task 2: Edit time range modal
        const editModalHtml = `
      <div class="modal fade" id="examPlanModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-header border-bottom-0 px-4 pt-4 pb-0">
              <h5 class="modal-title fw-bold"><i class="bi bi-calendar-range text-primary me-2"></i>設定上傳時間</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="examPlanForm">
                <input type="hidden" id="ep-id">
                <div class="alert alert-info border-0 rounded-3 mb-4">
                  設定 <strong id="ep-name" class="text-primary"></strong> 的試卷上傳期間。
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">開始時間</label>
                  <input type="datetime-local" class="form-control form-control-lg" id="ep-start" required>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">結束時間（截止期限）</label>
                  <input type="datetime-local" class="form-control form-control-lg" id="ep-end" required>
                  <div class="form-text text-danger mt-2" id="ep-error" style="display:none;">結束時間必須晚於開始時間！</div>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-light fw-bold rounded-pill px-4 me-2" data-bs-dismiss="modal">取消</button>
                  <button type="submit" class="btn btn-primary fw-bold rounded-pill px-4" id="ep-submit-btn">儲存設定</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

        // Teacher options for the assign modal
        const teacherOptions = teachers
            .map((t) => `<option value="${t.email}">${t.name}（${t.email}）</option>`)
            .join("");

        // Task 3: Assign teacher modal (per exam plan → per subject row)
        const assignModalHtml = `
      <div class="modal fade" id="assignTeacherModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-header border-bottom-0 px-4 pt-4 pb-0">
              <h5 class="modal-title fw-bold"><i class="bi bi-person-fill-add text-success me-2"></i>指派命題教師</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <p class="text-muted mb-3">考試：<strong id="at-exam-name" class="text-primary"></strong></p>
              <div class="table-responsive">
                <table class="table table-hover fs-6 align-middle mb-0 rounded-4 overflow-hidden" id="at-subject-table">
                  <thead class="table-light text-muted text-uppercase">
                    <tr>
                      <th class="ps-3">類別</th>
                      <th class="text-center">年級</th>
                      <th>科目</th>
                      <th>目前教師</th>
                      <th class="text-end pe-3">操作</th>
                    </tr>
                  </thead>
                  <tbody id="at-subject-tbody"></tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer border-top-0 px-4 pb-4 pt-0">
              <button type="button" class="btn btn-light fw-bold rounded-pill px-4" data-bs-dismiss="modal">關閉</button>
            </div>
          </div>
        </div>
      </div>

      <!-- inline assign form modal -->
      <div class="modal fade" id="assignOneModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow rounded-4">
            <div class="modal-header border-bottom-0 px-4 pt-4 pb-0">
              <h6 class="modal-title fw-bold">為 <span id="aom-subject" class="text-primary"></span> 指派命題教師</h6>
              <button type="button" class="btn-close" id="aom-close-btn"></button>
            </div>
            <div class="modal-body p-4">
              <form id="assignOneForm">
                <input type="hidden" id="aom-exam-table">
                <input type="hidden" id="aom-row-id">
                <div class="mb-4">
                  <label class="form-label fw-semibold fs-6">選擇教師：</label>
                  <select class="form-select form-select-lg" id="aom-teacher-email" required>
                    <option value="" selected disabled>請選擇...</option>
                    ${teacherOptions}
                  </select>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-light fw-bold rounded-pill px-4 me-2" id="aom-cancel-btn">取消</button>
                  <button type="submit" class="btn btn-success fw-bold rounded-pill px-4" id="aom-submit-btn">儲存</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

        setTimeout(() => this.bindEvents(settings, allExamData, teachers), 0);

        return `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">考試分項管理</h2>
          <p class="text-muted mb-0">管理各項考試的上傳時間，以及各科目的命題教師指派</p>
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
      ${editModalHtml}
      ${assignModalHtml}
    `;
    }

    /**
     * 綁定所有事件：設定時間、指派教師（多科目列表 + 單科指派）
     * @param {Array} settingsRows - 考試設定資料列
     * @param {Object} allExamData - 各考試 table 的科目資料 (key: tableName)
     * @param {Array} teachers - 教師清單
     */
    static bindEvents(settingsRows, allExamData, teachers) {
        // ─── Edit time range modal ───────────────────────────────────────────
        const planModalEl = document.getElementById("examPlanModal");
        if (!planModalEl) return;
        const planModal = new bootstrap.Modal(planModalEl);
        const planForm = document.getElementById("examPlanForm");
        const startInput = document.getElementById("ep-start");
        const endInput = document.getElementById("ep-end");
        const errorMsg = document.getElementById("ep-error");
        const submitBtn = document.getElementById("ep-submit-btn");

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

        document.querySelectorAll(".edit-plan-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                const rowData = settingsRows.find((r) => r.id === id);
                if (rowData) {
                    planForm.reset();
                    document.getElementById("ep-id").value = id;
                    document.getElementById("ep-name").textContent =
                        `${rowData.academicYear}-${rowData.semester} ${rowData.examName}`;
                    if (rowData.uploadStart) startInput.value = rowData.uploadStart.slice(0, 16);
                    if (rowData.uploadEnd) endInput.value = rowData.uploadEnd.slice(0, 16);
                    validateDates();
                    planModal.show();
                }
            });
        });

        planForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const start = new Date(startInput.value);
            const end = new Date(endInput.value);
            if (start >= end) return;
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>儲存中...';
            const id = document.getElementById("ep-id").value;
            try {
                await ApiService.updateTableRow("settings", "id", id, {
                    uploadStart: startInput.value + ":00",
                    uploadEnd: endInput.value + ":00",
                });
                planModal.hide();
                window.location.reload();
            } catch (err) {
                alert("儲存失敗: " + err.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "儲存設定";
            }
        });

        // ─── Assign teacher modal (subject list) ─────────────────────────────
        const assignModalEl = document.getElementById("assignTeacherModal");
        const assignModal = new bootstrap.Modal(assignModalEl);
        const tbody = document.getElementById("at-subject-tbody");

        document.querySelectorAll(".assign-teacher-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const tableName = e.currentTarget.getAttribute("data-table");
                const examName = e.currentTarget.getAttribute("data-name");
                const subjectRows = allExamData[tableName] || [];

                document.getElementById("at-exam-name").textContent = examName;

                tbody.innerHTML = subjectRows
                    .map((subRow) => {
                        const teacher = teachers.find((t) => t.email === subRow.teacherEmail);
                        const teacherCell = teacher
                            ? `<span class="fw-medium">${teacher.name}</span><small class="text-muted d-block">${subRow.teacherEmail}</small>`
                            : '<span class="text-danger"><i class="bi bi-exclamation-circle me-1"></i>尚未指派</span>';
                        return `
              <tr>
                <td class="ps-3">${subRow.department}</td>
                <td class="text-center">${subRow.grade}</td>
                <td class="fw-semibold text-primary">${subRow.subject}</td>
                <td>${teacherCell}</td>
                <td class="text-end pe-3">
                  <button class="btn btn-sm btn-light text-success fw-medium inline-assign-btn"
                    data-table="${tableName}"
                    data-row-id="${subRow.id}"
                    data-subject="${subRow.subject}"
                    data-teacher="${subRow.teacherEmail || ""}">
                    <i class="bi bi-person-fill-add me-1"></i>指派
                  </button>
                </td>
              </tr>`;
                    })
                    .join("");

                // bind inline assign buttons after injecting rows
                ExamPlanMgmt.bindInlineAssign(assignModal);
                assignModal.show();
            });
        });

        // ─── Inline single-subject assign form ───────────────────────────────
        const aomModalEl = document.getElementById("assignOneModal");
        const aomModal = new bootstrap.Modal(aomModalEl);

        // close assignOne → re-open assignTeacher modal
        ["aom-close-btn", "aom-cancel-btn"].forEach((elId) => {
            document.getElementById(elId)?.addEventListener("click", () => {
                aomModal.hide();
                aomModalEl.addEventListener(
                    "hidden.bs.modal",
                    () => {
                        assignModal.show();
                    },
                    { once: true },
                );
            });
        });

        const aomForm = document.getElementById("assignOneForm");
        aomForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("aom-submit-btn");
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>儲存中...';

            const tableName = document.getElementById("aom-exam-table").value;
            const rowId = document.getElementById("aom-row-id").value;
            const teacherEmail = document.getElementById("aom-teacher-email").value;

            try {
                await ApiService.updateTableRow(tableName, "id", rowId, { teacherEmail });
                aomModal.hide();
                window.location.reload();
            } catch (err) {
                alert("儲存失敗: " + err.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "儲存";
            }
        });
    }

    /**
     * 繫結「指派教師」子列表中的各科目「指派」按鈕，開啟單科指派 modal
     * @param {bootstrap.Modal} parentModal - 父層的科目列表 modal（用來先隱藏它）
     */
    static bindInlineAssign(parentModal) {
        const aomModalEl = document.getElementById("assignOneModal");
        const aomModal = new bootstrap.Modal(aomModalEl);

        document.querySelectorAll(".inline-assign-btn").forEach((btn) => {
            // remove old listeners by cloning
            const fresh = btn.cloneNode(true);
            btn.parentNode.replaceChild(fresh, btn);

            fresh.addEventListener("click", (e) => {
                const tableName = e.currentTarget.getAttribute("data-table");
                const rowId = e.currentTarget.getAttribute("data-row-id");
                const subject = e.currentTarget.getAttribute("data-subject");
                const currentTeacher = e.currentTarget.getAttribute("data-teacher");

                document.getElementById("aom-subject").textContent = subject;
                document.getElementById("aom-exam-table").value = tableName;
                document.getElementById("aom-row-id").value = rowId;
                document.getElementById("aom-teacher-email").value = currentTeacher || "";

                parentModal.hide();
                aomModalEl.addEventListener("hidden.bs.modal", () => {}, { once: true });
                parentModal._element.addEventListener(
                    "hidden.bs.modal",
                    () => {
                        aomModal.show();
                    },
                    { once: true },
                );
            });
        });
    }
}
