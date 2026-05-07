#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedJsFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    return output.split('\n').filter(f => f.startsWith('src/') && f.endsWith('.js'));
  } catch {
    return [];
  }
}

function docPathFor(jsFile) {
  const basename = path.basename(jsFile, '.js');
  return path.join('docs', 'modules', `${basename}.md`);
}

function main() {
  const jsFiles = getStagedJsFiles();
  if (jsFiles.length === 0) {
    console.log('[check-docs] No src/*.js files staged — skipping.');
    process.exit(0);
  }

  let hasError = false;
  for (const jsFile of jsFiles) {
    const docRel = docPathFor(jsFile);
    const docAbs = path.join(process.cwd(), docRel);
    if (!fs.existsSync(docAbs)) {
      console.error(`❌ ERROR: Missing documentation for "${jsFile}".`);
      console.error(`   Expected: ${docRel}`);
      console.error(`   Please create the doc before committing.`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('\n[check-docs] Commit blocked. Please add missing docs.\n');
    process.exit(1);
  }
  console.log('\n[check-docs] All checks passed.\n');
  process.exit(0);
}

main();
