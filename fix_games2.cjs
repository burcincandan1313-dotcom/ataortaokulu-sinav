const fs = require('fs');
let content = fs.readFileSync('src/features/games.js', 'utf8');
console.log('Original length:', content.length);

// Find start of renderZTypeGame
const FN_START = 'function renderZTypeGame(body) {\r\n  const dictionary = [';
const fnIdx = content.indexOf(FN_START);
if (fnIdx === -1) { console.log('ERROR: Function not found'); process.exit(1); }

// Build the new level selector that REPLACES only the function signature + dictionary part
// We want to keep all the game logic (spawnWord, update, etc.) intact
// Strategy: 
// 1. Insert new renderZTypeGame (level selector) BEFORE original
// 2. Rename old function to startZTypeCore
// 3. Add CFG vars at the top of the renamed function

// Insert level selector function before the existing function
const levelSelectorFn = `function renderZTypeGame(body) {
  body.innerHTML = \`
    <div style="text-align:center;padding:30px 20px;max-width:400px;margin:0 auto;">
      <div style="font-size:3.5rem;margin-bottom:12px;">\u2328\uFE0F</div>
      <h3 style="color:var(--acc);margin-bottom:8px;font-size:1.4rem;">Klavye Ustas\u0131</h3>
      <p style="color:var(--sub);font-size:0.85rem;margin-bottom:24px;">D\u00fc\u015fen kelimeleri h\u0131zl\u0131ca yazarak imha et!</p>
      <div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">
        <button data-speed="slow" class="zt-lvl-btn" style="padding:14px 20px;border-radius:12px;border:2px solid #22c55e;background:rgba(34,197,94,.12);color:#22c55e;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s;">\uD83D\uDC22 Yava\u015f \u2014 Kolay</button>
        <button data-speed="medium" class="zt-lvl-btn" style="padding:14px 20px;border-radius:12px;border:2px solid #f59e0b;background:rgba(245,158,11,.12);color:#f59e0b;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s;">\u26A1 Orta \u2014 Normal</button>
        <button data-speed="fast" class="zt-lvl-btn" style="padding:14px 20px;border-radius:12px;border:2px solid #ef4444;background:rgba(239,68,68,.12);color:#ef4444;font-weight:700;font-size:1rem;cursor:pointer;transition:all .2s;">\uD83D\uDD25 H\u0131zl\u0131 \u2014 Zor</button>
      </div>
    </div>
  \`;
  body.querySelectorAll('.zt-lvl-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.04)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });
    btn.addEventListener('click', () => startZTypeCore(body, btn.getAttribute('data-speed')));
  });
}

`;

// Now rename original function to startZTypeCore and inject speed config
// Original starts with: function renderZTypeGame(body) {\r\n  const dictionary = [
// Replace ONLY the function name - keep original body untouched
const oldFnHeader = 'function renderZTypeGame(body) {\r\n  const dictionary = [';
const newFnHeader = `function startZTypeCore(body, speedLevel) {\r\n  const speedCfg = { slow: { drop: 0.55, spawn: 3000 }, medium: { drop: 1.0, spawn: 2000 }, fast: { drop: 1.8, spawn: 1200 } };\r\n  const cfg = speedCfg[speedLevel] || speedCfg.medium;\r\n  const dictionary = [`;

// Fix drop speed and spawn rate to use cfg
const oldDrop = '  let dropSpeed = 1; // px per frame\r\n  let spawnRate = 2000; // ms';
const newDrop = '  let dropSpeed = cfg.drop;\r\n  let spawnRate = cfg.spawn;';

// Fix gameOver restart to go back to renderZTypeGame
const oldRestart = "document.getElementById('ztRestart').addEventListener('click', () => {\r\n         renderZTypeGame(body);\r\n      });";
const newRestart = "document.getElementById('ztRestart').addEventListener('click', () => {\r\n         renderZTypeGame(body);\r\n      });";

// Fix container height
const oldContainer = '      <div class="ztype-container" id="ztContainer">';
const newContainer = '      <div class="ztype-container" id="ztContainer" style="height:clamp(360px,58vh,560px);position:relative;">';

// Fix header bar to show level
const oldHeader = '      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">';
const newHeader = '      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;flex-wrap:wrap;gap:6px;">';

// Apply all changes
content = content.replace(oldFnHeader, newFnHeader);
content = content.replace(oldDrop, newDrop);
content = content.replace(oldContainer, newContainer);
content = content.replace(oldHeader, newHeader);

// Insert level selector function before startZTypeCore
const startIdx = content.indexOf('function startZTypeCore(body, speedLevel)');
if (startIdx !== -1) {
  content = content.substring(0, startIdx) + levelSelectorFn + content.substring(startIdx);
  console.log('Level selector inserted');
} else {
  console.log('ERROR: startZTypeCore not found after rename');
}

// Add ESC key support
const oldKeyHandler = "  function handleKeydown(e) {\r\n    if (isGameOver) return;\r\n    \r\n    // İngilizce karakterlere çevir";
const newKeyHandler = "  function handleKeydown(e) {\r\n    if (isGameOver) return;\r\n    if (e.key === 'Escape') { gameOver(); return; }\r\n    // İngilizce karakterlere çevir";
content = content.replace(oldKeyHandler, newKeyHandler);

fs.writeFileSync('src/features/games.js', content, 'utf8');
console.log('Done! New length:', content.length);

// Verify
const check = fs.readFileSync('src/features/games.js', 'utf8');
console.log('renderZTypeGame:', check.includes('function renderZTypeGame'));
console.log('startZTypeCore:', check.includes('function startZTypeCore'));
console.log('zt-lvl-btn:', check.includes('zt-lvl-btn'));
console.log('cfg.drop:', check.includes('cfg.drop'));
console.log('60vh container:', check.includes('58vh'));
