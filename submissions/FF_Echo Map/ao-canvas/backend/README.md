# AO Canvas Backend

镜像人格辩论平台的后端 API 服务，提供稳定的 REST API 支撑前端页面与交互。

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- pnpm (推荐) 或 npm

### 本地开发

1. **克隆项目并安装依赖**
   ```bash
   cd backend
   pnpm install
   ```

2. **配置环境变量**
   ```bash
   cp env.example .env.local
   # 编辑 .env.local 文件，配置数据库连接等
   ```

3. **启动数据库**
   ```bash
   # 使用 Docker Compose
   docker-compose up postgres -d
   
   # 或手动启动 PostgreSQL
   # 确保数据库名为 ao_canvas
   ```

4. **初始化数据库**
   ```bash
   pnpm prisma:migrate
   pnpm db:seed
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

6. **访问服务**
   - API: http://localhost:3000/api
   - 文档: http://localhost:3000/docs
   - OpenAPI: http://localhost:3000/openapi.yaml

### 生产部署

#### 使用 Docker Compose

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

#### 手动部署

```bash
# 构建项目
pnpm build

# 运行数据库迁移
pnpm prisma:deploy

# 启动生产服务
pnpm start
```

## 📚 API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 用户登出

### 会话管理

- `POST /api/sessions` - 创建会话
- `GET /api/sessions/:id` - 获取会话详情

### 角色管理

- `POST /api/roles` - 创建 AI 角色
- `GET /api/roles/sessions/:sessionId` - 获取会话角色列表

### 画布操作

- `POST /api/canvas/nodes` - 创建画布节点
- `POST /api/canvas/edges` - 创建画布边
- `POST /api/canvas/expand` - 扩展画布（四向语义映射）
- `GET /api/canvas/sessions/:sessionId` - 获取会话画布

### 健康检查

- `GET /api/health` - 服务健康状态

## 🎯 核心功能

### 四向语义映射

画布扩展严格遵循以下映射关系：

- **RIGHT** → `time` → 主线推进
- **UP** → `summary` → 抽象/总结  
- **DOWN** → `detail` → 细化/问题
- **LEFT** → `contrast` → 对比/平行分支

### 数据模型

- **User** - 用户信息（支持钱包地址）
- **Session** - 会话管理
- **Role** - AI 角色定义
- **Debate** - 辩论会话
- **CanvasNode** - 画布节点
- **CanvasEdge** - 画布边（带语义关系）
- **Idea** - 想法记录
- **Reflection** - 反思记录

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e

# 运行测试覆盖率
pnpm test:coverage
```

## 🔧 开发工具

```bash
# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 修复代码问题
pnpm lint:fix

# 数据库管理
pnpm prisma:studio

# 生成 TypeScript SDK
pnpm openapi:generate
```

## 📦 技术栈

- **Runtime**: Node.js + TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Documentation**: OpenAPI 3.1 + Swagger UI
- **Testing**: Vitest + Supertest
- **Deployment**: Docker + Docker Compose

## 🌍 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `DATABASE_URL` | 数据库连接字符串 | - |
| `JWT_SECRET` | JWT 密钥 | - |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` |
| `PORT` | 服务端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` |
| `CORS_ORIGIN` | CORS 允许的源 | `http://localhost:3001` |

## 🚀 部署选项

### Fly.io

```bash
# 安装 flyctl
curl -L https://fly.io/install.sh | sh

# 登录并部署
fly auth login
fly launch
fly deploy
```

### Render

1. 连接 GitHub 仓库
2. 选择 "Web Service"
3. 配置环境变量
4. 设置构建命令: `pnpm install && pnpm build`
5. 设置启动命令: `pnpm start`

### Vercel Functions

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 📝 开发指南

### 添加新模块

1. 创建模块目录: `src/modules/your-module/`
2. 实现 DTO、Service、Controller
3. 在 `app.module.ts` 中注册模块
4. 添加相应的测试

### 数据库迁移

```bash
# 创建迁移
pnpm prisma migrate dev --name your-migration-name

# 应用迁移
pnpm prisma migrate deploy

# 重置数据库
pnpm prisma migrate reset
```

### API 版本管理

- 使用 OpenAPI 规范定义接口
- 通过 Swagger UI 测试接口
- 生成 TypeScript SDK 供前端使用

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

如有问题，请：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue 描述问题
3. 联系开发团队

---

**Happy Coding! 🎉**
