import { StorageManager, state } from '../state.js';

// Görev kataloğu
const MISSION_CATALOG = [
  { id: 'quiz', text: 'Bugün 5 quiz sorusu çöz', required: 5, icon: '🧪', rewardXP: 100 },
  { id: 'lesson', text: 'Bir konuda ders çalış', required: 1, icon: '📚', rewardXP: 150 },
  { id: 'duel', text: 'Düello Arenasında 1 maç yap', required: 1, icon: '⚔️', rewardXP: 200 },
  { id: 'msg', text: 'Ataya 10 mesaj gönder', required: 10, icon: '💬', rewardXP: 50 },
  { id: 'voice', text: 'Sözlü Sınava 1 kez katıl', required: 1, icon: '🎤', rewardXP: 150 },
];

function getTodayStr() {
  return new Date().toDateString();
}

export function initDailyMissions() {
  const lastDate = StorageManager.get('mega_last_mission_date');
  const today = getTodayStr();

  let currentMissions = StorageManager.get('mega_daily_missions');

  if (lastDate !== today || !currentMissions || currentMissions.length === 0) {
    // Generate new missions
    const shuffled = [...MISSION_CATALOG].sort(() => 0.5 - Math.random());
    currentMissions = shuffled.slice(0, 3).map(m => ({
      id: m.id,
      text: m.text,
      required: m.required,
      current: 0,
      icon: m.icon,
      rewardXP: m.rewardXP,
      completed: false
    }));
    StorageManager.set('mega_daily_missions', currentMissions);
    StorageManager.set('mega_last_mission_date', today);
  }
}

export function renderDailyQuests() {
  const card = document.getElementById('questCard');
  if (!card) return;

  const currentMissions = StorageManager.get('mega_daily_missions') || [];
  
  card.innerHTML = `
    <div class="sec-lbl" style="display:flex; justify-content:space-between; align-items:center;">
      <span>📋 Günlük Görevler</span>
      <span style="font-size:0.7rem; color:var(--acc); font-weight:bold;">2x XP</span>
    </div>
    ${currentMissions.map(q => {
      const progressPct = Math.min(100, (q.current / q.required) * 100);
      return `
      <div class="quest-item ${q.completed ? 'done' : ''}" style="display:flex; flex-direction:column; gap:6px; margin-bottom:8px; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <div style="display:flex; justify-content:space-between;">
           <span>${q.icon} ${q.text}</span>
           <span>${q.completed ? '✅' : '⬜'}</span>
        </div>
        <div style="width:100%; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
           <div style="width:${progressPct}%; height:100%; background: ${q.completed ? '#22c55e' : 'var(--acc)'}; transition: width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.75rem; color:var(--sub); text-align:right;">
           ${q.current} / ${q.required} (${q.rewardXP} XP)
        </div>
      </div>
    `}).join('')}
  `;
}

export function updateMissionProgress(metricId, amount = 1) {
  let missions = StorageManager.get('mega_daily_missions');
  if (!missions) return;

  let updated = false;
  let newlyCompleted = [];

  missions.forEach(m => {
    if (m.id === metricId && !m.completed) {
      m.current += amount;
      updated = true;
      if (m.current >= m.required) {
        m.current = m.required;
        m.completed = true;
        newlyCompleted.push(m);
      }
    }
  });

  if (updated) {
    StorageManager.set('mega_daily_missions', missions);
    renderDailyQuests();

    // Eğer yeni biten varsa ödülleri ver
    newlyCompleted.forEach(m => {
       // Ödülü ekle
       state.xp += (m.rewardXP * 2); // 2x XP patlaması!
       
       // Animasyon
       if(window.triggerConfetti) window.triggerConfetti();
       
       // Bildirim
       const toast = document.createElement('div');
       toast.style.cssText = "position:fixed; top:20px; right:20px; background:linear-gradient(135deg, #10b981, #059669); color:white; padding:15px 25px; border-radius:12px; font-weight:bold; box-shadow:0 10px 25px rgba(16,185,129,0.5); z-index:99999; animation: slideInX 0.5s ease-out;";
       toast.innerHTML = `🌟 Görev Tamamlandı!<br><span style="font-size:0.85rem; font-weight:normal;">${m.text}</span><br>+${m.rewardXP * 2} XP Taze Kazanıldı!`;
       document.body.appendChild(toast);
       
       setTimeout(() => {
          toast.style.animation = "slideOutX 0.5s ease-in forwards";
          setTimeout(() => toast.remove(), 500);
       }, 3000);
    });
    
    // XP'yi kaydetmek için saveUserData tetikle
    const event = new CustomEvent('mega_xp_updated');
    document.dispatchEvent(event);
  }
}


