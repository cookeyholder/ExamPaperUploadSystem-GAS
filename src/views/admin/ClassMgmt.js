import { MockApiService } from '../../services/MockApiService.js';

export class ClassMgmt {
  static async render() {
    const classes = await MockApiService.getTableData('classes');
    
    // Task 1: Table Layout
    const rowsHtml = classes.map(c => `
      <tr>
        <td class="align-middle fw-semibold">${c.id}</td>
        <td class="align-middle">${c.name}</td>
        <td class="align-middle text-end">
          <button class="btn btn-sm btn-light text-primary me-2 edit-class-btn" data-id="${c.id}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-light text-danger delete-class-btn" data-id="${c.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Task 2: Create/Edit Modal Form
    const modalHtml = `
      <div class="modal fade" id="classFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-0">
              <h5 class="modal-title fw-bold" id="classFormModalLabel">新增/編輯班級</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="classForm">
                <input type="hidden" id="form-mode" value="create">
                <input type="hidden" id="original-id">
                
                <div class="mb-3">
                  <label class="form-label fw-semibold">班級代碼 (不可重複)</label>
                  <input type="text" class="form-control" id="c-id" required placeholder="例如: 101">
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">班級名稱</label>
                  <input type="text" class="form-control" id="c-name" required placeholder="例如: 機械一甲">
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">取消</button>
                  <button type="submit" class="btn btn-primary px-4 fw-bold">儲存</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => this.bindEvents(classes), 0);

    return `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">群科班級管理</h2>
          <p class="text-muted mb-0">管理學校所有班級名單</p>
        </div>
        <button class="btn btn-primary shadow-sm fw-semibold" id="add-class-btn">
          <i class="bi bi-plus-lg me-1"></i> 新增班級
        </button>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light text-muted small text-uppercase">
              <tr>
                <th class="ps-4">班級代碼</th>
                <th>班級名稱</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              ${rowsHtml}
            </tbody>
          </table>
          ${classes.length === 0 ? '<div class="text-center py-5 text-muted">目前沒有資料</div>' : ''}
        </div>
      </div>
      ${modalHtml}
    `;
  }

  static bindEvents(classList) {
    const modalEl = document.getElementById('classFormModal');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    const form = document.getElementById('classForm');

    // Add Button
    document.getElementById('add-class-btn').addEventListener('click', () => {
      form.reset();
      document.getElementById('form-mode').value = 'create';
      document.getElementById('classFormModalLabel').textContent = '新增班級';
      document.getElementById('c-id').readOnly = false;
      modal.show();
    });

    // Edit Buttons
    document.querySelectorAll('.edit-class-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const cls = classList.find(c => c.id === id);
        if (cls) {
          form.reset();
          document.getElementById('form-mode').value = 'edit';
          document.getElementById('original-id').value = cls.id;
          document.getElementById('classFormModalLabel').textContent = '編輯班級';
          
          document.getElementById('c-id').value = cls.id;
          document.getElementById('c-id').readOnly = true; // 代碼視為主鍵
          document.getElementById('c-name').value = cls.name;
          
          modal.show();
        }
      });
    });

    // Delete Buttons
    document.querySelectorAll('.delete-class-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm(`確定要刪除班級 ${id} 嗎？此操作無法還原。`)) {
          try {
            e.currentTarget.disabled = true;
            await MockApiService.deleteTableRow('classes', 'id', id);
            window.location.reload();
          } catch (err) {
            alert('刪除失敗: ' + err.message);
            e.currentTarget.disabled = false;
          }
        }
      });
    });

    // Form Submit (Create / Update)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>儲存中...';

      const mode = document.getElementById('form-mode').value;
      const dataObj = {
        id: document.getElementById('c-id').value,
        name: document.getElementById('c-name').value
      };

      try {
        if (mode === 'create') {
          if (classList.find(c => c.id === dataObj.id)) {
            throw new Error("此代碼已經存在！");
          }
          await MockApiService.addTableRow('classes', dataObj);
        } else {
          const originalId = document.getElementById('original-id').value;
          await MockApiService.updateTableRow('classes', 'id', originalId, dataObj);
        }
        modal.hide();
        window.location.reload();
      } catch (err) {
        alert('儲存失敗: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '儲存';
      }
    });
  }
}
