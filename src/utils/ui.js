/**
 * 更新頂部導覽列的頁面標題與描述
 * @param {string} title - 頁面主要標題
 * @param {string} description - 頁面功能描述
 */
export const updatePageHeader = (title, description = "") => {
    const titleEl = document.getElementById("page-title");
    const descEl = document.getElementById("page-desc");

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
};
