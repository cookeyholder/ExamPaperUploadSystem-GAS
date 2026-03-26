import { ApiService } from "../services/api.js";

export class UploadModal {
    static init() {
        // Inject modal HTML if not exists
        if (!document.getElementById("uploadModal")) {
            const modalHtml = `
        <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true" data-bs-backdrop="static">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg rounded-4">
              <div class="modal-header border-bottom-0 px-4 pt-4 pb-0">
                <h4 class="modal-title fw-bold text-dark" id="uploadModalLabel"><i class="bi bi-cloud-arrow-up-fill text-primary me-2"></i>上傳試卷</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                
                <div class="row mb-4 g-3">
                  <div class="col-md-6">
                    <div class="bg-light p-3 rounded-4 h-100 border border-secondary-subtle">
                      <p class="mb-2 text-muted small fw-bold">目前的上傳科目</p>
                      <h5 class="fw-bold text-dark mb-2" id="modal-exam-subject">載入中...</h5>
                      <div class="d-flex align-items-center text-primary fw-medium">
                        <i class="bi bi-people me-2"></i> <span id="modal-exam-class">載入中...</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="bg-danger-subtle text-danger-emphasis p-3 rounded-4 h-100 border border-danger-subtle">
                      <p class="mb-2 text-danger fw-bold fs-6"><i class="bi bi-exclamation-triangle-fill me-1"></i> 注意事項</p>
                      <ul class="mb-0 ps-3 fs-6 fw-medium">
                        <li class="mb-1">請將題目與答案卷合併為單一 PDF</li>
                        <li class="text-danger fw-bold fs-5">絕對請勿上傳解答！</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <form id="uploadForm" class="px-2">
                  <input type="hidden" id="modal-exam-id">
                  <input type="hidden" id="modal-exam-table">
                  <input type="hidden" id="modal-exam-name-hidden">

                  <div class="mb-4">
                    <label class="form-label fw-bold text-dark fs-5"><span class="text-danger me-1">*</span>閱卷方式：</label>
                    <div class="d-flex flex-wrap gap-3 mt-2">
                        <div class="form-check form-check-inline bg-light position-relative border border-secondary-subtle px-4 py-3 rounded-4 m-0 flex-grow-1 user-select-none">
                            <input class="form-check-input ms-0 me-2" style="transform: scale(1.3);" type="radio" name="markingType" id="marking_human" value="人工閱卷" required>
                            <label class="form-check-label fw-bold fs-5 text-dark stretched-link ms-2" for="marking_human" style="cursor: pointer;">人工閱卷</label>
                        </div>
                        <div class="form-check form-check-inline bg-light position-relative border border-secondary-subtle px-4 py-3 rounded-4 m-0 flex-grow-1 user-select-none">
                            <input class="form-check-input ms-0 me-2" style="transform: scale(1.3);" type="radio" name="markingType" id="marking_computer" value="電腦閱卷">
                            <label class="form-check-label fw-bold fs-5 text-dark stretched-link ms-2" for="marking_computer" style="cursor: pointer;">電腦閱卷</label>
                        </div>
                        <div class="form-check form-check-inline bg-light position-relative border border-secondary-subtle px-4 py-3 rounded-4 m-0 flex-grow-1 user-select-none">
                            <input class="form-check-input ms-0 me-2" style="transform: scale(1.3);" type="radio" name="markingType" id="marking_both" value="人工閱卷+電腦閱卷">
                            <label class="form-check-label fw-bold fs-5 text-dark stretched-link ms-2" for="marking_both" style="cursor: pointer;">人工 + 電腦</label>
                        </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-bold text-dark fs-5"><span class="text-danger me-1">*</span>試卷 PDF 檔案：</label>
                    <input type="file" id="examFile" accept=".pdf" class="d-none">
                    <div class="input-group input-group-lg shadow-sm">
                        <label class="btn btn-primary px-4 fw-bold fs-5" for="examFile"><i class="bi bi-folder2-open me-2"></i>瀏覽</label>
                        <input type="text" class="form-control bg-white fw-bold fs-5 text-dark" placeholder="未選擇任何檔案" aria-label="檔案名稱" readonly id="uploadFileDisplay" style="cursor: pointer;" onclick="document.getElementById('examFile').click()">
                    </div>
                    <div class="form-text mt-2 text-muted fw-medium fs-6">
                        <i class="bi bi-file-earmark-pdf text-danger me-1"></i> 檔案格式限 PDF，大小限制 10MB
                    </div>
                    <div class="form-text text-danger mt-1 fw-bold fs-6" id="fileErrorMsg" style="display:none;"></div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-bold text-dark fs-5" for="pageCount">
                        <span class="text-danger me-1">*</span>試卷張數：
                    </label>
                    <input type="number" class="form-control form-control-lg bg-light fw-bold fs-4 text-dark" id="pageCount" min="1" required placeholder="請填寫數字，例如：2">
                    <div class="form-text mt-2 fs-6 text-muted">
                        <i class="bi bi-info-circle me-1"></i> 請合併計算試卷與答題卷總列印張數 (以 B4 雙面列印為單位，若單面即視為 1 張)。<br><i class="bi bi-info-circle me-1"></i> 特殊需求請洽教學組 #2304。
                    </div>
                  </div>

                  <div class="mb-4 bg-warning-subtle p-3 rounded-3 border border-warning-subtle" id="listeningExamSection" style="display: none;">
                    <label class="form-label fw-bold text-dark mb-3"><span class="text-danger me-1">*</span>此份英語文試卷是否包含「英聽加考」？</label>
                    <div class="d-flex gap-4">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="hasListeningExam" id="listening_yes" value="true">
                            <label class="form-check-label fw-medium" for="listening_yes">是，含英聽</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="hasListeningExam" id="listening_no" value="false">
                            <label class="form-check-label fw-medium" for="listening_no">否，無英聽</label>
                        </div>
                    </div>
                  </div>
                </form>
              </div>

              <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-between align-items-center">
                <div id="buttonDisabledMessage" class="text-danger fw-bold small"><i class="bi bi-shield-exclamation me-1"></i> 選擇「閱卷方式」、「試卷張數」並「選取檔案」後，才能點擊「確認上傳」按鈕。</div>
                <div>
                  <button type="button" class="btn btn-light fw-bold px-4 rounded-pill" data-bs-dismiss="modal">取消</button>
                  <button type="button" id="submitUploadBtn" class="btn btn-primary fw-bold px-4 ms-2 rounded-pill shadow-sm" disabled>
                    <i class="bi bi-send me-2"></i>確認上傳
                  </button>
                </div>
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
        const markingRadios = document.querySelectorAll('input[name="markingType"]');
        const pageCount = document.getElementById("pageCount");
        const examFile = document.getElementById("examFile");
        const uploadFileDisplay = document.getElementById("uploadFileDisplay");
        const submitBtn = document.getElementById("submitUploadBtn");
        const fileErrorMsg = document.getElementById("fileErrorMsg");
        const buttonDisabledMessage = document.getElementById("buttonDisabledMessage");
        const listeningRadios = document.querySelectorAll('input[name="hasListeningExam"]');
        const listeningSection = document.getElementById("listeningExamSection");

        const validateForm = () => {
            let isValid = true;
            let markingTypeSelected = Array.from(markingRadios).find((r) => r.checked);
            if (!markingTypeSelected) isValid = false;
            if (pageCount.value === "" || parseInt(pageCount.value) < 1) isValid = false;

            const file = examFile.files[0];
            if (file) {
                uploadFileDisplay.value = file.name;
            } else {
                uploadFileDisplay.value = "";
            }

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

            if (listeningSection.style.display !== "none") {
                const hasListeningSelected = Array.from(listeningRadios).find((r) => r.checked);
                if (!hasListeningSelected) isValid = false;
            }

            submitBtn.disabled = !isValid;
            buttonDisabledMessage.style.display = isValid ? "none" : "block";
        };

        markingRadios.forEach((r) => r.addEventListener("change", validateForm));
        listeningRadios.forEach((r) => r.addEventListener("change", validateForm));
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
                const selectedMarkingType = Array.from(
                    document.querySelectorAll('input[name="markingType"]'),
                ).find((r) => r.checked)?.value;
                const examNameVal = document.getElementById("modal-exam-name-hidden").value;

                const payload = {
                    base64Data: b64String,
                    examTable: targetTable,
                    examId: examId,
                    examName: examNameVal,
                    department: window.__currentExamContext.department,
                    subject: window.__currentExamContext.subject,
                    markingType: selectedMarkingType,
                    pageCount: parseInt(pageCount.value),
                };

                if (window.__currentExamContext.subject === "英語文") {
                    payload.hasListeningExam = document.getElementById("listening_yes").checked;
                }

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
        document.getElementById("uploadModal").addEventListener("hidden.bs.modal", function () {
            form.reset();
            submitBtn.disabled = true;
            fileErrorMsg.style.display = "none";
        });
    }

    static show(examData) {
        this.init();

        document.getElementById("modal-exam-subject").textContent =
            `${examData.department} ${examData.grade}年級 ${examData.subject}`;
        document.getElementById("modal-exam-class").textContent =
            `${examData.applicableClass || "全體班級"}`;
        document.getElementById("modal-exam-id").value = examData.id;
        document.getElementById("modal-exam-table").value = examData.table;
        document.getElementById("modal-exam-name-hidden").value = examData.examName;

        document.querySelectorAll('input[name="markingType"]').forEach((r) => (r.checked = false));
        if (examData.markingType) {
            const target = Array.from(document.querySelectorAll('input[name="markingType"]')).find(
                (r) => r.value === examData.markingType,
            );
            if (target) target.checked = true;
        }

        const listeningSection = document.getElementById("listeningExamSection");
        if (examData.subject === "英語文") {
            listeningSection.style.display = "block";
            if (examData.hasListeningExam === true) {
                document.getElementById("listening_yes").checked = true;
            } else {
                document.getElementById("listening_no").checked = true;
            }
        } else {
            listeningSection.style.display = "none";
            document.getElementById("listening_yes").checked = false;
            document.getElementById("listening_no").checked = false;
        }

        if (examData.pageCount !== undefined && examData.pageCount !== "")
            document.getElementById("pageCount").value = examData.pageCount;
        else document.getElementById("pageCount").value = "";

        document.getElementById("uploadFileDisplay").value = "";
        document.getElementById("buttonDisabledMessage").style.display = "block";

        window.__currentExamContext = {
            examName: examData.examName,
            department: examData.department,
            subject: examData.subject,
        };

        const myModal = new bootstrap.Modal(document.getElementById("uploadModal"));
        myModal.show();
    }
}
