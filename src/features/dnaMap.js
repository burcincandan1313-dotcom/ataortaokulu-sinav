// src/features/dnaMap.js

export function renderDnaMap() {
  const historyStr = localStorage.getItem('mega_quiz_history');
  let history = [];
  try {
    history = JSON.parse(historyStr || '[]');
  } catch(e) {}

  const statsBySubject = {};

  // Aggregate stats
  history.forEach(session => {
    const sub = session.subject || 'Genel';
    if(!statsBySubject[sub]) {
       statsBySubject[sub] = { totalQuestions: 0, totalCorrect: 0 };
    }
    statsBySubject[sub].totalQuestions += session.total;
    statsBySubject[sub].totalCorrect += session.correct;
  });

  const existing = document.getElementById('dnaOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'dnaOverlay';
  overlay.className = 'onboard-overlay';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';

  let subjectCards = "";

  if(Object.keys(statsBySubject).length === 0) {
     subjectCards = `<div style="color:var(--sub); text-align:center; padding:20px;">Henüz DNA haritanı oluşturacak kadar verimiz yok. Biraz test çöz!</div>`;
  } else {
     Object.keys(statsBySubject).forEach(sub => {
       const stat = statsBySubject[sub];
       const pct = Math.round((stat.totalCorrect / stat.totalQuestions) * 100);
       
       let color = '#ef4444'; // Kırmızı (Zayıf)
       let icon = '🔴';
       let label = 'Zayıf Yönün (Geliştirilmeli)';
       
       if(pct >= 75) {
          color = '#22c55e'; // Yeşil (Güçlü)
          icon = '🟢';
          label = 'Güçlü Yönün (Mükemmel)';
       } else if (pct >= 40) {
          color = '#eab308'; // Sarı (Orta)
          icon = '🟡';
          label = 'Orta (Biraz tekrar gerek)';
       }

       subjectCards += `
         <div style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-bottom: 10px; border-left: 4px solid ${color};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
               <div style="font-weight:bold; font-size:1.1rem; color:var(--txt);"><span style="margin-right:8px">${icon}</span> ${sub}</div>
               <div style="font-weight:bold; color:${color}; font-size:1.2rem;">%${pct}</div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--sub); margin-bottom: 8px;">
               <span>${stat.totalCorrect} Doğru / ${stat.totalQuestions} Soru</span>
               <span>${label}</span>
            </div>
            <div style="height: 6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
               <div style="height:100%; width:${pct}%; background:${color}; transition: width 0.5s;"></div>
            </div>
         </div>
       `;
     });
  }

  overlay.innerHTML = `
    <div class="onboard-card" style="max-width: 450px; width: 90%; padding: 25px; max-height: 80vh; overflow-y:auto; background: linear-gradient(145deg, var(--bg2), #111827);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
        <h2 style="margin:0; font-size: 1.5rem;">🧬 Akademik DNA Haritan</h2>
        <button id="btnCloseDna" style="background:transparent; border:none; color:var(--sub); font-size:1.5rem; cursor:pointer;">&times;</button>
      </div>
      <p style="color:var(--sub); font-size:0.9rem; margin-bottom:20px;">Geçmiş sınav verilerin analiz edilerek güçlü ve zayıf derslerin tespit edildi.</p>
      
      <div style="display:flex; flex-direction:column; gap:8px;">
         ${subjectCards}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btnCloseDna').addEventListener('click', () => {
    overlay.remove();
  });
}
