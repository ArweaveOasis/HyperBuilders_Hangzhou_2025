"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Save, Edit3 } from 'lucide-react';

interface DebateMessage {
  id: string;
  speaker: string;
  content: string;
  timestamp: Date;
  isRole1: boolean;
}

interface ReflectionSectionProps {
  debateMessages: DebateMessage[];
  topic: string;
  role1Name: string;
  role2Name: string;
  onReflectionSave: (reflection: string) => void;
  initialReflection?: string;
}

export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  debateMessages,
  topic,
  role1Name,
  role2Name,
  onReflectionSave,
  initialReflection = ''
}) => {
  const [reflection, setReflection] = useState(initialReflection);
  const [isEditing, setIsEditing] = useState(!initialReflection);
  const [savedReflection, setSavedReflection] = useState(initialReflection);

  const handleSave = () => {
    setSavedReflection(reflection);
    setIsEditing(false);
    onReflectionSave(reflection);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const reflectionPrompts = [
    "Which viewpoint was most persuasive? Why?",
    "How did the two AI roles' argumentation styles differ?",
    "What new understanding did this debate give you about the original topic?",
    "If you were the judge, which side would you tend to support?",
    "What other angles were not covered in the debate?"
  ];

  const getDebateSummary = () => {
    const role1Messages = debateMessages.filter(m => m.isRole1).length;
    const role2Messages = debateMessages.filter(m => !m.isRole1).length;
    return {
      totalRounds: Math.max(role1Messages, role2Messages),
      role1Messages,
      role2Messages
    };
  };

  const summary = getDebateSummary();

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Debate Reflection
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">
            Topic: {topic}
          </Badge>
          <Badge variant="outline">
            {summary.totalRounds} Rounds
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 辩论摘要 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Debate Summary</h4>
          <div className="text-sm space-y-1">
            <p>• {role1Name}: {summary.role1Messages} speeches</p>
            <p>• {role2Name}: {summary.role2Messages} speeches</p>
            <p>• Total: {debateMessages.length} messages</p>
          </div>
        </div>

        {/* 反思提示 */}
        <div className="space-y-2">
          <h4 className="font-medium">Reflection Prompts</h4>
          <div className="grid grid-cols-1 gap-2">
            {reflectionPrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-2 bg-blue-50 rounded text-sm text-blue-700 cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  if (isEditing) {
                    setReflection(prev => prev + (prev ? '\n\n' : '') + `Q: ${prompt}\nA: `);
                  }
                }}
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>

        {/* 反思内容 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">My Reflection</h4>
            {!isEditing && savedReflection && (
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Please write your reflection and thoughts on this debate..."
                className="min-h-[200px] resize-none"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSave}
                  disabled={!reflection.trim()}
                  className="w-full flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Reflection
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReflection ? (
                <ScrollArea className="max-h-[200px] w-full border rounded-lg p-3">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {savedReflection}
                  </div>
                </ScrollArea>
              ) : (
                <div 
                  className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click to start writing reflection</p>
                </div>
              )}
            </div>
          )}
        </div>

        {savedReflection && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <p className="text-sm text-green-700">
              Reflection saved! You can continue adding new nodes on the canvas to expand your thinking.
            </p>
          </motion.div>
        )}

        {/* 快速动作 */}
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  setReflection(prev => prev + (prev ? '\n\n' : '') + `Based on the debate between ${role1Name} and ${role2Name}, I think...`);
                }
              }}
              disabled={!isEditing}
            >
              Add Viewpoint
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                if (isEditing) {
                  setReflection(prev => prev + (prev ? '\n\n' : '') + `The limitations of this debate are...`);
                }
              }}
              disabled={!isEditing}
            >
              Analyze Limitations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};