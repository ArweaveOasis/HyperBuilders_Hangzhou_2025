# Hacker House Submissions 指南


## 目录结构与命名

- 目录命名：`submissions/<team-slug>_<project-slug>/`
  - 仅用小写字母、数字与连字符 `-` 或下划线 `_`，避免空格与中文。
- 推荐结构：

```text
submissions/
  <team>_<project>/
    README.md               # 项目说明（见下方模板要点）
    submission.yaml         # 结构化元数据（见下方示例）
    demo/                   # 截图、视频或外链占位（可 README 链接）
    docs/                   # 架构图、设计说明等
    deploy/                 # 一键启动脚本或 docker-compose
      docker-compose.yml    # 或 Makefile / scripts/
      README.md             # 本地运行说明（如需）
    .env.example            # 环境变量样例（不得含密钥）
    LICENSE                 # 推荐 MIT 或 Apache-2.0
```

命名示例：`submissions/alpha-lab_ao-pay/`

## 必须文件

- `README.md`：面向评审的项目说明与运行指南。
- `submission.yaml`：元数据清单（见下文 Schema 字段）。
- `deploy/`：包含 `docker-compose.yml` 或 `Makefile`/`scripts/` 实现一键运行。
- `.env.example`：列出所有必需环境变量，示例值无敏感信息。
- `LICENSE`：明确授权条款。

## submission.yaml 字段示例

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
commit: "<freeze-commit-sha>"   # 提交冻结点（由评审前写入）
contact: "@tg / discord / email"
notes: "限制、已知问题、下一步"
```

建议后续提供 JSON Schema 与 CI 校验（若启用，将在 PR 时自动检查）。

## README 模板要点（队伍目录内）

在你们的 `submissions/<team>_<project>/README.md` 中，建议包含：

1) 项目简介

- 问题、目标用户、价值主张（≤150 字）。

2) 架构总览

- 一张总览图（前端/后端/合约/模型/数据流）。
- 关键流转说明（调用关系、数据/交易路径）。

3) 快速开始（优先一键）

- 推荐：`docker-compose up -d` 或 `make run`。
- 若需环境：给出 `.env.example`，并说明如何获取非敏感测试密钥或使用公共测试资源。
- 目标：本地 3 步内可运行最小可用 Demo。

4) 演示方式

- 在线 Demo、测试账号/数据、回放视频（≤3 分钟）。
- 无法公网演示时，提供本地录屏与说明。

5) 技术栈与权衡

- 栈列表、关键选型理由、替代方案简述。

6) 里程碑与范围

- 本次完成 vs 未来计划，避免超卖。

你可以复制以下 Markdown 片段作为起始模板：

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

## 提交流程（PR 驱动）

1. Fork 仓库并创建分支。
2. 在 `submissions/` 下创建你们的目录：`<team>_<project>/`。
3. 填写 `README.md` 与 `submission.yaml`，并准备 `deploy/` 与 `.env.example`。
4. 发起 PR 到 `main`：
   - PR 标题：`[Submission] <team>/<project>`
   - PR 描述：简要介绍 + 运行方式 + Demo 链接
   - 选择合适标签：`track:<xxx>`、`status:ready-for-review`、`region:hz-2025`

## 截止与冻结

- 截止时间前：仅接受包含 Demo 与可复现说明的 PR。
- 冻结规则：合并前写入 `submission.yaml.commit`（或创建 tag `submission-2025/<team>/<project>`）。

## 自动化校验（如启用）

- Schema 校验：`submission.yaml` 字段与类型检查。
- 链接检测：README 与 `demo_links` 可达性（允许软失败）。
- 复现探针：存在 `docker-compose.yml` 或 `Makefile run` 目标。
- 秘钥扫描：阻止敏感信息混入提交。
- 清单检查：必需文件齐全（README、YAML、LICENSE、.env.example）。
- 自动打标签：根据 `track` 字段添加赛道标签。

## 评审维度

- 问题价值：痛点清晰、市场与用户明确。
- 方案新颖：技术或产品角度的创新性与可行性。
- 完成度：可运行、功能闭环、边界处理。
- 可复现性：本地/容器一键跑通，说明清晰。
- 演示质量：3 分钟内传达亮点与可用性。
- 技术深度：架构设计、实现细节与权衡。
- 潜在影响：扩展性、生态价值与后续规划。

## 提交前检查清单（队伍）

- [ ] README 与 `submission.yaml` 信息一致且完整。
- [ ] `docker-compose up` 或 `make run` 可直接启动。
- [ ] `.env.example` 完整且无敏感信息；启动说明清晰。
- [ ] 在线 Demo 或视频可访问（≤3 分钟）。
- [ ] LICENSE 与第三方素材/模型合规声明齐全。
- [ ] 链接无 404，架构图/截图就位。

## 常见问题（FAQ）

- Q：我们不能公开线上 Demo，可以只交视频吗？
  - A：可以，但仍需提供本地可复现的运行方式（容器优先）。
- Q：需要链上真实交易吗？
  - A：不强制，鼓励使用测试网与模拟数据，并在 README 标注。
- Q：有多个服务如何组织？
  - A：推荐 `docker-compose` 管理；或提供 `Makefile` 聚合命令与清晰目录结构。
- Q：可以提交私有依赖吗？
  - A：不建议。若必须，请在 README 写明替代方案或精简版本。

——

需要我们提供 PR 模板与 CI 校验脚本吗？如果需要，我可以继续在仓库中添加：
- `.github/pull_request_template.md`
- `.github/workflows/validate-submission.yml`
- `submissions/_schema/submission.schema.json`
- `submissions/_template/README.md`

