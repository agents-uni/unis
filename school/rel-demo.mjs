/**
 * rel-demo.mjs — 高中班级多维关系引擎演示
 * 月考排名震荡、转学生站队与小团体重组
 */

import {
  RelationshipGraph,
  MemoryConsolidator,
  computeInfluence,
  detectClusters,
} from '@agents-uni/rel';

// ─── 1. 从 universe.yaml 提取关系 seeds ──────────────────────────
const seeds = [
  // 师生层级
  { from: 'teacher', to: 'class-monitor', type: 'superior', weight: 0.85 },
  { from: 'teacher', to: 'top-student', type: 'superior', weight: 0.8 },
  { from: 'teacher', to: 'sports-captain', type: 'superior', weight: 0.65 },
  { from: 'teacher', to: 'troublemaker', type: 'superior', weight: 0.5 },
  // 干部协作
  { from: 'class-monitor', to: 'sports-captain', type: 'peer', weight: 0.7 },
  { from: 'class-monitor', to: 'art-girl', type: 'peer', weight: 0.75 },
  { from: 'class-monitor', to: 'top-student', type: 'ally', weight: 0.6 },
  // 小团体
  { from: 'sports-captain', to: 'troublemaker', type: 'ally', weight: 0.7 },
  { from: 'art-girl', to: 'top-student', type: 'peer', weight: 0.5 },
  { from: 'top-student', to: 'troublemaker', type: 'rival', weight: 0.5 },
  // 转学生
  { from: 'transfer', to: 'class-monitor', type: 'peer', weight: 0.3 },
  { from: 'transfer', to: 'art-girl', type: 'peer', weight: 0.4 },
  // 隐性张力
  { from: 'troublemaker', to: 'teacher', type: 'rival', weight: 0.6 },
  { from: 'sports-captain', to: 'top-student', type: 'rival', weight: 0.4 },
];

const graph = new RelationshipGraph(seeds);

console.log('═══════════════════════════════════════════════════');
console.log('  第一步：初始班级关系图');
console.log('═══════════════════════════════════════════════════');
console.log(`关系总数: ${graph.size}\n`);

for (const rel of graph.getAllRelationships()) {
  console.log(`  ${rel.from} → ${rel.to} (origin: ${rel.origin})`);
  for (const dim of rel.dimensions) {
    console.log(`    ${dim.type}: ${dim.value.toFixed(2)}`);
  }
}

// ─── 2. 月考风波 ────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第二步：月考风波（关系演化）');
console.log('═══════════════════════════════════════════════════');

const examEvents = [
  {
    from: 'top-student', to: 'teacher',
    description: '林学霸月考第一，获得老师公开表扬',
    event: { type: 'competition.won', impact: { trust: 0.06, respect: 0.08 } },
  },
  {
    from: 'sports-captain', to: 'top-student',
    description: '体委成绩垫底被老师点名批评，对学霸更加不满',
    event: { type: 'conflict.escalated', impact: { rivalry: 0.10, trust: -0.05 } },
  },
  {
    from: 'transfer', to: 'top-student',
    description: '转学生数学考了全班第二，引起学霸警觉',
    event: { type: 'competition.won', impact: { rivalry: 0.08, respect: 0.06 } },
  },
  {
    from: 'troublemaker', to: 'teacher',
    description: '王叛逆考试作弊被抓，和老师爆发冲突',
    event: { type: 'conflict.escalated', impact: { trust: -0.12, rivalry: 0.10 } },
  },
  {
    from: 'class-monitor', to: 'troublemaker',
    description: '班长帮叛逆向老师求情，避免了处分',
    event: { type: 'conflict.resolved', impact: { trust: 0.10, affinity: 0.08 } },
  },
];

for (const scenario of examEvents) {
  const rel = graph.applyEventBetween(scenario.from, scenario.to, scenario.event);
  console.log(`\n  事件: ${scenario.description}`);
  console.log(`    ${scenario.from} → ${scenario.to} | ${scenario.event.type}`);
  for (const dim of rel.dimensions) {
    console.log(`      ${dim.type}: ${dim.value.toFixed(3)}`);
  }
}

// ─── 3. 转学生站队 ─────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第三步：转学生站队（关系演化续）');
console.log('═══════════════════════════════════════════════════');

const transferEvents = [
  {
    from: 'transfer', to: 'art-girl',
    description: '转学生主动帮文艺委员设计班级板报，建立友谊',
    event: { type: 'task.completed', impact: { trust: 0.10, affinity: 0.12 } },
  },
  {
    from: 'transfer', to: 'sports-captain',
    description: '转学生加入篮球队，和体委成为球友',
    event: { type: 'task.completed', impact: { trust: 0.08, affinity: 0.10 } },
  },
  {
    from: 'art-girl', to: 'class-monitor',
    description: '文艺汇演筹备中文艺委员和班长配合默契',
    event: { type: 'task.completed', impact: { trust: 0.06, loyalty: 0.08 } },
  },
  {
    from: 'top-student', to: 'transfer',
    description: '学霸发现转学生学习方法独特，主动请教交流',
    event: { type: 'conflict.resolved', impact: { trust: 0.08, rivalry: -0.06 } },
  },
  {
    from: 'troublemaker', to: 'transfer',
    description: '叛逆试探转学生底线，发现对方不卑不亢',
    event: { type: 'task.completed', impact: { trust: 0.06, respect: 0.08 } },
  },
];

for (const scenario of transferEvents) {
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

// ─── 6. 班级势力分析 ────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════');
console.log('  第六步：班级势力分析');
console.log('═══════════════════════════════════════════════════');

console.log('\n  影响力排名:');
const influence = computeInfluence(graph);
for (const item of influence) {
  const bar = '█'.repeat(Math.round(item.score * 20));
  console.log(`    ${item.agentId.padEnd(16)} ${item.score.toFixed(3)} ${bar}`);
}

console.log('\n  小团体聚类:');
const clusterResult = detectClusters(graph);
for (const cluster of clusterResult.clusters) {
  console.log(`    Group ${cluster.id}: [${cluster.members.join(', ')}] (cohesion: ${cluster.cohesion.toFixed(2)})`);
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  完成 — 高中班级多维关系演示结束');
console.log('═══════════════════════════════════════════════════\n');
