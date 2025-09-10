"use client";

import { useState, useEffect, useCallback } from 'react';

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  type: 'idea' | 'ai-setup' | 'debate' | 'reflection';
  content?: any;
  connected?: string[];
  timestamp: Date;
}

export interface MapTile {
  id: string;
  x: number;
  y: number;
  type: 'explored' | 'unexplored' | 'current';
  content?: any;
  timestamp: Date;
  nodes?: string[]; // 该瓦片包含的节点ID
}

export interface CanvasData {
  nodes: CanvasNode[];
  mapTiles: MapTile[];
  characterPosition: { x: number; y: number };
  lastUpdated: Date;
}

export const useCanvasPersistence = () => {
  const [data, setData] = useState<CanvasData>({
    nodes: [],
    mapTiles: [],
    characterPosition: { x: 0, y: 0 },
    lastUpdated: new Date()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从localStorage加载数据
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('ao-canvas-data');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 转换日期字符串为Date对象
        parsed.nodes = parsed.nodes.map((node: any) => ({
          ...node,
          timestamp: new Date(node.timestamp)
        }));
        parsed.mapTiles = parsed.mapTiles.map((tile: any) => ({
          ...tile,
          timestamp: new Date(tile.timestamp)
        }));
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        setData(parsed);
      }
    } catch (err) {
      console.error('Failed to load canvas data:', err);
      setError('加载数据失败');
    }
  }, []);

  // 保存数据到localStorage
  const saveToStorage = useCallback((newData: Partial<CanvasData>) => {
    try {
      const updatedData = {
        ...data,
        ...newData,
        lastUpdated: new Date()
      };
      localStorage.setItem('ao-canvas-data', JSON.stringify(updatedData));
      setData(updatedData);
    } catch (err) {
      console.error('Failed to save canvas data:', err);
      setError('保存数据失败');
    }
  }, [data]);

  // 添加新节点
  const addNode = useCallback((node: Omit<CanvasNode, 'timestamp'>) => {
    const newNode: CanvasNode = {
      ...node,
      timestamp: new Date()
    };
    
    setData(prev => {
      const updated = {
        ...prev,
        nodes: [...prev.nodes, newNode]
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 更新节点
  const updateNode = useCallback((nodeId: string, updates: Partial<CanvasNode>) => {
    setData(prev => {
      const updated = {
        ...prev,
        nodes: prev.nodes.map(node => 
          node.id === nodeId ? { ...node, ...updates } : node
        )
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 添加新地图瓦片
  const addMapTile = useCallback((tile: Omit<MapTile, 'timestamp'>) => {
    const newTile: MapTile = {
      ...tile,
      timestamp: new Date()
    };
    
    setData(prev => {
      const updated = {
        ...prev,
        mapTiles: [...prev.mapTiles, newTile]
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 更新地图瓦片
  const updateMapTile = useCallback((tileId: string, updates: Partial<MapTile>) => {
    setData(prev => {
      const updated = {
        ...prev,
        mapTiles: prev.mapTiles.map(tile => 
          tile.id === tileId ? { ...tile, ...updates } : tile
        )
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 更新角色位置
  const updateCharacterPosition = useCallback((position: { x: number; y: number }) => {
    setData(prev => {
      const updated = {
        ...prev,
        characterPosition: position
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 获取指定位置的瓦片
  const getTileAt = useCallback((x: number, y: number) => {
    return data.mapTiles.find(tile => tile.x === x && tile.y === y);
  }, [data.mapTiles]);

  // 获取指定位置的节点
  const getNodesAt = useCallback((x: number, y: number) => {
    return data.nodes.filter(node => node.x === x && node.y === y);
  }, [data.nodes]);

  // 初始化默认数据
  const initializeDefaultData = useCallback(() => {
    const defaultData: CanvasData = {
      nodes: [{
        id: 'origin',
        x: 0,
        y: 0,
        type: 'idea',
        content: {},
        connected: [],
        timestamp: new Date()
      }],
      mapTiles: [{
        id: 'origin-tile',
        x: 0,
        y: 0,
        type: 'current',
        content: {},
        timestamp: new Date(),
        nodes: ['origin']
      }],
      characterPosition: { x: 0, y: 0 },
      lastUpdated: new Date()
    };
    
    setData(defaultData);
    saveToStorage(defaultData);
  }, [saveToStorage]);

  // 清空所有数据
  const clearData = useCallback(() => {
    localStorage.removeItem('ao-canvas-data');
    setData({
      nodes: [],
      mapTiles: [],
      characterPosition: { x: 0, y: 0 },
      lastUpdated: new Date()
    });
  }, []);

  // 导出数据
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ao-canvas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // 导入数据
  const importData = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        // 转换日期字符串为Date对象
        imported.nodes = imported.nodes.map((node: any) => ({
          ...node,
          timestamp: new Date(node.timestamp)
        }));
        imported.mapTiles = imported.mapTiles.map((tile: any) => ({
          ...tile,
          timestamp: new Date(tile.timestamp)
        }));
        imported.lastUpdated = new Date(imported.lastUpdated);
        
        setData(imported);
        saveToStorage(imported);
      } catch (err) {
        setError('导入数据格式错误');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  }, [saveToStorage]);

  // 组件挂载时加载数据
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return {
    data,
    isLoading,
    isSaving,
    error,
    addNode,
    updateNode,
    addMapTile,
    updateMapTile,
    updateCharacterPosition,
    getTileAt,
    getNodesAt,
    initializeDefaultData,
    clearData,
    exportData,
    importData,
    setError
  };
};



