/**
 * rel-demo.mjs — 甄嬛传后宫多维关系引擎演示
 * Demonstrates @agents-uni/rel's multi-dimensional relationship engine
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
  resolveTemplate,
} from '@agents-uni/rel';

// ─── 1. Build graph from universe.yaml relationship seeds ──────────
const seeds = [
  { from: 'zhenhuan', to: 'shenmeizhuang', type: 'ally', weight: 0.95 },
  { from: 'zhenhuan', to: 'anlingrong', type: 'ally', weight: 0.7 },
  { from: 'zhenhuan', to: 'huafei', type: 'rival', weight: 0.8 },
  { from: 'empress', to: 'zhenhuan', type: 'rival', weight: 0.6 },
  { from: 'anlingrong', to: 'empress', type: 'subordinate', weight: 0.7 },
  { from: 'huafei', to: 'empress', type: 'rival', weight: 0.75 },
  { from: 'duanjunwang', to: 'zhenhuan', type: 'ally', weight: 0.6 },
  { from: 'qiguifei', to: 'empress', type: 'subordinate', weight: 0.5 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：初始后宫关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)} (conf: ${dim.confidence.toFixed(2)}, vol: ${dim.volatility.toFixed(2)})`);
  }
}

// ─── 2. Show built-in template dimensions ──────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：内置关系模板维度');
console.log('═══════════════════════════════════════════════════');

for (const tplName of ['ally', 'rival', 'subordinate', 'peer', 'mentor', 'superior']) {
  const tpl = resolveTemplate(tplName);
  if (tpl) {
    console.log(`\n  模板: ${tplName}`);
    for (const dim of tpl.dimensions) {
      console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
    }
  }
}

// ─── 3. Process events → evolve relationships ─────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：宫斗事件处理（关系演化）');
console.log('═══════════════════════════════════════════════════');

const events = [
  {
    from: 'zhenhuan', to: 'shenmeizhuang',
    description: '甄嬛在华妃刁难时得到沈眉庄暗中相助',
    event: { type: 'task.completed', impact: { trust: 0.08, loyalty: 0.06 } },
  },
  {
    from: 'zhenhuan', to: 'huafei',
    description: '甄嬛在赛马竞技中击败华妃夺得头名',
    event: { type: 'competition.won', impact: { rivalry: 0.10, respect: 0.05 } },
  },
  {
    from: 'anlingrong', to: 'empress',
    description: '安陵容向皇后密报甄嬛动向以换取庇护',
    event: { type: 'task.completed', impact: { trust: 0.07, dependence: 0.10 } },
  },
  {
    from: 'empress', to: 'zhenhuan',
    description: '皇后暗中阻挠甄嬛晋升被甄嬛化解',
    event: { type: 'conflict.resolved', impact: { rivalry: 0.08, trust: -0.05 } },
  },
  {
    from: 'duanjunwang', to: 'zhenhuan',
    description: '端妃暗中传递消息帮甄嬛避过皇后算计',
    event: { type: 'task.completed', impact: { trust: 0.10, affinity: 0.08 } },
  },
  {
    from: 'zhenhuan', to: 'anlingrong',
    description: '甄嬛发现安陵容态度微妙变化心生警觉',
    event: { type: 'review.rejected', impact: { trust: -0.08, loyalty: -0.05 } },
  },
  {
    from: 'huafei', to: 'empress',
    description: '华妃公然挑战皇后权威，两败俱伤',
    event: { type: 'conflict.escalated', impact: { rivalry: 0.12, trust: -0.10 } },
  },
];

for (const scenario of events) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  console.log(`    Impact: ${JSON.stringify(scenario.event.impact)}`);
  console.log(`    演化后维度:`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)} (conf: ${dim.confidence.toFixed(2)})`);
  }
}

// ─── 4. Post-evolution state ──────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第四步：演化后关系状态');
console.log('═══════════════════════════════════════════════════');

for (const rel of graph.getAllRelationships()) {
  console.log(`\n  ${rel.from} → ${rel.to} [${rel.tags?.join(', ') || 'no tags'}]`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(3)} (conf: ${dim.confidence.toFixed(2)})`);
  }
  console.log(`    memory: ${rel.memory.shortTerm.length} events, valence: ${rel.memory.valence.toFixed(3)}`);
}

// ─── 5. Memory consolidation ─────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第五步：记忆整合');
console.log('═══════════════════════════════════════════════════');

const consolidator = new MemoryConsolidator();
try {
  const consolidated = consolidator.consolidateAll(graph);
  console.log(`  整合了 ${graph.size} 条关系:`);
  for (const c of consolidated) {
    console.log(`\n  关系 ${c.relationshipId}:`);
    for (const p of (c.patterns || [])) {
      console.log(`    模式: "${p.type}" (freq: ${(p.frequency * 100).toFixed(0)}%, count: ${p.count})`);
    }
    for (const m of (c.keyMoments || [])) {
      console.log(`    关键事件: "${m.type}" (impact: ${m.impact.toFixed(2)})`);
    }
    if (!(c.patterns || []).length && !(c.keyMoments || []).length) {
      console.log('    (尚未检测到模式 — 需要更多事件)');
    }
  }
} catch {
  for (const rel of graph.getAllRelationships()) {
    console.log(`  ${rel.from} → ${rel.to}: ${rel.memory.shortTerm.length} events, valence: ${rel.memory.valence.toFixed(3)}`);
  }
}

// ─── 6. Power analysis ───────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：后宫势力分析');
console.log('═══════════════════════════════════════════════════');

console.log('\n  影响力排名:');
const influence = computeInfluence(graph);
for (const item of influence) {
  const bar = '█'.repeat(Math.round(item.score * 20));
  console.log(`    ${item.agentId.padEnd(16)} ${item.score.toFixed(3)} ${bar}`);
}

console.log('\n  势力聚类:');
const clusterResult = detectClusters(graph);
for (const cluster of clusterResult.clusters) {
  console.log(`    势力 ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n  各嫔妃最强信任连接:');
for (const agentId of graph.getAllAgentIds()) {
  const strongest = graph.getStrongestConnections(agentId, 'trust', 2);
  if (strongest.length > 0) {
    const desc = strongest.map(s => `${s.agentId}(${s.value.toFixed(2)})`).join(', ');
    console.log(`    ${agentId}: ${desc}`);
  }
}

console.log('\n  邻接表:');
const adj = graph.toAdjacencyList();
for (const [from, edges] of Object.entries(adj)) {
  for (const edge of edges) {
    const dims = Object.entries(edge.dimensions).map(([k, v]) => `${k}:${v.toFixed(2)}`).join(', ');
    console.log(`    ${from} → ${edge.to}: {${dims}} (valence: ${edge.valence.toFixed(3)})`);
  }
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 甄嬛传后宫多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
