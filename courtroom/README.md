# 法庭辩论

控辩双方围绕案件事实的对抗式信息博弈。

## 为什么设计这个场景

法庭是一个结构化的 competitive 系统，核心特点是**对抗是制度化的**：控辩双方必须在法官设定的规则框架内竞争，胜负由第三方（陪审团）裁定。这和自由竞争的后宫场景形成鲜明对比——关系演化受到程序正义的约束。适合展示 protocols 状态机如何控制 agent 行为。

## 关系网络亮点

- **制度化对抗**：prosecutor-defense 的 rival 关系在 protocol 约束下演化，不会无限升级
- **证人可信度动态**：witness-a 在交叉询问后 trust 急剧下降，展示单事件如何翻转关系
- **中立权威**：judge 与所有参与者都是 superior 关系，但 authority 维度随裁决积累

## 快速体验

```bash
uni validate universe.yaml
uni visualize universe.yaml
node rel-demo.mjs
```
