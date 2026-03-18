# 贡献指南 — 从零创建你的 Uni

本文档手把手教你用 agents-uni 工具链创建一个完整的 universe 并提交到仓库。

---

## 快速总览

| 步骤 | 命令 | 产出 |
|------|------|------|
| 1. 生成骨架 | `uni generate` | `universe.yaml` |
| 2. 验证 & 可视化 | `uni validate` / `uni visualize` | 确认结构正确 |
| 3. 补充关系和事件 | `uni enrich` | 更丰富的 universe.yaml |
| 4. 写 rel-demo.mjs | 手动 | 关系演化演示脚本 |
| 5. 提交 PR | `git` + `gh` | 合入仓库 |

---

## 第一步：生成骨架

用自然语言描述你想要的场景，`uni generate` 会生成完整的 `universe.yaml`：

```bash
uni generate "一个古代科举考场，考官、考生、监考之间的博弈" \
  --type competitive \
  -o universe.yaml
```

**参数说明：**

| 参数 | 说明 | 可选值 |
|------|------|--------|
| `<description>` | 场景的自然语言描述 | 越具体越好 |
| `--type` | 宇宙类型 | `competitive` / `hierarchical` / `flat` / `hybrid` |
| `-o` | 输出文件 | 默认 `universe.yaml` |
| `--lang` | 语言 | `zh` / `en` |

**好的描述示例：**
- "互联网大厂绩效季，VP、总监、P7 之间的晋升竞争和绩效博弈"
- "三国赤壁之战前夕，孙刘联盟 vs 曹操的多方外交博弈"
- "法庭辩论，控辩双方围绕一起谋杀案展开证据攻防"

**不好的描述：**
- "一些人在竞争"（太模糊，生成结果无个性）
- "AI agents"（没有场景信息）

---

## 第二步：验证 & 可视化

```bash
# 检查 YAML 是否符合 schema
uni validate universe.yaml

# 渲染 ASCII 关系图
uni visualize universe.yaml
```

**验证会检查：**
- agents 的 id 是否唯一
- relationships 的 from/to 是否指向真实 agent
- protocols 的状态机是否完整（无悬挂状态）
- governance 的 permissionMatrix 是否引用了有效的 actor/target

**可视化时重点检查：**
- 有没有孤立节点（没有任何关系的 agent）
- 关系方向是否合理
- 是否有明显缺失的关系

---

## 第三步：用 enrich 补充

```bash
uni enrich universe.yaml --relationships --events 6
```

**`--relationships` 会：**
- 检测孤立 agent 并自动补充合理关系
- 根据 rank 差异推断 superior/subordinate
- 根据 traits 相似度推断 ally/rival

**`--events <count>` 会：**
- 用 ScenarioSuggester 基于关系拓扑生成事件建议
- 每个事件包含 from/to、type、description、impact
- 可以直接复制到 rel-demo.mjs 中使用

生成后再跑一次 `uni validate` 确认无误。

---

## 第四步：写 rel-demo.mjs

每个 uni 需要一个 `rel-demo.mjs`，演示关系如何随事件演化。

### 模板

```javascript
/**
 * rel-demo.mjs — <你的宇宙名> 关系引擎演示
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
  resolveTemplate,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 的 relationships 提取 seeds ──────────
const seeds = [
  // 复制你的 universe.yaml 中的 relationships 部分
  { from: 'agent-a', to: 'agent-b', type: 'ally', weight: 0.8 },
  { from: 'agent-c', to: 'agent-a', type: 'rival', weight: 0.7 },
  // ...
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════');
console.log('  第一步：初始关系图');
console.log('═══════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 定义 5-7 个场景事件 ──────────────────────
const events = [
  {
    from: 'agent-a', to: 'agent-b',
    description: '描述发生了什么',
    event: {
      type: 'task.completed',         // 事件类型
      impact: { trust: 0.08, loyalty: 0.06 },  // 维度影响
    },
  },
  // 更多事件...
];

console.log('\n═══════════════════════════════════════');
console.log('  第二步：事件处理');
console.log('═══════════════════════════════════════');

for (const scenario of events) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 演化后状态 ──────────────────────────────
console.log('\n═══════════════════════════════════════');
console.log('  第三步：演化后关系');
console.log('═══════════════════════════════════════');

for (const rel of graph.getAllRelationships()) {
  console.log(`\n  ${rel.from} → ${rel.to}`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(3)}`);
  }
  console.log(`    memory: ${rel.memory.shortTerm.length} events, valence: ${rel.memory.valence.toFixed(3)}`);
}

// ─── 4. 记忆整合 ────────────────────────────────
console.log('\n═══════════════════════════════════════');
console.log('  第四步：记忆整合');
console.log('═══════════════════════════════════════');

const consolidator = new MemoryConsolidator();
try {
  const consolidated = consolidator.consolidateAll(graph);
  for (const c of consolidated) {
    console.log(`\n  关系 ${c.relationshipId}:`);
    for (const p of (c.patterns || [])) {
      console.log(`    模式: "${p.type}" (freq: ${(p.frequency * 100).toFixed(0)}%)`);
    }
    for (const m of (c.keyMoments || [])) {
      console.log(`    关键时刻: "${m.type}" (impact: ${m.impact.toFixed(2)})`);
    }
  }
} catch {
  for (const rel of graph.getAllRelationships()) {
    console.log(`  ${rel.from} → ${rel.to}: ${rel.memory.shortTerm.length} events`);
  }
}

// ─── 5. 影响力 & 聚类分析 ───────────────────────
console.log('\n═══════════════════════════════════════');
console.log('  第五步：势力分析');
console.log('═══════════════════════════════════════');

console.log('\n  影响力:');
const influence = computeInfluence(graph);
for (const item of influence) {
  const bar = '█'.repeat(Math.round(item.score * 20));
  console.log(`    ${item.agentId.padEnd(16)} ${item.score.toFixed(3)} ${bar}`);
}

console.log('\n  聚类:');
const clusterResult = detectClusters(graph);
for (const cluster of clusterResult.clusters) {
  console.log(`    Cluster ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n  各 Agent 最强信任连接:');
for (const agentId of graph.getAllAgentIds()) {
  const strongest = graph.getStrongestConnections(agentId, 'trust', 2);
  if (strongest.length > 0) {
    const desc = strongest.map(s => `${s.agentId}(${s.value.toFixed(2)})`).join(', ');
    console.log(`    ${agentId}: ${desc}`);
  }
}

console.log('\n═══════════════════════════════════════');
console.log('  完成');
console.log('═══════════════════════════════════════\n');
```

### 事件类型参考

| type | 含义 | 典型 impact |
|------|------|------------|
| `task.completed` | 协作完成任务 | `trust +, loyalty +` |
| `competition.won` | 竞争获胜 | `rivalry +, respect +` |
| `conflict.escalated` | 冲突升级 | `rivalry +, trust -` |
| `conflict.resolved` | 冲突化解 | `trust +/-` |
| `review.rejected` | 审核/评价否定 | `trust -, authority +` |

### 关系维度

| 维度 | 含义 | 范围 |
|------|------|------|
| `trust` | 信任度 | 0-1 |
| `rivalry` | 对抗度 | 0-1 |
| `loyalty` | 忠诚度 | 0-1 |
| `affinity` | 亲近度 | 0-1 |
| `dependence` | 依赖度 | 0-1 |
| `respect` | 尊重度 | 0-1 |
| `authority` | 权威感 | 0-1 |

---

## 第五步：提交 PR

### 目录结构

```
your-uni-name/
├── universe.yaml     # 宇宙定义
├── rel-demo.mjs      # 关系演化演示
└── README.md         # 设计意图说明
```

### 命名规范

- 目录名：kebab-case（如 `imperial-exam`），与 `universe.yaml` 里的 `name` 字段对应
- 所有 agent id：kebab-case

### 更新 registry.json

在 `registry.json` 的 `unis` 数组末尾添加一条：

```json
{
  "id": "your-uni-name",
  "name": "你的宇宙中文名",
  "nameEn": "English Name",
  "type": "competitive",
  "agentCount": 7,
  "difficulty": "intermediate",
  "tags": ["your", "tags"],
  "language": "zh"
}
```

### README.md 写什么

**要写的：**
- 一句话简介
- 为什么设计这个场景（想展示什么动态）
- 关系网络中最有趣的模式
- 3 行快速体验命令

**不要写的：**
- 角色列表（`uni inspect` 能看）
- 关系表（`uni visualize` 能看）
- YAML 内容的 Markdown 翻译

### PR 模板

```markdown
## 新增 Uni: <name>

**场景**: 一句话描述
**类型**: competitive / hierarchical / flat / hybrid
**Agent 数**: N
**难度**: beginner / intermediate / advanced

### 设计亮点
- 关系网络中有什么有趣的动态
- 想展示 agents-uni 的什么能力

### 验证
- [ ] `uni validate universe.yaml` 通过
- [ ] `node rel-demo.mjs` 可运行
- [ ] `registry.json` 已更新
```

---

## universe.yaml 设计指南

### Traits 怎么选

Traits 是 0-1 的浮点数，代表 agent 的性格特征。好的 traits 设计：
- 每个 agent 有 4-6 个 traits
- 有差异化（不是每个人都 0.8+）
- 体现角色个性（不是泛泛的 "smart: 0.9"）

### 关系模板

| 模板 | 维度特征 | 适用场景 |
|------|---------|---------|
| `ally` | 高 trust/loyalty | 盟友、搭档 |
| `rival` | 高 rivalry | 竞争对手 |
| `superior` | 高 authority/dependence | 上下级 |
| `subordinate` | 高 dependence | 下属 |
| `peer` | 中等各维度 | 平级同事 |
| `mentor` | 高 trust/respect | 师徒 |

### 协议状态机

每个 protocol 需要：
- 明确的初始状态（第一个 state）
- 至少一个终态（`terminal: true`）
- 每个状态都可达（从初始状态有路径可达）
- 关键转换标记 `requiredRole`

### 资源什么时候用

不是每个 uni 都需要 resources。只有当资源争夺是核心动态时才定义：
- `finite` — 总量固定（皇帝恩宠、晋升名额）
- `renewable` — 定期刷新（月度预算、工时）
- `positional` — 位置性资源（宫殿、办公室）
