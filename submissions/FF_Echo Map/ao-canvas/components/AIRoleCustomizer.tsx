"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Bot } from 'lucide-react';

interface AIRole {
  name: string;
  personality: string;
}

interface AIRoleCustomizerProps {
  onRolesComplete: (role1: AIRole, role2: AIRole) => void;
  initialRoles?: { role1?: AIRole; role2?: AIRole };
}

export const AIRoleCustomizer: React.FC<AIRoleCustomizerProps> = ({ 
  onRolesComplete, 
  initialRoles 
}) => {
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
  const isComplete = isRole1Complete && isRole2Complete;

  const handleStartDebate = () => {
    if (isComplete) {
      onRolesComplete(role1, role2);
    }
  };

  const updateRole1 = (field: keyof AIRole, value: string) => {
    setRole1(prev => ({ ...prev, [field]: value }));
  };

  const updateRole2 = (field: keyof AIRole, value: string) => {
    setRole2(prev => ({ ...prev, [field]: value }));
  };

  const presetRoles = [
    {
      name: "Rational Analyst",
      personality: "Rigorous and rational, strong logical thinking, supports technological progress, believes AI can collaborate with humans, skilled in data and logical arguments"
    },
    {
      name: "Humanist", 
      personality: "Emotional and gentle, values humanistic values and emotional experiences, concerned about AI's impact on human uniqueness, skilled in emotional and value-based arguments"
    }
  ];

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          AI Role Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Role 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-green-500" />
              <h3 className="font-medium">AI Role 1</h3>
              {isRole1Complete && <Badge variant="secondary">Complete</Badge>}
            </div>
            
            <div>
              <label className="block text-sm mb-1">Debater Name</label>
              <Input
                placeholder="Give a name to the AI debater"
                value={role1.name}
                onChange={(e) => updateRole1('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Personality & Views</label>
              <Textarea
                placeholder="Describe this AI debater's personality traits, viewpoints, and debate style..."
                value={role1.personality}
                onChange={(e) => updateRole1('personality', e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setRole1(presetRoles[0])}
              className="w-full"
            >
              Use Preset: {presetRoles[0].name}
            </Button>
          </div>

          {/* Role 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-500" />
              <h3 className="font-medium">AI Role 2</h3>
              {isRole2Complete && <Badge variant="secondary">Complete</Badge>}
            </div>
            
            <div>
              <label className="block text-sm mb-1">Debater Name</label>
              <Input
                placeholder="Give a name to the AI debater"
                value={role2.name}
                onChange={(e) => updateRole2('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Personality & Views</label>
              <Textarea
                placeholder="Describe this AI debater's personality traits, viewpoints, and debate style..."
                value={role2.personality}
                onChange={(e) => updateRole2('personality', e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setRole2(presetRoles[1])}
              className="w-full"
            >
              Use Preset: {presetRoles[1].name}
            </Button>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleStartDebate}
            disabled={!isComplete}
            className="w-full"
          >
            Start Debate
          </Button>
        </motion.div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <p className="text-sm text-green-700">
              Role setup complete! {role1.name} will debate with {role2.name}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
