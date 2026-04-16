const fs = require('fs');
let content = fs.readFileSync('src/features/games.js', 'utf8');

// Find the function boundaries
const fnStart = content.indexOf('function renderZTypeGame(body) {');
if (fnStart === -1) { console.log('Not found'); process.exit(1); }

const fnEnd = content.indexOf('\nfunction ', fnStart + 10);
const originalFn = content.substring(fnStart, fnEnd);
console.log('Original function length:', originalFn.length);

// Build the new function as raw string - no template literals in script
const HEARTS = '"' + String.fromCodePoint(0x2764, 0xFE0F) + '".repeat(health)';

const newFn = [
'function renderZTypeGame(body) {',
'  // Seviye secim ekrani',
'  body.innerHTML = `',
'    <div style="text-align:center;padding:30px 20px;max-width:400px;margin:0 auto;">',
'      <div style="font-size:3.5rem;margin-bottom:12px;">\u2328\uFE0F</div>',
'      <h3 style="color:var(--acc);margin-bottom:8px;font-size:1.4rem;">Klavye Ustas\u0131</h3>',
'      <p style="color:var(--sub);font-size:0.85rem;margin-bottom:24px;">D\u00fc\u015fen kelimeleri h\u0131zl\u0131ca yazarak imha et!</p>',
'      <div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">',
'        <button data-speed="slow" class="zt-lvl-btn" style="padding:14px 20px;border-radius:12px;border:2px solid #22c55e;background:rgba(34,197,94,.12);color:#22c55e;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s;">\uD83D\uDC22 Yava\u015f \u2014 Kolay</button>',
'        <button data-speed="medium" class="zt-lvl-btn" style="padding:14px 20px;border-radius:12px;border:2px solid #f59e0b;background:rgba(245,158,11,.12);color:#f59e0b;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s;">\u26A1 Orta \u2014 Normal</button>',
'        <button data-speed="fast" class="zt-lvl-btn" style="padding:14px 20px;border-radius:12px;border:2px solid #ef4444;background:rgba(239,68,68,.12);color:#ef4444;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s;">\uD83D\uDD25 H\u0131zl\u0131 \u2014 Zor</button>',
'      </div>',
'    </div>',
'  `;',
'',
'  body.querySelectorAll(\'.zt-lvl-btn\').forEach(btn => {',
'    btn.addEventListener(\'mouseenter\', () => { btn.style.transform = \'scale(1.04)\'; });',
'    btn.addEventListener(\'mouseleave\', () => { btn.style.transform = \'scale(1)\'; });',
'    btn.addEventListener(\'click\', () => startZTypeCore(body, btn.getAttribute(\'data-speed\')));',
'  });',
'}',
'',
'function startZTypeCore(body, speedLevel) {',
'  const speedCfg = {',
'    slow:   { drop: 0.55, spawn: 3000, label: \'\uD83D\uDC22 Yava\u015f\' },',
'    medium: { drop: 1.0,  spawn: 2000, label: \'\u26A1 Orta\'  },',
'    fast:   { drop: 1.8,  spawn: 1200, label: \'\uD83D\uDD25 H\u0131zl\u0131\' }',
'  };',
'  const cfg = speedCfg[speedLevel] || speedCfg.medium;',
'',
'  const dictionary = [',
'    "ATAT\u00dcRK", "B\u0130L\u0130M", "SANAT", "EVREN", "G\u00dcNE\u015e", "B\u0130LG\u0130SAYAR", "YAZILIM", "KODLAMA",',
'    "KLAVYE", "EKRAN", "T\u00dcRK\u0130YE", "\u0130STANBUL", "ANKARA", "YILDIZ", "GEZEGEN", "ASTRONOM\u0130",',
'    "MATEMAT\u0130K", "FEN", "K\u0130MYA", "B\u0130YOLOJ\u0130", "OKUL", "\u00d6\u011eRENC\u0130", "\u00d6\u011eRETMEN", "E\u011e\u0130T\u0130M",',
'    "M\u0130MAR\u0130", "M\u00dcHEND\u0130S", "DOKTOR", "TEKNOLOJ\u0130", "\u0130NTERNET", "S\u0130BER", "G\u00dcvenl\u0130K", "OYUN",',
'    "ROBOT", "YAPAY", "ZEKA", "AKIL", "DENEY", "HESAP", "SAYILAR", "ALAN"',
'  ];',
'',
'  let score = 0;',
'  let level = 1;',
'  let health = 5;',
'  let activeWords = [];',
'  let currentTarget = null;',
'  let dropSpeed = cfg.drop;',
'  let spawnRate = cfg.spawn;',
'  let isGameOver = false;',
'  let gameLoop;',
'  let spawnLoop;',
'  let container;',
'  let laser;',
'',
'  // Temel UI kurulumu',
'  body.innerHTML = `',
'    <div style="padding:10px;width:100%;">',
'      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;flex-wrap:wrap;gap:6px;">',
'         <span style="font-weight:bold; color:var(--acc);">Skor: <span id="ztScore">0</span> | Seviye: <span id="ztLevel">1</span></span>',
'         <span style="font-size:.75rem;color:var(--sub);background:rgba(255,255,255,.05);padding:3px 8px;border-radius:6px;">${cfg.label}</span>',
'         <span style="font-weight:bold; color:#ef4444;">Can: <span id="ztHealth">${"\\u2764\\uFE0F".repeat(health)}</span></span>',
'      </div>',
'      <div class="ztype-container" id="ztContainer" style="height:clamp(360px,58vh,560px);position:relative;">',
'        <div class="ztype-shooter"></div>',
'        <div class="ztype-laser" id="ztLaser" style="opacity:0;"></div>',
'      </div>',
'      <div style="margin-top:10px;text-align:center;color:var(--sub);font-size:.78rem;">Harflere basarak kelimeleri yok et \u2022 <span style="color:var(--acc);">ESC</span> = \xc7\u0131k</div>',
'    </div>',
'  `;',
'  addBackButton(body);',
].join('\n');

content = content.substring(0, fnStart) + newFn + '\n' + content.substring(fnStart + 'function renderZTypeGame(body) {'.length);
fs.writeFileSync('src/features/games.js', content, 'utf8');
console.log('Done. Checking new content...');
const check = fs.readFileSync('src/features/games.js', 'utf8');
console.log('startZTypeCore present:', check.includes('startZTypeCore'));
console.log('zt-lvl-btn present:', check.includes('zt-lvl-btn'));
