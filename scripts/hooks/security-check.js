#!/usr/bin/env node

/**
 * Security check hook (PostToolUse)
 * Kiểm tra bảo mật cơ bản sau khi file được tạo/sửa.
 *
 * Chạy sau Edit/Write tool. Đọc file vừa thay đổi và scan patterns nguy hiểm.
 * Chỉ WARN, không block (PostToolUse không hỗ trợ block).
 */

const fs = require('fs');
const path = require('path');

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

// Lấy file path từ tool input
const filePath = toolInput.file_path || toolInput.filePath || '';

if (!filePath) {
  process.exit(0);
}

// Chỉ check các file code
const codeExtensions = [
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.php',
  '.sql',
  '.html', '.vue', '.svelte',
];

const basename = path.basename(filePath).toLowerCase();
const isEnvFile = basename.startsWith('.env') && basename !== '.env.example';
const isCodeFile = codeExtensions.some(e => filePath.toLowerCase().endsWith(e));

// Warn ngay nếu đang ghi vào .env (không phải .env.example)
if (isEnvFile) {
  console.error('');
  console.error(`⚠️  Đang sửa file môi trường: ${path.basename(filePath)}`);
  console.error('   Đảm bảo file này có trong .gitignore và KHÔNG được commit.');
  console.error('');
  process.exit(0);
}

if (!isCodeFile) {
  process.exit(0);
}

// Bỏ qua test files — tránh false positive
const isTestFile = /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(filePath) ||
  /\/(tests|__tests__|__mocks__)\//i.test(filePath) ||
  /\/tests?\//i.test(filePath);

if (isTestFile) {
  process.exit(0);
}

// Đọc nội dung file
let content;
try {
  content = fs.readFileSync(filePath, 'utf-8');
} catch {
  process.exit(0);
}

const warnings = [];

// === PATTERNS ===

// 1. Hardcoded secrets
const secretPatterns = [
  { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/gi, name: 'Hardcoded API key' },
  { pattern: /(?:secret|password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/gi, name: 'Hardcoded secret/password' },
  { pattern: /(?:token)\s*[:=]\s*['"][A-Za-z0-9_\-\.]{20,}['"]/gi, name: 'Hardcoded token' },
  { pattern: /(?:sk|pk)[-_](?:live|test)[-_][A-Za-z0-9]{20,}/g, name: 'Stripe key' },
  { pattern: /ghp_[A-Za-z0-9]{36}/g, name: 'GitHub personal access token' },
  { pattern: /glpat-[A-Za-z0-9_\-]{20}/g, name: 'GitLab personal access token' },
  { pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, name: 'Private key' },
  { pattern: /shp(?:at|ca|ss|pa)_[A-Za-z0-9]{32,}/g, name: 'Shopify access token' },
];

// 2. SQL Injection risks
const sqlPatterns = [
  { pattern: /\$\{.*\}.*(?:SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b/gi, name: 'Template literal in SQL query' },
  { pattern: /['"].*\+.*(?:SELECT|INSERT|UPDATE|DELETE|DROP)\b/gi, name: 'String concatenation in SQL' },
  { pattern: /query\s*\(\s*['"`].*\$\{/gi, name: 'Interpolated SQL query' },
  { pattern: /DB::raw\s*\(\s*['"].*\$(?!table)/gi, name: 'Laravel DB::raw with variable' },
];

// 3. XSS risks
const xssPatterns = [
  { pattern: /innerHTML\s*=/gi, name: 'innerHTML assignment (XSS risk)' },
  { pattern: /dangerouslySetInnerHTML/g, name: 'dangerouslySetInnerHTML (React XSS risk)' },
  { pattern: /\{!!\s*\$.*!!}/g, name: 'Blade unescaped output {!! !!}' },
  { pattern: /document\.write\s*\(/g, name: 'document.write (XSS risk)' },
  { pattern: /eval\s*\(/g, name: 'eval() usage' },
];

// 4. Sensitive data exposure
const dataPatterns = [
  { pattern: /console\.(log|debug|info)\s*\(.*(?:password|secret|token|key|credential)/gi, name: 'Logging sensitive data' },
  { pattern: /(?:dd|dump|var_dump|print_r)\s*\(/g, name: 'Debug output in PHP (dd/dump/var_dump)' },
];

// Run all checks
const allPatterns = [
  ...secretPatterns.map(p => ({ ...p, severity: 'CRITICAL' })),
  ...sqlPatterns.map(p => ({ ...p, severity: 'HIGH' })),
  ...xssPatterns.map(p => ({ ...p, severity: 'HIGH' })),
  ...dataPatterns.map(p => ({ ...p, severity: 'MEDIUM' })),
];

const lines = content.split('\n');

for (const { pattern, name, severity } of allPatterns) {
  // Reset regex lastIndex
  pattern.lastIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      warnings.push({
        severity,
        name,
        line: i + 1,
        content: lines[i].trim().substring(0, 100),
      });
    }
    // Reset for next line
    pattern.lastIndex = 0;
  }
}

// Output warnings
if (warnings.length > 0) {
  console.error('');
  console.error(`🔒 Security Check: ${path.basename(filePath)}`);
  console.error('─'.repeat(40));

  const critical = warnings.filter(w => w.severity === 'CRITICAL');
  const high = warnings.filter(w => w.severity === 'HIGH');
  const medium = warnings.filter(w => w.severity === 'MEDIUM');

  if (critical.length > 0) {
    console.error('');
    console.error('🔴 CRITICAL:');
    critical.forEach(w => {
      console.error(`   Line ${w.line}: ${w.name}`);
      console.error(`   > ${w.content}`);
    });
  }

  if (high.length > 0) {
    console.error('');
    console.error('🟠 HIGH:');
    high.forEach(w => {
      console.error(`   Line ${w.line}: ${w.name}`);
      console.error(`   > ${w.content}`);
    });
  }

  if (medium.length > 0) {
    console.error('');
    console.error('🟡 MEDIUM:');
    medium.forEach(w => {
      console.error(`   Line ${w.line}: ${w.name}`);
      console.error(`   > ${w.content}`);
    });
  }

  console.error('');
  console.error(`Tổng: ${warnings.length} warning(s) trong ${path.basename(filePath)}`);
  console.error('');
}

process.exit(0);
