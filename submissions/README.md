# Hacker House Submissions 指南

本指南采用“两档提交”设计：默认走 Minimal（最小必交），进阶走 Pro（加分项）。先把项目跑起来和演示清楚，再考虑加分材料。

## TL;DR 最小提交（≤10 分钟）

- 目录：`submissions/<team-slug>_<project-slug>/`
- 提交 `README.md`：含简介（≤150 字）、本地运行步骤（3 步内）、Demo 链接或≤3 分钟视频、已知限制。
- 如需环境变量：附 `.env.example`（无敏感信息）。
- 能跑起来：直接命令或容器二选一（容器优先但不强制）。
- 可选：`submission.yaml`（精简字段见下）、`LICENSE`。

命名示例：`submissions/alpha-lab_ao-pay/`

---

## 提交档位

### Minimal（默认，建议所有队伍）

- 必交文件：
  - `README.md`（简介、运行步骤、Demo/视频、已知限制）。
  - `.env.example`（仅当需要环境变量时）。
- 可选文件（推荐但不强制）：
  - `submission.yaml`（最小字段集）。
  - `LICENSE`（MIT/Apache-2.0 任一）。
- 运行方式：直接命令或容器均可，目标是“3 步内跑通最小可用 Demo”。

### Pro（加分，时间充裕再做）

- 一键运行：`deploy/` 目录，含 `docker-compose.yml` 或 `Makefile`/`scripts/`。
- 文档材料：`docs/` 架构图、技术权衡、设计说明；`demo/` 截图/视频占位。
- 完整元数据：详尽 `submission.yaml`（见下方完整示例）。
- 合规透明：`LICENSE`、第三方素材/模型声明。

---

## 目录结构与命名（建议）

```text
submissions/
  <team>_<project>/
    README.md               # 必交：项目说明与运行指南（见模板）
    .env.example            # 仅当需要环境变量；不得含密钥
    submission.yaml         # 可选：最小或完整元数据
    demo/                   # 可选：截图、视频或外链占位
    docs/                   # 可选：架构图、设计说明等（Pro）
    deploy/                 # 可选：一键启动脚本或 docker-compose（Pro）
      docker-compose.yml
      README.md
    LICENSE                 # 可选：MIT 或 Apache-2.0（Pro）
```

---

## 最小 submission.yaml 模板（可选）

若使用元数据文件，Minimal 仅需以下字段：

```yaml
team: "<Team Name>"
members:
  - github: "<github_handle>"
project: "<Project Name>"
track: "AI | DeFi | Infra | Social | Other"
summary: "≤120 字电梯演讲"
how_to_run: "简述启动命令或指向 README"
demo_links:
  - "https://..."
```

## 完整 submission.yaml 字段示例（Pro 加分）

```yaml
team: "Alpha Lab"
members:
  - name: "Ada"
    role: "PM"
    github: "ada-lab"
    email: "ada@example.com"
    wallet: "<optional>"
  - name: "Bob"
    role: "Fullstack"
    github: "bob-dev"
project: "ao Pay"
track: "AI | DeFi | Infra | Social | Other"
summary: "一句话电梯演讲（不超过 120 字）"
problem: "要解决的问题及场景"
solution: "核心方案、关键创新点、差异化"
stack: ["Next.js", "lua", "hyperbeam", "OpenAI", "Supabase"]
architecture: "docs/architecture.png"
how_to_run: "deploy/README.md 或脚本说明"
demo_links:
  - "https://example.com/demo"
  - "https://example.com/video"
license: "MIT"
commit: "<freeze-commit-sha>"   # 由官方在评审前写入
contact: "@tg / discord / email"
notes: "限制、已知问题、下一步"
```

如启用自动化，建议提供 JSON Schema 与 CI 校验（PR 时自动检查）。

---

## README 模板

你可以根据时间选择 Minimal 模板或 Pro 模板。

### Minimal（推荐默认）

```markdown
# <Project Name>

## 简介
一句话电梯演讲（≤150 字）：要解决的问题、目标用户与价值。

## 快速开始
1. 如需环境变量：`cp .env.example .env`
2. 启动：<你的命令>（例如 `npm i && npm run dev` 或 `docker-compose up -d`）
3. 访问：<URL>（标注端口/路径）

## 演示
- 在线：<https://...>（可选）
- 视频：<https://...>（≤3 分钟，二选一必填）
- 测试账号/数据：<如适用>

## 已知限制
- 简述当前限制或待办。
```

### Pro（加分）

```markdown
# <Project Name>

## 简介
一句话电梯演讲；要解决的问题、目标用户与价值。

## 架构
![Architecture](docs/architecture.png)
简述关键组件与调用/数据流。

## 快速开始
1. 复制环境变量示例：`cp .env.example .env`
2. 启动服务：`docker-compose up -d`（或 `make run`）
3. 访问：`http://localhost:3000`（如不同请注明）

> 无 Docker 时：
> - 后端：`cd api && npm i && npm run dev`
> - 前端：`cd web && npm i && npm run dev`

## 演示
- 在线：<https://...>
- 视频：<https://...>
- 测试账号/数据：用户名/密码 或 钱包/水龙头

## 技术栈与权衡
- 栈：Next.js、Rust、Postgres、…
- 关键选型与替代：为什么选 A，不选 B。

## 里程碑
- 本次完成：功能 A/B/C；
- 计划中：X/Y；已知限制：Z。
```

---

## 提交流程（PR 驱动）

1. Fork 仓库并创建分支。
2. 在 `submissions/` 下创建你们的目录：`<team>_<project>/`。
3. 填写 `README.md`（Minimal 或 Pro），如需 `.env.example` 一并提交；`submission.yaml` 可选。
4. 发起 PR 到 `main`：
   - PR 标题：`[Submission] <team>/<project>`
   - PR 描述：简介 + 运行方式 + Demo 链接/视频
   - 标签：由官方/机器人自动打（队伍无需手动选择）。

---

## 截止与冻结

- 截止时间前：仅接受能运行并有 Demo/视频的 PR。
- 冻结规则：由官方在评审前写入 `submission.yaml.commit` 或创建 tag（队伍无需操作）。

---

## 自动化校验（如启用）

- 基础必检：
  - 清单：存在 `README.md`，若引用 `.env` 则提供 `.env.example`。
  - 链接：README 与 `demo_links` 可达性（允许软失败）。
  - 秘钥扫描：阻止敏感信息混入提交。
- 进阶可检（加分）：
  - Schema 校验：`submission.yaml` 字段与类型检查。
  - 复现探针：检测 `docker-compose.yml` 或 `make run` 目标。
  - 自动打标签：根据 `track` 字段添加赛道标签。

---

## 评审维度

- 问题价值：痛点清晰、目标用户明确。
- 方案新颖：技术或产品创新与可行性。
- 完成度：可运行、功能闭环、边界处理。
- 可复现性：3 步内跑通，说明清晰。
- 演示质量：≤3 分钟直击亮点与可用性。
- 技术深度：架构设计、实现细节与权衡。
- 潜在影响：扩展性、生态价值与后续规划。

---

## 提交前检查清单

### Minimal 清单

- [ ] README 含简介、运行步骤、Demo/视频、已知限制。
- [ ] 能在本地 3 步内运行；无敏感信息提交。
- [ ] （如需要）提供 `.env.example`。

### Pro 加分清单

- [ ] 一键运行：`docker-compose up` 或 `make run`。
- [ ] `docs/` 架构图与关键流转说明。
- [ ] 完整 `submission.yaml` 与 `LICENSE`。

---

## 常见问题（FAQ）

- Q：不能公开线上 Demo，可以只交视频吗？
  - A：可以，但仍需提供本地可复现的运行方式（直接命令或容器均可）。
- Q：需要链上真实交易吗？
  - A：不强制，鼓励使用测试网/模拟数据，并在 README 标注。
- Q：有多个服务如何组织？
  - A：推荐 `docker-compose` 管理；或提供 `Makefile` 聚合命令与清晰目录结构（Pro）。
- Q：可以提交私有依赖吗？
  - A：不建议。若必须，请在 README 写明替代方案或精简版本。

——

模板文件：`submissions/_template/README.min.md` 与 `submissions/_template/submission.min.yaml` 可直接复制使用。
