// src/main.js
import { Router } from './router.js';

// Setup Mock User info temporarily
document.getElementById('user-display-name').textContent = '系統管理員';

// Define Routes returning HTML strings (placeholders for now)
const routes = {
  '/': () => `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h3 fw-bold mb-0">試卷上傳情形</h2>
    </div>
    <div class="card shadow-sm border-0 bg-white">
      <div class="card-body py-5 text-center text-secondary">
        <i class="bi bi-clock-history fs-1 mb-3 text-primary-emphasis"></i>
        <h5 class="fw-semibold">開發中：教師儀表板與 Mock API 即將上線</h5>
        <p class="mb-0">Please proceed to Change 02 ~ 04</p>
      </div>
    </div>
  `,
  '/admin/exam-plans': () => `
    <h2 class="h3 fw-bold mb-4">考試分項管理</h2>
    <div class="alert alert-info border-0 shadow-sm"><i class="bi bi-tools me-2"></i> 管理模組建置中...</div>
  `,
  '/admin/subjects': () => `
    <h2 class="h3 fw-bold mb-4">科目管理</h2>
    <div class="alert alert-info border-0 shadow-sm"><i class="bi bi-tools me-2"></i> 管理模組建置中...</div>
  `,
  '/admin/classes': () => `
    <h2 class="h3 fw-bold mb-4">群科班級管理</h2>
    <div class="alert alert-info border-0 shadow-sm"><i class="bi bi-tools me-2"></i> 管理模組建置中...</div>
  `,
  '/admin/users': () => `
    <h2 class="h3 fw-bold mb-4">帳號管理</h2>
    <div class="alert alert-info border-0 shadow-sm"><i class="bi bi-tools me-2"></i> 管理模組建置中...</div>
  `,
  '*': () => `
    <div class="text-center py-5">
      <h1 class="display-4 text-secondary">404</h1>
      <p class="lead">頁面不存在</p>
    </div>
  `
};

// Initialize Router
const router = new Router(routes, 'app-content');

// Sidebar toggle logic for mobile
document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('show');
});

console.log('[App] SPA Routing Shell Initialized');
