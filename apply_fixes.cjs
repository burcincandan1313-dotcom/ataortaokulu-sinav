const fs = require('fs');

// Fix 1: Notification Badge & Sidebar Toggles
let appJS = fs.readFileSync('src/app.js', 'utf8');

appJS = appJS.replace(
  'const _badge = _wrap ? _wrap.querySelector(\'span\') : null;\r\n      if (_badge) _badge.style.opacity = \'0\';',
  'const _badge = _wrap ? _wrap.querySelector(\'span\') : null;\n      if (_badge) { _badge.style.opacity = \'0\'; _badge.style.display = \'none\'; localStorage.setItem(\'mega_notif_read\', \'true\'); }'
);

appJS = appJS.replace(
  'const _notifBtn = document.getElementById(\'btnNotif\');\r\n  if (_notifBtn) {\r\n    _notifBtn.addEventListener',
  'const _notifBtn = document.getElementById(\'btnNotif\');\n  if (_notifBtn) {\n    if (localStorage.getItem(\'mega_notif_read\') === \'true\') {\n      const _wrap = _notifBtn.closest(\'div[style*="position:relative"]\') || _notifBtn.parentElement;\n      const _badge = _wrap ? _wrap.querySelector(\'span\') : null;\n      if (_badge) { _badge.style.opacity = \'0\'; _badge.style.display = \'none\'; }\n    }\n    _notifBtn.addEventListener'
);

appJS = appJS.replace(
  'if (window.innerWidth <= 768) {\r\n      if (sidebar && sidebar.classList.contains(\'open\')) closeMobileSidebar();',
  'if (window.innerWidth <= 768 || document.body.classList.contains(\'device-phone\')) {\n      if (sidebar && sidebar.classList.contains(\'open\')) closeMobileSidebar();'
);

appJS = appJS.replace(
  'if (window.innerWidth <= 1024) {\r\n      if (rightSidebar.classList.contains(\'open\')) {',
  'if (window.innerWidth <= 1024 || document.body.classList.contains(\'device-phone\') || document.body.classList.contains(\'device-app\')) {\n      if (rightSidebar.classList.contains(\'open\')) {'
);

fs.writeFileSync('src/app.js', appJS, 'utf8');


// Fix 2: Duel Arena styling
let duelJS = fs.readFileSync('src/features/duelArena.js', 'utf8');

duelJS = duelJS.replace(
  '<select id="da-subject" style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:#fff; font-size:1rem;">',
  '<select id="da-subject" style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:#fff; font-size:1rem;">\n          <option style="background:#1e293b;color:#f1f5f9;" value="" disabled selected>Ders Seçiniz</option>'
);
duelJS = duelJS.replace(
  '<select id="da-topic" disabled style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:#fff; font-size:1rem;">',
  '<select id="da-topic" disabled style="width:100%; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:#fff; font-size:1rem;">\n          <option style="background:#1e293b;color:#f1f5f9;" value="" disabled selected>Önce ders seçiniz</option>'
);

fs.writeFileSync('src/features/duelArena.js', duelJS, 'utf8');

// Fix 3: Index.html version cache bump
let idxHtml = fs.readFileSync('index.html', 'utf8');
idxHtml = idxHtml.replace(/v=2026/g, 'v=2028');
fs.writeFileSync('index.html', idxHtml, 'utf8');

console.log('Fixes successfully applied.');
