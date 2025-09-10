"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Compass } from 'lucide-react';
import { Button } from './ui/button';
import { WalkingCharacter } from './WalkingCharacter';
import { WalkingTrail } from './WalkingTrail';
import { CanvasNode } from './InfiniteCanvas';
import { AOIntegration } from './AOIntegration';
import { useCanvasPersistence } from '../hooks/useCanvasPersistence';

interface MapTile {
  id: string;
  x: number;
  y: number;
  type: 'explored' | 'unexplored' | 'current';
  content?: any;
  timestamp: Date;
}

interface EnhancedInfiniteCanvasProps {
  children: React.ReactNode;
  nodes: CanvasNode[];
  onAddNode: (x: number, y: number, type: CanvasNode['type']) => void;
  selectedNode?: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onNodeComplete?: (nodeId: string) => void;
  onDataSync?: (data: { nodes: CanvasNode[]; mapTiles: MapTile[] }) => void;
}

export const EnhancedInfiniteCanvas: React.FC<EnhancedInfiniteCanvasProps> = ({
  children,
  nodes,
  onAddNode,
  selectedNode,
  onSelectNode,
  onNodeComplete,
  onDataSync
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCharacterWalking, setIsCharacterWalking] = useState(false);
  const [walkDirection, setWalkDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [trailPoints, setTrailPoints] = useState<Array<{id: string; x: number; y: number; timestamp: Date; type: 'step' | 'pause' | 'exploration'}>>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const GRID_SIZE = 400;

  // 使用持久化钩子
  const {
    data,
    addNode: addPersistedNode,
    addMapTile,
    updateMapTile,
    updateCharacterPosition,
    getTileAt,
    getNodesAt
  } = useCanvasPersistence();

  const { mapTiles, characterPosition, nodes: persistedNodes } = data;
  const currentTile = mapTiles.find(tile => tile.type === 'current') || null;

  // 初始化地图
  useEffect(() => {
    if (mapTiles.length === 0) {
      const initialTile: MapTile = {
        id: 'origin',
        x: 0,
        y: 0,
        type: 'current',
        timestamp: new Date()
      };
      addMapTile(initialTile);
      updateCharacterPosition({ x: 0, y: 0 });
    }
  }, [mapTiles.length, addMapTile, updateCharacterPosition]);

  // 当节点完成时，触发行走动画
  useEffect(() => {
    if (onNodeComplete && selectedNode) {
      const node = nodes.find(n => n.id === selectedNode);
      if (node) {
        // 检查节点是否完成（有内容）
        const hasContent = node.content && Object.keys(node.content).length > 0;
        if (hasContent) {
          triggerWalkAnimation();
        }
      }
    }
  }, [selectedNode, nodes, onNodeComplete]);

  const triggerWalkAnimation = () => {
    if (isCharacterWalking) return;
    
    setIsCharacterWalking(true);
    // 随机选择行走方向
    const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    setWalkDirection(randomDirection);
  };

  const handleWalkComplete = () => {
    setIsCharacterWalking(false);
    
    // 生成新的地图块
    const newTile = generateNewTile();
    addMapTile(newTile);
    
    // 更新当前瓦片状态
    mapTiles.forEach(tile => {
      if (tile.type === 'current') {
        updateMapTile(tile.id, { type: 'explored' });
      }
    });
    updateMapTile(newTile.id, { type: 'current' });
    
    // 更新角色位置
    const newPosition = { x: newTile.x * GRID_SIZE, y: newTile.y * GRID_SIZE };
    updateCharacterPosition(newPosition);
    
    // 添加轨迹点
    setTrailPoints(prev => [...prev, {
      id: `trail-${Date.now()}`,
      x: newPosition.x,
      y: newPosition.y,
      timestamp: new Date(),
      type: 'exploration'
    }]);
    
    // 自动创建新节点
    onAddNode(newTile.x, newTile.y, 'idea');
  };

  const generateNewTile = (): MapTile => {
    const directions = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
    ];
    
    // 找到当前瓦片
    const current = currentTile || mapTiles[mapTiles.length - 1];
    
    // 随机选择一个方向
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const newX = current.x + direction.x;
    const newY = current.y + direction.y;
    
    // 检查是否已存在
    const exists = mapTiles.some(tile => tile.x === newX && tile.y === newY);
    if (exists) {
      return generateNewTile(); // 递归重试
    }
    
    return {
      id: `tile-${Date.now()}`,
      x: newX,
      y: newY,
      type: 'unexplored',
      timestamp: new Date()
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.1, Math.min(2, zoom - e.deltaY * 0.001));
    setZoom(newZoom);
  };

  const getExpandButtons = (node: CanvasNode) => {
    const directions = [
      { dir: 'up', x: node.x, y: node.y - 1, icon: '↑' },
      { dir: 'down', x: node.x, y: node.y + 1, icon: '↓' },
      { dir: 'left', x: node.x - 1, y: node.y, icon: '←' },
      { dir: 'right', x: node.x + 1, y: node.y, icon: '→' }
    ];

    return directions.filter(d => !nodes.some(n => n.x === d.x && n.y === d.y));
  };

  const getTileType = (x: number, y: number): 'explored' | 'unexplored' | 'current' => {
    const tile = mapTiles.find(t => t.x === x && t.y === y);
    if (tile) {
      return tile.type;
    }
    return 'unexplored';
  };

  return (
    <div className="relative size-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <div
        ref={canvasRef}
        className="size-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          className="relative"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* 地图网格背景 */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={`v-${i}`}>
                <div
                  className="absolute border-l border-gray-200"
                  style={{
                    left: (i - 10) * GRID_SIZE,
                    top: -5000,
                    height: 10000
                  }}
                />
                <div
                  className="absolute border-t border-gray-200"
                  style={{
                    top: (i - 10) * GRID_SIZE,
                    left: -5000,
                    width: 10000
                  }}
                />
              </div>
            ))}
          </div>

          {/* 地图瓦片 */}
          {Array.from({ length: 20 }, (_, i) => 
            Array.from({ length: 20 }, (_, j) => {
              const x = i - 10;
              const y = j - 10;
              const tileType = getTileType(x, y);
              
              if (tileType === 'unexplored') return null;
              
              return (
                <motion.div
                  key={`tile-${x}-${y}`}
                  className={`absolute rounded-lg border-2 ${
                    tileType === 'current' 
                      ? 'border-blue-400 bg-blue-100/50' 
                      : 'border-gray-300 bg-white/30'
                  }`}
                  style={{
                    left: x * GRID_SIZE - 50,
                    top: y * GRID_SIZE - 50,
                    width: 100,
                    height: 100
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center justify-center h-full">
                    {tileType === 'current' ? (
                      <MapPin className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Compass className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </motion.div>
              );
            })
          )}

          {/* 节点 */}
          {nodes.map((node) => (
            <div key={node.id}>
              <motion.div
                className={`absolute p-6 bg-white rounded-lg shadow-lg border-2 cursor-pointer ${
                  selectedNode === node.id ? 'border-blue-500' : 'border-gray-200'
                }`}
                style={{
                  left: node.x * GRID_SIZE - 150,
                  top: node.y * GRID_SIZE - 100,
                  width: 300,
                  minHeight: 200
                }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onSelectNode(node.id);
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {children}
              </motion.div>

              {/* 扩展按钮 */}
              {selectedNode === node.id &&
                getExpandButtons(node).map((direction) => (
                  <Button
                    key={direction.dir}
                    size="sm"
                    variant="outline"
                    className={`absolute w-8 h-8 p-0 rounded-full shadow-md ${
                      direction.dir === 'up' ? '-top-4 left-1/2 -translate-x-1/2' :
                      direction.dir === 'down' ? '-bottom-4 left-1/2 -translate-x-1/2' :
                      direction.dir === 'left' ? '-left-4 top-1/2 -translate-y-1/2' :
                      '-right-4 top-1/2 -translate-y-1/2'
                    }`}
                    style={{
                      left: direction.dir === 'left' 
                        ? direction.x * GRID_SIZE - 170 
                        : direction.dir === 'right'
                        ? direction.x * GRID_SIZE - 130
                        : direction.x * GRID_SIZE - 150,
                      top: direction.dir === 'up'
                        ? direction.y * GRID_SIZE - 120
                        : direction.dir === 'down' 
                        ? direction.y * GRID_SIZE - 80
                        : direction.y * GRID_SIZE - 100
                    }}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onAddNode(direction.x, direction.y, 'idea');
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                ))}

              {/* 连接线 */}
              {node.connected?.map((connectedId) => {
                const connectedNode = nodes.find(n => n.id === connectedId);
                if (!connectedNode) return null;

                const startX = node.x * GRID_SIZE;
                const startY = node.y * GRID_SIZE;
                const endX = connectedNode.x * GRID_SIZE;
                const endY = connectedNode.y * GRID_SIZE;

                return (
                  <svg
                    key={`${node.id}-${connectedId}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: Math.min(startX, endX) - 150,
                      top: Math.min(startY, endY) - 100,
                      width: Math.abs(endX - startX) + 300,
                      height: Math.abs(endY - startY) + 200
                    }}
                  >
                    <line
                      x1={startX < endX ? 150 : Math.abs(endX - startX) + 150}
                      y1={startY < endY ? 100 : Math.abs(endY - startY) + 100}
                      x2={startX < endX ? Math.abs(endX - startX) + 150 : 150}
                      y2={startY < endY ? Math.abs(endY - startY) + 100 : 100}
                      stroke="#e5e7eb"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                );
              })}
            </div>
          ))}

          {/* 行走轨迹 */}
          <WalkingTrail
            trailPoints={trailPoints}
            currentPosition={characterPosition}
            isWalking={isCharacterWalking}
          />

          {/* 行走角色 */}
          <WalkingCharacter
            position={characterPosition}
            isWalking={isCharacterWalking}
            direction={walkDirection}
            onWalkComplete={handleWalkComplete}
          />
        </motion.div>
      </div>

      {/* 控制面板 */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.min(2, zoom + 0.2))}
        >
          +
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}
        >
          -
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
        >
          Reset
        </Button>
      </div>

      {/* 地图信息 */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>Explored: {mapTiles.length} tiles</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-gray-500" />
            <span>Current Position: ({currentTile?.x || 0}, {currentTile?.y || 0})</span>
          </div>
        </div>
      </div>

      {/* AO同步面板 */}
      <div className="absolute bottom-4 left-4">
        <AOIntegration
          nodes={nodes}
          mapTiles={mapTiles}
          onDataSync={onDataSync}
        />
      </div>
    </div>
  );
};
