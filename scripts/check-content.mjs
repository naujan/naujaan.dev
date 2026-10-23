import { existsSync, readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = process.cwd();
const fixtures = [
  ['posts', 'validation-draft-post', { date: '2020-01-01', draft: true }],
  ['posts', 'validation-future-post', { date: '2999-01-01', draft: false }],
  ['projects', 'validation-draft-project', { year: '2026', draft: true }],
];
const created = [];
try {
  for (const [collection, slug, data] of fixtures) {
    const path = join(root, 'src/content', collection, slug + '.mdoc');
    const frontmatter = { title: slug, description: 'Temporary validation fixture', featured: true, order: 0, ...data };
    // Exclusive creation prevents overwriting any existing content.
    writeFileSync(path, '---\n' + Object.entries(frontmatter).map(([key, value]) => key + ': ' + JSON.stringify(value)).join('\n') + '\n---\nNot public.\n', { flag: 'wx' });
    created.push(path);
  }
  const astroPackage = JSON.parse(readFileSync(join(root, 'node_modules/astro/package.json'), 'utf8'));
  const bin = typeof astroPackage.bin === 'string' ? astroPackage.bin : astroPackage.bin.astro;
  const result = spawnSync(process.execPath, [join(root, 'node_modules/astro', bin), 'build'], {
    cwd: root, stdio: 'inherit',
  });
  assert.equal(result.status, 0, 'Production build must succeed');
  const output = resolve(root, '.vercel/output/static');
  const pages = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.html')) pages.push(path);
    }
  };
  walk(output);
  for (const [, slug] of fixtures) {
    for (const page of pages) assert.ok(!readFileSync(page, 'utf8').includes(slug), 'Hidden content leaked into ' + page);
    assert.ok(!existsSync(join(output, 'blog', slug, 'index.html')));
    assert.ok(!existsSync(join(output, 'projects', slug, 'index.html')));
  }
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = match[1];
      if (href.startsWith('//')) continue;
      const target = resolve(output, '.' + decodeURIComponent(href));
      assert.ok(existsSync(target) || existsSync(join(target, 'index.html')), 'Broken internal link: ' + href);
    }
  }
  const homepage = readFileSync(join(output, 'index.html'), 'utf8');
  assert.ok(!homepage.includes('astro-island'), 'Public homepage should not hydrate React/Keystatic');
  for (const id of ['hero', 'about', 'writing', 'work']) assert.ok(homepage.includes('id="' + id + '"'));
  console.log('PASS: drafts and future posts stay private; internal links resolve; public homepage stays static.');
} finally {
  for (const path of created) unlinkSync(path);
}

