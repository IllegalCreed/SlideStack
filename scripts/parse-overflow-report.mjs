#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const log = readFileSync('/tmp/slidev-overflow-final.log', 'utf-8');
const lines = log.split('\n').filter(l => l.startsWith('⚠'));

const packages = {};
for (const line of lines) {
  const nameMatch = line.match(/⚠️  ([\w-]+)\s+\(/);
  if (!nameMatch) continue;
  const name = nameMatch[1];
  const fracMatch = line.match(/(\d+)\/(\d+) 页溢出/);
  const overflowPages = [...line.matchAll(/#(\d+) \(\+(\d+)px\)/g)]
    .map(m => ({ no: parseInt(m[1]), over: parseInt(m[2]) }))
    .filter(p => p.over > 0); // ignore 0px (mismatch errors)
  if (overflowPages.length === 0) continue;
  packages[name] = {
    total: fracMatch ? parseInt(fracMatch[2]) : null,
    overflowCount: overflowPages.length,
    maxOver: Math.max(...overflowPages.map(p => p.over)),
    pages: overflowPages,
  };
}

const sorted = Object.entries(packages).sort((a, b) => b[1].maxOver - a[1].maxOver);
writeFileSync('/tmp/slidev-overflow-final.json', JSON.stringify(packages, null, 2));

console.log(`总共 ${Object.keys(packages).length} 个包有真实溢出`);
console.log(`总溢出页数 (over > 0): ${Object.values(packages).reduce((s, p) => s + p.overflowCount, 0)}`);
console.log('\nTop 15 (按最大溢出排序):');
for (const [name, info] of sorted.slice(0, 15)) {
  console.log(`  ${name.padEnd(28)} ${info.overflowCount}/${info.total} 页 / 最大 +${info.maxOver}px`);
}
