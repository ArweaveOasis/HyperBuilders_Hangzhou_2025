"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Bot, ArrowRight, CheckCircle } from 'lucide-react';

interface AIRole {
  name: string;
  personality: string;
}

interface IdeaAndRoleSetupProps {
  onComplete: (idea: string, role1: AIRole, role2: AIRole) => void;
  initialIdea?: string;
  initialRoles?: { role1?: AIRole; role2?: AIRole };
}

export const IdeaAndRoleSetup: React.FC<IdeaAndRoleSetupProps> = ({ 
  onComplete, 
  initialIdea = '',
  initialRoles 
}) => {
  const [idea] = useState(initialIdea); // 保持idea不变，但不提供编辑界面
  
  const [role1, setRole1] = useState<AIRole>(initialRoles?.role1 || {
    name: '',
    personality: ''
  });

  const [role2, setRole2] = useState<AIRole>(initialRoles?.role2 || {
    name: '',
    personality: ''
  });

  const isRole1Complete = role1.name && role1.personality;
  const isRole2Complete = role2.name && role2.personality;
  const areRolesComplete = isRole1Complete && isRole2Complete;
  const isAllComplete = idea.trim().length > 0 && areRolesComplete;

  const updateRole1 = (field: keyof AIRole, value: string) => {
    setRole1(prev => ({ ...prev, [field]: value }));
  };

  const updateRole2 = (field: keyof AIRole, value: string) => {
    setRole2(prev => ({ ...prev, [field]: value }));
  };

  const presetRoles = [
    {
      name: "理性分析师",
      personality: "严谨理性，逻辑性强，支持技术进步，认为AI可以与人类协作，善用数据和逻辑论证"
    },
    {
      name: "人文主义者", 
      personality: "感性温和，重视人文价值和情感体验，担心AI对人类独特性的冲击，善用情感和价值观论证"
    }
  ];



  const handleComplete = () => {
    if (isAllComplete) {
      onComplete(idea.trim(), role1, role2);
    }
  };

  return (
    <Card className="w-full h-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          第一幕：AI辩手角色设定
        </CardTitle>
        
        <div className="flex items-center gap-4 mt-4">
          <div className={`flex items-center gap-2 ${areRolesComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
            {areRolesComplete ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2" />}
            <span className="text-sm">设定两个AI辩手角色</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {idea && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-medium">辩论话题:</span> {idea}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                请为这个话题设定两个具有不同观点的AI辩手角色
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-500" />
                  <h3 className="font-medium">AI辩手 1</h3>
                  {isRole1Complete && <Badge variant="secondary" className="text-green-600">已完成</Badge>}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">辩手名字</label>
                    <Input
                      placeholder="为AI辩手起个名字"
                      value={role1.name}
                      onChange={(e) => updateRole1('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">性格观点</label>
                    <Textarea
                      placeholder="描述这个AI辩手的性格特点、观点立场和辩论风格..."
                      value={role1.personality}
                      onChange={(e) => updateRole1('personality', e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRole1(presetRoles[0])}
                  className="w-full"
                >
                  使用预设: {presetRoles[0].name}
                </Button>
              </div>

              {/* Role 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <h3 className="font-medium">AI辩手 2</h3>
                  {isRole2Complete && <Badge variant="secondary" className="text-purple-600">已完成</Badge>}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">辩手名字</label>
                    <Input
                      placeholder="为AI辩手起个名字"
                      value={role2.name}
                      onChange={(e) => updateRole2('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">性格观点</label>
                    <Textarea
                      placeholder="描述这个AI辩手的性格特点、观点立场和辩论风格..."
                      value={role2.personality}
                      onChange={(e) => updateRole2('personality', e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRole2(presetRoles[1])}
                  className="w-full"
                >
                  使用预设: {presetRoles[1].name}
                </Button>
            </div>
          </div>

          {areRolesComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-sm text-green-700 mb-2">
                <span className="font-medium">角色设定完成！</span>
              </p>
              <p className="text-xs text-green-600">
                {role1.name} 将与 {role2.name} 围绕{`“${idea}”`}进行辩论
              </p>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleComplete}
              disabled={!isAllComplete}
              className="w-full"
            >
              完成设定，开始辩论
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
