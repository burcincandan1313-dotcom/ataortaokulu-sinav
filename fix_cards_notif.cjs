const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf8');

// =========================================================
// FIX 1: Simply add position:relative to each card div
// and add info btn via JS after dashboard renders
// Strategy: modify the 3 simpler cards, skip card-orange escape issue
// =========================================================

// Card 1: pink - Konu Çalış
content = content.replace(
  'class="dash-dev-card card-pink" onclick="document.getElementById(\'btnOpenStudyWizard\')?.click()"',
  'class="dash-dev-card card-pink" style="position:relative;" onclick="document.getElementById(\'btnOpenStudyWizard\')?.click()"'
);

// Card 2: cyan - Test Sihirbazı
content = content.replace(
  'class="dash-dev-card card-cyan" onclick="document.getElementById(\'btnOpenQuizWizard\')?.click()"',
  'class="dash-dev-card card-cyan" style="position:relative;" onclick="document.getElementById(\'btnOpenQuizWizard\')?.click()"'
);

// Card 3: blue - Sözlü Sınav
content = content.replace(
  'class="dash-dev-card card-blue" onclick="document.getElementById(\'btnOpenVoiceExam\')?.click()"',
  'class="dash-dev-card card-blue" style="position:relative;" onclick="document.getElementById(\'btnOpenVoiceExam\')?.click()"'
);

// Card 4: orange (complex onclick - just add style)
content = content.replace(
  'class="dash-dev-card card-orange"',
  'class="dash-dev-card card-orange" style="position:relative;"'
);

// Now inject info buttons into dashboard setup setTimeout
// Find the setTimeout that sets up dashboard event listeners
const setupMarker = "// Arama çubuğu event listener\r\n        setTimeout(() => {\r\n          const searchInput = document.getElementById('dashSearchInput');";
const newSetup = `// Arama çubuğu event listener
        setTimeout(() => {
          const searchInput = document.getElementById('dashSearchInput');
          // Info butonlarını kartlara ekle
          const cardInfoMap = [
            { sel: '.card-pink', id: 'konu' },
            { sel: '.card-cyan', id: 'test' },
            { sel: '.card-blue', id: 'sozlu' },
            { sel: '.card-orange', id: 'sohbet' }
          ];
          cardInfoMap.forEach(({ sel, id }) => {
            const card = document.querySelector(sel);
            if (card && !card.querySelector('.card-info-btn')) {
              const btn = document.createElement('button');
              btn.className = 'card-info-btn';
              btn.textContent = '?';
              btn.title = 'Bu ne işe yarar?';
              btn.setAttribute('aria-label', 'Bilgi');
              btn.onclick = (e) => { e.stopPropagation(); showCardInfo(id); };
              card.appendChild(btn);
            }
          });`;

if (content.includes(setupMarker)) {
  content = content.replace(setupMarker, newSetup);
  console.log('Fix 1: Info button injection added to dashboard setTimeout');
} else {
  // Try LF variant
  const setupMarkerLF = "// Arama çubuğu event listener\n        setTimeout(() => {\n          const searchInput = document.getElementById('dashSearchInput');";
  if (content.includes(setupMarkerLF)) {
    const newSetupLF = newSetup.replace(/\r\n/g, '\n');
    content = content.replace(setupMarkerLF, newSetupLF);
    console.log('Fix 1: Info button injection (LF) added');
  } else {
    console.log('Fix 1 FAILED - setTimeout marker not found');
    const idx = content.indexOf('Arama cubugu');
    console.log('Alt marker at:', idx);
  }
}

// =========================================================
// FIX 2: Add showCardInfo global function
// =========================================================
if (!content.includes('function showCardInfo')) {
  const showCardInfoFn = `
// =====================================================
// KART BİLGİ POPUP
// =====================================================
function showCardInfo(cardId) {
  const infos = {
    konu:   { title: '\uD83D\uDCDA Konu \u00c7al\u0131\u015f', icon: '\uD83D\uDCDA', color: '#f472b6',
               text: 'Yapay zeka ile ad\u0131m ad\u0131m ders anlat! S\u0131n\u0131f seviyene ve dersine g\u00f6re \u00f6zelle\u015ftirilmi\u015f ders anlat\u0131m\u0131 al\u0131rs\u0131n. Matematik, Fen, T\u00fcrk\u00e7e, Sosyal — t\u00fcm konularda detayl\u0131 a\u00e7\u0131klama ve \u00f6rnek \u00e7\u00f6z\u00fcmler.',
               tip: '\uD83D\uDCA1 "7. s\u0131n\u0131f matematik / kesirler" yazarak ba\u015fla!' },
    test:   { title: '\uD83C\uDFAF Test Sihirbaz\u0131', icon: '\uD83C\uDFAF', color: '#38bdf8',
               text: 'S\u0131n\u0131f ve konuna g\u00f6re yapay zeka taraf\u0131ndan \u00fcretilen \u00f6zel sorular \u00e7\u00f6z! LGS, Maarif ve \u00e7e\u015fitli soru formatlar\u0131 (\u00e7oktan se\u00e7meli, do\u011fru-yanl\u0131\u015f, bo\u015fluk doldurama) aras\u0131ndan se\u00e7. Her sorunun ayr\u0131nt\u0131l\u0131 \u00e7\u00f6z\u00fcm\u00fc sunulur.',
               tip: '\uD83D\uDCA1 Soru format\u0131n\u0131 ve zorluk seviyesini kendin belirleyebilirsin!' },
    sozlu:  { title: '\uD83C\uDFA4 S\u00f6zl\u00fc S\u0131nav', icon: '\uD83C\uDFA4', color: '#818cf8',
               text: 'Yapay zeka sana s\u00f6zl\u00fc s\u0131nav sorular\u0131 sorar, sen de sesli veya yaz\u0131l\u0131 olarak cevapl\u0131yorsun. Her cevab\u0131n\u0131 de\u011ferlendirir, puan verir ve 5 soruluk sinavin sonunda genel performans\u0131n\u0131 \u00f6zetler.',
               tip: '\uD83D\uDCA1 5 soru sorulur → otomatik de\u011ferlendirme yap\u0131l\u0131r!' },
    sohbet: { title: '\uD83D\uDCAC Sohbet Odas\u0131', icon: '\uD83D\uDCAC', color: '#fb923c',
               text: 'Herhangi bir konuda \u00f6zg\u00fcrce sorular\u0131n\u0131 sor! Ders d\u0131\u015f\u0131nda genel k\u00fclt\u00fcr, g\u00fcncel konular veya akl\u0131na tak\u0131lan her \u015feyi sorabilirsin. Yapay zeka anla\u015f\u0131l\u0131r, samimi bir dille yan\u0131t verir.',
               tip: '\uD83D\uDCA1 Her t\u00fcrl\u00fc soruyu sorabilirsin, s\u0131n\u0131r yok!' }
  };
  const info = infos[cardId] || infos.sohbet;
  if (typeof Swal === 'undefined') { alert(info.title + '\\n\\n' + info.text); return; }
  Swal.fire({
    title: info.title,
    html: '<p style="text-align:left;line-height:1.75;color:#cbd5e1;font-size:.93rem;margin-bottom:12px;">' + info.text + '</p>' +
          '<div style="font-size:.85rem;color:' + info.color + ';background:rgba(255,255,255,.04);padding:9px 13px;border-radius:9px;border-left:3px solid ' + info.color + ';text-align:left;">' + info.tip + '</div>',
    confirmButtonText: 'Hemen Ba\u015fla!',
    confirmButtonColor: info.color,
    background: '#0f172a',
    color: '#f8fafc',
    icon: 'info',
    iconColor: info.color
  });
}
`;
  // Add before Tema Degistirici or end of file
  const insertBefore = '// Tema toggle setupVayBeFeatures';
  if (content.includes(insertBefore)) {
    content = content.replace(insertBefore, showCardInfoFn + '\n' + insertBefore);
    console.log('Fix 2: showCardInfo function added');
  } else {
    content = content + '\n' + showCardInfoFn;
    console.log('Fix 2: showCardInfo added at end');
  }
}

// =========================================================
// FIX 3: Fix notification bell - show changelog
// =========================================================
const notifIdx = content.indexOf("btnNotif.addEventListener('click'");
if (notifIdx !== -1) {
  // Find the end of the click handler
  const handlerStart = content.lastIndexOf('{', notifIdx + 40);
  const handlerEnd = content.indexOf('\n  });\n}', notifIdx);
  
  if (handlerEnd !== -1) {
    const oldHandler = content.substring(notifIdx, handlerEnd + '\n  });\n}'.length);
    const newHandler = `btnNotif.addEventListener('click', () => {
    // Okundu - badge gizle
    const nbadge = btnNotif.parentElement ? btnNotif.parentElement.querySelector('span') : btnNotif.nextElementSibling;
    if (nbadge) { nbadge.style.display = 'none'; }
    if(typeof Swal !== 'undefined') {
      Swal.fire({
        title: '\uD83D\uDD14 Yenilikler & G\u00fcncellemeler',
        html: \`<div style="text-align:left;max-height:360px;overflow-y:auto;font-size:.88rem;line-height:1.6;">
          <div style="margin-bottom:12px;padding:9px 11px;background:rgba(0,212,255,.07);border-radius:9px;border-left:3px solid #00d4ff;">
            <div style="font-size:.72rem;color:#64748b;">16 Nisan 2026</div>
            <b style="color:#00d4ff;">\u2328\uFE0F Klavye Ustas\u0131 G\u00fcncellendi</b>
            <p style="color:#94a3b8;margin:3px 0 0;">Yava\u015f / Orta / H\u0131zl\u0131 seviye se\u00e7imi ve b\u00fcy\u00fct\u00fclm\u00fc\u015f oyun ekran\u0131 eklendi.</p>
          </div>
          <div style="margin-bottom:12px;padding:9px 11px;background:rgba(56,189,248,.07);border-radius:9px;border-left:3px solid #38bdf8;">
            <div style="font-size:.72rem;color:#64748b;">16 Nisan 2026</div>
            <b style="color:#38bdf8;">\uD83C\uDFA4 S\u00f6zl\u00fc S\u0131nav \u0130yile\u015fmesi</b>
            <p style="color:#94a3b8;margin:3px 0 0;">Art\u0131k tam 5 soruda bitiyor. Her sorudan sonra aksiyon butonlar\u0131 \u00e7\u0131k\u0131yor.</p>
          </div>
          <div style="margin-bottom:12px;padding:9px 11px;background:rgba(34,197,94,.07);border-radius:9px;border-left:3px solid #22c55e;">
            <div style="font-size:.72rem;color:#64748b;">16 Nisan 2026</div>
            <b style="color:#22c55e;">\uD83D\uDCDA M\u00fcfredat D\u00fczeltmesi</b>
            <p style="color:#94a3b8;margin:3px 0 0;">7. s\u0131n\u0131f "Fizik" ba\u015fl\u0131\u011f\u0131 kald\u0131r\u0131ld\u0131, do\u011fru konu isimleri eklendi.</p>
          </div>
          <div style="margin-bottom:12px;padding:9px 11px;background:rgba(139,92,246,.07);border-radius:9px;border-left:3px solid #8b5cf6;">
            <div style="font-size:.72rem;color:#64748b;">15 Nisan 2026</div>
            <b style="color:#8b5cf6;">\uD83C\uDF19 Gece/G\u00fcnd\u00fcz Tema D\u00fczeltmesi</b>
            <p style="color:#94a3b8;margin:3px 0 0;">Light/Dark mod \u00e7ift handler \u00e7ak\u0131\u015fmas\u0131 d\u00fczeltildi.</p>
          </div>
          <div style="padding:9px 11px;background:rgba(245,158,11,.07);border-radius:9px;border-left:3px solid #f59e0b;">
            <div style="font-size:.72rem;color:#64748b;">14 Nisan 2026</div>
            <b style="color:#f59e0b;">\uD83E\uDD16 AI Ba\u011flant\u0131s\u0131 G\u00fc\u00e7lendirildi</b>
            <p style="color:#94a3b8;margin:3px 0 0;">Cloudflare \u00fczerinden \u00f6nbellekleme edildi, ba\u011flant\u0131 kesinimi azalt\u0131ld\u0131.</p>
          </div>
        </div>\`,
        confirmButtonText: 'Harika!',
        confirmButtonColor: '#00d4ff',
        background: '#0f172a',
        color: '#f8fafc',
        width: '480px'
      });
    }
  });
}`;
    content = content.substring(0, notifIdx) + newHandler + content.substring(handlerEnd + '\n  });\n}'.length);
    console.log('Fix 3: Notification changelog updated');
  } else {
    console.log('Fix 3 FAILED - could not find handler end');
  }
} else {
  console.log('Fix 3: btnNotif handler not found');
}

// =========================================================
// FIX 4: Add CSS for card-info-btn to style.css
// =========================================================
let css = fs.readFileSync('src/style.css', 'utf8');
const cardBtnCSS = `
/* ── KART BİLGİ BUTONU ── */
.card-info-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
  font-weight: 900;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
  font-family: Georgia, serif;
  line-height: 1;
}
.card-info-btn:hover {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.6);
  transform: scale(1.15);
}
`;

if (!css.includes('card-info-btn')) {
  // Add before or at end
  const cssMarker = '/* ── ZTYPE OYUNU ──';
  if (css.includes(cssMarker)) {
    css = css.replace(cssMarker, cardBtnCSS + '\n' + cssMarker);
  } else {
    css = css + cardBtnCSS;
  }
  fs.writeFileSync('src/style.css', css, 'utf8');
  console.log('Fix 4: card-info-btn CSS added');
} else {
  console.log('Fix 4: CSS already has card-info-btn');
}

fs.writeFileSync('src/app.js', content, 'utf8');
console.log('All fixes done. app.js size:', content.length);
