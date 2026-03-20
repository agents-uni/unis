# 医院急诊科

分秒必争的黄金一小时 — 共识决策与跨专业协作的生死博弈。

## 为什么设计这个场景

现有 universe 覆盖了 hierarchical（startup, bigtech）、competitive（zhenhuan, courtroom）和 hybrid（sanguo），唯独缺少真正的 **flat / consensus** 类型。医院急诊科是最好的载体：主治医师们在专业上平等（外科、内科、麻醉科各有话语权），但时间压力迫使他们必须快速达成共识。内外科的治疗路径之争（手术 vs 保守）是最经典的 peer rivalry，而麻醉师作为瓶颈资源拥有事实上的一票否决权。

## 关系网络亮点

- **扁平共识 vs 时间压力**：consensus 决策模型在倒计时下被压缩，rivalry 和 trust 维度极速波动
- **瓶颈资源博弈**：手术室 3 间、麻醉师 1 个、呼吸机 8 台 — 资源争夺不是权力游戏而是生命选择
- **家属变量**：patient-family 的 composure 极低但 empathy 极高，情绪爆发会打断任何既定流程

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
