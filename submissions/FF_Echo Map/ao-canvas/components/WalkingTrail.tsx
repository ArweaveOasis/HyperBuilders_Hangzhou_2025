"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Footprints } from 'lucide-react';

interface TrailPoint {
  id: string;
  x: number;
  y: number;
  timestamp: Date;
  type: 'step' | 'pause' | 'exploration';
}

interface WalkingTrailProps {
  trailPoints: TrailPoint[];
  currentPosition: { x: number; y: number };
  isWalking: boolean;
  className?: string;
}

export const WalkingTrail: React.FC<WalkingTrailProps> = ({
  trailPoints,
  currentPosition,
  isWalking,
  className = ''
}) => {
  const [visiblePoints, setVisiblePoints] = useState<TrailPoint[]>([]);
  const [trailPath, setTrailPath] = useState<string>('');

  // 更新可见的轨迹点
  useEffect(() => {
    setVisiblePoints(trailPoints.slice(-20)); // 只显示最近20个点
  }, [trailPoints]);

  // 生成SVG路径
  useEffect(() => {
    if (visiblePoints.length < 2) {
      setTrailPath('');
      return;
    }

    const pathData = visiblePoints
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${point.x} ${point.y}`;
      })
      .join(' ');

    setTrailPath(pathData);
  }, [visiblePoints]);

  const getPointColor = (type: TrailPoint['type']) => {
    switch (type) {
      case 'step':
        return 'text-blue-500';
      case 'pause':
        return 'text-yellow-500';
      case 'exploration':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPointSize = (type: TrailPoint['type']) => {
    switch (type) {
      case 'step':
        return 'w-2 h-2';
      case 'pause':
        return 'w-3 h-3';
      case 'exploration':
        return 'w-4 h-4';
      default:
        return 'w-2 h-2';
    }
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* 轨迹线 */}
      {trailPath && (
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 10 }}
        >
          <motion.path
            d={trailPath}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* 轨迹点 */}
      <AnimatePresence>
        {visiblePoints.map((point, index) => (
          <motion.div
            key={point.id}
            className={`absolute ${getPointColor(point.type)} ${getPointSize(point.type)}`}
            style={{
              left: point.x - 4,
              top: point.y - 4,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1
            }}
          >
            <div className="relative">
              {/* 点的主体 */}
              <div className={`w-full h-full rounded-full bg-current shadow-sm`} />
              
              {/* 脉冲效果 */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-current opacity-30`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* 类型图标 */}
              {point.type === 'exploration' && (
                <div className="absolute -top-1 -right-1">
                  <MapPin className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 当前位置指示器 */}
      <motion.div
        className="absolute w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
        style={{
          left: currentPosition.x - 12,
          top: currentPosition.y - 12,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: isWalking ? [1, 1.2, 1] : 1,
          boxShadow: isWalking 
            ? ["0 0 0 0 rgba(59, 130, 246, 0.7)", "0 0 0 10px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0.7)"]
            : "0 4px 8px rgba(0,0,0,0.2)"
        }}
        transition={{
          duration: 1,
          repeat: isWalking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <Footprints className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      {/* 轨迹统计 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Footprints className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Walking Trail</span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>Total Steps: {trailPoints.length}</div>
          <div>Exploration Points: {trailPoints.filter(p => p.type === 'exploration').length}</div>
          <div>Pause Points: {trailPoints.filter(p => p.type === 'pause').length}</div>
        </div>
      </div>
    </div>
  );
};



