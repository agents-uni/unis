# @agents-uni/unis

[![CI](https://github.com/agents-uni/unis/actions/workflows/ci.yml/badge.svg)](https://github.com/agents-uni/unis/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@agents-uni/unis.svg)](https://www.npmjs.com/package/@agents-uni/unis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Curated universe templates for [agents-uni](https://github.com/agents-uni) — ready-to-play scenarios with agents, relationships, and storylines.

每个 uni 是一个独立可运行的目录，`cp -r zhenhuan/ my-project/` 就能用。

## 宇宙索引

| ID | 名称 | 类型 | Agents | 难度 | 场景特色 |
|----|------|------|--------|------|---------|
| `zhenhuan` | 甄嬛传后宫 | competitive | 7 | intermediate | 宫斗权谋、联盟背叛、资源争夺 |
| `sanguo` | 三国演义 | hybrid | 8 | advanced | 三方博弈、跨阵营外交、军事对抗 |
| `startup` | 创业公司 | hierarchical | 7 | beginner | 层级协作、融资压力、技术选型分歧 |
| `courtroom` | 法庭辩论 | competitive | 7 | intermediate | 对抗式博弈、证据攻防、程序正义 |
| `bigtech` | 互联网大厂 | hierarchical | 7 | intermediate | 绩效考核、晋升竞争、组织政治 |

## 快速体验

```bash
# 1. 验证宇宙定义
cd zhenhuan && uni validate universe.yaml

# 2. 可视化关系图
uni visualize universe.yaml

# 3. 运行关系演化演示
node rel-demo.mjs
```

## 用模板初始化项目

```bash
uni init my-project --uni zhenhuan
cd my-project
npm install
uni validate universe.yaml
node rel-demo.mjs
```

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
├── zhenhuan/             # 每个 uni = 独立目录
│   ├── universe.yaml
│   ├── rel-demo.mjs
│   └── README.md
├── sanguo/
├── startup/
├── courtroom/
└── bigtech/
```
