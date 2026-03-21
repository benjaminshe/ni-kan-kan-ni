import AsyncStorage from '@react-native-async-storage/async-storage';

// 类型定义
export interface Session {
  id: number;
  deviceId: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface ContentRecord {
  id: number;
  categoryId: number;
  title: string;
  notes?: string;
  createdAt: string;
}

const KEYS = {
  SESSIONS: '@nikanikani:sessions',
  CATEGORIES: '@nikanikani:categories',
  CONTENT_RECORDS: '@nikanikani:content_records',
  CURRENT_SESSION: '@nikanikani:current_session',
  ID_COUNTER: '@nikanikani:id_counter',
};

// 会话管理
export const sessionStorage = {
  async getAll(): Promise<Session[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  async save(session: Session): Promise<void> {
    try {
      const sessions = await this.getAll();
      sessions.push(session);
      await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  },

  async update(id: number, updates: Partial<Session>): Promise<void> {
    try {
      const sessions = await this.getAll();
      const index = sessions.findIndex(s => s.id === id);
      if (index !== -1) {
        sessions[index] = { ...sessions[index], ...updates };
        await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  },

  async getCurrentSession(): Promise<{ id: number; startTime: string } | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  },

  async setCurrentSession(session: { id: number; startTime: string }): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
    } catch (error) {
      console.error('Error setting current session:', error);
    }
  },

  async clearCurrentSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CURRENT_SESSION);
    } catch (error) {
      console.error('Error clearing current session:', error);
    }
  },
};

// 分类管理
export const categoryStorage = {
  async getAll(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
      if (data) {
        return JSON.parse(data);
      }
      // 返回默认分类
      const defaultCategories: Category[] = [
        { id: 1, name: '社交', color: '#FF6B6B' },
        { id: 2, name: '娱乐', color: '#4ECDC4' },
        { id: 3, name: '工作', color: '#45B7D1' },
        { id: 4, name: '学习', color: '#96CEB4' },
        { id: 5, name: '其他', color: '#FFEAA7' },
      ];
      await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      return defaultCategories;
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },

  async save(category: Category): Promise<void> {
    try {
      const categories = await this.getAll();
      categories.push(category);
      await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving category:', error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const categories = await this.getAll();
      const filtered = categories.filter(c => c.id !== id);
      await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  },
};

// 内容记录管理
export const contentRecordStorage = {
  async getAll(): Promise<ContentRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CONTENT_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting content records:', error);
      return [];
    }
  },

  async save(record: ContentRecord): Promise<void> {
    try {
      const records = await this.getAll();
      records.push(record);
      await AsyncStorage.setItem(KEYS.CONTENT_RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving content record:', error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const records = await this.getAll();
      const filtered = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(KEYS.CONTENT_RECORDS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting content record:', error);
    }
  },
};

let idCounter: number | null = null;

export const generateId = async (): Promise<number> => {
  if (idCounter === null) {
    try {
      const data = await AsyncStorage.getItem(KEYS.ID_COUNTER);
      idCounter = data ? parseInt(data, 10) : 1;
    } catch {
      idCounter = 1;
    }
  }
  const newId = idCounter++;
  await AsyncStorage.setItem(KEYS.ID_COUNTER, idCounter.toString());
  return newId;
};

export const resetIdCounter = async (): Promise<void> => {
  idCounter = 1;
  await AsyncStorage.setItem(KEYS.ID_COUNTER, '1');
};

// 工具函数：获取今天的日期字符串
export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};
