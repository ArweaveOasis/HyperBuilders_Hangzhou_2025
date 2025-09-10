import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface DirectionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDirection: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const DirectionSelector: React.FC<DirectionSelectorProps> = ({
  isOpen,
  onClose,
  onSelectDirection
}) => {
  const directions = [
    { key: 'up', label: 'Expand Up', icon: ArrowUp, x: 1, y: 0 },
    { key: 'down', label: 'Expand Down', icon: ArrowDown, x: 1, y: 2 },
    { key: 'left', label: 'Expand Left', icon: ArrowLeft, x: 0, y: 1 },
    { key: 'right', label: 'Expand Right', icon: ArrowRight, x: 2, y: 1 }
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Canvas Expansion Direction</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Based on the debate content, select which direction to create a new reflection node:
          </p>
          
          {/* 方向选择网格 */}
          <div className="relative grid grid-cols-3 gap-2 p-4">
            {/* 中心节点 */}
            <div style={{ gridColumnStart: 2, gridRowStart: 2 }} className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
              <div className="text-sm font-medium text-blue-700">Current Debate</div>
            </div>
            
            {/* 方向按钮 */}
            {directions.map(({ key, label, icon: Icon, x, y }) => (
              <motion.div
                key={key}
                style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-16 flex flex-col items-center justify-center gap-1 hover:bg-green-50 hover:border-green-300"
                  onClick={() => {
                    onSelectDirection(key);
                    onClose();
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};