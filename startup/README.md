# 创业公司

从融资压力到产品上线的完整创业周期 — 层级协作与资源博弈。

## 为什么设计这个场景

创业公司是最贴近现实工作场景的 hierarchical 模板。它展示了一个关键动态：层级结构中的权力并不单向流动。投资人在层级上高于 CEO，但 PM 通过数据可以说服 CEO 改变方向；前端和后端在层级上平等，但技术选型分歧会撕裂团队。适合作为入门模板理解 agents-uni 的关系引擎。

## 关系网络亮点

- **三明治压力**：CEO 夹在投资人压力和技术团队抵触之间，trust 维度两头波动
- **跨层级影响力**：PM 虽然 rank 低于 CTO，但通过事件（用户调研数据）可以获得更高 influence score
- **前后端张力**：peer 关系中 rivalry 随技术分歧升高，但产品上线后通过协作修复

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
