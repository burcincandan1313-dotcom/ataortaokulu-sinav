const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf8');

// ====================================================
// FIX 1: Add appendOralExamButtons function
// ====================================================
const oralBtnFn = `
// ═══════════════════════════════════════════
// SOZLU SINAV AKSIYON BUTONLARI
// ═══════════════════════════════════════════
function appendOralExamButtons() {
  const chatbox = document.getElementById('chatbox');
  if (!chatbox) return;

  const barId = 'oral-action-bar-' + Date.now();
  const wrapper = document.createElement('div');
  wrapper.className = 'msg bot';
  wrapper.innerHTML = \`
    <div id="\${barId}" style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;padding:10px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:12px;">
      <button class="oral-next-btn" style="padding:8px 16px;background:linear-gradient(135deg,#00d4ff,#3a7bfd);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.85rem;">Sonraki Soru</button>
      <button class="oral-end-btn" style="padding:8px 16px;background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.3);border-radius:8px;font-weight:700;cursor:pointer;font-size:0.85rem;">Sinavi Bitir</button>
    </div>
  \`;
  chatbox.appendChild(wrapper);
  chatbox.scrollTop = chatbox.scrollHeight;

  const bar = document.getElementById(barId);
  if (!bar) return;

  const nextBtn = bar.querySelector('.oral-next-btn');
  const endBtn = bar.querySelector('.oral-end-btn');

  const disableAll = () => {
    [nextBtn, endBtn].forEach(b => { if(b){ b.disabled=true; b.style.opacity='0.5'; b.style.pointerEvents='none'; }});
  };

  if (nextBtn) nextBtn.addEventListener('click', () => {
    disableAll();
    handleSendMessage('Devam et, bana bir sonraki sozlu soruyu sor ve onceki cevabimi degerlendirerek basla.');
  });

  if (endBtn) endBtn.addEventListener('click', () => {
    disableAll();
    window.activeOralSession = false;
    handleSendMessage('Sozlu sinavi bitirdim. Genel bir degerlendirme yap ve toplam performansimi ozet olarak sun.');
  });
}
`;

const marker = '// KONU DEĞİŞTİR POPUP';
if (!content.includes('appendOralExamButtons')) {
  const idx = content.indexOf(marker);
  if (idx !== -1) {
    // Find the previous === separator
    const sepIdx = content.lastIndexOf('// ═══', idx);
    content = content.substring(0, sepIdx) + oralBtnFn + '\n' + content.substring(sepIdx);
    console.log('Fix 1: appendOralExamButtons added');
  } else {
    console.log('Fix 1 FAILED: marker not found');
  }
} else {
  console.log('Fix 1: already exists');
}

// ====================================================
// FIX 2: Update Klavye Ustasi game with level selector and larger screen
// ====================================================
const oldZTypeStart = 'function renderZTypeGame(body) {\n  const dictionary = [';
const newZTypeStart = `function renderZTypeGame(body) {
  // ── Seviye seçimi ──────────────────────████
  body.innerHTML = \`
    <div style="text-align:center;padding:30px 20px;">
      <div style="font-size:3rem;margin-bottom:12px;">⌨️</div>
      <h3 style="color:var(--acc);margin-bottom:8px;">Klavye Ustası</h3>
      <p style="color:var(--sub);font-size:0.85rem;margin-bottom:20px;">Düşen kelimeleri yazarak imha et!</p>
      <div style="display:flex;flex-direction:column;gap:10px;max-width:280px;margin:0 auto;">
        <button class="ztype-level-btn" data-speed="slow" style="padding:14px;border-radius:12px;border:2px solid #22c55e;background:rgba(34,197,94,.1);color:#22c55e;font-weight:700;font-size:1rem;cursor:pointer;transition:.2s;">🐢 Yavaş (Kolay)</button>
        <button class="ztype-level-btn" data-speed="medium" style="padding:14px;border-radius:12px;border:2px solid #f59e0b;background:rgba(245,158,11,.1);color:#f59e0b;font-weight:700;font-size:1rem;cursor:pointer;transition:.2s;">⚡ Orta (Normal)</button>
        <button class="ztype-level-btn" data-speed="fast" style="padding:14px;border-radius:12px;border:2px solid #ef4444;background:rgba(239,68,68,.1);color:#ef4444;font-weight:700;font-size:1rem;cursor:pointer;transition:.2s;">🔥 Hızlı (Zor)</button>
      </div>
    </div>
  \`;

  body.querySelectorAll('.ztype-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = btn.getAttribute('data-speed');
      renderZTypeGameCore(body, speed);
    });
  });
}

function renderZTypeGameCore(body, speedLevel) {
  const speedMap = { slow: { drop: 0.5, spawn: 3000 }, medium: { drop: 1, spawn: 2000 }, fast: { drop: 1.8, spawn: 1200 } };
  const cfg = speedMap[speedLevel] || speedMap.medium;

  const dictionary = [`;

if (content.includes('function renderZTypeGame(body) {\n  const dictionary = [')) {
  content = content.replace(
    'function renderZTypeGame(body) {\n  const dictionary = [',
    newZTypeStart
  );
  console.log('Fix 2a: Level selector added');
} else {
  console.log('Fix 2a: Pattern not found, trying alternatives...');
  const idx = content.indexOf('function renderZTypeGame(body)');
  if (idx !== -1) {
    console.log('Found at:', idx);
    const snippet = content.substring(idx, idx + 200);
    console.log('Snippet:', snippet);
  }
}

// Fix initial drop speed and spawn rate to use config
const oldDropLine = "  let dropSpeed = 1; // px per frame\n  let spawnRate = 2000; // ms";
const newDropLine = "  let dropSpeed = cfg.drop; // px per frame\n  let spawnRate = cfg.spawn; // ms";
if (content.includes(oldDropLine)) {
  content = content.replace(oldDropLine, newDropLine);
  console.log('Fix 2b: Speed config applied');
} else {
  console.log('Fix 2b: dropSpeed line not found');
}

// Fix the container height to be larger
const oldContainerStyle = '      <div class="ztype-container" id="ztContainer">';
const newContainerStyle = '      <div class="ztype-container" id="ztContainer" style="min-height:420px;height:clamp(350px, 55vh, 580px);">';
if (content.includes(oldContainerStyle)) {
  content = content.replace(oldContainerStyle, newContainerStyle);
  console.log('Fix 2c: Container enlarged');
}

fs.writeFileSync('src/app.js', content, 'utf8');
console.log('All fixes applied. File size:', content.length);
