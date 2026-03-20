/**
 * rel-demo.mjs — 悬疑推理社多维关系引擎演示
 * 信息碎片争夺、推理路线之争与新人信任危机
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 提取关系 seeds ──────────────────────────
const seeds = [
  // 社团层级
  { from: 'president', to: 'genius', type: 'peer', weight: 0.7 },
  { from: 'president', to: 'profiler', type: 'superior', weight: 0.7 },
  { from: 'president', to: 'techie', type: 'superior', weight: 0.75 },
  { from: 'president', to: 'archivist', type: 'superior', weight: 0.7 },
  // 推理竞争
  { from: 'genius', to: 'profiler', type: 'rival', weight: 0.6 },
  { from: 'genius', to: 'president', type: 'rival', weight: 0.5 },
  // 信息依赖
  { from: 'techie', to: 'archivist', type: 'ally', weight: 0.75 },
  { from: 'profiler', to: 'witness', type: 'advisor', weight: 0.6 },
  { from: 'genius', to: 'techie', type: 'ally', weight: 0.65 },
  // 新人的不确定性
  { from: 'newcomer', to: 'president', type: 'peer', weight: 0.3 },
  { from: 'newcomer', to: 'genius', type: 'rival', weight: 0.35 },
  { from: 'newcomer', to: 'witness', type: 'peer', weight: 0.4 },
  // 目击者孤立
  { from: 'witness', to: 'president', type: 'subordinate', weight: 0.4 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：推理社初始关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 密室案线索争夺 ──────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：密室案线索争夺（关系演化）');
console.log('═══════════════════════════════════════════════════');

const clueEvents = [
  {
    from: 'techie', to: 'president',
    description: '技术宅从监控录像中发现关键时间线矛盾',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'genius', to: 'profiler',
    description: '天才侦探否定心理画像方向，坚持物证优先',
    event: { type: 'conflict.escalated', impact: { trust: -0.06, rivalry: 0.10 } },
  },
  {
    from: 'profiler', to: 'witness',
    description: '心理分析师通过微表情发现目击者在隐瞒关键信息',
    event: { type: 'task.completed', impact: { trust: -0.08, dependence: 0.10 } },
  },
  {
    from: 'archivist', to: 'genius',
    description: '资料员翻出十年前类似案件档案，逻辑链出现新方向',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.10 } },
  },
  {
    from: 'newcomer', to: 'president',
    description: '新人提出一个大胆假设，社长犹豫是否采纳',
    event: { type: 'task.completed', impact: { trust: 0.04, respect: 0.06 } },
  },
];

for (const scenario of clueEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 真相逼近 — 信任危机 ─────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：真相逼近 — 信任危机（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const crisisEvents = [
  {
    from: 'newcomer', to: 'witness',
    description: '新人私下接触目击者，被其他成员发现引发怀疑',
    event: { type: 'conflict.escalated', impact: { trust: -0.10, rivalry: 0.08 } },
  },
  {
    from: 'genius', to: 'newcomer',
    description: '天才侦探当众质疑新人的动机和身份',
    event: { type: 'conflict.escalated', impact: { trust: -0.08, rivalry: 0.12 } },
  },
  {
    from: 'profiler', to: 'newcomer',
    description: '心理分析师为新人辩护：行为模式不符合嫌疑人画像',
    event: { type: 'conflict.resolved', impact: { trust: 0.08, affinity: 0.06 } },
  },
  {
    from: 'newcomer', to: 'genius',
    description: '新人拿出关键证据自证清白，并指出真正的逻辑漏洞',
    event: { type: 'task.completed', impact: { trust: 0.12, respect: 0.10 } },
  },
  {
    from: 'genius', to: 'profiler',
    description: '天才侦探承认心理画像提供了关键洞察，两派合流',
    event: { type: 'conflict.resolved', impact: { trust: 0.08, rivalry: -0.08 } },
  },
  {
    from: 'president', to: 'genius',
    description: '社长综合所有线索发表最终推理，案件告破',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.06 } },
  },
];

for (const scenario of crisisEvents) {
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

// ─── 6. 推理社势力分析 ──────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：推理社势力分析');
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
  console.log(`    Group ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 悬疑推理社多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
