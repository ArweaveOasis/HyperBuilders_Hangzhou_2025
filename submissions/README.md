# Hacker House 提交指南

## 快速提交（5分钟搞定）

1. 创建目录：`submissions/<team>_<project>/`
2. 写一个简单的 `README.md`：
   - 项目是什么（1-2句话）
   - 怎么跑起来（最简单的命令）
   - Demo 链接或视频（必须有一个）
3. 提 PR

## README 最简模板

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

## Demo

- 在线: https://xxx.com
- 视频: https://xxx.com/video
---
## 提交流程（PR 驱动）

1. Fork 仓库并创建分支。
2. 在 `submissions/` 下创建你们的目录：`<team>_<project>/`。
3. 填写 `README.md`（Minimal 或 Pro），如需 `.env.example` 一并提交。
4. 发起 PR 到 `main`：
   - PR 标题：`[Submission] <team>/<project>`
   - PR 描述：简介 + 运行方式 + Demo 链接/视频
   - 标签：由官方/机器人自动打（队伍无需手动选择）。
---

## 注意事项

- ✅ 代码能跑就行，不用完美
- ✅ Demo 比文档重要
- ✅ 有创意比技术栈重要
- ❌ 不要提交密钥和敏感信息
- ❌ 不要花时间写长文档

## FAQ

**Q: 需要 Docker 吗？**  
A: 不强制，能跑就行

**Q: 代码不完整怎么办？**  
A: 正常，说明已完成什么就行

**Q: 有什么节点或者网络比较好？**  
A: 如果 HyperBEAM 网络稳定，最好是 HyperBEAM，但如果网络不稳定，就是用 LegacyNet。发现网络不稳定就赶紧切换，不要花时间在等待上。

---

有问题随时问，专注做项目！
