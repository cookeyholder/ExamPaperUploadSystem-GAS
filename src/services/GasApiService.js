// src/services/GasApiService.js
export class GasApiService {
  static async getUserInfo() {
      return new Promise((resolve, reject) => {
          if (typeof google !== 'undefined' && google.script) {
              google.script.run
                  .withSuccessHandler(res => {
                      const data = JSON.parse(res);
                      if (data.error) reject(new Error(data.error));
                      else resolve(data);
                  })
                  .withFailureHandler(err => reject(err))
                  .apiGetUserInfo();
          } else {
              reject(new Error("無 GAS 環境，請在 Google Apps Script 執行環境中開啟"));
          }
      });
  }

  static async getTableData(tableName) {
      return new Promise((resolve, reject) => {
          if (typeof google !== 'undefined' && google.script) {
              google.script.run
                  .withSuccessHandler(res => {
                      const rawData = JSON.parse(res);
                      const mappedData = GasApiService.mapDataToFrontend(tableName, rawData);
                      resolve(mappedData);
                  })
                  .withFailureHandler(err => reject(err))
                  .apiGetTableData(tableName);
          } else {
              reject(new Error("無 GAS 環境，請在 Google Apps Script 執行環境中開啟"));
          }
      });
  }

  static async addTableRow(tableName, dataObj) {
      throw new Error("Phase 3 (Write API) 尚未實作真正的 GAS 寫入機制");
  }

  static async updateTableRow(tableName, keyField, keyValue, updateObj) {
      throw new Error("Phase 3 (Write API) 尚未實作真正的 GAS 更新機制");
  }

  static async deleteTableRow(tableName, keyField, keyValue) {
      throw new Error("Phase 3 (Write API) 尚未實作真正的 GAS 刪除機制");
  }

  static mapDataToFrontend(tableName, rawData) {
      if (!rawData || rawData.length === 0) return [];
      
      if (tableName === 'users') {
          return rawData.map(r => ({
              email: r['Email'],
              name: r['姓名'],
              teacherCode: r['人員編號'],
              department: r['部門單位'],
              role: (r['群組'] === 'admin' || r['群組'] === '管理員' || r['角色'] === 'admin') ? 'admin' : 'teacher'
          }));
      } else if (tableName === 'classes') {
          return rawData.map(r => ({
              id: r['班級代碼'],
              name: r['班級名稱']
          }));
      } else if (tableName === 'settings') {
          return rawData.map(r => ({
              id: r['ID'] || r['考試代碼'] || '1',
              academicYear: r['學年度'],
              semester: r['學期'],
              examName: r['考試名稱'],
              uploadStart: r['開始時間'],
              uploadEnd: r['結束時間']
          }));
      } else if (tableName.startsWith('exam')) {
          return rawData.map(r => ({
              id: r['ID'] || r['科目代碼'],
              department: r['類別'] || r['群科'],
              grade: r['年級'],
              subject: r['科目名稱'],
              teacherEmail: r['命題教師'] || r['教師Email'],
              markingType: r['閱卷方式'],
              pageCount: r['試卷張數'],
              fileUrl: r['檔案連結'] || r['FileUrl']
          }));
      }
      return rawData;
  }
}
