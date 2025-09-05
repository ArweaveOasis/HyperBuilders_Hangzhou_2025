# Workshop 1: AO Fundamentals

Status: In Progress
Date: August 29, 2025
Tags: Content
Tasks: Workshop 1 Content Preparation (https://www.notion.so/Workshop-1-Content-Preparation-25dc18e690da8020bb0ae08d275e6ba9?pvs=21)

<aside>
💡

Introduction to AO
• Why: The need for persistent, distributed computing
• What: AO as a decentralized computer network
• How: Basic architecture and concepts
• Demo: Show Windows Task Manager analogy - "AO processes are like OS processes"

</aside>

## 为什么需要 AO：持久化分布式计算的需求

大家想一想，当你停止付费给云服务商时，你的 Node.js 服务器会发生什么？当你的笔记本电脑关机时，你的 Python 脚本会怎样？它们都停止运行了

当前的痛点：
•  服务器依赖："每个应用都需要一台 24/7 运行的服务器"
•  单点故障："如果 AWS 宕机，半个互联网都会瘫痪"
•  数据孤岛："你的微信数据无法和抖音数据对话"
•  协调困难："让不同的服务协同工作非常复杂"

想象一下，如果你的程序可以永远运行，不依赖任何单一服务器？如果程序之间可以像发邮件一样简单地通信？这就是 AO 要实现的。

生活化类比：
"打个比方：现在运行程序就像开一家商店 - 你需要付租金、交电费、还要有人24小时值守。而在 AO 上，更像是立一块路牌 - 一旦立起来，它就一直在那里，任何人都能看到。"

## 什么是 AO：去中心化计算机网络

简单定义：
"AO 是一个全球化的计算机网络，你的程序在这个网络上运行，就像应用在操作系统上运行一样。"

核心特性：

1. 永久运行："程序一旦部署，就会永远运行下去"
2. 消息驱动："程序之间通过发送消息来交互"
3. 并行计算："成千上万的程序可以同时运行"
4. 状态持久："数据永远不会丢失"

与传统方式对比：

```bash
传统方式                    AO 方式
---------                  ---------
需要服务器     →            无需服务器
中心化控制     →            去中心化
API 调用      →            消息传递
数据库存储     →            进程状态
手动扩展       →            自动并行
```

## 关键概念 - 进程（Process）：

**`"在 AO 中，每个应用都是一个'进程'。就像你电脑上运行的程序一样，但这些进程永远不会停止。"`**

## 如何工作：基础架构和概念

三个核心组件：

1. 进程（Processes）
• "你的应用逻辑"
• "可以接收和发送消息"
• "维护自己的状态"
2. 消息（Messages）
• "进程之间的通信方式"
• "包含动作（Action）和数据（Data）"
• "异步处理"
3. 计算单元（Compute Units）
• "执行进程代码的地方"
• "分布在全球"
• "自动负载均衡"

消息流程图解：

```bash
用户/应用 → 发送消息 → 目标进程 → 处理消息 → 返回结果
         ↓                    ↓
      [签名验证]           [状态更新]
```

编程模型：
"就像写事件驱动的程序：收到消息 → 处理逻辑 → 更新状态 → 发送回复"

## 演示：任务管理器类比

实际演示：

1. 打开 Windows 任务管理器
• "看这里，每个应用都是一个进程"
• "它们都有 PID（进程ID）"
• "它们可以相互通信"
2. 类比说明

```bash
    Windows 进程              AO 进程
   ------------            ----------
   Process.exe      →      进程 ID (43个字符)
   占用内存           →      进程状态
   CPU 使用率        →      计算消耗
   进程间通信         →      消息传递
```

1. 关键区别
• "Windows 进程：关机就没了"
• "AO 进程：永远运行"
• "Windows 进程：本地运行"
• "AO 进程：全球网络运行"

现场演示 aos：

```bash
# 启动 aos
$ aos myprocess

# 展示进程信息
aos> ao.id
"Kw5XtPcGqEaDRaVMhR3KpLqXRpCQPbPJhVvU9QPXcD8"

# 就像查看进程 PID
aos> Name
"myprocess"
```

总结过渡：
"现在大家理解了 AO 是什么 - 一个让程序永远运行的全球计算机。接下来，让我们动手写一些代码，真正体验一下！"

---

<aside>
💡

Core Concepts (30 min)
•  Message passing fundamentals
•  Process concept and lifecycle

•  Variables and state management
•  Handlers for processing messages

</aside>

## 核心概念（30分钟）

### 消息传递基础

什么是消息传递？

"在 AO 中，进程之间不能直接调用对方的函数，而是通过发送消息来通信。就像发邮件一样！"

消息的组成部分：

```bash
-- 一个消息包含以下要素
{
  From = "发送者进程ID",
  Target = "目标进程ID", 
  Action = "Transfer",         -- 动作标签
  Quantity = "100",           -- 数据
  Tags = {                    -- 其他标签
    { name = "Token", value = "USDC" }
  },
  Data = "额外的数据内容"      -- 可选的数据体
}
```

发送消息的方式:

```bash
-- 方式1：使用 Send 函数（aos 环境）
Send({
  Target = "另一个进程ID",
  Action = "Greet",
  Data = "Hello, AO!"
})

-- 方式2：使用 ao.send（更底层）
ao.send({
  Target = ProcessId,
  Action = "UpdateBalance",
  Quantity = "500"
})
```

消息的异步性：

```bash
-- 发送消息是异步的
Send({ Target = "...", Action = "Ask" })
-- 这里不会立即得到回复
-- 回复会作为新消息到达你的 Inbox
```

实际演示：

```bash
-- 在 aos 中演示
aos> Send({ Target = ao.id, Action = "Echo", Data = "Hello" })
aos> Inbox[#Inbox]  -- 查看收到的回复
```

### 进程概念与生命周期（8分钟）

进程是什么？

"进程就是一个独立运行的程序实例，有自己的内存、状态和消息队列。"

进程的创建：

```bash
-- 在 aos 中创建进程
aos> .load process.lua  -- 加载进程代码

-- 或者生成新进程
NewProcess = Spawn("模块ID", {
  Data = "初始化数据"
})
```

进程的核心属性:

```bash
-- 每个进程都有这些属性
aos> ao.id      -- 进程的唯一标识符
"xKw5XtPc...QPXcD8"

aos> Owner      -- 进程的所有者
"_r9LpP4F...Q24tTsGo"  

aos> Name       -- 进程名称
"MyTodoProcess"
```

进程的生命周期：

```bash
创建 → 初始化 → 运行 → (永久存在)
 ↓       ↓        ↓
spawn   load    处理消息
       handlers
```

进程间的关系:

```bash
-- 父子进程示例
ParentProcess = ao.id
ChildProcess = Spawn(ModuleId, {
  Parent = ParentProcess
})

-- 进程可以创建其他进程
-- 形成进程树结构
```

状态的作用域：

```bash
-- 全局变量 - 进程级别
Balance = 1000

-- 局部变量 - 仅在函数内
function addTodo(task)
  local timestamp = os.time()  -- 局部变量
  table.insert(Todos, {
    task = task,
    time = timestamp
  })
end
```

状态管理模式：

```bash
-- 1. 初始化模式
State = State or {
  users = {},
  config = { 
    maxUsers = 100,
    isActive = true 
  }
}

-- 2. 更新模式
function updateUser(userId, data)
  State.users[userId] = State.users[userId] or {}
  for k, v in pairs(data) do
    State.users[userId][k] = v
  end
end
```

状态查看和调试：

```bash
-- 查看当前状态
aos> Todos
{
  { task = "学习 AO", completed = false },
  { task = "构建应用", completed = false }
}

-- 使用 Dump 函数美化输出
aos> Dump(State)
```

### Handlers 消息处理器

什么是 Handler？

"Handler 是处理特定消息的函数，就像事件监听器。"

Handler 的三要素：

```bash
Handlers.add(
  "handler-name",              -- 1. 名称
  function(msg)                -- 2. 匹配函数
    return msg.Action == "Add"
  end,
  function(msg)                -- 3. 处理函数
    -- 处理逻辑
    print("处理 Add 动作")
  end
)
```

使用工具函数简化：

```bash
-- 使用内置的匹配函数
Handlers.add(
  "transfer",
  Handlers.utils.hasMatchingTag("Action", "Transfer"),
  function(msg)
    local recipient = msg.Recipient
    local amount = tonumber(msg.Quantity)
    
    -- 更新余额
    Balances[msg.From] = Balances[msg.From] - amount
    Balances[recipient] = (Balances[recipient] or 0) + amount
    
    -- 回复确认
    msg.reply({
      Action = "Transfer-Notice",
      Data = "Transfer completed"
    })
  end
)
```

Handler 执行顺序：

```bash
-- Handler 按添加顺序执行
-- 第一个匹配的 handler 处理消息

-- 1. 日志 handler（总是匹配）
Handlers.add("logger",
  function(msg) return true end,
  function(msg) 
    print("收到消息: " .. msg.Action)
  end
)

-- 2. 特定动作 handler
Handlers.add("specific",
  Handlers.utils.hasMatchingTag("Action", "Specific"),
  function(msg)
    -- 只处理特定动作
  end
)
```

完整示例 - Todo Handler：

```bash
-- 添加 Todo 项
Handlers.add(
  "add-todo",
  Handlers.utils.hasMatchingTag("Action", "AddTodo"),
  function(msg)
    -- 验证输入
    if not msg.Task or msg.Task == "" then
      msg.reply({ Error = "Task cannot be empty" })
      return
    end
    
    -- 添加到列表
    local todo = {
      id = #Todos + 1,
      task = msg.Task,
      completed = false,
      creator = msg.From,
      timestamp = msg.Timestamp
    }
    table.insert(Todos, todo)
    
    -- 回复成功
    msg.reply({
      Action = "Todo-Added",
      TodoId = todo.id,
      Data = json.encode(todo)
    })
  end
)
```

实战练习（剩余时间）

练习1：创建简单的计数器

```bash
-- 让参与者实现
Count = Count or 0

Handlers.add(
  "increment",
  Handlers.utils.hasMatchingTag("Action", "Inc"),
  function(msg)
    Count = Count + 1
    msg.reply({ Count = tostring(Count) })
  end
)
```

练习2：消息转发器

```bash
-- 实现一个简单的消息路由
Handlers.add(
  "forward",
  Handlers.utils.hasMatchingTag("Action", "Forward"),
  function(msg)
    if msg.ForwardTo then
      Send({
        Target = msg.ForwardTo,
        Action = "Forwarded",
        Data = msg.Data,
        OriginalSender = msg.From
      })
    end
  end
)
```

---

<aside>
💡

Hands-on: aos CLI (30 min)
•  Installing and launching aos
•  Creating variables
•  Writing basic handlers
•  Sending and receiving messages

</aside>

## 实践：aos CLI 操作（30分钟）

1. 安装和启动 aos（5分钟）

安装 aos：

```bash
# 确保已安装 Node.js 18+
node --version

# 安装 aos
npm i -g https://get_ao.g8way.io

# 验证安装
aos --version
```

启动 aos：

```bash
# 方式1：创建新进程
aos

# 方式2：指定进程名称
aos myprocess

# 方式3：连接到现有进程
aos processId
```

首次启动界面：

```bash
          _____                   _______                   _____          
         /\    \                 /::\    \                 /\    \         
        /::\    \               /::::\    \               /::\    \        
       /::::\    \             /::::::\    \             /::::\    \       
      /::::::\    \           /::::::::\    \           /::::::\    \      
     /:::/\:::\    \         /:::/~~\:::\    \         /:::/\:::\    \     
    /:::/__\:::\    \       /:::/    \:::\    \       /:::/__\:::\    \    
   /::::\   \:::\    \     /:::/    / \:::\    \      \:::\   \:::\    \   
  /::::::\   \:::\    \   /:::/____/   \:::\____\   ___\:::\   \:::\    \  
 /:::/\:::\   \:::\    \ |:::|    |     |:::|    | /\   \:::\   \:::\    \ 
/:::/  \:::\   \:::\____\|:::|____|     |:::|    |/::\   \:::\   \:::\____\
\::/    \:::\  /:::/    / \:::\    \   /:::/    / \:::\   \:::\   \::/    /
 \/____/ \:::\/:::/    /   \:::\    \ /:::/    /   \:::\   \:::\   \/____/ 
          \::::::/    /     \:::\    /:::/    /     \:::\   \:::\    \     
           \::::/    /       \:::\__/:::/    /       \:::\   \:::\____\    
           /:::/    /         \::::::::/    /         \:::\  /:::/    /    
          /:::/    /           \::::::/    /           \:::\/:::/    /     
         /:::/    /             \::::/    /             \::::::/    /      
        /:::/    /               \::/____/               \::::/    /       
        \::/    /                 ~~                      \::/    /        
         \/____/                                           \/____/    
                                                                           
Welcome to AOS: Your operating system for AO, the decentralized open access supercomputer.
Type ".load-blueprint chat" to join the community chat and ask questions!

AOS Client Version: 2.0.8. 2025
Type "Ctrl-C" twice to exit

Your AOS process:  a4gf6YPF6Kv6anAnVHs37tBosqlIIWZcCPgv3FPjcR8

gerry_2@aos-2.0.4[Inbox:1]>
```

基本命令介绍：

```bash
-- 查看帮助
aos> .help

-- 查看进程信息
aos> ao.id
"xKw5XtPcGqE...QPXcD8"

-- 退出 aos
aos> .exit
```

### 创建变量（7分钟）

基础变量创建：

```bash
-- 字符串变量
aos> Name = "My First Process"
"My First Process"

-- 数字变量
aos> Counter = 0
0

-- 查看变量
aos> Name
"My First Process"

-- 布尔值
aos> IsActive = true
true
```

表（Table）和数组：

```bash
-- 创建数组
aos> Todos = {}
{}

-- 添加元素
aos> table.insert(Todos, "Learn AO")
aos> table.insert(Todos, "Build App")

-- 查看数组
aos> Todos
{ "Learn AO", "Build App" }

-- 创建对象/字典
aos> User = { name = "Alice", balance = 100 }
{ name = "Alice", balance = 100 }

-- 访问属性
aos> User.name
"Alice"
```

永久化模式：

```bash
-- 使用 or 模式确保变量初始化
aos> Balance = Balance or 1000
1000

-- 复杂数据结构
aos> State = State or {
>>   users = {},
>>   config = {
>>     maxUsers = 100,
>>     fee = 10
>>   }
>> }

-- 查看结构化数据
aos> Dump(State)
```

实时练习：

```bash
-- 让参与者创建自己的变量
aos> MyName = "参与者姓名"
aos> MyTodos = { "任务1", "任务2" }
aos> MyConfig = { language = "中文", level = "beginner" }
```

### 编写基础 Handlers（10分钟）

第一个 Handler：

```bash
-- 简单的问候 handler
aos> Handlers.add(
>>   "greet",
>>   Handlers.utils.hasMatchingTag("Action", "Greet"),
>>   function(msg)
>>     local name = msg.Name or "朋友"
>>     msg.reply({ 
>>       Data = "你好, " .. name .. "!" 
>>     })
>>   end
>> )
```

带状态的 Handler：

```bash
-- 初始化计数器
aos> Count = Count or 0

-- 计数器 handler
aos> Handlers.add(
>>   "increment",
>>   Handlers.utils.hasMatchingTag("Action", "Inc"),
>>   function(msg)
>>     Count = Count + 1
>>     print("计数器增加到: " .. Count)
>>     msg.reply({
>>       Action = "Count-Updated",
>>       Count = tostring(Count)
>>     })
>>   end
>> )
```

Todo 列表 Handler：

```bash
-- 初始化 todo 列表
aos> Todos = Todos or {}

-- 添加 todo handler
aos> Handlers.add(
>>   "add-todo",
>>   Handlers.utils.hasMatchingTag("Action", "AddTodo"),
>>   function(msg)
>>     if not msg.Task then
>>       msg.reply({ Error = "请提供任务内容" })
>>       return
>>     end
>>     
>>     local todo = {
>>       id = #Todos + 1,
>>       task = msg.Task,
>>       completed = false
>>     }
>>     
>>     table.insert(Todos, todo)
>>     
>>     msg.reply({
>>       Action = "Todo-Added",
>>       TodoId = todo.id,
>>       TotalTodos = #Todos
>>     })
>>   end
>> )
```

查看已注册的 Handlers：

```bash
-- 列出所有 handlers
aos> Handlers.list
```

### 发送和接收消息（8分钟）

发送消息给自己：

```bash
-- 测试问候 handler
aos> Send({ Target = ao.id, Action = "Greet", Name = "AO学习者" })
消息已发送: -Df3...

-- 检查收件箱
aos> #Inbox
1

-- 查看最新消息
aos> Inbox[#Inbox]
{
  Data = "你好, AO学习者!",
  From = "xKw5XtPc...QPXcD8",
  ...
}
```

测试计数器：

```bash
-- 发送增加请求
aos> Send({ Target = ao.id, Action = "Inc" })
计数器增加到: 1

aos> Send({ Target = ao.id, Action = "Inc" })
计数器增加到: 2

-- 查看当前计数
aos> Count
2
```

Todo 操作演示：

```bash
-- 添加任务
aos> Send({ 
>>   Target = ao.id, 
>>   Action = "AddTodo", 
>>   Task = "完成 AO 工作坊" 
>> })

aos> Send({ 
>>   Target = ao.id, 
>>   Action = "AddTodo", 
>>   Task = "构建第一个 dApp" 
>> })

-- 查看所有任务
aos> Todos
{
  { id = 1, task = "完成 AO 工作坊", completed = false },
  { id = 2, task = "构建第一个 dApp", completed = false }
}
```

处理收到的回复：

```bash
-- 创建一个显示所有 todos 的 handler
aos> Handlers.add(
>>   "list-todos",
>>   Handlers.utils.hasMatchingTag("Action", "ListTodos"),
>>   function(msg)
>>     local todoList = "=== Todo 列表 ===\n"
>>     for i, todo in ipairs(Todos) do
>>       local status = todo.completed and "✓" or "○"
>>       todoList = todoList .. status .. " " .. todo.id .. ". " .. todo.task .. "\n"
>>     end
>>     msg.reply({ Data = todoList })
>>   end
>> )

-- 测试列表功能
aos> Send({ Target = ao.id, Action = "ListTodos" })
aos> Inbox[#Inbox].Data
=== Todo 列表 ===
○ 1. 完成 AO 工作坊
○ 2. 构建第一个 dApp
```

调试技巧：

```bash
-- 查看消息详情
aos> Dump(Inbox[#Inbox])

-- 清理收件箱（可选）
aos> Inbox = {}

-- 使用 print 调试
aos> Handlers.add(
>>   "debug",
>>   function(msg) return true end,  -- 匹配所有消息
>>   function(msg)
>>     print("收到消息 Action: " .. (msg.Action or "无"))
>>   end
>> )
```

### 实践总结和技巧（剩余时间）

快速参考卡：

```bash
-- 常用命令
ao.id          -- 查看进程 ID
#Inbox         -- 消息数量
Inbox[n]       -- 查看第 n 条消息
.help          -- 帮助
.exit          -- 退出

-- 发送消息模板
Send({ 
  Target = ao.id, 
  Action = "动作名",
  其他数据 = "值"
})

-- Handler 模板
Handlers.add("名称",
  Handlers.utils.hasMatchingTag("Action", "动作"),
  function(msg)
    -- 处理逻辑
    msg.reply({ Data = "回复" })
  end
)
```

---

<aside>
💡

Build: Todo List Application (40 min)
•  Implement data structure for todos
•  Create handlers for CRUD operations
•  Test with message sending
•  Live coding with participants following along

</aside>

## 构建：Todo 列表应用（40分钟）

### 实现 Todo 数据结构（8分钟）

设计数据结构：

```bash
-- 首先，让我们思考需要什么数据
-- Todo 项应该包含：ID、任务内容、完成状态、创建时间、创建者

aos> Todos = Todos or {}
aos> TodoCounter = TodoCounter or 0  -- 用于生成唯一 ID
```

定义 Todo 模板：

```bash
-- 创建一个帮助函数来生成 Todo 对象
aos> function createTodo(task, creator)
>>   TodoCounter = TodoCounter + 1
>>   return {
>>     id = TodoCounter,
>>     task = task,
>>     completed = false,
>>     creator = creator or "anonymous",
>>     createdAt = os.time(),
>>     completedAt = nil
>>   }
>> end
```

初始化示例数据（可选）：

```bash
-- 添加一些示例数据，帮助测试
aos> if #Todos == 0 then
>>   table.insert(Todos, createTodo("学习 AO 基础", ao.id))
>>   table.insert(Todos, createTodo("构建第一个应用", ao.id))
>>   print("已添加示例 Todo 项")
>> end
```

### 创建 CRUD 操作的 Handlers（20分钟）

C - Create（创建）Handler：

```bash
aos> Handlers.add(
>>   "create-todo",
>>   Handlers.utils.hasMatchingTag("Action", "CreateTodo"),
>>   function(msg)
>>     -- 验证输入
>>     if not msg.Task or msg.Task == "" then
>>       msg.reply({ 
>>         Action = "Create-Error",
>>         Error = "任务内容不能为空" 
>>       })
>>       return
>>     end
>>     
>>     -- 创建新 Todo
>>     local todo = createTodo(msg.Task, msg.From)
>>     table.insert(Todos, todo)
>>     
>>     -- 返回成功消息
>>     msg.reply({
>>       Action = "Todo-Created",
>>       Todo = json.encode(todo),
>>       Message = "Todo 创建成功！"
>>     })
>>     
>>     print("新增 Todo: " .. todo.task)
>>   end
>> )
```

R - Read（读取）Handlers：

```bash
-- 获取所有 Todos
aos> Handlers.add(
>>   "get-todos",
>>   Handlers.utils.hasMatchingTag("Action", "GetTodos"),
>>   function(msg)
>>     -- 可以添加过滤选项
>>     local filter = msg.Filter or "all"  -- all, active, completed
>>     local filtered = {}
>>     
>>     for _, todo in ipairs(Todos) do
>>       if filter == "all" or 
>>          (filter == "active" and not todo.completed) or
>>          (filter == "completed" and todo.completed) then
>>         table.insert(filtered, todo)
>>       end
>>     end
>>     
>>     msg.reply({
>>       Action = "Todos-List",
>>       Todos = json.encode(filtered),
>>       Count = #filtered,
>>       TotalCount = #Todos
>>     })
>>   end
>> )

-- 获取单个 Todo
aos> Handlers.add(
>>   "get-todo",
>>   Handlers.utils.hasMatchingTag("Action", "GetTodo"),
>>   function(msg)
>>     local todoId = tonumber(msg.TodoId)
>>     
>>     if not todoId then
>>       msg.reply({ 
>>         Action = "Get-Error",
>>         Error = "请提供有效的 TodoId" 
>>       })
>>       return
>>     end
>>     
>>     -- 查找 Todo
>>     for _, todo in ipairs(Todos) do
>>       if todo.id == todoId then
>>         msg.reply({
>>           Action = "Todo-Found",
>>           Todo = json.encode(todo)
>>         })
>>         return
>>       end
>>     end
>>     
>>     msg.reply({
>>       Action = "Todo-NotFound",
>>       Error = "未找到 ID 为 " .. todoId .. " 的 Todo"
>>     })
>>   end
>> )
```

U - Update（更新）Handlers：

```bash
-- 更新 Todo 内容
aos> Handlers.add(
>>   "update-todo",
>>   Handlers.utils.hasMatchingTag("Action", "UpdateTodo"),
>>   function(msg)
>>     local todoId = tonumber(msg.TodoId)
>>     local newTask = msg.NewTask
>>     
>>     if not todoId or not newTask then
>>       msg.reply({ 
>>         Action = "Update-Error",
>>         Error = "请提供 TodoId 和 NewTask" 
>>       })
>>       return
>>     end
>>     
>>     -- 更新 Todo
>>     for i, todo in ipairs(Todos) do
>>       if todo.id == todoId then
>>         -- 检查权限（可选）
>>         if msg.From ~= todo.creator and msg.From ~= Owner then
>>           msg.reply({
>>             Action = "Update-Error",
>>             Error = "只有创建者可以更新此 Todo"
>>           })
>>           return
>>         end
>>         
>>         todo.task = newTask
>>         todo.updatedAt = os.time()
>>         
>>         msg.reply({
>>           Action = "Todo-Updated",
>>           Todo = json.encode(todo),
>>           Message = "Todo 更新成功！"
>>         })
>>         return
>>       end
>>     end
>>     
>>     msg.reply({
>>       Action = "Update-Error",
>>       Error = "未找到指定的 Todo"
>>     })
>>   end
>> )

-- 切换完成状态
aos> Handlers.add(
>>   "toggle-todo",
>>   Handlers.utils.hasMatchingTag("Action", "ToggleTodo"),
>>   function(msg)
>>     local todoId = tonumber(msg.TodoId)
>>     
>>     if not todoId then
>>       msg.reply({ 
>>         Action = "Toggle-Error",
>>         Error = "请提供有效的 TodoId" 
>>       })
>>       return
>>     end
>>     
>>     for i, todo in ipairs(Todos) do
>>       if todo.id == todoId then
>>         todo.completed = not todo.completed
>>         todo.completedAt = todo.completed and os.time() or nil
>>         
>>         msg.reply({
>>           Action = "Todo-Toggled",
>>           Todo = json.encode(todo),
>>           Message = todo.completed and "Todo 已完成！" or "Todo 标记为未完成"
>>         })
>>         
>>         print("Todo " .. todoId .. " 状态: " .. (todo.completed and "完成" or "未完成"))
>>         return
>>       end
>>     end
>>     
>>     msg.reply({
>>       Action = "Toggle-Error",
>>       Error = "未找到指定的 Todo"
>>     })
>>   end
>> )
```

D - Delete（删除）Handler：

```bash
aos> Handlers.add(
>>   "delete-todo",
>>   Handlers.utils.hasMatchingTag("Action", "DeleteTodo"),
>>   function(msg)
>>     local todoId = tonumber(msg.TodoId)
>>     
>>     if not todoId then
>>       msg.reply({ 
>>         Action = "Delete-Error",
>>         Error = "请提供有效的 TodoId" 
>>       })
>>       return
>>     end
>>     
>>     for i, todo in ipairs(Todos) do
>>       if todo.id == todoId then
>>         -- 检查权限
>>         if msg.From ~= todo.creator and msg.From ~= Owner then
>>           msg.reply({
>>             Action = "Delete-Error",
>>             Error = "只有创建者可以删除此 Todo"
>>           })
>>           return
>>         end
>>         
>>         table.remove(Todos, i)
>>         
>>         msg.reply({
>>           Action = "Todo-Deleted",
>>           TodoId = todoId,
>>           Message = "Todo 删除成功！"
>>         })
>>         
>>         print("删除 Todo: " .. todoId)
>>         return
>>       end
>>     end
>>     
>>     msg.reply({
>>       Action = "Delete-Error",
>>       Error = "未找到指定的 Todo"
>>     })
>>   end
>> )
```

### 测试消息发送（10分钟）

测试创建功能：

```bash
-- 创建新 Todo
aos> Send({ 
>>   Target = ao.id, 
>>   Action = "CreateTodo", 
>>   Task = "完成 AO 工作坊作业" 
>> })

-- 查看回复
aos> Inbox[#Inbox].Action
"Todo-Created"

-- 再创建几个
aos> Send({ Target = ao.id, Action = "CreateTodo", Task = "学习 Handler 编写" })
aos> Send({ Target = ao.id, Action = "CreateTodo", Task = "部署第一个进程" })
```

测试读取功能：

```bash
-- 获取所有 Todos
aos> Send({ Target = ao.id, Action = "GetTodos" })

-- 查看返回的数据
aos> local response = Inbox[#Inbox]
aos> print("共有 " .. response.Count .. " 个 Todo 项")

-- 获取特定 Todo
aos> Send({ Target = ao.id, Action = "GetTodo", TodoId = "1" })

-- 获取只看未完成的
aos> Send({ Target = ao.id, Action = "GetTodos", Filter = "active" })
```

测试更新功能：

```bash
-- 更新 Todo 内容
aos> Send({ 
>>   Target = ao.id, 
>>   Action = "UpdateTodo", 
>>   TodoId = "1",
>>   NewTask = "深入学习 AO 核心概念"
>> })

-- 切换完成状态
aos> Send({ Target = ao.id, Action = "ToggleTodo", TodoId = "1" })
aos> Send({ Target = ao.id, Action = "ToggleTodo", TodoId = "2" })

-- 查看完成的 Todos
aos> Send({ Target = ao.id, Action = "GetTodos", Filter = "completed" })
```

测试删除功能：

```bash
-- 删除一个 Todo
aos> Send({ Target = ao.id, Action = "DeleteTodo", TodoId = "3" })

-- 验证删除结果
aos> Send({ Target = ao.id, Action = "GetTodos" })
```

### 添加高级功能（剩余时间）

统计信息 Handler：

```bash
aos> Handlers.add(
>>   "todo-stats",
>>   Handlers.utils.hasMatchingTag("Action", "GetStats"),
>>   function(msg)
>>     local stats = {
>>       total = #Todos,
>>       completed = 0,
>>       active = 0,
>>       completionRate = 0
>>     }
>>     
>>     for _, todo in ipairs(Todos) do
>>       if todo.completed then
>>         stats.completed = stats.completed + 1
>>       else
>>         stats.active = stats.active + 1
>>       end
>>     end
>>     
>>     if stats.total > 0 then
>>       stats.completionRate = math.floor((stats.completed / stats.total) * 100)
>>     end
>>     
>>     msg.reply({
>>       Action = "Todo-Stats",
>>       Stats = json.encode(stats),
>>       Summary = string.format(
>>         "总计: %d | 完成: %d | 进行中: %d | 完成率: %d%%",
>>         stats.total, stats.completed, stats.active, stats.completionRate
>>       )
>>     })
>>   end
>> )
```

美化的列表显示：

```bash
aos> Handlers.add(
>>   "pretty-list",
>>   Handlers.utils.hasMatchingTag("Action", "PrettyList"),
>>   function(msg)
>>     local output = "\n📝 Todo 列表\n" .. string.rep("=", 40) .. "\n"
>>     
>>     if #Todos == 0 then
>>       output = output .. "暂无 Todo 项\n"
>>     else
>>       for i, todo in ipairs(Todos) do
>>         local status = todo.completed and "✅" or "⏰"
>>         local date = os.date("%Y-%m-%d %H:%M", todo.createdAt)
>>         output = output .. string.format(
>>           "%s [%d] %s\n   创建于: %s\n",
>>           status, todo.id, todo.task, date
>>         )
>>       end
>>     end
>>     
>>     output = output .. string.rep("=", 40)
>>     
>>     msg.reply({
>>       Action = "Pretty-List",
>>       Data = output
>>     })
>>   end
>> )

-- 测试美化显示
aos> Send({ Target = ao.id, Action = "PrettyList" })
aos> print(Inbox[#Inbox].Data)
```