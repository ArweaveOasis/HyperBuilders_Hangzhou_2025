"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

interface WalkingCharacterProps {
  position: { x: number; y: number };
  isWalking: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  onWalkComplete?: () => void;
  className?: string;
}

export const WalkingCharacter: React.FC<WalkingCharacterProps> = ({
  position,
  isWalking,
  direction,
  onWalkComplete,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // 行走动画配置
  const walkConfig = {
    up: { 
      x: 0, 
      y: -100, 
      rotation: -90,
      stepDuration: 0.3,
      totalSteps: 3
    },
    down: { 
      x: 0, 
      y: 100, 
      rotation: 90,
      stepDuration: 0.3,
      totalSteps: 3
    },
    left: { 
      x: -100, 
      y: 0, 
      rotation: 180,
      stepDuration: 0.3,
      totalSteps: 3
    },
    right: { 
      x: 100, 
      y: 0, 
      rotation: 0,
      stepDuration: 0.3,
      totalSteps: 3
    }
  };

  const config = walkConfig[direction];

  // 行走动画效果
  useEffect(() => {
    if (isWalking) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= config.totalSteps) {
            clearInterval(interval);
            onWalkComplete?.();
            return 0;
          }
          return nextStep;
        });
      }, config.stepDuration * 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [isWalking, config.stepDuration, config.totalSteps, onWalkComplete]);

  // 计算当前步数对应的位置偏移
  const getStepOffset = () => {
    const progress = currentStep / config.totalSteps;
    return {
      x: config.x * progress,
      y: config.y * progress
    };
  };

  const stepOffset = getStepOffset();

  return (
    <motion.div
      className={`absolute z-50 ${className}`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`
      }}
      animate={{
        x: stepOffset.x,
        y: stepOffset.y,
        scale: isWalking ? [1, 1.1, 1] : 1
      }}
      transition={{
        duration: config.stepDuration,
        ease: "easeInOut"
      }}
    >
      <motion.div
        className="relative"
        animate={{
          y: isWalking ? [0, -5, 0] : 0
        }}
        transition={{
          duration: 0.2,
          repeat: isWalking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* 行走时的足迹效果 */}
        <AnimatePresence>
          {isWalking && currentStep > 0 && (
            <motion.div
              className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full opacity-60"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* 角色图标 */}
        <div className="relative">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{
              boxShadow: isWalking 
                ? ["0 4px 8px rgba(0,0,0,0.2)", "0 6px 12px rgba(0,0,0,0.3)", "0 4px 8px rgba(0,0,0,0.2)"]
                : "0 4px 8px rgba(0,0,0,0.2)"
            }}
            transition={{
              duration: 0.3,
              repeat: isWalking ? Infinity : 0
            }}
          >
            <User className="w-4 h-4 text-white" />
          </motion.div>

          {/* 行走时的光晕效果 */}
          {isWalking && (
            <motion.div
              className="absolute inset-0 w-8 h-8 bg-blue-400 rounded-full opacity-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* 行走轨迹线 */}
        {isWalking && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"
            style={{
              transformOrigin: 'left center',
              transform: `rotate(${config.rotation}deg)`
            }}
            animate={{
              width: `${Math.abs(config.x) + Math.abs(config.y)}px`
            }}
            transition={{
              duration: config.stepDuration * config.totalSteps,
              ease: "easeOut"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};



