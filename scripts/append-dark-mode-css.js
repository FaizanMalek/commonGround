const fs = require('fs');
const { execSync } = require('child_process');

const block = execSync('git show 79281ec:public/css/dashboard.css', { encoding: 'utf8' })
  .split(/\r?\n/)
  .slice(1483)
  .join('\n');

const toggleExtra = `
/* ── Theme toggle (coordinator / staff topbar) ───────────────── */
.theme-toggle {
  position: relative;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 999px;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.theme-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}
.theme-toggle-icons {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 7px;
  pointer-events: none;
  z-index: 1;
}
.theme-toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}
.theme-toggle-icon svg { display: block; }
html[data-theme='dark'] .theme-toggle {
  background: #1e293b;
  border-color: #334155;
}
html[data-theme='dark'] .theme-toggle-thumb {
  transform: translateX(24px);
  background: #f8fafc;
}
html[data-theme='dark'] .theme-toggle-icon { color: #94a3b8; }
[data-theme='dark'] .modal-overlay { background: rgba(0, 0, 0, 0.72); }
`;

const dashPath = 'public/css/dashboard.css';
let dash = fs.readFileSync(dashPath, 'utf8');
if (!dash.includes('True Black Dark Mode')) {
  dash = dash.trimEnd() + '\n\n' + block + toggleExtra + '\n';
  fs.writeFileSync(dashPath, dash, 'utf8');
  console.log('Appended dark mode to dashboard.css');
} else {
  console.log('Dark mode already present');
}
