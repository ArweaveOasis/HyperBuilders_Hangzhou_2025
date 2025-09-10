"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lightbulb } from 'lucide-react';

interface IdeaInputProps {
  onIdeaSubmit: (idea: string) => void;
  initialIdea?: string;
}

export const IdeaInput: React.FC<IdeaInputProps> = ({ onIdeaSubmit, initialIdea = '' }) => {
  const [idea, setIdea] = useState(initialIdea);

  const handleSubmit = () => {
    if (idea.trim()) {
      onIdeaSubmit(idea.trim());
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Idea Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2">Please enter the idea or topic you want to discuss:</label>
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="For example: Will AI replace human creativity?"
            className="min-h-[80px] resize-none"
          />
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!idea.trim()}
            className="w-full"
          >
            Confirm Idea
          </Button>
        </motion.div>

        {idea.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-sm text-blue-700">
              Your idea: <span className="font-medium">{idea}</span>
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};