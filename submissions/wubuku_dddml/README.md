# DDDML AO MCP Server

## 简介
一个基于 DDDML 模型驱动开发的 AO Dapp 脚手架，结合 MCP Server，实现低代码构建去中心化应用。

## AO 进程信息
- Network: Legacy Net

## 快速开始
1. 前置条件
- 安装 Node.js 和 npm
- 安装 AOS
- 安装 Docker
- 运行 `docker pull wubuku/dddml-ao-mcp-server:latest` 将 DDDML AO MCP Server 拉到本地

2. 在本机的任意一个目录中创建一个脚本文件，可以命名为 `dddml-mcp-wrapper.sh`，内容如上。
然后赋予它执行权限：`chmod +x /PATH/TO/dddml-mcp-wrapper.sh`

3. MCP Client config

以 Cursor IDE 为例：
```json
    "dddml-ao-mcp-server": {
      "command": "/PATH/TO/dddml-mcp-wrapper.sh",
      "args": ["--platform", "ao"],
      "options": {
        "cwd": "${workspaceFolder}"
      }
    }
```
4. 以上准备妥当之后，就可以将下面的提示词粘贴给 AI。

你可以把下面提示词中的 `Blog Dapp` 改为你要开发的应用的需求描述，然后就可以等着 AI 给生成一个可以完成度相当高的 AO Dapp。未完成的部分，你可以让 AI 继续帮你改进直至完成。

```
使用可用的 AO MCP Server 创建一个以 DDDML 模型驱动开发的 Blog Dapp。

你应该从 MCP server 提供的示例模型资源中学习如何定义 DDDML 模型，并利用其提供的工具生成代码。

最后将整个过程和总结为 `README.md` 文档。
```

## 演示
- https://gist.github.com/wubuku/e77ef5d1bdb9c84ddfd8e49e62e587c9

## 联系方式
- GitHub: @wubuku
- Wallet Address: 
