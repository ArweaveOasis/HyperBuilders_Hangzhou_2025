"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Lightbulb, Map, ArrowRight, Brain, Users } from 'lucide-react';
import { IdeaAndRoleSetup } from './IdeaAndRoleSetup';

interface AIRole {
  name: string;
  personality: string;
}

interface LandingPageProps {
  onIdeaSubmit: (idea: string) => void;
  onSetupComplete: (idea: string, role1: AIRole, role2: AIRole) => void;
  onOpenMap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onIdeaSubmit, onSetupComplete, onOpenMap }) => {
  const [idea, setIdea] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  const handleSubmit = () => {
    if (idea.trim()) {
      setShowSetup(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && idea.trim()) {
      handleSubmit();
    }
  };

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          <div className="mb-4 text-center">
            <Button
              onClick={() => setShowSetup(false)}
              variant="outline"
              className="bg-white/80 hover:bg-white"
            >
              ← Back
            </Button>
          </div>
          <IdeaAndRoleSetup
            initialIdea={idea}
            onComplete={onSetupComplete}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            What are you thinking about today?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Share your thoughts and let AI characters help you with deep thinking, recording your thought journey on an infinite canvas
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Your Thoughts
                  </label>
                  <Textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="For example: Will AI replace human creativity? Or any other topic you want to think deeply about..."
                    className="min-h-[120px] resize-none bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Press Ctrl + Enter to submit quickly
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={!idea.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
                    >
                      Setup AI Roles & Start Debate
                      <Users className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onOpenMap}
                      variant="outline"
                      className="w-full sm:w-auto bg-white/50 border-gray-300 hover:bg-white/80"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Open Mind Map
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-sm text-muted-foreground">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span>Ideas + Roles</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span>AI Debate</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span>Deep Reflection</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};