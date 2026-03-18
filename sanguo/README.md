# 三国演义

魏蜀吴三方势力的合纵连横 — 展现战略级的多方关系演化。

## 为什么设计这个场景

三国是 hybrid 类型的最佳样本：阵营内部是 hierarchical 协作（刘备-诸葛亮-关羽），阵营之间是 competitive 对抗（魏蜀吴三方），同时存在跨阵营的临时联盟（孙刘联盟抗曹）。这种三层结构让聚类分析特别有趣——你能看到内部凝聚力 vs 跨阵营张力的动态平衡。

## 关系网络亮点

- **三方博弈**：不是简单的二元对抗，而是"敌人的敌人是朋友"的复杂格局
- **忠诚与野心冲突**：司马懿对曹操的 superior 关系中，loyalty 极低但 dependence 高，预示了权力更迭
- **既生瑜何生亮**：周瑜与诸葛亮的 rival 关系中 respect 极高，展示对抗中的相互欣赏

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
