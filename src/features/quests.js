/**
 * quests.js
 * Ata Quest: Günlük Görevler Modülü
 */
import { state, addXP, saveUserData } from '../state.js';
import DOMPurify from 'dompurify';

export class QuestsBoard {
  constructor(appContainer) {
    this.container = appContainer;
    // Görev havuzu
    this.questPool = [
      { id: 'q1', type: 'duel_win', target: 1, xp: 100, title: 'Arenanın Fatihi', desc: "Gölge Bot'a karşı 1 Düello kazan." },
      { id: 'q2', type: 'quiz_solve', target: 5, xp: 50, title: 'Günlük Antrenman', desc: "Test Sihirbazı'nda 5 doğru cevap ver." },
      { id: 'q3', type: 'chat_ask', target: 3, xp: 30, title: 'Bilgi Avcısı', desc: 'Sohbet modunda 3 farklı eğitici soru sor.' }
    ];
  }

  // Günde 1 kez görevleri yenilemek için
  checkAndRefreshQuests() {
    const today = new Date().toDateString();
    if (!state.quests) state.quests = { daily: [], lastUpdate: null };

    if (state.quests.lastUpdate !== today) {
      // Yeni görevler ver (her gün sıfırla)
      const newQuests = this.questPool.map(q => ({
        id: q.id,
        type: q.type,
        target: q.target,
        progress: 0,
        xp: q.xp,
        title: q.title,
        desc: q.desc,
        completed: false,
        claimed: false
      }));
      state.quests.daily = newQuests;
      state.quests.lastUpdate = today;
      saveUserData();
    }
  }

  // Oyundaki aksiyonlar bu fonksiyonu çağırarak progressi artırır
  updateProgress(type, amount = 1) {
    this.checkAndRefreshQuests();
    let updated = false;
    state.quests.daily.forEach(q => {
      if (q.type === type && !q.completed) {
        q.progress += amount;
        if (q.progress >= q.target) {
           q.progress = q.target;
           q.completed = true;
           // Görev tamamlandı bildirimi (SweetAlert)
           if (typeof window !== 'undefined' && window.Swal) {
             window.Swal.fire({
               title: '📜 GÖREV TAMAMLANDI!',
               text: `${q.title} görevini bitirdin! Görev panosuna gidip ${q.xp} XP ödülünü al.`,
               icon: 'info',
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 3000
             });
           }
        }
        updated = true;
      }
    });
    if (updated) saveUserData();
  }

  openBoard() {
    this.checkAndRefreshQuests();

    this.overlay = document.createElement('div');
    this.overlay.className = 'dom-overlay';
    this.overlay.style.display = 'flex';
    this.overlay.style.zIndex = '99999';
    this.overlay.style.background = 'rgba(15, 23, 42, 0.95)';
    this.overlay.style.flexDirection = 'column';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';

    this.render();
    document.body.appendChild(this.overlay);
  }

  render() {
    let html = `
      <div class="rpg-quests-card">
        <button id="questsClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; color: var(--sub); cursor: pointer;">✖</button>
        <h2 style="text-align: center; color: #3b82f6; font-size: 2rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">📜 GÖREV PANOSU</h2>
        <p style="text-align: center; color: var(--sub); margin-bottom: 20px;">Günlük görevleri tamamla ve XP kazan!</p>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
    `;

    state.quests.daily.forEach((q, idx) => {
      const progressPercent = Math.min((q.progress / q.target) * 100, 100);
      let actionHtml = '';

      if (q.claimed) {
         actionHtml = `<span style="color: #10b981; font-weight: bold;">✔️ Ödül Alındı</span>`;
      } else if (q.completed) {
         actionHtml = `<button class="claim-btn" data-idx="${idx}" style="padding: 8px 15px; background: #eab308; color: #000; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; animation: pulse 1.5s infinite;">Ödülü Al (+${q.xp} XP)</button>`;
      } else {
         actionHtml = `<span style="color: var(--sub);">Devam Ediyor</span>`;
      }

      html += `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 10px;">
           <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                 <h3 style="margin: 0 0 5px 0; color: #f8fafc; font-size: 1.1rem;">${q.title}</h3>
                 <p style="margin: 0; color: var(--sub); font-size: 0.85rem;">${q.desc}</p>
              </div>
              <div style="font-weight: bold; color: #3b82f6;">+${q.xp} XP</div>
           </div>
           
           <div style="display: flex; align-items: center; gap: 15px;">
              <div style="flex: 1; height: 8px; background: rgba(0,0,0,0.5); border-radius: 4px; overflow: hidden;">
                 <div style="width: ${progressPercent}%; height: 100%; background: ${q.completed ? '#10b981' : '#3b82f6'}; transition: width 0.3s;"></div>
              </div>
              <div style="font-size: 0.8rem; font-family: monospace; color: var(--sub); width: 40px; text-align: right;">
                 ${q.progress} / ${q.target}
              </div>
              <div style="min-width: 100px; text-align: center;">
                 ${actionHtml}
              </div>
           </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.overlay.innerHTML = DOMPurify.sanitize(html, { ALLOW_DATA_ATTR: true });

    const closeBtn = document.getElementById('questsClose');
    if(closeBtn) {
       closeBtn.addEventListener('click', () => {
         if(this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
       });
    }

    const claimBtns = this.overlay.querySelectorAll('.claim-btn');
    claimBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
         const idx = parseInt(btn.getAttribute('data-idx'), 10);
         const q = state.quests.daily[idx];
         if(q && q.completed && !q.claimed) {
            q.claimed = true;
            saveUserData();
            addXP(q.xp); // XP verilir
            this.render(); // Ekran güncellenir
         }
      });
    });
  }
}
