// src/features/teacherPanel.js
import { StorageManager, state } from '../state.js';

export function openTeacherPanel() {
  const pin = prompt("Öğretmen Paneli PIN kodunu giriniz: (Varsayılan: 1234)");
  if (pin !== "1234") {
      if(window.triggerError) window.triggerError("Hatalı PIN. Giriş reddedildi.");
      else alert("Hatalı PIN!");
      return;
  }

  const roster = StorageManager.get('mega_class_roster') || [];
  const currentName = StorageManager.get(StorageManager.keys.NAME) || 'Bilinmiyor';
  
  let userStats = "";
  if(roster.length === 0) {
     userStats = "<tr><td colspan='3' style='text-align:center;'>Veri bulunmuyor</td></tr>";
  } else {
     userStats = roster.sort((a,b) => b.xp - a.xp).map(r => `
       <tr>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">${r.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align:center;">${r.level || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); text-align:right; color:var(--acc); font-weight:bold;">${r.xp}</td>
       </tr>
     `).join('');
  }

  const existing = document.getElementById('teacherOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'teacherOverlay';
  overlay.className = 'onboard-overlay';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';

  overlay.innerHTML = `
    <div class="onboard-card" style="max-width: 600px; width: 95%; padding: 30px; background: linear-gradient(145deg, #1e1b4b, #312e81); box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 2px solid #818cf8;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
        <h2 style="margin:0; font-size: 2rem; color: #a5b4fc;">👨‍🏫 Öğretmen Kontrol Paneli</h2>
        <button id="btnCloseTeacher" style="background:transparent; border:none; color:#fbbf24; font-size:1.5rem; cursor:pointer;">&times;</button>
      </div>
      
      <p style="color: #cbd5e1; font-size:1rem; margin-bottom:20px;">Bu ekranda laboratuvar cihazında kayıtlı olan tüm öğrencilerin akademik ilerlemelerini denetleyebilirsiniz.</p>
      
      <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; max-height:300px; overflow-y:auto; margin-bottom:25px; border: 1px solid rgba(255,255,255,0.05);">
         <table style="width: 100%; border-collapse: collapse; color: white; text-align:left;">
            <thead>
               <tr>
                  <th style="padding: 10px; border-bottom: 2px solid #6366f1;">Öğrenci Adı</th>
                  <th style="padding: 10px; border-bottom: 2px solid #6366f1; text-align:center;">Seviye</th>
                  <th style="padding: 10px; border-bottom: 2px solid #6366f1; text-align:right;">XP</th>
               </tr>
            </thead>
            <tbody>
               ${userStats}
            </tbody>
         </table>
      </div>

      <div style="display:flex; gap:15px; justify-content:flex-end;">
         <button id="btnParentReport" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 1.1rem; cursor: pointer; box-shadow: 0 5px 15px rgba(34, 197, 94, 0.4);">
             📄 Aktif Kullanıcı (Veli) Raporu
         </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btnCloseTeacher').addEventListener('click', () => {
    overlay.remove();
  });

  document.getElementById('btnParentReport').addEventListener('click', () => {
     generateParentReport(currentName);
  });
}

function generateParentReport(studentName) {
  const historyStr = localStorage.getItem('mega_quiz_history');
  let history = [];
  try { history = JSON.parse(historyStr || '[]'); } catch(e) {}

  let reportHtml = `
    <div id="printReport" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:white; color:black; z-index:9999999; padding:40px; box-sizing:border-box; overflow-y:auto;">
       <div style="text-align:center; border-bottom:3px solid #1e3a8a; padding-bottom:20px; margin-bottom:30px;">
          <h1 style="color:#1e3a8a; margin:0 0 10px 0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Ata Ortaokulu - Akademik Gelişim Raporu</h1>
          <div style="font-size:1.2rem; display:flex; justify-content:space-between; color:#333;">
             <strong>Öğrenci: ${studentName}</strong>
             <strong>Tarih: ${new Date().toLocaleDateString('tr-TR')}</strong>
          </div>
       </div>

       <div style="display:flex; justify-content:space-between; margin-bottom:30px;">
          <div style="border:1px solid #ccc; padding:20px; border-radius:10px; width:48%; background:#f9f9f9;">
             <h3 style="margin-top:0; color:#475569;">Gelişim Analizi</h3>
             <p>Öğrenci gelişimini hızla sürdürmektedir. Genel XP seviyesi: <strong>${state.xp}</strong></p>
             <p>Ata Zeka Asistanı verilerine göre sistemde aktif ve düzenli olarak sorular çözmekte, yetenek ağacını geliştirmektedir.</p>
          </div>
          <div style="border:1px solid #ccc; padding:20px; border-radius:10px; width:48%; background:#f9f9f9;">
             <h3 style="margin-top:0; color:#475569;">Veli Notu</h3>
             <p>Sayın Velimiz,</p>
             <p>Çocuğunuzun ilerlemesi yakından takip edilmektedir. Zayıf ve güçlü yönler detaylı test sonuçları raporumuzda mevcuttur. Desteğiniz eğitim kalitesini artıracaktır.</p>
          </div>
       </div>

       <h2 style="color:#1e3a8a; border-bottom:2px solid #ccc; padding-bottom:10px;">📊 Sınav Deneme Geçmişi</h2>
       <table style="width:100%; border-collapse:collapse; margin-bottom:30px; border:1px solid #ddd;">
          <tr style="background:#f1f5f9;">
             <th style="border:1px solid #ddd; padding:10px; text-align:left;">Sınav Tarihi</th>
             <th style="border:1px solid #ddd; padding:10px; text-align:left;">Branş / Konu</th>
             <th style="border:1px solid #ddd; padding:10px; text-align:center;">Doğru / Toplam</th>
             <th style="border:1px solid #ddd; padding:10px; text-align:center;">Başarı Yüzdesi</th>
          </tr>
  `;

  if(history.length === 0) {
      reportHtml += `<tr><td colspan="4" style="padding:15px; text-align:center;">Henüz bir test çözülmemiş.</td></tr>`;
  } else {
      history.forEach(h => {
         const d = new Date(h.date).toLocaleDateString();
         const sub = h.subject || 'Genel Sınav';
         const clr = h.pct >= 70 ? '#16a34a' : (h.pct >= 40 ? '#d97706' : '#dc2626');
         reportHtml += `
           <tr>
              <td style="border:1px solid #ddd; padding:10px;">${d}</td>
              <td style="border:1px solid #ddd; padding:10px;"><strong>${sub}</strong><br><span style="font-size:0.85rem;color:#666;">${h.topic || ''}</span></td>
              <td style="border:1px solid #ddd; padding:10px; text-align:center; font-weight:bold;">${h.correct} / ${h.total}</td>
              <td style="border:1px solid #ddd; padding:10px; text-align:center; color:${clr}; font-weight:bold;">%${h.pct}</td>
           </tr>
         `;
      });
  }

  reportHtml += `
       </table>
       
       <div style="text-align:center; margin-top:50px; font-size:0.9rem; color:#64748b;">
          Ata Ortaokulu Zeka Asistanı Sistemi Tarafından Otomatik Üretilmiştir.
       </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', reportHtml);

  // Print modülüne stil inject etmemize gerek yok çünkü @media print ayarlarımız `style.css` içerisinde var, ama garantilemek için JS ile print diyoruz.
  setTimeout(() => {
     window.print();
     // Çıktıdan sonra (Print işleminden sonra modalı kapat)
     setTimeout(() => {
        document.getElementById('printReport').remove();
     }, 1000);
  }, 500);
}
