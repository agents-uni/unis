/**
 * rel-demo.mjs — 法庭辩论多维关系引擎演示
 * 控辩双方的证据攻防与关系演化
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 提取关系 seeds ──────────────────────────
const seeds = [
  // 对抗关系
  { from: 'prosecutor', to: 'defense', type: 'rival', weight: 0.85 },
  { from: 'prosecutor', to: 'witness-b', type: 'rival', weight: 0.5 },
  // 权威关系
  { from: 'judge', to: 'prosecutor', type: 'superior', weight: 0.9 },
  { from: 'judge', to: 'defense', type: 'superior', weight: 0.9 },
  { from: 'judge', to: 'jury-leader', type: 'superior', weight: 0.7 },
  // 协作关系
  { from: 'prosecutor', to: 'witness-a', type: 'ally', weight: 0.7 },
  { from: 'defense', to: 'witness-b', type: 'ally', weight: 0.65 },
  { from: 'prosecutor', to: 'expert', type: 'ally', weight: 0.6 },
  // 信息关系
  { from: 'expert', to: 'judge', type: 'subordinate', weight: 0.5 },
  { from: 'jury-leader', to: 'judge', type: 'subordinate', weight: 0.6 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：初始法庭关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 交叉询问事件 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：交叉询问（关系演化）');
console.log('═══════════════════════════════════════════════════');

const crossExamEvents = [
  {
    from: 'prosecutor', to: 'witness-a',
    description: '检察官引导控方证人完成直接询问，证词对被告不利',
    event: { type: 'task.completed', impact: { trust: 0.08, loyalty: 0.05 } },
  },
  {
    from: 'defense', to: 'witness-a',
    description: '辩护律师通过交叉询问发现证人证词前后矛盾',
    event: { type: 'competition.won', impact: { trust: -0.12, respect: 0.06 } },
  },
  {
    from: 'expert', to: 'judge',
    description: '法医鉴定专家出具报告，关键物证时间线存疑',
    event: { type: 'task.completed', impact: { trust: 0.10, authority: 0.05 } },
  },
  {
    from: 'defense', to: 'witness-b',
    description: '辩方证人提供新的不在场证明，动摇控方论证体系',
    event: { type: 'task.completed', impact: { trust: 0.08, loyalty: 0.06 } },
  },
  {
    from: 'prosecutor', to: 'defense',
    description: '检察官质疑辩方证据合法性，双方就程序问题激烈争执',
    event: { type: 'conflict.escalated', impact: { rivalry: 0.10, trust: -0.06 } },
  },
  {
    from: 'judge', to: 'jury-leader',
    description: '法官指导陪审团关注证据链的完整性而非单一证词',
    event: { type: 'task.completed', impact: { trust: 0.06, authority: 0.08 } },
  },
];

for (const scenario of crossExamEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 结辩事件 ────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：结辩（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const closingEvents = [
  {
    from: 'prosecutor', to: 'jury-leader',
    description: '检察官情理兼备地总结控方立场，强调证据链',
    event: { type: 'task.completed', impact: { trust: 0.06, respect: 0.08 } },
  },
  {
    from: 'defense', to: 'jury-leader',
    description: '辩护律师以"合理怀疑"为核心完成结辩陈词',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.10 } },
  },
  {
    from: 'jury-leader', to: 'judge',
    description: '陪审团经过激烈讨论后达成多数意见',
    event: { type: 'task.completed', impact: { trust: 0.06, loyalty: 0.05 } },
  },
  {
    from: 'judge', to: 'prosecutor',
    description: '法官宣布裁决结果，案件尘埃落定',
    event: { type: 'conflict.resolved', impact: { authority: 0.10, trust: 0.05 } },
  },
];

for (const scenario of closingEvents) {
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

// ─── 6. 法庭势力分析 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：法庭势力分析');
console.log('═══════════════════════════════════════════════════');

console.log('\n  影响力排名:');
const influence = computeInfluence(graph);
for (const item of influence) {
  const bar = '█'.repeat(Math.round(item.score * 20));
  console.log(`    ${item.agentId.padEnd(16)} ${item.score.toFixed(3)} ${bar}`);
}

console.log('\n  阵营聚类:');
const clusterResult = detectClusters(graph);
for (const cluster of clusterResult.clusters) {
  console.log(`    阵营 ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 法庭辩论多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
