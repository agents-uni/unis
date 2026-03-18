# 互联网大厂

绩效考核、晋升竞争、组织架构调整 — 职场生存法则的 Agent 模拟。

## 为什么设计这个场景

大厂是一个 hierarchical 体系中最具现实感的模板。核心动态是**绩效季的零和博弈**：晋升名额有限（3 个），绩效包总量固定，一个人的 3.75 意味着另一个人的 3.25。同时组织架构调整引入了结构性不确定性——你的 manager 可能突然变了，你的团队可能被合并。适合展示 resources 有限性如何驱动关系演化。

## 关系网络亮点

- **晋升竞争**：P7-FE vs P7-BE 的 rival 关系随绩效季升温，但日常又需要协作
- **IC vs Manager 路线**：P9 架构师与总监的微妙 rival 关系，展示同级别不同路线的张力
- **HRBP 的桥梁角色**：与 VP、总监是 peer，与 P6 是 ally，连接组织的不同层级

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
