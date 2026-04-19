#!/usr/bin/env node

/**
 * Review reminder hook
 * Nhắc nhở review trước khi push.
 *
 * Exit codes:
 * - 0: Cho phép (không phải push hoặc đã review)
 * - 2: Block nếu chưa review (tùy cấu hình)
 *
 * Hiện tại: chỉ WARN, không block.
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

const command = toolInput.command || '';

// Chỉ check khi là git push
if (!command.match(/git\s+push/)) {
  process.exit(0);
}

// Cảnh báo riêng nếu là force push
const isForcePush = /git\s+push.*(?:--force|-f)\b/.test(command);
if (isForcePush) {
  console.error('');
  console.error('🔴 FORCE PUSH DETECTED');
  console.error('   Force push sẽ ghi đè lịch sử remote. Đảm bảo bạn biết mình đang làm gì.');
  console.error('');
}

// Đọc session để kiểm tra review status
const sessionPath = path.join(process.cwd(), '.broccoli', 'session.json');

if (!fs.existsSync(sessionPath)) {
  // Không có session → không check
  process.exit(0);
}

let session;
try {
  session = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
} catch {
  process.exit(0);
}

const completed = session.steps_completed || [];
const workflowRaw = session.workflow || 'unknown';
const workflowLabel = workflowRaw === 'feature' ? 'Feature'
  : workflowRaw === 'bugfix' ? 'Bugfix'
  : workflowRaw;
const description = session.description || session.feature_name || '';
const workflowDisplay = description ? `${workflowLabel} - ${description}` : workflowLabel;

// Các review steps cần check
const reviewSteps = [
  'review-perf',
  'review-arch',
  'review-clean',
  'review-security',
];

const completedReviews = reviewSteps.filter(s => completed.includes(s));
const missingReviews = reviewSteps.filter(s => !completed.includes(s));

if (missingReviews.length > 0) {
  console.error('');
  console.error('⚠️  REVIEW REMINDER');
  console.error('─'.repeat(40));
  console.error(`Workflow: ${workflowDisplay}`);
  console.error(`Reviews đã chạy: ${completedReviews.length}/${reviewSteps.length}`);
  console.error('');

  if (completedReviews.length > 0) {
    console.error('✅ Đã review:');
    completedReviews.forEach(r => console.error(`   - ${r}`));
  }

  console.error('⏳ Chưa review:');
  missingReviews.forEach(r => console.error(`   - ${r}`));

  console.error('');
  console.error('Gợi ý: Chạy các lệnh review trước khi push:');
  missingReviews.forEach(r => console.error(`   /${r}`));
  console.error('');
  console.error('(Push vẫn được cho phép, đây chỉ là nhắc nhở)');
  console.error('');
} else {
  console.error(`✅ Tất cả reviews đã hoàn thành (${workflowDisplay}). Pushing...`);
}

// Cho phép push (chỉ warn, không block)
process.exit(0);
