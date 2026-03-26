import { ApiService } from "../services/api.js";

export class UploadModal {
  static init() {
    // Inject modal HTML if not exists
    if (!document.getElementById("uploadModal")) {
      const modalHtml = `
        <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true" data-bs-backdrop="static">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
              <div class="modal-header bg-light border-0 rounded-top-4">
                <h5 class="modal-title fw-bold" id="uploadModalLabel">
                  <i class="bi bi-cloud-arrow-up text-primary me-2"></i>上傳試卷
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <div class="alert alert-info border-0 rounded-3 mb-4">
                  <h6 class="fw-bold mb-1" id="modal-exam-name">考試名稱</h6>
                  <p class="mb-1 text-primary fw-semibold" id="modal-exam-subject">科目名稱</p>
                  <p class="mb-0 text-muted small" id="modal-exam-class">適用班級</p>
                </div>

                <form id="uploadForm">
                  <input type="hidden" id="modal-exam-id">
                  <input type="hidden" id="modal-exam-table">

                  <div class="mb-3">
                    <label class="form-label fw-semibold">閱卷方式</label>
                    <select class="form-select" id="markingType" required>
                      <option value="" selected disabled>請選擇閱卷方式...</option>
                      <option value="人工閱卷">人工閱卷</option>
                      <option value="電腦閱卷">電腦閱卷</option>
                      <option value="人工閱卷+電腦閱卷">人工閱卷+電腦閱卷</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">試卷張數 (必填)</label>
                    <input type="number" class="form-control" id="pageCount" min="1" max="10" required placeholder="請輸入試卷張數">
                    <div class="form-text text-muted mt-2">
                        <i class="bi bi-info-circle me-1"></i>試卷總張數（最小值為 1）
                        <ul class="mb-0 mt-1 small">
                            <li>試卷與答題卷請一起計算</li>
                            <li>一律採 B4 雙面列印，如需單面列印或其他需求請轉告教學組 #2304。</li>
                            <li>(EX: 4 頁試卷 = 2 張，2 頁試卷 + 1 頁答題卷 = 2 張。假如 5 頁試卷打 5 張，皆認定為單面列印之意)</li>
                        </ul>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">上傳 PDF 檔案</label>
                    <input class="form-control" type="file" id="examFile" accept=".pdf" required>
                    <div class="form-text text-danger" id="fileErrorMsg" style="display:none;"></div>
                  </div>

                  <div class="d-grid mt-4">
                    <button type="button" id="submitUploadBtn" class="btn btn-primary py-2 fw-bold" disabled>
                      <i class="bi bi-send me-2"></i>確認上傳
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      this.bindEvents();
    }
  }

  static bindEvents() {
    const form = document.getElementById("uploadForm");
    const markingType = document.getElementById("markingType");
    const pageCount = document.getElementById("pageCount");
    const examFile = document.getElementById("examFile");
    const submitBtn = document.getElementById("submitUploadBtn");
    const fileErrorMsg = document.getElementById("fileErrorMsg");

    const validateForm = () => {
      let isValid = true;
      if (!markingType.value) isValid = false;
      if (
        pageCount.value === "" ||
        parseInt(pageCount.value) < 0 ||
        parseInt(pageCount.value) > 10
      )
        isValid = false;

      const file = examFile.files[0];
      if (!file) {
        isValid = false;
      } else {
        if (file.type !== "application/pdf") {
          fileErrorMsg.textContent = "只允許上傳 PDF 檔案！";
          fileErrorMsg.style.display = "block";
          isValid = false;
        } else if (file.size > 10 * 1024 * 1024) {
          fileErrorMsg.textContent = "檔案大小不可超過 10MB！";
          fileErrorMsg.style.display = "block";
          isValid = false;
        } else {
          fileErrorMsg.style.display = "none";
        }
      }

      submitBtn.disabled = !isValid;
    };

    markingType.addEventListener("change", validateForm);
    pageCount.addEventListener("input", validateForm);
    examFile.addEventListener("change", validateForm);

    submitBtn.addEventListener("click", async () => {
      const eBtn = submitBtn;
      const originalHtml = eBtn.innerHTML;
      eBtn.disabled = true;
      eBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>上傳中...`;

      try {
        const file = examFile.files[0];

        // Task 3: Base64 Conversion Mock
        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
          });

        const b64String = await toBase64(file);

        // Payload
        const targetTable = document.getElementById("modal-exam-table").value;
        const examId = document.getElementById("modal-exam-id").value;
        const payload = {
          base64Data: b64String,
          examTable: targetTable,
          examId: examId,
          examName: window.__currentExamContext.examName, // Assuming __currentExamContext is available
          department: window.__currentExamContext.department,
          subject: window.__currentExamContext.subject,
          markingType: markingType.value,
          pageCount: parseInt(pageCount.value),
        };

        await ApiService.uploadExamPaper(payload);

        const myModalEl = document.getElementById("uploadModal");
        const modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        window.location.reload(); // Refresh to update badge
      } catch (err) {
        console.error(err);
        alert("上傳失敗：" + err.message);
      } finally {
        eBtn.innerHTML = originalHtml;
        eBtn.disabled = false;
      }
    });

    // Reset form on hidden
    document
      .getElementById("uploadModal")
      .addEventListener("hidden.bs.modal", function () {
        form.reset();
        submitBtn.disabled = true;
        fileErrorMsg.style.display = "none";
      });
  }

  static show(examData) {
    this.init();

    document.getElementById('modal-exam-name').textContent = examData.examName;
    document.getElementById('modal-exam-subject').textContent = `[${examData.department}] ${examData.grade}年級 ${examData.subject}`;
    document.getElementById('modal-exam-class').textContent = `適用班級：${examData.applicableClass || '未指定'}`;
    document.getElementById('modal-exam-id').value = examData.id;
    document.getElementById("modal-exam-table").value = examData.table;

    // Prefill if existing data
    if (examData.markingType)
      document.getElementById("markingType").value = examData.markingType;
    else document.getElementById("markingType").value = "";

    if (examData.pageCount !== undefined && examData.pageCount !== "")
      document.getElementById("pageCount").value = examData.pageCount;
    else document.getElementById("pageCount").value = "";

    window.__currentExamContext = {
      examName: examData.examName,
      department: examData.department,
      subject: examData.subject,
    };

    const myModal = new bootstrap.Modal(document.getElementById("uploadModal"));
    myModal.show();
  }
}
