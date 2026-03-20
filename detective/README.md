# 悬疑推理社

每个人都有秘密，真相只在所有碎片拼合后浮现 — 信息不对称与逻辑博弈。

## 为什么设计这个场景

推理社是 **meritocratic** 决策模型的最佳载体：谁的推理最有说服力谁就主导方向，不靠层级不靠投票。它展示了一个独特动态：**信息就是权力**。archivist 掌握档案但不主动分享，techie 能破解数字证据但不懂人心，profiler 洞察动机但缺乏硬证据。newcomer 的高 deception + 不明身份是全场最大变量——他可能是破案关键，也可能是嫌疑人之一。

## 关系网络亮点

- **推理竞赛**：genius 和 profiler 的 rival 关系代表逻辑派 vs 心理派的路线之争
- **信息守门人**：archivist 的 low ambition + high analytical 创造了信息瓶颈——他不争功但控制信息流
- **新人悬念**：newcomer 的 deception 0.8 是全场最高，初始关系 weight 全部低于 0.4，信任必须靠行动换取
- **证人困境**：witness 可能隐瞒信息（deception 0.6），profiler 的 advisor 关系能否撬开真话？

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
