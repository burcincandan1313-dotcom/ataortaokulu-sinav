// src/features/leaderboard.js
import { StorageManager } from '../state.js';

export function renderLeaderboard() {
  const currentName = StorageManager.get(StorageManager.keys.NAME) || 'Sen';
  let roster = StorageManager.get('mega_class_roster') || [];
  
  // Eğer hiç mock yoksa baz olarak yapay rakipler ekle
  const mockStudents = [
    { name: 'Kaan (LGS Canavarı)', xp: 1250, avatar: '😎', fake: true },
    { name: 'Ayşe (Çalışkan)', xp: 850, avatar: '👩‍🏫', fake: true },
    { name: 'Arda (Gamer)', xp: 450, avatar: '🎮', fake: true },
    { name: 'Zeynep (Sessiz)', xp: 120, avatar: '🤫', fake: true }
  ];

  // Roster içindeki kayıtları mock ile birleştir
  // Sadece aynı isimli olmayan mock'ları al
  let combined = [...roster];
  mockStudents.forEach(ms => {
    if (!combined.find(c => c.name === ms.name)) {
       combined.push(ms);
    }
  });

  // Puana göre büyükten küçüğe sırala
  combined.sort((a, b) => b.xp - a.xp);

  // Zaten varsa sil, üst üste açılmasın
  const existing = document.getElementById('leaderboardOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'leaderboardOverlay';
  overlay.className = 'onboard-overlay';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';

  const modalHtml = `
    <div class="onboard-card" style="max-width: 400px; padding: 25px; max-height: 80vh; overflow-y:auto; background: linear-gradient(145deg, var(--bg2), #111827);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
        <h2 style="margin:0; font-size: 1.5rem;">🏆 Sınıf Liderlik Tablosu</h2>
        <button id="btnCloseLeaderboard" style="background:transparent; border:none; color:var(--sub); font-size:1.5rem; cursor:pointer;">&times;</button>
      </div>
      
      <p style="color:var(--sub); font-size:0.9rem; margin-bottom:20px;">Bu laboratuvar bilgisayarında veya sınıfta çalışan öğrenciler arasındaki sıralamanız.</p>
      
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${combined.map((student, index) => {
           let rankCls = 'lb-rank-other';
           if (index === 0) rankCls = 'lb-rank-1';
           else if (index === 1) rankCls = 'lb-rank-2';
           else if (index === 2) rankCls = 'lb-rank-3';

           const isMe = student.name === currentName;
           const bgClass = isMe ? 'background: rgba(34, 197, 94, 0.15); border: 1px solid var(--acc);' : 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);';

           return `
             <div style="display:flex; align-items:center; padding: 12px; border-radius: 12px; ${bgClass} transition: transform 0.2s;">
                <div class="${rankCls}" style="width: 30px; font-weight: bold; font-size: 1.2rem; color: #fff;">
                  ${index === 0 ? '👑' : index + 1}
                </div>
                <div style="font-size: 1.8rem; margin: 0 15px;">${student.avatar || '🧑‍🎓'}</div>
                <div style="flex-grow: 1;">
                   <div style="font-weight: 700; font-size:1.1rem; color: ${isMe ? 'var(--acc)' : 'var(--txt)'}">${student.name} ${isMe ? '(Sen)' : ''}</div>
                   <div style="font-size: 0.85rem; color: var(--sub);">${student.xp} XP</div>
                </div>
             </div>
           `;
        }).join('')}
      </div>
    </div>
  `;

  overlay.innerHTML = modalHtml;
  document.body.appendChild(overlay);

  document.getElementById('btnCloseLeaderboard').addEventListener('click', () => {
    overlay.remove();
  });
}
