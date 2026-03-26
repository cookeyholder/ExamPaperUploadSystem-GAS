// src/services/GasApiService.js
export class GasApiService {
  static async getUserInfo() {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.script) {
        google.script.run
          .withSuccessHandler((res) => {
            const data = JSON.parse(res);
            if (data.error) reject(new Error(data.error));
            else resolve(data);
          })
          .withFailureHandler((err) => reject(err))
          .apiGetUserInfo();
      } else {
        reject(
          new Error("無 GAS 環境，請在 Google Apps Script 執行環境中開啟"),
        );
      }
    });
  }

  static async getTableData(tableName) {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.script) {
        google.script.run
          .withSuccessHandler((res) => {
            const rawData = JSON.parse(res);
            const mappedData = GasApiService.mapDataToFrontend(
              tableName,
              rawData,
            );
            resolve(mappedData);
          })
          .withFailureHandler((err) => reject(err))
          .apiGetTableData(tableName);
      } else {
        reject(
          new Error("無 GAS 環境，請在 Google Apps Script 執行環境中開啟"),
        );
      }
    });
  }

  static async addTableRow(tableName, dataObj) {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.script) {
        const mappedDataObj = GasApiService.mapDataToBackend(
          tableName,
          dataObj,
        );
        google.script.run
          .withSuccessHandler((res) => {
            const result = JSON.parse(res);
            if (result.error) reject(new Error(result.error));
            else resolve(result);
          })
          .withFailureHandler((err) => reject(err))
          .apiAddTableRow(tableName, mappedDataObj);
      } else {
        reject(new Error("無 GAS 環境"));
      }
    });
  }

  static async updateTableRow(tableName, keyField, keyValue, updateObj) {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.script) {
        const mappedUpdateObj = GasApiService.mapDataToBackend(
          tableName,
          updateObj,
        );
        const mappedKeyField = GasApiService.mapKeyToBackend(
          tableName,
          keyField,
        );
        google.script.run
          .withSuccessHandler((res) => {
            const result = JSON.parse(res);
            if (result.error) reject(new Error(result.error));
            else resolve(result);
          })
          .withFailureHandler((err) => reject(err))
          .apiUpdateTableRow(
            tableName,
            mappedKeyField,
            keyValue,
            mappedUpdateObj,
          );
      } else {
        reject(new Error("無 GAS 環境"));
      }
    });
  }

  static async deleteTableRow(tableName, keyField, keyValue) {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.script) {
        const mappedKeyField = GasApiService.mapKeyToBackend(
          tableName,
          keyField,
        );
        google.script.run
          .withSuccessHandler((res) => {
            const result = JSON.parse(res);
            if (result.error) reject(new Error(result.error));
            else resolve(result);
          })
          .withFailureHandler((err) => reject(err))
          .apiDeleteTableRow(tableName, mappedKeyField, keyValue);
      } else {
        reject(new Error("無 GAS 環境"));
      }
    });
  }

  static async uploadExamPaper(payload) {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.script) {
        google.script.run
          .withSuccessHandler((res) => {
            const result = JSON.parse(res);
            if (result.error) reject(new Error(result.error));
            else resolve(result);
          })
          .withFailureHandler((err) => reject(err))
          .apiUploadExamPaper(payload);
      } else {
        reject(new Error("無 GAS 環境"));
      }
    });
  }

  static mapKeyToBackend(tableName, keyField) {
    // Map frontend key strings to GAS columns
    if (tableName === "users" && keyField === "email") return "Email";
    if (tableName === "classes" && keyField === "id") return "班級代碼";
    if (tableName === "settings" && keyField === "id") return "ID";
    if (tableName.startsWith("exam") && keyField === "id") return "ID";
    return keyField; // Fallback
  }

  static mapDataToBackend(tableName, frontendData) {
    const map = {};

    if (tableName === "users") {
      if (frontendData.email !== undefined) map["Email"] = frontendData.email;
      if (frontendData.name !== undefined) map["姓名"] = frontendData.name;
      if (frontendData.teacherCode !== undefined)
        map["人員編號"] = frontendData.teacherCode;
      if (frontendData.department !== undefined)
        map["部門單位"] = frontendData.department;
      if (frontendData.role !== undefined) map["群組"] = frontendData.role;
    } else if (tableName === "classes") {
      if (frontendData.id !== undefined) map["班級代碼"] = frontendData.id;
      if (frontendData.name !== undefined) map["班級名稱"] = frontendData.name;
    } else if (tableName === "settings") {
      if (frontendData.id !== undefined) map["ID"] = frontendData.id;
      if (frontendData.academicYear !== undefined)
        map["學年度"] = frontendData.academicYear;
      if (frontendData.semester !== undefined)
        map["學期"] = frontendData.semester;
      if (frontendData.examName !== undefined)
        map["考試名稱"] = frontendData.examName;
      if (frontendData.uploadStart !== undefined)
        map["開始時間"] = frontendData.uploadStart;
      if (frontendData.uploadEnd !== undefined)
        map["結束時間"] = frontendData.uploadEnd;
    } else if (tableName.startsWith("exam")) {
      if (frontendData.id !== undefined) map["ID"] = frontendData.id;
      if (frontendData.department !== undefined)
        map["類別"] = frontendData.department;
      if (frontendData.grade !== undefined) map["年級"] = frontendData.grade;
      if (frontendData.subject !== undefined)
        map["科目名稱"] = frontendData.subject;
      if (frontendData.teacherEmail !== undefined)
        map["命題教師"] = frontendData.teacherEmail;
      if (frontendData.markingType !== undefined)
        map["閱卷方式"] = frontendData.markingType;
      if (frontendData.pageCount !== undefined)
        map["試卷張數"] = frontendData.pageCount;
      if (frontendData.fileUrl !== undefined)
        map["檔案連結"] = frontendData.fileUrl;
      if (frontendData.hasListeningExam !== undefined)
        map["英聽加考"] = frontendData.hasListeningExam ? "是" : "否";
    }
    return Object.keys(map).length > 0 ? map : frontendData;
  }

  static mapDataToFrontend(tableName, rawData) {
    if (!rawData || rawData.length === 0) return [];

    if (tableName === "users") {
      return rawData.map((r) => ({
        email: r["Email"],
        name: r["姓名"],
        teacherCode: r["人員編號"],
        department: r["部門單位"],
        role:
          r["群組"] === "admin" ||
          r["群組"] === "管理員" ||
          r["角色"] === "admin"
            ? "admin"
            : "teacher",
      }));
    } else if (tableName === "classes") {
      return rawData.map((r) => ({
        id: r["班級代碼"],
        name: r["班級名稱"],
      }));
    } else if (tableName === "settings") {
      return rawData.map((r) => ({
        id: r["ID"] || r["考試代碼"] || "1",
        academicYear: r["學年度"],
        semester: r["學期"],
        examName: r["考試名稱"],
        uploadStart: r["開始時間"],
        uploadEnd: r["結束時間"],
      }));
    } else if (tableName.startsWith("exam")) {
      return rawData.map((r) => ({
        id: r["ID"] || r["科目代碼"],
        department: r["類別"] || r["群科"],
        grade: r["年級"],
        subject: r["科目名稱"],
        teacherEmail: r["命題教師"] || r["教師Email"],
        markingType: r["閱卷方式"],
        pageCount: r["試卷張數"],
        fileUrl: r["檔案連結"] || r["FileUrl"],
        applicableClass: r["適用班級"] || "",
        hasListeningExam: r["英聽加考"] === "是",
      }));
    }
    return rawData;
  }
}
