// src/services/MockApiService.js
import { mockData } from './mockData.js';

// Deep clone to simulate a fresh memory store
let memoryStore = JSON.parse(JSON.stringify(mockData));

// Simulate network latency
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  
  /**
   * 模擬取得當下使用者 (對標 Session.getActiveUser().getEmail())
   */
  static async getUserInfo() {
    await delay();
    // Default mock user for testing views
    const mockEmail = "t1001@ksvs.kh.edu.tw";
    const user = memoryStore.users.find(u => u.email === mockEmail);
    return user || { email: mockEmail, name: "測試無名氏", role: "teacher" };
  }

  /**
   * 模擬取得整張工作表資料
   * @param {string} tableName - settings, users, classes, exam1~4
   */
  static async getTableData(tableName) {
    await delay();
    if (!memoryStore[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    // Return a clone to prevent direct mutability bypass
    return JSON.parse(JSON.stringify(memoryStore[tableName]));
  }

  /**
   * 模擬新增整列資料到工作表
   */
  static async addTableRow(tableName, dataObj) {
    await delay();
    if (!memoryStore[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    // Very simple UUID generation for mock
    dataObj.id = dataObj.id || Math.random().toString(36).substr(2, 9);
    memoryStore[tableName].push(dataObj);
    return true;
  }

  /**
   * 模擬依據 ID 更新資料列
   */
  static async updateTableRow(tableName, idKey, idValue, dataObj) {
    await delay();
    if (!memoryStore[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    const index = memoryStore[tableName].findIndex(row => row[idKey] === idValue);
    if (index === -1) throw new Error(`Row with ${idKey}=${idValue} not found in ${tableName}`);
    
    memoryStore[tableName][index] = { ...memoryStore[tableName][index], ...dataObj };
    return true;
  }

  /**
   * 模擬依據 ID 刪除資料列
   */
  static async deleteTableRow(tableName, idKey, idValue) {
    await delay();
    if (!memoryStore[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    memoryStore[tableName] = memoryStore[tableName].filter(row => row[idKey] !== idValue);
    return true;
  }
}
