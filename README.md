# @agents-uni/unis

[![CI](https://github.com/agents-uni/unis/actions/workflows/ci.yml/badge.svg)](https://github.com/agents-uni/unis/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@agents-uni/unis.svg)](https://www.npmjs.com/package/@agents-uni/unis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Curated universe templates for [agents-uni](https://github.com/agents-uni) — ready-to-play agent scenarios with relationships, storylines, and governance rules.

> **注意**：这是一个**模板仓库**，不是一个可以直接 clone & run 的项目。
> `rel-demo.mjs` 依赖 `@agents-uni/rel`，需要在你自己的项目中安装后才能运行。
> 推荐通过 `uni init --uni <name>` 使用模板（会自动处理依赖）。

## 宇宙索引

| ID | 名称 | 类型 | Agents | 难度 | 场景特色 |
|----|------|------|--------|------|---------|
| `zhenhuan` | 甄嬛传后宫 | competitive | 7 | intermediate | 宫斗权谋、联盟背叛、资源争夺 |
| `sanguo` | 三国演义 | hybrid | 8 | advanced | 三方博弈、跨阵营外交、军事对抗 |
| `startup` | 创业公司 | hierarchical | 7 | beginner | 层级协作、融资压力、技术选型分歧 |
| `courtroom` | 法庭辩论 | competitive | 7 | intermediate | 对抗式博弈、证据攻防、程序正义 |
| `bigtech` | 互联网大厂 | hierarchical | 7 | intermediate | 绩效考核、晋升竞争、组织政治 |

## 使用方式

### 推荐：通过 CLI 初始化项目

```bash
# 1. 用模板创建项目（自动复制 universe.yaml + rel-demo.mjs）
uni init my-project --uni zhenhuan
cd my-project

# 2. 安装依赖（包含 @agents-uni/rel）
npm install

# 3. 验证 & 体验
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```

### 手动使用

如果你想直接从仓库复制模板：

```bash
# 1. 复制模板文件到你的项目
cp zhenhuan/universe.yaml zhenhuan/rel-demo.mjs your-project/

# 2. 在你的项目中安装依赖
cd your-project
npm install @agents-uni/rel

# 3. 验证 & 运行
uni validate universe.yaml
node rel-demo.mjs
```

### 仅浏览 / 验证

`universe.yaml` 是纯 YAML，无需安装任何依赖即可验证和查看：

```bash
cd zhenhuan
uni validate universe.yaml
uni visualize universe.yaml
```

## npm 包的作用

`@agents-uni/unis` 发布为 npm 包，但**不是给用户直接安装的**。它服务于：

- **`uni init --uni <name>`** — CLI 通过 `require.resolve` 定位模板文件并复制到用户项目
- **`@agents-uni/zhenhuan`** — 作为 fallback 源查找 `universe.yaml`

如果你只是想浏览模板，直接看这个 Git 仓库即可。

## 贡献你的 Uni

请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) — 5 步从零创建并提交你的宇宙。

## 目录结构

```
agents-uni-unis/
├── README.md
├── CONTRIBUTING.md       # 创建指南（核心文档）
├── registry.json         # 机器可读索引
├── package.json
│
├── zhenhuan/             # 每个 uni = 模板目录
│   ├── universe.yaml     #   宇宙定义（纯 YAML，可独立验证）
│   ├── rel-demo.mjs      #   关系演化演示（需 @agents-uni/rel）
│   └── README.md         #   设计意图说明
├── sanguo/
├── startup/
├── courtroom/
└── bigtech/
```
