const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf8');

// =========================================================
// FIX 1: Inject appendOralExamButtons call into streamMessage
// The actual pattern has 3 spaces indent
// =========================================================
const pattern1 = "streamMessage(renderHtml, () => {\r\n           if (currentMode === 'ders') appendLessonActionButtons();\r\n         });";
const replacement1 = "streamMessage(renderHtml, () => {\r\n           if (currentMode === 'ders') appendLessonActionButtons();\r\n           if (window.activeOralSession) appendOralExamButtons();\r\n         });";

if (content.includes(pattern1)) {
  content = content.replace(pattern1, replacement1);
  console.log('Fix 1: appendOralExamButtons call injected');
} else {
  console.log('Fix 1 FAILED - already applied or pattern changed');
  const idx = content.indexOf('appendLessonActionButtons');
  const ctx = content.substring(Math.max(0,idx-80), idx+200);
  console.log('Context:', JSON.stringify(ctx).substring(0, 300));
}

// =========================================================
// FIX 2: Replace appendOralExamButtons function with counter version
// =========================================================
const oldFnStart = content.indexOf('\nfunction appendOralExamButtons() {');
const oldFnEnd = content.indexOf('\n}\n', oldFnStart + 10);

if (oldFnStart !== -1 && oldFnEnd !== -1) {
  const newFn = `
function appendOralExamButtons() {
  const chatbox = document.getElementById('chatbox');
  if (!chatbox) return;

  if (!window.oralQuestionCount) window.oralQuestionCount = 0;
  if (!window.oralMaxQuestions) window.oralMaxQuestions = 5;
  window.oralQuestionCount++;

  const remaining = window.oralMaxQuestions - window.oralQuestionCount;
  const barId = 'oral-bar-' + Date.now();

  const wrapper = document.createElement('div');
  wrapper.id = barId;
  wrapper.style.cssText = 'margin:6px 0;padding:10px 12px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

  const counterHtml = remaining > 0
    ? '<span style="font-size:.8rem;color:var(--sub);flex:1;">Soru ' + window.oralQuestionCount + ' / ' + window.oralMaxQuestions + '</span>'
    : '<span style="font-size:.8rem;color:#f59e0b;flex:1;">Son soru tamamlandi!</span>';

  const nextHtml = remaining > 0
    ? '<button class="oral-next-btn" style="padding:7px 15px;background:linear-gradient(135deg,#00d4ff,#3a7bfd);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.84rem;">Sonraki Soru \u2192</button>'
    : '';

  wrapper.innerHTML = counterHtml + nextHtml + '<button class="oral-end-btn" style="padding:7px 15px;background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.3);border-radius:8px;font-weight:700;cursor:pointer;font-size:.84rem;">\u23F9 Sinavi Bitir</button>';

  chatbox.appendChild(wrapper);
  chatbox.scrollTop = chatbox.scrollHeight;

  const disableAll = () => {
    wrapper.querySelectorAll('button').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; });
  };

  const nextBtn = wrapper.querySelector('.oral-next-btn');
  const endBtn = wrapper.querySelector('.oral-end-btn');

  if (nextBtn) nextBtn.addEventListener('click', () => {
    disableAll();
    handleSendMessage('Devam et. Bir sonraki soruyu sor ve onceki cevabimi degerlendir.');
  });

  if (endBtn) endBtn.addEventListener('click', () => {
    disableAll();
    window.activeOralSession = false;
    const total = window.oralMaxQuestions;
    window.oralQuestionCount = 0;
    handleSendMessage('Sozlu sinavim tamamlandi (' + total + ' soru). Toplam performansimi degerlendir, guclu ve zayif yonlerimi belirt ve genel bir not ver.');
  });

  // Auto-end after last question (4s delay)
  if (window.oralQuestionCount >= window.oralMaxQuestions) {
    setTimeout(() => {
      if (endBtn && !endBtn.disabled) endBtn.click();
    }, 5000);
  }
}`;

  content = content.substring(0, oldFnStart) + newFn + content.substring(oldFnEnd);
  console.log('Fix 2: appendOralExamButtons replaced with counter version (5 soru max)');
} else {
  console.log('Fix 2 FAILED - function not found. oldFnStart:', oldFnStart, 'oldFnEnd:', oldFnEnd);
}

// Save app.js
fs.writeFileSync('src/app.js', content, 'utf8');
console.log('app.js saved.');

// =========================================================
// FIX 3: Info button in index.html
// =========================================================
let html = fs.readFileSync('index.html', 'utf8');

// Remove existing btnMenuInfo if malformed
if (html.includes('btnMenuInfo')) {
  // Check if it's in the right place - should be in chat-header area
  const idx = html.indexOf('btnMenuInfo');
  const ctx = html.substring(Math.max(0,idx-200), idx+300);
  console.log('Existing btnMenuInfo context:', ctx.substring(0, 200));
} else {
  // Add info button to chat header - right before the right-side buttons div
  const markerDiv = '<div style="display:flex; gap:8px;">';
  const idx = html.indexOf(markerDiv);
  if (idx !== -1) {
    const infoBtnHtml = '<button id="btnMenuInfo" class="mic-btn" title="Uygulama hakkinda bilgi al" style="font-size:1rem;border-color:rgba(0,212,255,0.4);background:rgba(0,212,255,0.06);"><i class="fa-solid fa-circle-question" style="color:var(--acc);"></i></button>\r\n      ';
    html = html.substring(0, idx) + infoBtnHtml + html.substring(idx);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fix 3: btnMenuInfo added to HTML');
  } else {
    console.log('Fix 3 FAILED: marker div not found');
  }
}
