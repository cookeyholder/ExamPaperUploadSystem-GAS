import { MockApiService } from '../services/MockApiService.js';

export class UploadModal {
  static init() {
    // Inject modal HTML if not exists
    if (!document.getElementById('uploadModal')) {
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
                  <p class="mb-0 text-muted small" id="modal-exam-subject">科目名稱</p>
                </div>

                <form id="uploadForm">
                  <input type="hidden" id="modal-exam-id">
                  <input type="hidden" id="modal-exam-table">

                  <div class="mb-3">
                    <label class="form-label fw-semibold">閱卷方式</label>
                    <select class="form-select" id="markingType" required>
                      <option value="" selected disabled>請選擇閱卷方式...</option>
                      <option value="電腦閱卷">電腦閱卷</option>
                      <option value="人工閱卷">人工閱卷</option>
                      <option value="不需閱卷">不需閱卷</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">試卷張數 (B4 雙面為 1 張)</label>
                    <input type="number" class="form-control" id="pageCount" min="0" max="10" required placeholder="如不需要印試卷請填 0">
                    <div class="form-text text-muted">目前最多支援 10 張</div>
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
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      this.bindEvents();
    }
  }

  static bindEvents() {
    const form = document.getElementById('uploadForm');
    const markingType = document.getElementById('markingType');
    const pageCount = document.getElementById('pageCount');
    const examFile = document.getElementById('examFile');
    const submitBtn = document.getElementById('submitUploadBtn');
    const fileErrorMsg = document.getElementById('fileErrorMsg');

    const validateForm = () => {
      let isValid = true;
      if (!markingType.value) isValid = false;
      if (pageCount.value === '' || parseInt(pageCount.value) < 0 || parseInt(pageCount.value) > 10) isValid = false;
      
      const file = examFile.files[0];
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
    };

    markingType.addEventListener('change', validateForm);
    pageCount.addEventListener('input', validateForm);
    examFile.addEventListener('change', validateForm);

    submitBtn.addEventListener('click', async () => {
      const eBtn = submitBtn;
      const originalHtml = eBtn.innerHTML;
      eBtn.disabled = true;
      eBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>上傳中...`;

      try {
        const file = examFile.files[0];
        
        // Task 3: Base64 Conversion Mock
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
        
        const base64Content = await toBase64(file);
        
        // Task 3: Mock Submit
        const targetTable = document.getElementById('modal-exam-table').value;
        const examId = document.getElementById('modal-exam-id').value;
        
        await MockApiService.updateTableRow(targetTable, 'id', examId, {
            markingType: markingType.value,
            pageCount: parseInt(pageCount.value),
            fileUrl: `https://mock.drive.google.com/pdf/${file.name}` // Mock URL
        });

        const myModalEl = document.getElementById('uploadModal');
        const modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();

        // Show Toast / Render Page
        alert("上傳成功！(Mock)");
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
    document.getElementById('uploadModal').addEventListener('hidden.bs.modal', function () {
      form.reset();
      submitBtn.disabled = true;
      fileErrorMsg.style.display = 'none';
    });
  }

  static show(examData) {
    this.init();
    
    document.getElementById('modal-exam-name').textContent = examData.examName;
    document.getElementById('modal-exam-subject').textContent = `${examData.department} - ${examData.subject}`;
    document.getElementById('modal-exam-id').value = examData.id;
    // Derive table from exam id logic? e.g. e1_1 -> exam1
    const tablePrefix = examData.id.split('_')[0]; // "e1"
    const tableIndex = tablePrefix.replace('e', ''); // "1"
    document.getElementById('modal-exam-table').value = `exam${tableIndex}`;

    // Prefill if existing data
    if (examData.markingType) document.getElementById('markingType').value = examData.markingType;
    if (examData.pageCount !== undefined) document.getElementById('pageCount').value = examData.pageCount;

    const myModal = new bootstrap.Modal(document.getElementById('uploadModal'));
    myModal.show();
  }
}
