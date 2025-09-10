"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Database, Cloud, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react';
import { aoService, AOCanvasData } from '../services/aoService';

interface CanvasNode {
  id: string;
  x: number;
  y: number;
  type: 'idea' | 'ai-setup' | 'debate' | 'reflection';
  content?: any;
  connected?: string[];
}

interface MapTile {
  id: string;
  x: number;
  y: number;
  type: 'explored' | 'unexplored' | 'current';
  content?: any;
  timestamp: Date;
}

interface AOIntegrationProps {
  nodes: CanvasNode[];
  mapTiles: MapTile[];
  onDataSync?: (data: { nodes: CanvasNode[]; mapTiles: MapTile[] }) => void;
}

export const AOIntegration: React.FC<AOIntegrationProps> = ({
  nodes,
  mapTiles,
  onDataSync
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // 检查AO连接状态
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // 尝试连接到AO
        const connected = await aoService.simulateConnection();
        setIsConnected(connected);
        setSyncStatus('idle');
      } catch (err) {
        setIsConnected(false);
        setSyncStatus('error');
        setError('无法连接到AO网络');
      }
    };

    checkConnection();
  }, []);

  const syncToAO = async () => {
    if (!isConnected) {
      setError('请先连接到AO网络');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('syncing');
    setError(null);

    try {
      // 准备数据
      const canvasData: AOCanvasData = {
        nodes: nodes.map(node => ({
          ...node,
          timestamp: node.timestamp?.toISOString() || new Date().toISOString()
        })),
        mapTiles: mapTiles.map(tile => ({
          ...tile,
          timestamp: tile.timestamp?.toISOString() || new Date().toISOString()
        })),
        characterPosition: { x: 0, y: 0 }, // 从props中获取
        lastUpdated: new Date().toISOString()
      };

      // 同步到AO
      await aoService.simulateSave(canvasData);
      
      setLastSync(new Date());
      setSyncStatus('success');
      
      // 通知父组件数据已同步
      onDataSync?.({ nodes, mapTiles });
      
    } catch (err) {
      setSyncStatus('error');
      setError(err instanceof Error ? err.message : '同步失败');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromAO = async () => {
    if (!isConnected) {
      setError('请先连接到AO网络');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('syncing');
    setError(null);

    try {
      // 从AO加载数据
      const data = await aoService.simulateLoad();
      
      if (data) {
        // 转换数据格式
        const loadedNodes = data.nodes.map((node: any) => ({
          ...node,
          timestamp: new Date(node.timestamp)
        }));
        const loadedMapTiles = data.mapTiles.map((tile: any) => ({
          ...tile,
          timestamp: new Date(tile.timestamp)
        }));
        
        // 通知父组件加载数据
        onDataSync?.({ nodes: loadedNodes, mapTiles: loadedMapTiles });
      }
      
      setSyncStatus('success');
      
    } catch (err) {
      setSyncStatus('error');
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Sync Success';
      case 'error':
        return 'Sync Failed';
      default:
        return isConnected ? 'Connected' : 'Disconnected';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-500" />
          AO Blockchain Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 连接状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        {/* 错误信息 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* 同步信息 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Nodes:</span>
            <span className="font-medium">{nodes.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Map Tiles:</span>
            <span className="font-medium">{mapTiles.length}</span>
          </div>
          {lastSync && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Last Sync:</span>
              <span>{lastSync.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          <Button
            onClick={syncToAO}
            disabled={!isConnected || isSyncing}
            className="w-full"
            variant="default"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isSyncing ? 'Syncing...' : 'Sync to AO'}
          </Button>
          
          <Button
            onClick={loadFromAO}
            disabled={!isConnected || isSyncing}
            className="w-full"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Load from AO
          </Button>
        </div>

        {/* 数据统计 */}
        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-medium text-lg text-blue-600">{nodes.length}</div>
              <div>Thought Nodes</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-lg text-green-600">{mapTiles.length}</div>
              <div>Explored Areas</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
