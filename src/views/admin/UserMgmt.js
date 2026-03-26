import { MockApiService } from '../../services/MockApiService.js';

export class UserMgmt {
  static async render() {
    const users = await MockApiService.getTableData('users');
    
    // Task 1: Table Layout
    const rowsHtml = users.map(u => `
      <tr>
        <td class="align-middle">${u.teacherCode || '-'}</td>
        <td class="align-middle fw-semibold">${u.name}</td>
        <td class="align-middle text-muted">${u.email}</td>
        <td class="align-middle">
          <span class="badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'} bg-opacity-10 text-${u.role === 'admin' ? 'danger' : 'primary'} px-2 py-1 rounded-pill">
            ${u.role === 'admin' ? '系統管理員' : '一般教師'}
          </span>
        </td>
        <td class="align-middle text-end">
          <button class="btn btn-sm btn-light text-primary me-2 edit-user-btn" data-email="${u.email}">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-light text-danger delete-user-btn" data-email="${u.email}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // Task 2: Create/Edit Modal Form
    const modalHtml = `
      <div class="modal fade" id="userFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-0">
              <h5 class="modal-title fw-bold" id="userFormModalLabel">新增/編輯帳號</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form id="userForm">
                <input type="hidden" id="form-mode" value="create">
                <input type="hidden" id="original-email">
                
                <div class="mb-3">
                  <label class="form-label fw-semibold">姓名</label>
                  <input type="text" class="form-control" id="u-name" required placeholder="例如: 王大明">
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Email</label>
                  <input type="email" class="form-control" id="u-email" required placeholder="例如: name@ksvs.kh.edu.tw">
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">教師代碼 (選填)</label>
                  <input type="text" class="form-control" id="u-code" placeholder="例如: T1001">
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">系統角色</label>
                  <select class="form-select" id="u-role" required>
                    <option value="teacher">一般教師</option>
                    <option value="admin">系統管理員</option>
                  </select>
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

    setTimeout(() => this.bindEvents(users), 0);

    return `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">帳號管理</h2>
          <p class="text-muted mb-0">管理系統管理員與教師的名單與權限</p>
        </div>
        <button class="btn btn-primary shadow-sm fw-semibold" id="add-user-btn">
          <i class="bi bi-plus-lg me-1"></i> 新增帳號
        </button>
      </div>

      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light text-muted small text-uppercase">
              <tr>
                <th class="ps-4">代碼</th>
                <th>姓名</th>
                <th>Google 帳號 (Email)</th>
                <th>角色</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody class="border-top-0">
              ${rowsHtml}
            </tbody>
          </table>
          ${users.length === 0 ? '<div class="text-center py-5 text-muted">目前沒有資料</div>' : ''}
        </div>
      </div>
      ${modalHtml}
    `;
  }

  static bindEvents(usersList) {
    const modalEl = document.getElementById('userFormModal');
    if (!modalEl) return;
    const modal = new bootstrap.Modal(modalEl);
    const form = document.getElementById('userForm');

    // Add Button
    document.getElementById('add-user-btn').addEventListener('click', () => {
      form.reset();
      document.getElementById('form-mode').value = 'create';
      document.getElementById('userFormModalLabel').textContent = '新增帳號';
      document.getElementById('u-email').readOnly = false;
      modal.show();
    });

    // Edit Buttons (Task 3)
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.currentTarget.getAttribute('data-email');
        const user = usersList.find(u => u.email === email);
        if (user) {
          form.reset();
          document.getElementById('form-mode').value = 'edit';
          document.getElementById('original-email').value = user.email;
          document.getElementById('userFormModalLabel').textContent = '編輯帳號';
          
          document.getElementById('u-name').value = user.name;
          document.getElementById('u-email').value = user.email;
          document.getElementById('u-email').readOnly = true; // Email 視為主鍵不建議修改
          document.getElementById('u-code').value = user.teacherCode || '';
          document.getElementById('u-role').value = user.role;
          
          modal.show();
        }
      });
    });

    // Delete Buttons (Task 3)
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const email = e.currentTarget.getAttribute('data-email');
        if (confirm(`確定要刪除帳號 ${email} 嗎？此操作無法還原。`)) {
          try {
            e.currentTarget.disabled = true;
            await MockApiService.deleteTableRow('users', 'email', email);
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
        name: document.getElementById('u-name').value,
        email: document.getElementById('u-email').value,
        teacherCode: document.getElementById('u-code').value,
        role: document.getElementById('u-role').value
      };

      try {
        if (mode === 'create') {
          // Check if exists
          if (usersList.find(u => u.email === dataObj.email)) {
            throw new Error("此 Email 已經存在！");
          }
          await MockApiService.addTableRow('users', dataObj);
        } else {
          const originalEmail = document.getElementById('original-email').value;
          await MockApiService.updateTableRow('users', 'email', originalEmail, dataObj);
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
