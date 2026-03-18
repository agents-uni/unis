/**
 * rel-demo.mjs — 三国演义多维关系引擎演示
 * 魏蜀吴三方势力的合纵连横与关系演化
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 提取关系 seeds ──────────────────────────
const seeds = [
  // 蜀汉内部
  { from: 'liubei', to: 'zhuge', type: 'superior', weight: 0.95 },
  { from: 'liubei', to: 'guanyu', type: 'ally', weight: 0.98 },
  { from: 'liubei', to: 'zhangfei', type: 'ally', weight: 0.95 },
  { from: 'guanyu', to: 'zhangfei', type: 'ally', weight: 0.9 },
  // 魏国内部
  { from: 'caocao', to: 'simayi', type: 'superior', weight: 0.6 },
  // 吴国内部
  { from: 'sunquan', to: 'zhouyu', type: 'superior', weight: 0.85 },
  // 跨阵营
  { from: 'liubei', to: 'sunquan', type: 'ally', weight: 0.6 },
  { from: 'liubei', to: 'caocao', type: 'rival', weight: 0.85 },
  { from: 'sunquan', to: 'caocao', type: 'rival', weight: 0.7 },
  { from: 'zhuge', to: 'zhouyu', type: 'rival', weight: 0.65 },
  { from: 'zhuge', to: 'simayi', type: 'rival', weight: 0.8 },
  { from: 'guanyu', to: 'sunquan', type: 'rival', weight: 0.5 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：初始三国关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 赤壁之战事件序列 ────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：赤壁之战（关系演化）');
console.log('═══════════════════════════════════════════════════');

const chibiEvents = [
  {
    from: 'zhuge', to: 'sunquan',
    description: '诸葛亮舌战群儒，说服孙权联刘抗曹',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'zhuge', to: 'zhouyu',
    description: '诸葛亮草船借箭，令周瑜自叹不如',
    event: { type: 'competition.won', impact: { rivalry: 0.12, respect: 0.10 } },
  },
  {
    from: 'zhouyu', to: 'caocao',
    description: '周瑜设连环计，黄盖苦肉计迷惑曹操',
    event: { type: 'competition.won', impact: { rivalry: 0.15, trust: -0.10 } },
  },
  {
    from: 'caocao', to: 'simayi',
    description: '曹操兵败赤壁，司马懿趁乱积累政治资本',
    event: { type: 'task.completed', impact: { trust: -0.05, dependence: 0.08 } },
  },
  {
    from: 'guanyu', to: 'caocao',
    description: '关羽华容道义释曹操，以报旧恩',
    event: { type: 'conflict.resolved', impact: { trust: 0.10, loyalty: 0.05 } },
  },
  {
    from: 'liubei', to: 'sunquan',
    description: '赤壁大胜，刘备借荆州扩大势力',
    event: { type: 'task.completed', impact: { trust: -0.05, rivalry: 0.06 } },
  },
  {
    from: 'zhouyu', to: 'zhuge',
    description: '周瑜三气而亡，临终叹"既生瑜何生亮"',
    event: { type: 'conflict.escalated', impact: { rivalry: 0.20, respect: 0.15 } },
  },
];

for (const scenario of chibiEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 北伐事件序列 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：北伐（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const northernEvents = [
  {
    from: 'zhuge', to: 'liubei',
    description: '诸葛亮出师表明志，承刘备遗志北伐中原',
    event: { type: 'task.completed', impact: { loyalty: 0.10, trust: 0.08 } },
  },
  {
    from: 'zhuge', to: 'simayi',
    description: '诸葛亮空城计退司马懿大军',
    event: { type: 'competition.won', impact: { rivalry: 0.12, respect: 0.10 } },
  },
  {
    from: 'simayi', to: 'zhuge',
    description: '司马懿坚守不出，以逸待劳消耗蜀军',
    event: { type: 'conflict.resolved', impact: { rivalry: 0.08, trust: -0.05 } },
  },
  {
    from: 'simayi', to: 'caocao',
    description: '司马懿成功抵御蜀军，在魏国威望日隆',
    event: { type: 'task.completed', impact: { trust: -0.08, dependence: 0.10 } },
  },
  {
    from: 'zhuge', to: 'guanyu',
    description: '诸葛亮星落五丈原，蜀汉北伐梦碎',
    event: { type: 'conflict.resolved', impact: { loyalty: 0.15, trust: 0.10 } },
  },
];

for (const scenario of northernEvents) {
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

// ─── 6. 天下势力分析 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：天下势力分析');
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

console.log('\n  各英雄最强信任连接:');
for (const agentId of graph.getAllAgentIds()) {
  const strongest = graph.getStrongestConnections(agentId, 'trust', 2);
  if (strongest.length > 0) {
    const desc = strongest.map(s => `${s.agentId}(${s.value.toFixed(2)})`).join(', ');
    console.log(`    ${agentId}: ${desc}`);
  }
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 三国演义多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
