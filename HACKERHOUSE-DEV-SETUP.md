# 🚀 AO/HyperBEAM HackerHouse 开发环境准备指南

欢迎参加 AO/HyperBEAM HackerHouse！本指南将帮助您在活动开始前准备好完整的开发环境。

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

## 开发语言环境

### 1. Lua 开发环境

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

### 2. 尝试通过 HyperBEAM 创建 Process

```bash
aos {process_name} --url http://node.arweaveoasis.com:8734
```

## 🎯 推荐的预习内容

1. **AO 基础概念**
   - 阅读：[https://ao.arweave.net/](https://cookbook_ao.defi.ao/)
   - 理解 AO-Core, Process、HyperBEAM 相关基础信息

2. **HyperBEAM 节点**
   - [http://node.arweaveoasis.com:8734](http://node.arweaveoasis.com:8734)

## ✅ 准备清单

在参加 HackerHouse 前，请确保：

- [ ] 所有必需组件已安装并验证
- [ ] HyperBEAM 节点连接并创建 Process
- [ ] 拥有 Arweave 钱包和代币
- [ ] 熟悉基本的 aos 命令
- [ ] 准备好您的项目想法！

---

**祝您在 HackerHouse 取得成功！🎉**
