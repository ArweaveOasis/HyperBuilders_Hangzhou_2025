# AO Memory - 去中心化AI记忆代理

## 简介
基于AO网络的智能记忆代理，结合向量数据库和AI大模型，为用户提供具有长期记忆能力的对话体验。通过Weaviate向量搜索实现智能记忆检索，支持记忆导出到Arweave永久存储，打造真正属于用户的AI记忆资产。

## AO 进程信息
- Process ID: `pqv5D0p8bmWfTG6oLRDzLlFl63QR29UOB8YOWFP5rIw` 
- Process Name: `AOMemory Agent`
- Network: `主网`
- Memory Agent ID: `需要部署` (用于记忆管理)
- Marketplace ID: `需要部署` (用于记忆交易)

## 快速开始

### 1. 环境准备
```bash
# 克隆项目
git clone <repo-url>
cd ao-memory

# 启动向量数据库
docker-compose up -d

# 前端环境
npm install
```

### 2. 配置环境变量
```bash
# 网关服务配置
cd gateway
# 创建 .env 文件并配置以下变量：
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini

# Ollama 配置 (用于本地嵌入)
OLLAMA_URL=http://localhost:11434

# Weaviate 向量数据库配置
WEAVIATE_URL=http://localhost:8080
WEAVIATE_API_KEY=

# AO 钱包配置 (JSON 格式的钱包私钥)
AO_WALLET_JSON={"private_key":"your_wallet_private_key_json"}

# AO 进程 ID 配置
MEMORY_PROCESS_ID=your_memory_process_id
MARKET_PROCESS_ID=your_market_process_id

# 服务器端口
PORT=8787

```

### 3. 启动服务
```bash
# 启动网关服务 (端口 8787)
cd gateway
npm run dev

# 启动前端 (端口 5173)
cd ..
npm run dev
```

### 4. 部署AO进程
```bash
# 安装 aos CLI
npm i -g https://preview_ao.arweave.net

# 部署Memory Agent
cd ao_process
aos memory_agent
.load memory_agent.lua

# 部署Marketplace 
aos marketplace  
.load marketplace.lua

# 更新配置文件中的进程ID
```

### 6. AO 交互
- 使用 aos CLI: `aos <process-id>`
- 或通过 Web UI 连接钱包后发送消息
- 查看记忆: 发送 `GetConversationHistory` 动作
- 清除记忆: 发送 `ClearConversationHistory` 动作

## 演示
- 在线: http://localhost:5173 (本地运行后访问)
- 视频: [演示视频链接] (≤3分钟，展示AI记忆对话功能)
- 测试账号: 连接Arweave钱包后可直接对话测试
- AO 进程查看: https://ao.link/#/entity/pqv5D0p8bmWfTG6oLRDzLlFl63QR29UOB8YOWFP5rIw

## 核心功能

### 🧠 智能记忆系统
- **向量检索**: 使用Weaviate + Ollama实现语义相似搜索
- **长期记忆**: 每用户最多存储1000条对话历史
- **上下文感知**: 基于历史对话提供个性化回复

### 🔗 AO网络集成  
- **去中心化存储**: 记忆数据存储在AO进程中
- **钱包身份**: 基于Arweave钱包地址的用户识别
- **智能合约**: Lua编写的AO进程处理记忆逻辑

### 💾 记忆导出交易
- **加密上传**: 本地AES-GCM加密后上传Arweave
- **市场机制**: 通过Marketplace进程管理记忆资产交易
- **永久存储**: 利用Arweave的永久存储特性

## 技术架构

### Frontend
- React 18 + TypeScript + Vite
- Ant Design UI组件
- arweave-wallet-kit钱包连接
- @permaweb/aoconnect AO网络通信

### Gateway API
- Node.js + Express + TypeScript
- Weaviate向量数据库集成
- Apus 对话模型
- Ollama本地嵌入模型 (nomic-embed-text)

### AO Processes
- **ao_agent.lua**: 主要AI推理和记忆管理
- **memory_agent.lua**: 专门的记忆存储和检索
- **marketplace.lua**: 记忆资产交易市场

### Infrastructure  
- Docker Compose (Weaviate + Ollama)
- Arweave网络永久存储
- HyperBEAM/LegacyNet网络支持

## 已知限制
- 需要本地运行Ollama和Weaviate服务
- OpenAI API调用需要付费Key
- 记忆导出功能需要配置Marketplace进程
- 当前仅支持文本记忆，未来将支持多模态

## 联系方式
- GitHub: @hi-Ernest
- Wallet Address: `kdC3NSGpwA9EFHRJo50gLpbIaie5hGyGeCg3CVtm1O8`
