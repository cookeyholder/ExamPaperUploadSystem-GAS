// src/router.js
export class Router {
    constructor(routes, outletId) {
        this.routes = routes;
        this.outlet = document.getElementById(outletId);

        // Listen for hash changes
        window.addEventListener("hashchange", () => this.handleRoute());
        // Handle initial load
        window.addEventListener("load", () => this.handleRoute());
    }

    async handleRoute() {
        let path = window.location.hash.slice(1) || "/";

        const viewRenderFn = this.routes[path] || this.routes["*"];

        if (viewRenderFn) {
            // Show loading spinner
            this.outlet.innerHTML = `
        <div class="d-flex justify-content-center align-items-center py-5 mt-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">載入中...</span>
          </div>
        </div>`;

            try {
                const html = await viewRenderFn();
                this.outlet.innerHTML = html;
                this.updateActiveLink(path);
            } catch (err) {
                console.error("View rendering failed:", err);
                this.outlet.innerHTML = `<div class="alert alert-danger shadow-sm"><i class="bi bi-x-circle-fill me-2"></i> 頁面渲染失敗</div>`;
            }
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
        document.querySelectorAll(".sidebar-nav .nav-link").forEach((link) => {
            if (link.dataset.path === activePath) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
}
