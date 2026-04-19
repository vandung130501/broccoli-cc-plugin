#!/usr/bin/env node

/**
 * Notify Wait hook (Stop)
 * Gửi Windows notification khi Claude kết thúc lượt và đang chờ dev phản hồi.
 *
 * Dùng PowerShell BalloonTip — không cần cài thêm package.
 * Chạy nền (detached) để không làm chậm Claude.
 */

const { spawn } = require('child_process');
const fs = require('fs');

// Đọc input từ stdin
let input = '';
try {
  input = fs.readFileSync(0, 'utf-8');
} catch {
  process.exit(0);
}

let hookData;
try {
  hookData = JSON.parse(input);
} catch {
  hookData = {};
}

// Không notify nếu stop hook đang active (tránh loop)
if (hookData.stop_hook_active) {
  process.exit(0);
}

// PowerShell script gửi Windows balloon tip notification
const psScript = `
Add-Type -AssemblyName System.Windows.Forms
$notify = New-Object System.Windows.Forms.NotifyIcon
$notify.Icon = [System.Drawing.SystemIcons]::Information
$notify.BalloonTipIcon  = [System.Windows.Forms.ToolTipIcon]::Info
$notify.BalloonTipTitle = 'Claude Code'
$notify.BalloonTipText  = 'Claude dang cho phan hoi cua ban...'
$notify.Visible = $true
$notify.ShowBalloonTip(5000)
Start-Sleep -Seconds 5
$notify.Dispose()
`.trim();

// Spawn PowerShell nền — hook thoát ngay, không đợi notification
const child = spawn('powershell', [
  '-NoProfile',
  '-WindowStyle', 'Hidden',
  '-NonInteractive',
  '-Command', '-',
], {
  detached: true,
  stdio: ['pipe', 'ignore', 'ignore'],
});

child.stdin.write(psScript);
child.stdin.end();
child.unref();

process.exit(0);
