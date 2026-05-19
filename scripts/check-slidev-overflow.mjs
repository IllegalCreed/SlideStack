#!/usr/bin/env node
/**
 * 批量检测所有 slidev 包的页面溢出
 * 用法：node scripts/check-slidev-overflow.mjs [pkg-name ...]
 * 不传参数则测全部带 dist 的包
 */
import { chromium } from '/Users/zhangxu/illegal/quiz-monorepo/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs';
import { readdirSync, existsSync, symlinkSync, mkdirSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { spawn } from 'child_process';

const SLIDESTACK = resolve(new URL('..', import.meta.url).pathname);
const PACKAGES_DIR = join(SLIDESTACK, 'packages');
const SERVE_ROOT = '/tmp/slidev-overflow-serve';
const SERVE_PORT = 8765;

const targets = process.argv.slice(2);

function listAll() {
  return readdirSync(PACKAGES_DIR)
    .filter((n) => n.endsWith('-slide'))
    .filter((n) => existsSync(join(PACKAGES_DIR, n, 'dist', 'index.html')));
}

function ensureSymlinks(packages) {
  rmSync(SERVE_ROOT, { recursive: true, force: true });
  mkdirSync(join(SERVE_ROOT, 'SlideStack'), { recursive: true });
  for (const p of packages) {
    symlinkSync(join(PACKAGES_DIR, p, 'dist'), join(SERVE_ROOT, 'SlideStack', p));
  }
}

function startServer() {
  const child = spawn('python3', ['-m', 'http.server', String(SERVE_PORT)], {
    cwd: SERVE_ROOT,
    stdio: 'ignore',
    detached: false,
  });
  return child;
}

async function waitServerReady() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`http://localhost:${SERVE_PORT}/`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('server not ready');
}

async function checkPackage(browser, pkg) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const url = `http://localhost:${SERVE_PORT}/SlideStack/${pkg}/index.html#/1?clicks=999`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // 等 slidev 渲染
    await page.waitForFunction(() => document.querySelector('.slidev-page')?.getBoundingClientRect().width > 0, { timeout: 15000 });
    // 取总页数
    const total = await page.evaluate(() => {
      const txt = document.querySelector('nav')?.innerText || '';
      const m = txt.match(/\/ (\d+)/);
      return m ? parseInt(m[1]) : 0;
    });
    if (!total) {
      await context.close();
      return { pkg, error: 'cannot read total slide count' };
    }
    // 依次跳转测量
    const overflows = [];
    for (let i = 1; i <= total; i++) {
      await page.evaluate((n) => { location.hash = `/${n}?clicks=999`; }, i);
      await page.waitForTimeout(350);
      const r = await page.evaluate(() => {
        const v = [...document.querySelectorAll('.slidev-page')].find(p => p.getBoundingClientRect().width > 0);
        if (!v) return { error: 'no visible slide' };
        const l = v.querySelector('.slidev-layout');
        if (!l) return { error: 'no layout' };
        return { layoutH: l.clientHeight, scrollH: l.scrollHeight, over: l.scrollHeight - l.clientHeight };
      });
      if (r.error || r.over > 0) overflows.push({ no: i, ...r });
    }
    await context.close();
    return { pkg, total, overflows };
  } catch (e) {
    await context.close();
    return { pkg, error: e.message };
  }
}

async function main() {
  const allPackages = listAll();
  const todo = targets.length ? targets.filter((p) => allPackages.includes(p)) : allPackages;
  console.log(`[overflow-check] 共 ${todo.length} 个 slidev 包`);

  ensureSymlinks(todo);
  const server = startServer();
  try {
    await waitServerReady();
    const browser = await chromium.launch({ headless: true });
    const summary = [];
    for (const pkg of todo) {
      const start = Date.now();
      const result = await checkPackage(browser, pkg);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      if (result.error) {
        console.log(`❌ ${pkg.padEnd(30)} (${elapsed}s) ERROR: ${result.error}`);
      } else if (result.overflows.length) {
        console.log(`⚠️  ${pkg.padEnd(30)} (${elapsed}s) ${result.overflows.length}/${result.total} 页溢出: ${result.overflows.map(o => `#${o.no} (+${o.over}px)`).join(', ')}`);
      } else {
        console.log(`✅ ${pkg.padEnd(30)} (${elapsed}s) ${result.total} 页全部 OK`);
      }
      summary.push(result);
    }
    await browser.close();
    const badCount = summary.filter((s) => s.overflows?.length || s.error).length;
    console.log(`\n[overflow-check] 完成：${summary.length - badCount} OK / ${badCount} 异常`);
  } finally {
    server.kill();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
