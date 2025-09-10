"use client";

import { connect, ConnectResult } from '@permaweb/ao-connect';

export interface AOCanvasData {
  nodes: any[];
  mapTiles: any[];
  characterPosition: { x: number; y: number };
  lastUpdated: string;
}

export interface AOServiceConfig {
  processId?: string;
  wallet?: any;
  autoConnect?: boolean;
}

export class AOService {
  private connectResult: ConnectResult | null = null;
  private processId: string | null = null;
  private isConnected = false;
  private config: AOServiceConfig;

  constructor(config: AOServiceConfig = {}) {
    this.config = {
      autoConnect: true,
      ...config
    };
  }

  async connect(): Promise<boolean> {
    try {
      this.connectResult = await connect({
        wallet: this.config.wallet,
        autoConnect: this.config.autoConnect
      });

      if (this.connectResult) {
        this.isConnected = true;
        this.processId = this.config.processId || this.connectResult.processId;
        console.log('Connected to AO:', this.processId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect to AO:', error);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.connectResult = null;
    this.isConnected = false;
    this.processId = null;
  }

  getConnectionStatus(): { isConnected: boolean; processId: string | null } {
    return {
      isConnected: this.isConnected,
      processId: this.processId
    };
  }

  async saveCanvasData(data: AOCanvasData): Promise<boolean> {
    if (!this.isConnected || !this.connectResult) {
      throw new Error('Not connected to AO');
    }

    try {
      const result = await this.connectResult.message({
        process: this.processId!,
        tags: [
          { name: 'Action', value: 'SaveCanvasData' },
          { name: 'Data', value: JSON.stringify(data) },
          { name: 'Timestamp', value: new Date().toISOString() }
        ],
        data: JSON.stringify(data)
      });

      console.log('Canvas data saved to AO:', result);
      return true;
    } catch (error) {
      console.error('Failed to save canvas data to AO:', error);
      throw error;
    }
  }

  async loadCanvasData(): Promise<AOCanvasData | null> {
    if (!this.isConnected || !this.connectResult) {
      throw new Error('Not connected to AO');
    }

    try {
      const result = await this.connectResult.message({
        process: this.processId!,
        tags: [
          { name: 'Action', value: 'LoadCanvasData' }
        ]
      });

      // 解析返回的数据
      if (result && result.data) {
        const data = JSON.parse(result.data);
        return data as AOCanvasData;
      }
      return null;
    } catch (error) {
      console.error('Failed to load canvas data from AO:', error);
      throw error;
    }
  }

  async getCanvasHistory(): Promise<AOCanvasData[]> {
    if (!this.isConnected || !this.connectResult) {
      throw new Error('Not connected to AO');
    }

    try {
      const result = await this.connectResult.message({
        process: this.processId!,
        tags: [
          { name: 'Action', value: 'GetCanvasHistory' }
        ]
      });

      if (result && result.data) {
        const history = JSON.parse(result.data);
        return Array.isArray(history) ? history : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to get canvas history from AO:', error);
      throw error;
    }
  }

  async syncCanvasData(data: AOCanvasData): Promise<boolean> {
    if (!this.isConnected || !this.connectResult) {
      throw new Error('Not connected to AO');
    }

    try {
      // 先保存当前数据
      await this.saveCanvasData(data);
      
      // 然后尝试加载最新数据进行同步
      const latestData = await this.loadCanvasData();
      
      if (latestData) {
        // 比较时间戳，使用最新的数据
        const currentTime = new Date(data.lastUpdated).getTime();
        const latestTime = new Date(latestData.lastUpdated).getTime();
        
        if (latestTime > currentTime) {
          console.log('Data synced from AO - using latest version');
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to sync canvas data with AO:', error);
      throw error;
    }
  }

  async createNewCanvas(): Promise<string> {
    if (!this.isConnected || !this.connectResult) {
      throw new Error('Not connected to AO');
    }

    try {
      const result = await this.connectResult.message({
        process: this.processId!,
        tags: [
          { name: 'Action', value: 'CreateNewCanvas' },
          { name: 'Timestamp', value: new Date().toISOString() }
        ]
      });

      if (result && result.data) {
        const response = JSON.parse(result.data);
        return response.canvasId;
      }
      throw new Error('Failed to create new canvas');
    } catch (error) {
      console.error('Failed to create new canvas:', error);
      throw error;
    }
  }

  async shareCanvas(canvasId: string): Promise<string> {
    if (!this.isConnected || !this.connectResult) {
      throw new Error('Not connected to AO');
    }

    try {
      const result = await this.connectResult.message({
        process: this.processId!,
        tags: [
          { name: 'Action', value: 'ShareCanvas' },
          { name: 'CanvasId', value: canvasId }
        ]
      });

      if (result && result.data) {
        const response = JSON.parse(result.data);
        return response.shareUrl;
      }
      throw new Error('Failed to share canvas');
    } catch (error) {
      console.error('Failed to share canvas:', error);
      throw error;
    }
  }

  // 模拟方法 - 用于开发测试
  async simulateConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.processId = 'simulated-process-id';
        resolve(true);
      }, 1000);
    });
  }

  async simulateSave(data: AOCanvasData): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Simulated save to AO:', data);
        resolve(true);
      }, 500);
    });
  }

  async simulateLoad(): Promise<AOCanvasData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 500);
    });
  }
}

// 创建全局实例
export const aoService = new AOService();



