/**
 * rel-demo.mjs — 互联网大厂多维关系引擎演示
 * 绩效季与组织架构调整中的关系演化
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
  { from: 'vp', to: 'director', type: 'superior', weight: 0.85 },
  { from: 'director', to: 'p9-arch', type: 'superior', weight: 0.7 },
  { from: 'director', to: 'p7-fe', type: 'superior', weight: 0.8 },
  { from: 'director', to: 'p7-be', type: 'superior', weight: 0.8 },
  { from: 'p7-fe', to: 'p6-new', type: 'mentor', weight: 0.7 },
  // 平级竞争
  { from: 'p7-fe', to: 'p7-be', type: 'rival', weight: 0.6 },
  { from: 'p9-arch', to: 'director', type: 'rival', weight: 0.4 },
  // HR 关系
  { from: 'hrbp', to: 'vp', type: 'peer', weight: 0.7 },
  { from: 'hrbp', to: 'director', type: 'peer', weight: 0.65 },
  { from: 'hrbp', to: 'p6-new', type: 'ally', weight: 0.5 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：初始组织关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 绩效季事件 ──────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：绩效季（关系演化）');
console.log('═══════════════════════════════════════════════════');

const perfEvents = [
  {
    from: 'vp', to: 'director',
    description: 'VP 下达本季 OKR，要求业务增长 30%，技术总监承压传导',
    event: { type: 'task.completed', impact: { trust: -0.03, dependence: 0.08 } },
  },
  {
    from: 'p7-be', to: 'director',
    description: 'P7 后端完成核心系统重构，性能提升 50%，绩效有力支撑',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'p7-fe', to: 'p7-be',
    description: 'P7 前端的用户增长项目数据更亮眼，晋升竞争中占据优势',
    event: { type: 'competition.won', impact: { rivalry: 0.12, respect: 0.05 } },
  },
  {
    from: 'director', to: 'p6-new',
    description: '总监在校准会上给 P6 新人打了 3.25（低绩效预警）',
    event: { type: 'review.rejected', impact: { trust: -0.10, authority: 0.05 } },
  },
  {
    from: 'hrbp', to: 'p6-new',
    description: 'HRBP 与 P6 新人进行绩效面谈，帮助制定改进计划',
    event: { type: 'task.completed', impact: { trust: 0.10, affinity: 0.08 } },
  },
  {
    from: 'p9-arch', to: 'vp',
    description: 'P9 架构师的跨 BU 技术方案被采纳，影响力上升',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.10 } },
  },
];

for (const scenario of perfEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 组织架构调整事件 ────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：组织架构调整（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const reorgEvents = [
  {
    from: 'vp', to: 'director',
    description: 'VP 宣布两个 BU 合并，总监的团队面临缩编压力',
    event: { type: 'conflict.escalated', impact: { trust: -0.08, authority: 0.10 } },
  },
  {
    from: 'director', to: 'p7-fe',
    description: '总监被迫选择裁减一个 P7，前端和后端都在争取留下',
    event: { type: 'conflict.escalated', impact: { trust: -0.06, rivalry: 0.08 } },
  },
  {
    from: 'hrbp', to: 'director',
    description: 'HRBP 提供裁员方案和法律合规建议，协助执行',
    event: { type: 'task.completed', impact: { trust: 0.06, dependence: 0.08 } },
  },
  {
    from: 'p9-arch', to: 'director',
    description: 'P9 架构师趁组织调整竞争总监位置，技术路线 vs 管理路线',
    event: { type: 'competition.won', impact: { rivalry: 0.15, trust: -0.10 } },
  },
  {
    from: 'p6-new', to: 'hrbp',
    description: 'P6 新人申请内部转岗到新 BU，HRBP 协助办理',
    event: { type: 'task.completed', impact: { trust: 0.08, affinity: 0.06 } },
  },
];

for (const scenario of reorgEvents) {
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

// ─── 6. 组织势力分析 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：组织势力分析');
console.log('═══════════════════════════════════════════════════');

console.log('\n  影响力排名:');
const influence = computeInfluence(graph);
for (const item of influence) {
  const bar = '█'.repeat(Math.round(item.score * 20));
  console.log(`    ${item.agentId.padEnd(16)} ${item.score.toFixed(3)} ${bar}`);
}

console.log('\n  派系聚类:');
const clusterResult = detectClusters(graph);
for (const cluster of clusterResult.clusters) {
  console.log(`    派系 ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n  各成员最强信任连接:');
for (const agentId of graph.getAllAgentIds()) {
  const strongest = graph.getStrongestConnections(agentId, 'trust', 2);
  if (strongest.length > 0) {
    const desc = strongest.map(s => `${s.agentId}(${s.value.toFixed(2)})`).join(', ');
    console.log(`    ${agentId}: ${desc}`);
  }
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 互联网大厂多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
