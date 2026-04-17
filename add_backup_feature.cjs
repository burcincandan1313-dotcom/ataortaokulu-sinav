const fs = require('fs');

// 1. UPDATE HTML
let html = fs.readFileSync('index.html', 'utf8');

const backupButtons = `
             <button class="chip v18-btn" id="btnExportData" style="color:var(--acc);"><i class="fa-solid fa-download"></i> Verilerimi İndir (Yedekle)</button>
             <button class="chip v18-btn" id="btnImportData"><i class="fa-solid fa-upload"></i> Verileri Geri Yükle</button>
             `;

html = html.replace('<!-- 3. Rapor & Araçlar -->', '<!-- 3. Rapor & Araçlar -->'); // Just checking it exists
const insertBefore = '<button class="chip v18-btn" id="btnLogoutUser">';
if (html.includes(insertBefore) && !html.includes('btnExportData')) {
  html = html.replace(insertBefore, backupButtons + '\n             ' + insertBefore);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('HTML updated.');

// 2. UPDATE APP.JS WITH LOGIC
let js = fs.readFileSync('src/app.js', 'utf8');

const logic = `
  // ═══════════════════════════════════════════
  // VERİ YEDEKLEME VE GERİ YÜKLEME 
  // ═══════════════════════════════════════════
  const btnExportData = document.getElementById('btnExportData');
  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      document.body.classList.remove('sidebar-collapsed');
      
      const backupData = {
        v11XP: localStorage.getItem('v11XP'),
        v11LevelIndex: localStorage.getItem('v11LevelIndex'),
        ataProgress: localStorage.getItem('ataProgress'),
        ataLastQType: localStorage.getItem('ataLastQType'),
        ataLastSubCategory: localStorage.getItem('ataLastSubCategory'),
        theme: localStorage.getItem('theme'),
        keyboardBestScore: localStorage.getItem('keyboardBestScore')
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const anchorNode = document.createElement('a');
      anchorNode.setAttribute("href", dataStr);
      anchorNode.setAttribute("download", "AtaMentor_Gelisim_Yedek.json");
      document.body.appendChild(anchorNode);
      anchorNode.click();
      anchorNode.remove();
      
      if(typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Yedekleme Başarılı!',
          text: 'XP, Başarılar ve İlerleme verileriniz "AtaMentor_Gelisim_Yedek.json" olarak indirildi.',
          icon: 'success',
          confirmButtonColor: '#00d4ff',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  const btnImportData = document.getElementById('btnImportData');
  if (btnImportData) {
    btnImportData.addEventListener('click', () => {
      document.body.classList.remove('sidebar-collapsed');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
          try {
            const content = JSON.parse(readerEvent.target.result);
            let restored = 0;
            
            if(content.v11XP !== undefined && content.v11XP !== null) { localStorage.setItem('v11XP', content.v11XP); restored++; }
            if(content.v11LevelIndex !== undefined && content.v11LevelIndex !== null) { localStorage.setItem('v11LevelIndex', content.v11LevelIndex); restored++; }
            if(content.ataProgress) { localStorage.setItem('ataProgress', content.ataProgress); restored++; }
            if(content.ataLastQType) localStorage.setItem('ataLastQType', content.ataLastQType);
            if(content.ataLastSubCategory) localStorage.setItem('ataLastSubCategory', content.ataLastSubCategory);
            if(content.theme) document.documentElement.setAttribute('data-theme', content.theme);
            if(content.keyboardBestScore) localStorage.setItem('keyboardBestScore', content.keyboardBestScore);
            
            if(typeof Swal !== 'undefined' && restored > 0) {
              Swal.fire({
                title: 'Harika! 🚀',
                text: "Eski verileriniz başarıyla yüklendi! Etkili olması için sayfa yenileniyor...",
                icon: 'success',
                confirmButtonColor: '#00d4ff',
                background: '#0f172a',
                color: '#f8fafc'
              }).then(() => window.location.reload());
            } else {
               throw new Error("Boş Dosya");
            }
          } catch(err) {
            console.error(err);
            if(typeof Swal !== 'undefined') {
              Swal.fire('Hata!', 'Geçersiz veya bozuk yedek dosyası yüklemeye çalıştınız.', 'error');
            }
          }
        }
      }
      input.click();
    });
  }
`;

if (!js.includes('btnExportData.addEventListener')) {
  // Append right before the close of setupVayBeFeatures or just at the end.
  // We can attach it to the Window load or at the end of the file.
  // Since some buttons are mapped using setTimeout in setupVayBeFeatures, we can append it globally.
  js += '\n' + logic;
  fs.writeFileSync('src/app.js', js, 'utf8');
  console.log('JS updated.');
}
