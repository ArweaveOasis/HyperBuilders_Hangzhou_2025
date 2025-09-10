"use client";

import React, { useState } from 'react';
import { InfiniteCanvas, CanvasNode } from '@/components/InfiniteCanvas';
import { EnhancedInfiniteCanvas } from '@/components/EnhancedInfiniteCanvas';
import { LandingPage } from '@/components/LandingPage';
import { IdeaInput } from '@/components/IdeaInput';
import { AIRoleCustomizer } from '@/components/AIRoleCustomizer';
import { DebateSection } from '@/components/DebateSection';
import { ReflectionSection } from '@/components/ReflectionSection';
import { DirectionSelector } from '@/components/DirectionSelector';

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

interface NodeData {
  idea?: string;
  roles?: { role1: AIRole; role2: AIRole };
  debateMessages?: DebateMessage[];
  reflection?: string;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'canvas'>('landing');
  const [initialIdea, setInitialIdea] = useState<string>('');
  const [showDirectionSelector, setShowDirectionSelector] = useState(false);
  const [pendingDebateData, setPendingDebateData] = useState<{
    messages: DebateMessage[];
    sourceNodeId: string;
  } | null>(null);

  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: 'start',
      x: 0,
      y: 0,
      type: 'idea',
      content: {}
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>('start');
  const [nodeData, setNodeData] = useState<Record<string, NodeData>>({
    start: {}
  });
  const [useEnhancedCanvas, setUseEnhancedCanvas] = useState(true);
  const [mapTiles, setMapTiles] = useState<any[]>([]);

  const addNode = (x: number, y: number, type: CanvasNode['type']) => {
    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      x,
      y,
      type,
      content: {},
      connected: selectedNode ? [selectedNode] : []
    };

    setNodes(prev => {
      // 添加连接到被选中的节点
      if (selectedNode) {
        return prev.map(node =>
          node.id === selectedNode
            ? { ...node, connected: [...(node.connected || []), newNode.id] }
            : node
        ).concat(newNode);
      }
      return [...prev, newNode];
    });

    setNodeData(prev => ({
      ...prev,
      [newNode.id]: {}
    }));

    setSelectedNode(newNode.id);
  };

  const updateNodeData = (nodeId: string, data: Partial<NodeData>) => {
    setNodeData(prev => ({
      ...prev,
      [nodeId]: { ...prev[nodeId], ...data }
    }));
  };

  const handleIdeaSubmit = (nodeId: string, idea: string) => {
    updateNodeData(nodeId, { idea });
  };

  const handleRolesComplete = (nodeId: string, role1: AIRole, role2: AIRole) => {
    updateNodeData(nodeId, { roles: { role1, role2 } });
  };

  const handleDebateComplete = (nodeId: string, messages: DebateMessage[]) => {
    updateNodeData(nodeId, { debateMessages: messages });
  };

  const handleReflectionSave = (nodeId: string, reflection: string) => {
    updateNodeData(nodeId, { reflection });
  };

  const handleNodeComplete = (nodeId: string) => {
    // 节点完成时的处理逻辑
    console.log(`Node ${nodeId} completed`);
  };

  const handleDataSync = (data: { nodes: CanvasNode[]; mapTiles: any[] }) => {
    // 处理AO同步的数据
    setNodes(data.nodes);
    setMapTiles(data.mapTiles);
  };

  const handleLandingIdeaSubmit = (idea: string) => {
    setInitialIdea(idea);
    // 更新起始节点的数据
    updateNodeData('start', { idea });
    // 切换到画布视图
    setCurrentView('canvas');
  };

  const handleSetupComplete = (idea: string, role1: AIRole, role2: AIRole) => {
    setInitialIdea(idea);
    // 更新起始节点为完整的设定数据
    updateNodeData('start', {
      idea,
      roles: { role1, role2 }
    });
    // 将起始节点类型设为辩论节点
    setNodes(prev => prev.map(node =>
      node.id === 'start' ? { ...node, type: 'debate' } : node
    ));
    // 切换到画布视图
    setCurrentView('canvas');
  };

  const handleOpenMap = () => {
    setCurrentView('canvas');
  };

  const handleDebateToCanvas = (nodeId: string, messages: DebateMessage[]) => {
    // 存储辩论数据到当前节点
    updateNodeData(nodeId, { debateMessages: messages });

    // 设置待处理的辩论数据和显示方向选择器
    setPendingDebateData({ messages, sourceNodeId: nodeId });
    setShowDirectionSelector(true);

    // 切换到画布视图
    setCurrentView('canvas');
  };

  const handleDirectionSelect = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!pendingDebateData) return;

    const sourceNode = nodes.find(n => n.id === pendingDebateData.sourceNodeId);
    if (!sourceNode) return;

    // 根据方向计算新节点位置
    const directionOffsets = {
      up: { x: 0, y: -400 },
      down: { x: 0, y: 400 },
      left: { x: -600, y: 0 },
      right: { x: 600, y: 0 }
    };

    const offset = directionOffsets[direction];
    const newX = sourceNode.x + offset.x;
    const newY = sourceNode.y + offset.y;

    // 创建反思节点
    const newNode: CanvasNode = {
      id: `reflection-${Date.now()}`,
      x: newX,
      y: newY,
      type: 'reflection',
      content: {},
      connected: [pendingDebateData.sourceNodeId]
    };

    // 添加节点并建立连接
    setNodes(prev => {
      return prev.map(node =>
        node.id === pendingDebateData.sourceNodeId
          ? { ...node, connected: [...(node.connected || []), newNode.id] }
          : node
      ).concat(newNode);
    });

    // 获取源节点的数据，用于反思节点
    const sourceNodeData = nodeData[pendingDebateData.sourceNodeId];

    // 初始化新节点数据，包含辩论消息和相关信息
    setNodeData(prev => ({
      ...prev,
      [newNode.id]: {
        debateMessages: pendingDebateData.messages,
        roles: sourceNodeData?.roles,
        idea: sourceNodeData?.idea ||
          // 尝试从连接的节点获取idea
          sourceNode.connected?.map(id => nodeData[id]).find(d => d?.idea)?.idea ||
          "未指定话题"
      }
    }));

    // 选中新节点
    setSelectedNode(newNode.id);

    // 清理待处理数据
    setPendingDebateData(null);
  };

  const renderNodeContent = (node: CanvasNode) => {
    const data = nodeData[node.id] || {};

    switch (node.type) {
      case 'idea':
        return (
          <IdeaInput
            onIdeaSubmit={(idea) => handleIdeaSubmit(node.id, idea)}
            initialIdea={data.idea || (node.id === 'start' ? initialIdea : '')}
          />
        );

      case 'ai-setup':
        return (
          <AIRoleCustomizer
            onRolesComplete={(role1, role2) => handleRolesComplete(node.id, role1, role2)}
            initialRoles={data.roles}
          />
        );

      case 'debate':
        if (!data.roles) {
          return (
            <div className="p-4 text-center text-muted-foreground">
              Please complete AI role setup first
            </div>
          );
        }

        // 尝试从连接的节点获取idea
        const connectedNodes = node.connected?.map(id => ({ id, data: nodeData[id] })) || [];
        const ideaNode = connectedNodes.find(n => n.data.idea);
        const topic = ideaNode?.data.idea || data.idea || "No topic specified";

        return (
          <DebateSection
            role1={data.roles.role1}
            role2={data.roles.role2}
            topic={topic}
            onDebateComplete={(messages) => handleDebateComplete(node.id, messages)}
            onSummaryToCanvas={(messages) => handleDebateToCanvas(node.id, messages)}
          />
        );

      case 'reflection':
        const debateData = data.debateMessages || [];
        const rolesData = data.roles;

        // 从连接的节点获取辩论数据
        const connectedDebateNode = node.connected?.map(id => nodeData[id]).find(d => d.debateMessages);
        const connectedRolesNode = node.connected?.map(id => nodeData[id]).find(d => d.roles);
        const connectedIdeaNode = node.connected?.map(id => nodeData[id]).find(d => d.idea);

        const messages = debateData.length > 0 ? debateData : (connectedDebateNode?.debateMessages || []);
        const roles = rolesData || connectedRolesNode?.roles;
        const reflectionTopic = data.idea || connectedIdeaNode?.idea || "No topic specified";

        if (!messages.length || !roles) {
          return (
            <div className="p-4 text-center text-muted-foreground">
              Please complete the debate section first
            </div>
          );
        }

        return (
          <ReflectionSection
            debateMessages={messages}
            topic={reflectionTopic}
            role1Name={roles.role1.name}
            role2Name={roles.role2.name}
            onReflectionSave={(reflection) => handleReflectionSave(node.id, reflection)}
            initialReflection={data.reflection}
          />
        );

      default:
        return (
          <div className="p-4">
            <h3>Select Node Type</h3>
            <div className="space-y-2 mt-3">
              <button
                onClick={() => {
                  setNodes(prev => prev.map(n =>
                    n.id === node.id ? { ...n, type: 'idea' } : n
                  ));
                }}
                className="block w-full p-2 text-left border rounded hover:bg-gray-50"
              >
                💡 Idea Input
              </button>
              <button
                onClick={() => {
                  setNodes(prev => prev.map(n =>
                    n.id === node.id ? { ...n, type: 'ai-setup' } : n
                  ));
                }}
                className="block w-full p-2 text-left border rounded hover:bg-gray-50"
              >
                🤖 AI Role Setup
              </button>
              <button
                onClick={() => {
                  setNodes(prev => prev.map(n =>
                    n.id === node.id ? { ...n, type: 'debate' } : n
                  ));
                }}
                className="block w-full p-2 text-left border rounded hover:bg-gray-50"
              >
                💬 Debate Section
              </button>
              <button
                onClick={() => {
                  setNodes(prev => prev.map(n =>
                    n.id === node.id ? { ...n, type: 'reflection' } : n
                  ));
                }}
                className="block w-full p-2 text-left border rounded hover:bg-gray-50"
              >
                📝 Reflection Record
              </button>
            </div>
          </div>
        );
    }
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onIdeaSubmit={handleLandingIdeaSubmit}
        onSetupComplete={handleSetupComplete}
        onOpenMap={handleOpenMap}
      />
    );
  }

  return (
    <div className="size-full relative">
      {/* Back to landing button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setCurrentView('landing')}
          className="px-4 py-2 bg-white/90 hover:bg-white border border-gray-200 rounded-lg shadow-md flex items-center gap-2 text-sm backdrop-blur-sm transition-all hover:shadow-lg"
        >
          ← Back to Home
        </button>
      </div>

      {/* Canvas mode toggle */}
      <div className="absolute top-4 left-32 z-10">
        <button
          onClick={() => setUseEnhancedCanvas(!useEnhancedCanvas)}
          className={`px-4 py-2 border rounded-lg shadow-md flex items-center gap-2 text-sm backdrop-blur-sm transition-all hover:shadow-lg ${
            useEnhancedCanvas 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white/90 hover:bg-white border-gray-200'
          }`}
        >
          {useEnhancedCanvas ? '🎮 Enhanced Canvas' : '📝 Basic Canvas'}
        </button>
      </div>

      {useEnhancedCanvas ? (
        <EnhancedInfiniteCanvas
          nodes={nodes}
          onAddNode={addNode}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          onNodeComplete={handleNodeComplete}
          onDataSync={handleDataSync}
        >
          {selectedNode && (
            <>
              {renderNodeContent(nodes.find(n => n.id === selectedNode)!)}
            </>
          )}
        </EnhancedInfiniteCanvas>
      ) : (
        <InfiniteCanvas
          nodes={nodes}
          onAddNode={addNode}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        >
          {selectedNode && (
            <>
              {renderNodeContent(nodes.find(n => n.id === selectedNode)!)}
            </>
          )}
        </InfiniteCanvas>
      )}

      {/* Direction Selector Dialog */}
      <DirectionSelector
        isOpen={showDirectionSelector}
        onClose={() => {
          setShowDirectionSelector(false);
          setPendingDebateData(null);
        }}
        onSelectDirection={handleDirectionSelect}
      />
    </div>
  );
}
