#!/usr/bin/env node

/**
 * Pre-commit lint hook
 * Kiểm tra lint trước khi commit. Block nếu có lỗi lint.
 *
 * Exit codes:
 * - 0: Cho phép (không phải commit hoặc lint pass)
 * - 2: Block (có lỗi lint)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đọc tool input từ stdin
let input = '';
try {
  input = fs.readFileSync(0, 'utf-8');
} catch {
  process.exit(0);
}

// Parse input
let toolInput;
try {
  toolInput = JSON.parse(input);
} catch {
  process.exit(0);
}

const command = toolInput.command || '';

// Chỉ check khi là git commit
if (!command.match(/git\s+commit/)) {
  process.exit(0);
}

// Lấy danh sách staged files
let stagedFiles = [];
try {
  const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf-8',
    timeout: 10000,
  });
  stagedFiles = output.trim().split('\n').filter(Boolean);
} catch {
  // Không lấy được staged files → cho qua
  process.exit(0);
}

if (stagedFiles.length === 0) {
  process.exit(0);
}

const errors = [];

// Kiểm tra JS/TS files
const jsFiles = stagedFiles.filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
if (jsFiles.length > 0) {
  // Tìm eslint config
  const hasEslint = fs.existsSync('node_modules/.bin/eslint') ||
    fs.existsSync('.eslintrc.js') ||
    fs.existsSync('.eslintrc.json') ||
    fs.existsSync('.eslintrc.yml') ||
    fs.existsSync('eslint.config.js') ||
    fs.existsSync('eslint.config.mjs');

  if (hasEslint && fs.existsSync('node_modules/.bin/eslint')) {
    // Detect ESLint version để dùng flag đúng
    let eslintArgs = jsFiles.join(' ');
    try {
      const versionOutput = execSync('./node_modules/.bin/eslint --version', {
        encoding: 'utf-8',
        timeout: 5000,
      });
      const majorVersion = parseInt(versionOutput.trim().replace('v', '').split('.')[0], 10);
      if (majorVersion >= 9) {
        eslintArgs += ' --no-warn-ignored';
      }
    } catch {
      // Không lấy được version → chạy không có flag
    }

    try {
      execSync(`./node_modules/.bin/eslint ${eslintArgs}`, {
        encoding: 'utf-8',
        timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (e) {
      if (e.stdout) {
        errors.push(`ESLint errors:\n${e.stdout}`);
      }
      if (e.stderr && !e.stderr.includes('Warning:')) {
        errors.push(e.stderr);
      }
    }
  }
}

// Kiểm tra PHP files
const phpFiles = stagedFiles.filter(f => /\.php$/.test(f));
if (phpFiles.length > 0) {
  for (const file of phpFiles) {
    try {
      execSync(`php -l "${file}"`, {
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (e) {
      errors.push(`PHP syntax error in ${file}: ${e.stdout || e.stderr}`);
    }
  }
}

if (errors.length > 0) {
  console.error('❌ Lint check FAILED. Hãy fix lỗi trước khi commit:\n');
  errors.forEach(err => console.error(err));
  console.error('\nTip: Fix lỗi rồi stage lại files trước khi commit.');
  process.exit(2);
}

console.error(`✅ Lint check passed (${stagedFiles.length} file${stagedFiles.length > 1 ? 's' : ''} checked).`);
process.exit(0);
