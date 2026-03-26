// src/main.js
import { Router } from './router.js';
import { MockApiService } from './services/MockApiService.js';
import { TeacherDashboard } from './views/TeacherDashboard.js';
import { UserMgmt } from './views/admin/UserMgmt.js';
import { ClassMgmt } from './views/admin/ClassMgmt.js';
import { SubjectMgmt } from './views/admin/SubjectMgmt.js';

// Setup Mock User info temporarily
document.getElementById('user-display-name').textContent = '系統管理員';

// Define Routes returning HTML strings or Promises
const routes = {
  '/': () => TeacherDashboard.render(),
  '/admin/exam-plans': () => `
    <h2 class="h3 fw-bold mb-4">考試分項管理</h2>
    <div class="alert alert-info border-0 shadow-sm"><i class="bi bi-tools me-2"></i> 管理模組建置中...</div>
  `,
  '/admin/subjects': () => SubjectMgmt.render(),
  '/admin/classes': () => ClassMgmt.render(),
  '/admin/users': () => UserMgmt.render(),
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

// App Initialization
async function initApp() {
  try {
    const user = await MockApiService.getUserInfo();
    document.getElementById('user-display-name').textContent = `${user.name} (${user.role === 'admin' ? '管理員' : '教師'})`;
    
    const users = await MockApiService.getTableData('users');
    const settings = await MockApiService.getTableData('settings');
    
    console.log(`[Mock API] System initialized with ${users.length} users and ${settings.length} active exam schedules.`);
  } catch (error) {
    console.error('App init failed:', error);
  }
}

initApp();
