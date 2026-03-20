# 高中班级

成绩排名、社交资本和青春期情绪交织的微型社会 — 小团体形成与跨圈层流动。

## 为什么设计这个场景

高中班级是社会网络研究的经典模型。它展示了一个关键动态：**正式层级（老师→班干部→学生）与非正式影响力（社交资本）的错位**。学霸 rank 高但 charisma 低，体育委员 rank 低但 social influence 大。转学生是天然的"外来变量"——他的站队选择会打破现有小团体平衡。叛逆少年对权威的抵触制造了 rival 维度的持续张力。

## 关系网络亮点

- **正式 vs 非正式权力**：class-monitor 有 assign 权限但 troublemaker 的 social influence 可能更大
- **转学生催化效应**：transfer 初始 weight 全部低于 0.5，但选择加入哪个圈子会改变整个关系拓扑
- **成绩排名零和**：positional 资源让 top-student 和 sports-captain 的 rivalry 有硬约束

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
