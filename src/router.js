// src/router.js
export class Router {
  constructor(routes, outletId) {
    this.routes = routes;
    this.outlet = document.getElementById(outletId);
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    // Handle initial load
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    let path = window.location.hash.slice(1) || '/';
    
    // Default fallback
    const viewRenderFn = this.routes[path] || this.routes['*'];
    
    if (viewRenderFn) {
      this.outlet.innerHTML = viewRenderFn();
      this.updateActiveLink(path);
    } else {
      this.outlet.innerHTML = `
        <div class="alert alert-danger shadow-sm">
          <i class="bi bi-exclamation-triangle-fill me-2"></i> 找不到該頁面 (404)
        </div>`;
    }
  }

  updateActiveLink(activePath) {
    // Determine base path for highlighting submenus 
    // e.g. /admin/users -> /admin/users
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      if (link.dataset.path === activePath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
