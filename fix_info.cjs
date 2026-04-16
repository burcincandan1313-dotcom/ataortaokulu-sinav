const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add info button to chat header - right after bot-info div closing tag
const searchStr = '<span id="botStatus">';
const idx = html.indexOf(searchStr);
if (idx === -1) { console.log('botStatus not found'); process.exit(1); }

// Find the closing </div> of bot-info
const closeDiv = html.indexOf('</div>', idx);
if (closeDiv === -1) { console.log('closing div not found'); process.exit(1); }

const infoBtnHtml = '\r\n      <button id="btnMenuInfo" class="mic-btn" title="Bu Uygulama Ne Isler?" style="font-size:1rem;"><i class="fa-solid fa-circle-question" style="color:var(--acc);"></i></button>';

html = html.substring(0, closeDiv + 6) + infoBtnHtml + html.substring(closeDiv + 6);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Info button added at index', closeDiv);

// Now add info button handler to app.js
let js = fs.readFileSync('src/app.js', 'utf8');
const infoHandlerCode = `
  // ═══════════════════════════════════════════
  // MENÜ BİLGİ BUTONU (?) handler
  // ═══════════════════════════════════════════
  const btnMenuInfo = document.getElementById('btnMenuInfo');
  if (btnMenuInfo) {
    btnMenuInfo.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Ata Mentor Hakkinda',
          html: \`
            <div style="text-align:left; line-height:1.7; font-size:0.92rem;">
              <p style="margin-bottom:10px;"><b>Ata Mentor</b>, ortaokul ogrencilerine yonelik yapay zeka destekli ogrenme asistanidir.</p>
              <ul style="padding-left:18px; color:#94a3b8; list-style:disc;">
                <li style="margin-bottom:6px;">Derslerini <b>sohbet ederek</b> ogrenebilirsin</li>
                <li style="margin-bottom:6px;">Istedigin konuda <b>test/quiz</b> cozebilirsin</li>
                <li style="margin-bottom:6px;"><b>Sozlu sinav</b> modunda sorulara sesli cevap verebilirsin</li>
                <li style="margin-bottom:6px;"><b>Oyun merkezi</b>nde egitici oyunlar oynayabilirsin</li>
                <li style="margin-bottom:6px;"><b>Yetenek agaci</b>nda ilerlemeyi takip edebilirsin</li>
              </ul>
              <p style="margin-top:10px; color:var(--acc); font-weight:700;">Hazirsan baslayalim!</p>
            </div>
          \`,
          confirmButtonText: 'Anlaydum!',
          confirmButtonColor: '#00d4ff',
          background: '#0f172a',
          color: '#f8fafc',
          iconColor: '#00d4ff',
          icon: 'info'
        });
      }
    });
  }
`;

// Add the handler inside setupEventListeners function, near the end
const setupEnd = "  // ═══════════════════════════════════════════\n  // Performans Modu toggle";
if (js.includes(setupEnd)) {
  js = js.replace(setupEnd, infoHandlerCode + '\n' + setupEnd);
  fs.writeFileSync('src/app.js', js, 'utf8');
  console.log('Info button handler added to app.js');
} else {
  console.log('setupEventListeners end marker not found, trying alternative...');
  // Try inserting near the toggleLowEnd handler
  const altMarker = 'const toggleLowEnd = document.getElementById';
  const altIdx = js.indexOf(altMarker);
  if (altIdx !== -1) {
    js = js.substring(0, altIdx) + infoHandlerCode + '\n  ' + js.substring(altIdx);
    fs.writeFileSync('src/app.js', js, 'utf8');
    console.log('Info button handler added via alternative marker');
  } else {
    console.log('ERROR: Could not find insertion point');
  }
}
