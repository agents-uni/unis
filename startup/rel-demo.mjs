/**
 * rel-demo.mjs — 创业公司多维关系引擎演示
 * 团队在融资压力、技术选型和产品交付中的关系演化
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 提取关系 seeds ──────────────────────────
const seeds = [
  // 层级关系
  { from: 'ceo', to: 'cto', type: 'superior', weight: 0.85 },
  { from: 'ceo', to: 'pm', type: 'superior', weight: 0.8 },
  { from: 'cto', to: 'fe-lead', type: 'superior', weight: 0.8 },
  { from: 'cto', to: 'be-lead', type: 'superior', weight: 0.85 },
  { from: 'pm', to: 'designer', type: 'superior', weight: 0.75 },
  // 平级协作 & 竞争
  { from: 'fe-lead', to: 'be-lead', type: 'peer', weight: 0.7 },
  { from: 'pm', to: 'cto', type: 'peer', weight: 0.6 },
  { from: 'fe-lead', to: 'designer', type: 'ally', weight: 0.8 },
  // 外部关系
  { from: 'investor', to: 'ceo', type: 'superior', weight: 0.7 },
  { from: 'investor', to: 'cto', type: 'peer', weight: 0.5 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：初始团队关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 业务转型危机 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：业务转型危机（关系演化）');
console.log('═══════════════════════════════════════════════════');

const pivotEvents = [
  {
    from: 'investor', to: 'ceo',
    description: '投资人对当前产品数据不满，施压要求业务转型',
    event: { type: 'review.rejected', impact: { trust: -0.08, dependence: 0.10 } },
  },
  {
    from: 'ceo', to: 'cto',
    description: 'CEO 要求快速转型，CTO 认为技术债务需先解决',
    event: { type: 'conflict.escalated', impact: { trust: -0.06, rivalry: 0.08 } },
  },
  {
    from: 'fe-lead', to: 'be-lead',
    description: '技术栈之争：前端要换 React→Vue，后端坚持现有架构',
    event: { type: 'conflict.escalated', impact: { trust: -0.05, rivalry: 0.10 } },
  },
  {
    from: 'pm', to: 'ceo',
    description: '产品经理通过用户调研数据说服 CEO 渐进式转型',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'designer', to: 'pm',
    description: '设计师快速产出新方向的原型，获得团队认可',
    event: { type: 'task.completed', impact: { trust: 0.08, affinity: 0.06 } },
  },
  {
    from: 'cto', to: 'ceo',
    description: 'CTO 提出渐进式重构方案，CEO 接受折中方案',
    event: { type: 'conflict.resolved', impact: { trust: 0.06, respect: 0.08 } },
  },
];

for (const scenario of pivotEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 产品上线 ────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：产品上线（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const launchEvents = [
  {
    from: 'ceo', to: 'pm',
    description: 'CEO 定下两周后上线的 deadline，PM 分解任务排期',
    event: { type: 'task.completed', impact: { trust: 0.05, dependence: 0.06 } },
  },
  {
    from: 'fe-lead', to: 'designer',
    description: '前端和设计师就动效方案达成一致，保质保量',
    event: { type: 'conflict.resolved', impact: { trust: 0.08, affinity: 0.06 } },
  },
  {
    from: 'be-lead', to: 'cto',
    description: '后端完成核心 API 开发，CTO code review 通过',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.06 } },
  },
  {
    from: 'pm', to: 'investor',
    description: '产品经理向投资人演示 demo，获得正面反馈',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'ceo', to: 'investor',
    description: '产品成功上线，用户数据超预期，投资人追加投资',
    event: { type: 'task.completed', impact: { trust: 0.12, loyalty: 0.08 } },
  },
];

for (const scenario of launchEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 4. 演化后状态 ──────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第四步：演化后关系状态');
console.log('═══════════════════════════════════════════════════');

for (const rel of graph.getAllRelationships()) {
  console.log(`\n  ${rel.from} → ${rel.to}`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(3)}`);
  }
  console.log(`    memory: ${rel.memory.shortTerm.length} events, valence: ${rel.memory.valence.toFixed(3)}`);
}

// ─── 5. 记忆整合 ────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第五步：记忆整合');
console.log('═══════════════════════════════════════════════════');

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

// ─── 6. 团队势力分析 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：团队势力分析');
console.log('═══════════════════════════════════════════════════');

console.log('\n  影响力排名:');
const influence = computeInfluence(graph);
for (const item of influence) {
  const bar = '█'.repeat(Math.round(item.score * 20));
  console.log(`    ${item.agentId.padEnd(16)} ${item.score.toFixed(3)} ${bar}`);
}

console.log('\n  团队聚类:');
const clusterResult = detectClusters(graph);
for (const cluster of clusterResult.clusters) {
  console.log(`    Group ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 创业公司多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
