"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  type: 'idea' | 'ai-setup' | 'debate' | 'reflection';
  content?: unknown;
  connected?: string[];
}

interface InfiniteCanvasProps {
  children: React.ReactNode;
  nodes: CanvasNode[];
  onAddNode: (x: number, y: number, type: CanvasNode['type']) => void;
  selectedNode?: string | null;
  onSelectNode: (nodeId: string | null) => void;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  children,
  nodes,
  onAddNode,
  selectedNode,
  onSelectNode
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const GRID_SIZE = 400;

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

  return (
    <div className="relative size-full overflow-hidden bg-gray-50">
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
          {/* Grid background */}
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

          {/* Nodes */}
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

              {/* Expansion buttons */}
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

              {/* Connection lines */}
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
        </motion.div>
      </div>

      {/* Zoom controls */}
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
          重置
        </Button>
      </div>
    </div>
  );
};
