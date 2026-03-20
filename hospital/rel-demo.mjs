/**
 * rel-demo.mjs — 医院急诊科多维关系引擎演示
 * 黄金一小时内跨专业协作与内外科路线之争
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 提取关系 seeds ──────────────────────────
const seeds = [
  // 急诊科内协作（扁平为主）
  { from: 'er-chief', to: 'surgeon', type: 'peer', weight: 0.8 },
  { from: 'er-chief', to: 'internist', type: 'peer', weight: 0.8 },
  { from: 'er-chief', to: 'head-nurse', type: 'superior', weight: 0.75 },
  { from: 'surgeon', to: 'anesthetist', type: 'peer', weight: 0.85 },
  { from: 'surgeon', to: 'internist', type: 'peer', weight: 0.65 },
  { from: 'er-chief', to: 'radiologist', type: 'peer', weight: 0.6 },
  // 护理网络
  { from: 'head-nurse', to: 'patient-family', type: 'advisor', weight: 0.7 },
  { from: 'head-nurse', to: 'surgeon', type: 'subordinate', weight: 0.65 },
  // 诊断链
  { from: 'radiologist', to: 'surgeon', type: 'advisor', weight: 0.7 },
  { from: 'radiologist', to: 'internist', type: 'advisor', weight: 0.7 },
  { from: 'internist', to: 'surgeon', type: 'rival', weight: 0.4 },
  // 家属关系
  { from: 'er-chief', to: 'patient-family', type: 'advisor', weight: 0.5 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：急诊科初始关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 重大车祸急救 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：重大车祸急救（关系演化）');
console.log('═══════════════════════════════════════════════════');

const traumaEvents = [
  {
    from: 'er-chief', to: 'surgeon',
    description: '急诊主任判断需紧急手术，外科医生立即响应',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.06 } },
  },
  {
    from: 'internist', to: 'surgeon',
    description: '内科建议先稳定内出血再手术，外科认为应立即开腹',
    event: { type: 'conflict.escalated', impact: { trust: -0.06, rivalry: 0.12 } },
  },
  {
    from: 'radiologist', to: 'er-chief',
    description: '影像科紧急CT报告显示脾破裂，支持手术方案',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'anesthetist', to: 'surgeon',
    description: '麻醉师评估患者心功能，给出麻醉可行性绿灯',
    event: { type: 'task.completed', impact: { trust: 0.08, loyalty: 0.06 } },
  },
  {
    from: 'head-nurse', to: 'patient-family',
    description: '护士长安抚情绪崩溃的家属，获得手术知情同意',
    event: { type: 'task.completed', impact: { trust: 0.12, affinity: 0.10 } },
  },
  {
    from: 'internist', to: 'er-chief',
    description: '内科医生接受手术方案，转为负责术后内科管理',
    event: { type: 'conflict.resolved', impact: { trust: 0.06, respect: 0.08 } },
  },
];

for (const scenario of traumaEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 术后并发症危机 ──────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：术后并发症危机（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const complicationEvents = [
  {
    from: 'surgeon', to: 'internist',
    description: '术后患者出现感染性休克，外科请内科紧急会诊',
    event: { type: 'task.completed', impact: { trust: 0.08, respect: 0.10 } },
  },
  {
    from: 'head-nurse', to: 'er-chief',
    description: '护士长第一时间发现生命体征异常，挽救了宝贵时间',
    event: { type: 'task.completed', impact: { trust: 0.10, respect: 0.08 } },
  },
  {
    from: 'patient-family', to: 'er-chief',
    description: '家属质疑手术决策，情绪激动差点引发医闹',
    event: { type: 'conflict.escalated', impact: { trust: -0.10, rivalry: 0.08 } },
  },
  {
    from: 'er-chief', to: 'patient-family',
    description: '主任耐心解释病情和治疗方案，家属逐渐理解',
    event: { type: 'conflict.resolved', impact: { trust: 0.08, affinity: 0.06 } },
  },
  {
    from: 'internist', to: 'surgeon',
    description: '内科的抗感染方案奏效，患者脱离危险',
    event: { type: 'task.completed', impact: { trust: 0.10, rivalry: -0.08 } },
  },
];

for (const scenario of complicationEvents) {
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

// ─── 6. 科室势力分析 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：科室势力分析');
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
console.log('  完成 — 医院急诊科多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
