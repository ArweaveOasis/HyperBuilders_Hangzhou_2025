"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, Play, Pause, RotateCcw } from 'lucide-react';

interface AIRole {
  name: string;
  personality: string;
}

interface DebateMessage {
  id: string;
  speaker: string;
  content: string;
  timestamp: Date;
  isRole1: boolean;
}

interface DebateSectionProps {
  role1: AIRole;
  role2: AIRole;
  topic: string;
  onDebateComplete: (messages: DebateMessage[]) => void;
  onSummaryToCanvas?: (messages: DebateMessage[]) => void;
}

export const DebateSection: React.FC<DebateSectionProps> = ({
  role1,
  role2,
  topic,
  onDebateComplete,
  onSummaryToCanvas
}) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // 生成辩论回复 - 基于角色设定生成
  // 放在 useEffect 内部使用，避免额外的依赖告警

  const startDebate = () => {
    setIsDebating(true);
    setMessages([]);
    setCurrentRound(0);
    setIsComplete(false);
  };

  const pauseDebate = () => {
    setIsDebating(false);
  };

  const resetDebate = () => {
    setIsDebating(false);
    setMessages([]);
    setCurrentRound(0);
    setIsComplete(false);
  };

  useEffect(() => {
    if (isDebating && currentRound < 4) {
      const timer = setTimeout(() => {
        const isRole1Turn = currentRound % 2 === 0;
        const currentRole = isRole1Turn ? role1 : role2;

        const generateResponse = (speaker: AIRole, isRole1Flag: boolean, round: number): string => {
          const speakerRole = isRole1Flag ? role1 : role2;
          const opponentRole = isRole1Flag ? role2 : role1;
          if (round === 0) {
            return `As ${speakerRole.name}, regarding the topic "${topic}", based on my ${speakerRole.personality} characteristics, I would like to share my perspective. From my point of view, this issue needs to be understood and analyzed from multiple levels...`;
          } else {
            return `After listening to ${opponentRole.name}'s viewpoint, I believe there are some areas worth further discussion. Based on my ${speakerRole.personality} way of thinking, I would like to approach this issue from another angle. While I respect the opponent's opinion, I still maintain that...`;
          }
        };
        
        const newMessage: DebateMessage = {
          id: `msg-${Date.now()}-${currentRound}`,
          speaker: currentRole.name,
          content: generateResponse(currentRole, isRole1Turn, Math.floor(currentRound / 2)),
          timestamp: new Date(),
          isRole1: isRole1Turn
        };

        setMessages(prev => [...prev, newMessage]);
        setCurrentRound(prev => prev + 1);
      }, 2500);

      return () => clearTimeout(timer);
    } else if (currentRound >= 4) {
      setIsDebating(false);
      setIsComplete(true);
    }
  }, [isDebating, currentRound, role1, role2, messages, topic]);

  useEffect(() => {
    if (isComplete) {
      onDebateComplete(messages);
    }
  }, [isComplete, messages, onDebateComplete]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          AI Role Debate - Two Rounds, Four Exchanges
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-600">
            {role1.name}
          </Badge>
          <span className="text-muted-foreground">VS</span>
          <Badge variant="outline" className="text-purple-600">
            {role2.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm">
              <span className="font-medium">Debate Topic:</span> {topic}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-700 mb-1">{role1.name}</h4>
              <p className="text-xs text-green-600">{role1.personality}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-700 mb-1">{role2.name}</h4>
              <p className="text-xs text-purple-600">{role2.personality}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Debate Structure: Two rounds, each person speaks twice, four exchanges total
            </div>
            {(isDebating || messages.length > 0) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Progress:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full ${
                        step <= messages.length 
                          ? 'bg-blue-500' 
                          : step === messages.length + 1 && isDebating
                          ? 'bg-blue-300 animate-pulse'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {messages.length}/4
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={startDebate}
            disabled={isDebating}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Debate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={pauseDebate}
            disabled={!isDebating}
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetDebate}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <ScrollArea className="h-[350px] w-full border rounded-lg p-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`mb-4 p-3 rounded-lg ${
                  message.isRole1 
                    ? 'bg-green-50 border-l-4 border-green-400 ml-0 mr-8' 
                    : 'bg-purple-50 border-l-4 border-purple-400 ml-8 mr-0'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={message.isRole1 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}
                  >
                    {message.speaker}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Round {Math.floor(index / 2) + 1}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {isDebating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {currentRound % 2 === 0 ? role1.name : role2.name} is thinking...
              </span>
            </motion.div>
          )}
        </ScrollArea>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                Two rounds of debate completed! {role1.name} and {role2.name} have both fully expressed their viewpoints.
              </p>
            </div>
            
            {onSummaryToCanvas && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onSummaryToCanvas(messages)}
                  className="w-full"
                  variant="outline"
                >
                  📝 Summarize Debate - Go to Canvas
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
