# 🚀 AO/HyperBEAM HackerHouse 开发环境准备指南

欢迎参加 AO/HyperBEAM HackerHouse！本指南将帮助您在活动开始前准备好完整的开发环境。

## 📋 目录

- [基础环境要求](#基础环境要求)
- [AO 开发工具链](#ao-开发工具链)
- [HyperBEAM 核心设置](#hyperbeam-核心设置)
- [开发语言环境](#开发语言环境)
- [开发辅助工具](#开发辅助工具)
- [环境验证](#环境验证)
- [快速开始](#快速开始)
- [常见问题](#常见问题)

## 基础环境要求

### 1. Erlang/OTP 运行时（必需）

HyperBEAM 需要 **Erlang/OTP 27** 版本。

#### macOS
```bash
brew install erlang@27
```

#### Ubuntu/Debian
```bash
# 添加 Erlang Solutions 仓库
wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb
sudo dpkg -i erlang-solutions_2.0_all.deb
sudo apt-get update
sudo apt-get install esl-erlang=1:27.0

# 验证安装
erl -version
```

#### Windows
- 下载安装包：https://www.erlang.org/downloads
- 选择 OTP 27.x 版本

### 2. Rebar3 构建工具（必需）

```bash
# 下载并安装 Rebar3
wget https://s3.amazonaws.com/rebar3/rebar3
chmod +x rebar3
sudo mv rebar3 /usr/local/bin/

# 或通过 Homebrew (macOS)
brew install rebar3

# 验证安装
rebar3 --version
```

### 3. Git 版本控制（必需）

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# 验证安装
git --version
```

## AO 开发工具链

### 1. Node.js 和 npm（必需）

```bash
# 推荐使用 Node.js 18.x 或更高版本
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. aos CLI 工具（必需）

```bash
# 全局安装 aos
npm i -g https://get_ao.arweave.net

# 验证安装
aos --version
```

### 3. Arweave 钱包（必需）

1. 访问 https://www.wander.app
2. 创建新钱包
3. 下载并保存 keyfile（JSON 格式）
4. **重要**：备份您的助记词和 keyfile
5. 获取一些 AR 代币用于测试

## HyperBEAM 核心设置

### 1. 克隆 HyperBEAM 仓库

```bash
# 克隆官方仓库
git clone https://github.com/permaweb/HyperBEAM.git
cd HyperBEAM
# 需要切到 edge 分支
git checkout edge

```

### 2. 创建配置文件

```bash
# 创建 config.flat 配置文件
cat > config.flat << EOF
port: 10000
priv_key_location: /path/to/your/wallet.json
EOF
```

## 开发语言环境

### 1. Lua 开发环境（推荐初学者）

Lua 是 AO 生态系统中最简单的入门语言。

```bash
# macOS
brew install lua@5.3
brew install luarocks

# Ubuntu/Debian
sudo apt-get install lua5.3 luarocks

# 验证安装
lua -v
luarocks --version
```

### 2. WebAssembly 开发环境

选择以下任一语言来开发 WASM 模块：

#### Rust（推荐）
```bash
# 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 添加 WASM 目标
rustup target add wasm32-unknown-unknown

# 安装 wasm-pack（可选）
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

#### AssemblyScript
```bash
# 需要 Node.js
npm install -g assemblyscript
```

#### C/C++ with Emscripten
```bash
# 克隆 Emscripten SDK
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# 安装最新版本
./emsdk install latest
./emsdk activate latest

# 设置环境变量
source ./emsdk_env.sh
```

## 开发辅助工具

### 1. HTTP 客户端工具

```bash
# HTTPie（推荐，更友好的输出）
pip3 install httpie

# 使用示例
http GET localhost:10000/~meta@1.0/info

# 或使用 curl
curl http://localhost:10000/~meta@1.0/info
```

### 2. JSON 处理工具

```bash
# jq - 强大的命令行 JSON 处理器
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# 使用示例
curl http://localhost:10000/~meta@1.0/info | jq .
```

### 3. Python 环境（文档和脚本）

```bash
# 确保 Python 3.8+ 已安装
python3 --version

# 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate  # Windows

# 安装文档构建工具
pip3 install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin
```

## 环境验证

创建环境检查脚本 `check-env.sh`：

```bash
#!/bin/bash

echo "=== AO/HyperBEAM 开发环境检查 ==="
echo ""

# 定义颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2: $(command $1 $3 2>&1 | head -n 1)"
    else
        echo -e "${RED}✗${NC} $2: 未安装"
        return 1
    fi
}

# 必需组件
echo "必需组件："
check_command erl "Erlang/OTP" "-eval 'io:format(\"~s~n\", [erlang:system_info(otp_release)]), halt().' -noshell"
check_command rebar3 "Rebar3" "--version"
check_command git "Git" "--version"
check_command node "Node.js" "--version"
check_command npm "npm" "--version"
check_command aos "aos CLI" "--version"

echo ""
echo "可选组件："
# 可选组件
check_command docker "Docker" "--version"
check_command lua "Lua" "-v"
check_command rustc "Rust" "--version"
check_command python3 "Python 3" "--version"
check_command jq "jq" "--version"
check_command http "HTTPie" "--version"

echo ""
echo "=== 检查完成 ==="
```

运行检查：
```bash
chmod +x check-env.sh
./check-env.sh
```

## 快速开始

### 1. 启动本地 HyperBEAM 节点

```bash
cd HyperBEAM
rebar3 shell

# 节点启动后，您应该看到类似输出：
# HyperBEAM node started on port 10000
```

### 2. 验证节点运行

在新的终端窗口中：

```bash
# 获取节点信息
curl http://localhost:10000/~meta@1.0/info | jq .

# 或使用 HTTPie
http GET localhost:10000/~meta@1.0/info
```

### 3. 运行第一个 AO 进程

创建简单的 Lua 处理器 `hello.lua`：

```lua
Handlers.add(
  "SayHello",
  Handlers.utils.hasMatchingTag("Action", "Hello"),
  function (msg)
    Send({
      Target = msg.From,
      Action = "Hello-Reply",
      Data = "Hello, " .. (msg.Tags.Name or "World") .. "!"
    })
  end
)
```

使用 aos 运行：

```bash
aos hello-process --load hello.lua
```

### 4. 测试预言机功能

```bash
# 使用 relay 设备获取外部数据
curl "http://localhost:10000/~relay@1.0/call?method=GET&path=https://api.github.com/repos/permaweb/HyperBEAM"
```

## 常见问题

### Q1: Erlang 版本不匹配怎么办？

确保安装的是 OTP 27 版本。可以使用版本管理工具如 `asdf` 或 `kerl`：

```bash
# 使用 asdf
asdf plugin-add erlang
asdf install erlang 27.0
asdf global erlang 27.0
```

### Q2: 端口 10000 被占用？

修改 `config.flat` 中的端口设置：

```yaml
port: 10001  # 或其他未使用的端口
```

### Q3: 如何获取测试用 AR 代币？

1. 加入 Arweave 社区 Discord
2. 在 #faucet 频道请求测试代币
3. 或联系 HackerHouse 组织者

### Q4: WebAssembly 编译失败？

确保正确设置了目标架构：

```bash
# Rust
rustup target add wasm32-unknown-unknown

# 检查已安装的目标
rustup target list --installed
```

## 🎯 推荐的预习内容

1. **AO 基础概念**
   - 阅读：https://ao.arweave.net/
   - 理解 Process、Message、Device 概念

2. **HyperBEAM 架构**
   - 阅读项目 README.md
   - 理解 HashPath 和 Commitment 机制

3. **实践项目**
   - 创建一个简单的代币合约
   - 实现一个使用外部数据的预言机
   - 构建一个多设备组合的应用

## 📞 获取帮助

- **官方文档**: https://ao.arweave.net/docs
- **GitHub Issues**: https://github.com/permaweb/HyperBEAM/issues
- **Discord 社区**: [加入链接]
- **HackerHouse 支持群**: [群组链接]

## ✅ 准备清单

在参加 HackerHouse 前，请确保：

- [ ] 所有必需组件已安装并验证
- [ ] HyperBEAM 节点可以正常启动
- [ ] 拥有 Arweave 钱包和测试代币
- [ ] 运行过至少一个示例程序
- [ ] 熟悉基本的 aos 命令
- [ ] 准备好您的项目想法！

---

**祝您在 HackerHouse 取得成功！🎉**

*最后更新：2025年1月*
