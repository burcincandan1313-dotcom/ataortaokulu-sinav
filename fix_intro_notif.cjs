const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf8');

// =========================================================
// FIX 1: Move _btnNotif handler inside DOMContentLoaded
// Problem: it's at global scope at bottom - DOM may not be ready
// =========================================================

// Remove the existing global _btnNotif handler
const notifBlockStart = '\n// ═══════════════════════════════════════════\n// BİLDİRİM ZİLİ — Yenilikler Changelog\n// ═══════════════════════════════════════════\nconst _btnNotif = document.getElementById(\'btnNotif\');';
const notifBlockEnd = content.indexOf('});\n}', content.indexOf('_btnNotif')) + '});\n}'.length;

if (notifBlockStart && content.includes('BİLDİRİM ZİLİ')) {
  const startIdx = content.indexOf(notifBlockStart);
  const endIdx = content.indexOf('\n};\n', startIdx); // Find closing
  // Find the block end more precisely
  let braceCount = 0;
  let blockEnd = -1;
  const blockStart = content.indexOf('const _btnNotif = document.getElementById');
  for (let i = blockStart; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0 && i > blockStart + 50) {
        blockEnd = i + 1;
        break;
      }
    }
  }
  
  if (blockEnd > 0) {
    const oldBlock = content.substring(blockStart, blockEnd);
    console.log('Found notif block length:', oldBlock.length);
    console.log('Last 50 chars:', oldBlock.substring(oldBlock.length - 50));
    
    // Remove the old block from file end
    const headerLine = '\n// ═══════════════════════════════════════════\n// BİLDİRİM ZİLİ — Yenilikler Changelog\n// ═══════════════════════════════════════════\n';
    const headerIdx = content.indexOf(headerLine);
    if (headerIdx !== -1) {
      content = content.substring(0, headerIdx) + '\n// Bildirim handler DOMContentLoaded icinde tanimlanmistir.\n';
    } else {
      content = content.substring(0, blockStart) + content.substring(blockEnd);
    }
    console.log('Old notif block removed');
  }
}

// =========================================================
// FIX 2: Replace btnMenuInfo handler with beautiful intro popup
// FIX 3: Add btnNotif changelog handler
// Both inside setupVayBeFeatures (which runs after DOM is ready)
// =========================================================

const oldMenuInfo = `  const btnMenuInfo = document.getElementById('btnMenuInfo');
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
  }`;

const newMenuInfoAndNotif = `  // === ANA BİLGİ BUTONU (?) — Uygulama İntrosu ===
  const btnMenuInfo = document.getElementById('btnMenuInfo');
  if (btnMenuInfo) {
    btnMenuInfo.addEventListener('click', () => {
      if (typeof Swal === 'undefined') return;
      Swal.fire({
        title: '',
        html: \`
          <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:3.5rem;margin-bottom:8px;">🏫</div>
            <h2 style="margin:0;font-size:1.45rem;font-weight:800;background:linear-gradient(135deg,#00d4ff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Ata Mentor</h2>
            <p style="color:#64748b;font-size:.83rem;margin:4px 0 0;">Yapay Zeka Destekli Eğitim Asistanı</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left;margin-bottom:16px;">
            <div style="padding:10px 12px;background:rgba(244,114,182,.08);border-radius:10px;border:1px solid rgba(244,114,182,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">📚</div>
              <b style="color:#f472b6;font-size:.85rem;">Konu Çalış</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">Yapay zeka ile adım adım ders anlat, sorularını sor</p>
            </div>
            <div style="padding:10px 12px;background:rgba(56,189,248,.08);border-radius:10px;border:1px solid rgba(56,189,248,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">🎯</div>
              <b style="color:#38bdf8;font-size:.85rem;">Test Sihirbazı</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">LGS/Maarif formatında özel quiz soruları çöz</p>
            </div>
            <div style="padding:10px 12px;background:rgba(129,140,248,.08);border-radius:10px;border:1px solid rgba(129,140,248,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">🎤</div>
              <b style="color:#818cf8;font-size:.85rem;">Sözlü Sınav</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">5 soru, sesli cevap, otomatik değerlendirme</p>
            </div>
            <div style="padding:10px 12px;background:rgba(251,146,60,.08);border-radius:10px;border:1px solid rgba(251,146,60,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">🎮</div>
              <b style="color:#fb923c;font-size:.85rem;">Oyun Merkezi</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">Klavye Ustası, bilgi yarışması ve daha fazlası</p>
            </div>
          </div>
          <div style="padding:10px;background:rgba(0,212,255,.06);border-radius:10px;border:1px solid rgba(0,212,255,.15);text-align:center;">
            <span style="color:#00d4ff;font-size:.85rem;font-weight:700;">⭐ XP kazan → Rozet al → Yetenek Ağacını büyüt!</span>
          </div>
        \`,
        confirmButtonText: '🚀 Hadi Başlayalım!',
        confirmButtonColor: '#00d4ff',
        background: '#0f172a',
        color: '#f8fafc',
        width: '520px',
        showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' }
      });
    });
  }

  // === BİLDİRİM ZİLİ — Yenilikler Changelog ===
  const _notifBtn = document.getElementById('btnNotif');
  if (_notifBtn) {
    _notifBtn.addEventListener('click', () => {
      // Badge gizle
      const _wrap = _notifBtn.closest('div[style*="position:relative"]') || _notifBtn.parentElement;
      const _badge = _wrap ? _wrap.querySelector('span') : null;
      if (_badge) _badge.style.opacity = '0';

      if (typeof Swal === 'undefined') return;
      const items = [
        { date: '16 Nisan 2026', color: '#00d4ff', title: '⌨️ Klavye Ustası Güncellendi',  text: 'Yavaş / Orta / Hızlı seviye seçimi ve büyütülmüş ekran.' },
        { date: '16 Nisan 2026', color: '#38bdf8', title: '🎤 Sözlü Sınav İyileştirmesi', text: '5 soruda bitiyor, her yanıtta Sonraki Soru / Sınavı Bitir butonları.' },
        { date: '16 Nisan 2026', color: '#22c55e', title: '📚 Müfredat Düzeltmesi',        text: '7. sınıf Fen Bilimleri konuları düzeltildi.' },
        { date: '15 Nisan 2026', color: '#8b5cf6', title: '🌙 Tema Düzeltmesi',            text: 'Gece/Gündüz mod çakışması tamamen giderildi.' },
        { date: '14 Nisan 2026', color: '#f59e0b', title: '🤖 AI Bağlantısı Güçlendi',    text: 'Cloudflare önbellekleme ile kesintiler azaldı.' }
      ];
      const html = '<div style="text-align:left;max-height:340px;overflow-y:auto;padding-right:6px;">' +
        items.map(it =>
          '<div style="margin-bottom:9px;padding:9px 11px;background:rgba(255,255,255,.03);border-radius:9px;border-left:3px solid ' + it.color + ';">' +
            '<div style="font-size:.7rem;color:#64748b;">' + it.date + '</div>' +
            '<b style="color:' + it.color + ';font-size:.87rem;">' + it.title + '</b>' +
            '<p style="color:#94a3b8;font-size:.82rem;margin:3px 0 0;">' + it.text + '</p>' +
          '</div>'
        ).join('') + '</div>';
      Swal.fire({
        title: '🔔 Yenilikler',
        html: html,
        confirmButtonText: 'Harika! 👍',
        confirmButtonColor: '#00d4ff',
        background: '#0f172a',
        color: '#f8fafc',
        width: '460px'
      });
    });
  }`;

if (content.includes(oldMenuInfo)) {
  content = content.replace(oldMenuInfo, newMenuInfoAndNotif);
  console.log('Fix 1+2+3: btnMenuInfo intro popup and btnNotif changelog added inside setupVayBeFeatures');
} else {
  console.log('Old pattern not found. Looking for alt...');
  // Find btnMenuInfo location
  const idx = content.indexOf("document.getElementById('btnMenuInfo')");
  if (idx > -1) {
    const ctx = content.substring(idx-50, idx + 500);
    console.log('Context:', ctx.substring(0, 400));
  }
}

fs.writeFileSync('src/app.js', content, 'utf8');
console.log('Done. Size:', content.length);
