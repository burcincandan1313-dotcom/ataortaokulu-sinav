const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf8');

const handler = `
// ═══════════════════════════════════════════
// BİLDİRİM ZİLİ — Yenilikler Changelog
// ═══════════════════════════════════════════
const _btnNotif = document.getElementById('btnNotif');
if (_btnNotif) {
  _btnNotif.addEventListener('click', () => {
    const _badge = _btnNotif.parentElement
      ? _btnNotif.parentElement.querySelector('span')
      : null;
    if (_badge) _badge.style.display = 'none';

    if (typeof Swal === 'undefined') return;

    const changelogItems = [
      { date: '16 Nisan 2026', color: '#00d4ff', title: '\u2328\uFE0F Klavye Ustas\u0131 G\u00fcncellendi',   text: 'Yava\u015f / Orta / H\u0131zl\u0131 seviye se\u00e7imi ve b\u00fcy\u00fct\u00fclm\u00fc\u015f oyun ekran\u0131.' },
      { date: '16 Nisan 2026', color: '#38bdf8', title: '\uD83C\uDFA4 S\u00f6zl\u00fc S\u0131nav \u0130yile\u015fmesi',   text: '5 soruda bitiyor, her sorudan sonra aksiyon butonlar\u0131 \u00e7\u0131k\u0131yor.' },
      { date: '16 Nisan 2026', color: '#22c55e', title: '\uD83D\uDCDA M\u00fcfredat D\u00fczeltmesi',         text: '7. s\u0131n\u0131f Fen Bilimleri konular\u0131 d\u00fczeltildi, Fizik ba\u015fl\u0131\u011f\u0131 kald\u0131r\u0131ld\u0131.' },
      { date: '15 Nisan 2026', color: '#8b5cf6', title: '\uD83C\uDF19 Tema D\u00fczeltmesi',                text: 'Gece/G\u00fcnd\u00fcz mod \u00e7ift handler \u00e7ak\u0131\u015fmas\u0131 giderildi.' },
      { date: '14 Nisan 2026', color: '#f59e0b', title: '\uD83E\uDD16 AI Ba\u011flant\u0131s\u0131 G\u00fc\u00e7lendirildi', text: 'Cloudflare \u00f6nbellekleme ile ba\u011flant\u0131 kesinimi neredeyse s\u0131f\u0131rland\u0131.' }
    ];

    const itemsHtml = changelogItems.map(item =>
      '<div style="margin-bottom:10px;padding:9px 11px;background:rgba(255,255,255,.03);border-radius:9px;border-left:3px solid ' + item.color + ';">' +
        '<div style="font-size:.7rem;color:#64748b;margin-bottom:3px;">' + item.date + '</div>' +
        '<b style="color:' + item.color + ';font-size:.88rem;">' + item.title + '</b>' +
        '<p style="color:#94a3b8;font-size:.83rem;margin:3px 0 0;">' + item.text + '</p>' +
      '</div>'
    ).join('');

    Swal.fire({
      title: '\uD83D\uDD14 Yenilikler',
      html: '<div style="text-align:left;max-height:360px;overflow-y:auto;padding-right:4px;">' + itemsHtml + '</div>',
      confirmButtonText: 'Harika! \uD83D\uDC4D',
      confirmButtonColor: '#00d4ff',
      background: '#0f172a',
      color: '#f8fafc',
      width: '460px'
    });
  });
}
`;

content = content + handler;
fs.writeFileSync('src/app.js', content, 'utf8');
console.log('Notification handler added. Size:', content.length);
console.log('btnNotif in app.js:', content.includes('_btnNotif'));
