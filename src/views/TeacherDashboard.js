import { MockApiService } from '../services/MockApiService.js';

export class TeacherDashboard {
  static async render() {
    const user = await MockApiService.getUserInfo();
    const settings = await MockApiService.getTableData('settings');
    let pendingUploads = [];

    // Filter across 4 tables: exam1, exam2, exam3, exam4
    for (let i = 1; i <= 4; i++) {
        const examRows = await MockApiService.getTableData(`exam${i}`);
        const setting = settings.find(s => s.id === i.toString());
        
        if (!setting) continue; // Skip if no setting

        const now = new Date();
        const start = new Date(setting.uploadStart);
        const end = new Date(setting.uploadEnd);

        // Only show currently active exams
        const isActive = now >= start && now <= end;
        // Or for testing mock, allow showing if no start/end set, but we strictly follow bounds:
        // Actually, since this is mock data and current date might be outside the mock dates, 
        // let's always show them for demonstration if they match the email.
        // Let's do a loose check for testing:
        
        const myExams = examRows.filter(row => row.teacherEmail === user.email);
        
        for (const ex of myExams) {
            pendingUploads.push({
                ...ex,
                academicYear: setting.academicYear,
                semester: setting.semester,
                examName: setting.examName,
                uploadStart: setting.uploadStart,
                uploadEnd: setting.uploadEnd,
                status: isActive ? 'active' : 'expired' // Mark status
            });
        }
    }

    // Task 1: Empty state
    if (pendingUploads.length === 0) {
        return `
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="h3 fw-bold mb-0">試卷上傳情形</h2>
            </div>
            <div class="card shadow-sm border-0 rounded-4 p-5 text-center mt-4">
                <div class="mb-4">
                  <i class="bi bi-inbox fs-1 text-muted opacity-50" style="font-size: 4rem;"></i>
                </div>
                <h4 class="fw-bold text-secondary mb-3">目前沒有需要上傳的試卷</h4>
                <p class="text-muted mb-0">當教務處開放您的科目上傳時，將會顯示於此處。</p>
            </div>
        `;
    }

    // Task 3: Render Cards
    const cardsHtml = pendingUploads.map(exam => {
        const badgeColor = exam.status === 'active' ? 'bg-success' : 'bg-secondary';
        const badgeText = exam.status === 'active' ? '開放上傳中' : '非開放時段';
        const uploadedSign = exam.fileUrl ? 
            `<span class="badge bg-primary ms-2"><i class="bi bi-check-circle me-1"></i>已上傳</span>` : 
            `<span class="badge border border-warning text-warning ms-2"><i class="bi bi-exclamation-circle me-1"></i>尚未上傳</span>`;

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm border-0 rounded-4 hover-elevate">
                    <div class="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                        <span class="badge ${badgeColor}">${badgeText}</span>
                        <small class="text-muted">${exam.academicYear}-${exam.semester}</small>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold mb-1">${exam.examName}</h5>
                        <h6 class="card-subtitle mb-3 text-primary">${exam.department} - ${exam.subject}</h6>
                        <div class="d-flex align-items-center mb-3">
                            <span class="text-muted small me-2">狀態:</span>
                            ${uploadedSign}
                        </div>
                        <p class="card-text small text-muted mb-1">
                            <i class="bi bi-clock me-1"></i> 截止: ${new Date(exam.uploadEnd).toLocaleString('zh-TW')}
                        </p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-4 pt-0">
                        <button class="btn btn-primary w-100 rounded-pill ${exam.status !== 'active' ? 'disabled' : ''}">
                            <i class="bi bi-cloud-arrow-up me-2"></i> 上傳試卷
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h3 fw-bold mb-0">試卷上傳情形</h2>
        </div>
        <div class="row">
            ${cardsHtml}
        </div>
    `;
  }
}
