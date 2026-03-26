import { ApiService } from "../services/api.js";

export class UploadModal {
  static init() {
    // Inject modal HTML if not exists
    if (!document.getElementById("uploadModal")) {
      const modalHtml = `
        <div class="modal fade" id="uploadModal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true" data-bs-backdrop="static">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title fw-bold" id="uploadModalLabel">上傳試卷</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="alert alert-info mb-3">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  <strong>操作說明：</strong>請先選擇閱卷方式並上傳檔案，「確認上傳」按鈕才會啟用。
                </div>

                <div class="mb-3">
                  <p class="mb-1">
                    <strong>科目: </strong>
                    <span id="modal-exam-subject"></span>
                  </p>
                  <p class="mb-1">
                    <strong>適用班級: </strong>
                    <span id="modal-exam-class"></span>
                  </p>
                  <p class="mb-1"><strong>注意事項:</strong></p>
                  <ul>
                    <li>請將題目卷與答案卷合併在同一個 PDF 檔案</li>
                    <li class="text-danger">請勿上傳解答！請勿上傳解答！請勿上傳解答！</li>
                  </ul>
                </div>

                <form id="uploadForm">
                  <input type="hidden" id="modal-exam-id">
                  <input type="hidden" id="modal-exam-table">
                  <input type="hidden" id="modal-exam-name-hidden">

                  <div class="mb-3">
                    <label class="form-label"><span class="text-danger">*</span> 請選擇閱卷方式：</label>
                    <div class="form-check form-switch">
                      <input class="form-check-input border-dark border-1" type="radio" role="switch" name="markingType" id="marking_human" value="人工閱卷" required>
                      <label class="form-check-label" for="marking_human">人工閱卷</label>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input border-dark border-1" type="radio" role="switch" name="markingType" id="marking_computer" value="電腦閱卷">
                      <label class="form-check-label" for="marking_computer">電腦閱卷</label>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input border-dark border-1" type="radio" role="switch" name="markingType" id="marking_both" value="人工閱卷+電腦閱卷">
                      <label class="form-check-label" for="marking_both">人工閱卷+電腦閱卷</label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label"><span class="text-danger">*</span> 請選擇要上傳的 PDF 檔案：</label>
                    <input type="file" id="examFile" accept=".pdf" class="d-none">
                    <div class="input-group">
                        <label class="btn btn-outline-secondary" for="examFile">瀏覽檔案</label>
                        <input type="text" class="form-control border-dark" placeholder="未選擇任何檔案" aria-label="檔案名稱" readonly id="uploadFileDisplay">
                    </div>
                    <div class="form-text mt-1">
                        <i class="bi bi-info-circle me-1"></i>檔案大小限制為 10MB
                    </div>
                    <div class="form-text text-danger mt-1" id="fileErrorMsg" style="display:none;"></div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label" for="pageCount">
                        <span class="text-danger">*</span> 試卷張數：
                    </label>
                    <input type="number" class="form-control border-dark" id="pageCount" min="1" required placeholder="請輸入試卷張數">
                    <div class="form-text mt-2">
                        <i class="bi bi-info-circle me-1"></i>試卷總張數（必填，最小值為 1）
                        <ul>
                            <li>試卷與答題卷請一起計算</li>
                            <li>一律採 B4 雙面列印，如需單面列印或其他需求請轉告教學組 #2304。</li>
                            <li>(EX: 4 頁試卷 = 2 張，2 頁試卷 + 1 頁答題卷 = 2 張。假如 5 頁試卷打 5 張，皆認定為單面列印之意)</li>
                        </ul>
                    </div>
                  </div>
                </form>
              </div>

              <div class="modal-footer d-flex justify-content-between">
                <div id="buttonDisabledMessage" class="text-danger fw-bold small">請選擇 閱卷方式、檔案、張數</div>
                <div>
                  <button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal">取消</button>
                  <button type="button" id="submitUploadBtn" class="btn btn-primary text-white ms-2" disabled>
                    <i class="bi bi-upload me-1"></i> 確認上傳
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
    const form = document.getElementById('uploadForm');
    const markingRadios = document.querySelectorAll('input[name="markingType"]');
    const pageCount = document.getElementById('pageCount');
    const examFile = document.getElementById('examFile');
    const uploadFileDisplay = document.getElementById('uploadFileDisplay');
    const submitBtn = document.getElementById('submitUploadBtn');
    const fileErrorMsg = document.getElementById('fileErrorMsg');
    const buttonDisabledMessage = document.getElementById('buttonDisabledMessage');

    const validateForm = () => {
      let isValid = true;
      let markingTypeSelected = Array.from(markingRadios).find(r => r.checked);
      if (!markingTypeSelected) isValid = false;
      if (pageCount.value === '' || parseInt(pageCount.value) < 1) isValid = false;
      
      const file = examFile.files[0];
      if (file) {
          uploadFileDisplay.value = file.name;
      } else {
          uploadFileDisplay.value = '';
      }

      if (!file) {
        isValid = false;
      } else {
        if (file.type !== 'application/pdf') {
          fileErrorMsg.textContent = "只允許上傳 PDF 檔案！";
          fileErrorMsg.style.display = 'block';
          isValid = false;
        } else if (file.size > 10 * 1024 * 1024) {
          fileErrorMsg.textContent = "檔案大小不可超過 10MB！";
          fileErrorMsg.style.display = 'block';
          isValid = false;
        } else {
          fileErrorMsg.style.display = 'none';
        }
      }

      submitBtn.disabled = !isValid;
      buttonDisabledMessage.style.display = isValid ? 'none' : 'block';
    };

    markingRadios.forEach(r => r.addEventListener('change', validateForm));
    pageCount.addEventListener('input', validateForm);
    examFile.addEventListener('change', validateForm);

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
        const targetTable = document.getElementById('modal-exam-table').value;
        const examId = document.getElementById('modal-exam-id').value;
        const selectedMarkingType = Array.from(document.querySelectorAll('input[name="markingType"]')).find(r => r.checked)?.value;
        const examNameVal = document.getElementById('modal-exam-name-hidden').value;

        const payload = {
            base64Data: b64String,
            examTable: targetTable,
            examId: examId,
            examName: examNameVal,
            department: window.__currentExamContext.department,
            subject: window.__currentExamContext.subject,
            markingType: selectedMarkingType,
            pageCount: parseInt(pageCount.value)
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

    document.getElementById('modal-exam-subject').textContent = `${examData.department} ${examData.grade}年級 ${examData.subject}`;
    document.getElementById('modal-exam-class').textContent = `${examData.applicableClass || '全體班級'}`;
    document.getElementById('modal-exam-id').value = examData.id;
    document.getElementById('modal-exam-table').value = examData.table; 
    document.getElementById('modal-exam-name-hidden').value = examData.examName;

    document.querySelectorAll('input[name="markingType"]').forEach(r => r.checked = false);
    if (examData.markingType) {
        const target = Array.from(document.querySelectorAll('input[name="markingType"]')).find(r => r.value === examData.markingType);
        if (target) target.checked = true;
    }
    
    if (examData.pageCount !== undefined && examData.pageCount !== '') document.getElementById('pageCount').value = examData.pageCount;
    else document.getElementById('pageCount').value = '';
    
    document.getElementById('uploadFileDisplay').value = '';
    document.getElementById('buttonDisabledMessage').style.display = 'block';

    window.__currentExamContext = {
        examName: examData.examName,
        department: examData.department,
        subject: examData.subject
    };

    const myModal = new bootstrap.Modal(document.getElementById('uploadModal'));
    myModal.show();
  }
}
