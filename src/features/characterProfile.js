/**
 * characterProfile.js
 * Ata Quest: Karakter Profili Modülü
 */
import { state } from '../state.js';
import { StorageManager } from '../state.js';

export class CharacterProfile {
  constructor(appContainer) {
    this.container = appContainer;
  }

  getTitle(level) {
    if (level < 5) return 'Acemi Çaylak';
    if (level < 10) return 'Öğrenci';
    if (level < 20) return 'Bilgi Avcısı';
    if (level < 30) return 'Kahin';
    if (level < 50) return 'Bilge';
    return 'Efsanevi Ata Asistanı';
  }

  openProfile() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'dom-overlay';
    this.overlay.style.display = 'flex';
    this.overlay.style.zIndex = '99999';
    this.overlay.style.background = 'rgba(15, 23, 42, 0.95)';
    this.overlay.style.flexDirection = 'column';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';

    const avatar = StorageManager.get(StorageManager.keys.AVATAR) || '🧑‍🎓';
    const name = StorageManager.get(StorageManager.keys.NAME) || 'Karakter';
    const nextLevelXP = state.level * 100;
    const progressPercent = Math.min((state.xp / nextLevelXP) * 100, 100);

    const title = this.getTitle(state.level);

    let badgesHtml = '';
    // Unlock edilmiş özelliklere göre basit rozetler (Badges)
    if (state.level >= 5) badgesHtml += '<div class="profile-badge" title="5. Seviye Ulaşıldı">🔥</div>';
    if (state.level >= 10) badgesHtml += '<div class="profile-badge" title="10. Seviye Ulaşıldı">⭐</div>';
    if (state.skills?.timeBender) badgesHtml += '<div class="profile-badge" title="Zaman Bükücü Unlocked">⏳</div>';
    if (state.skills?.clairvoyant) badgesHtml += '<div class="profile-badge" title="Kahin Unlocked">👁️</div>';
    if (badgesHtml === '') badgesHtml = '<span style="color: var(--sub); font-size: 0.85rem;">Henüz rozet yok</span>';

    this.overlay.innerHTML = \`
      <div class="rpg-profile-card">
        <button id="profileClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; color: var(--sub); cursor: pointer;">✖</button>
        
        <div class="profile-header">
           <div class="profile-avatar-wrap">
              \${avatar}
           </div>
           <div class="profile-info">
              <h2>\${name}</h2>
              <div class="profile-title">\${title}</div>
           </div>
        </div>

        <div class="profile-stats">
           <div class="stat-box">
              <div class="stat-value">\${state.level}</div>
              <div class="stat-label">Seviye</div>
           </div>
           <div class="stat-box">
              <div class="stat-value">\${state.skillPoints}</div>
              <div class="stat-label">Yetenek Puanı</div>
           </div>
           <div class="stat-box">
              <div class="stat-value">\${state.streak}</div>
              <div class="stat-label">Günlük Seri</div>
           </div>
        </div>

        <div class="profile-xp-section">
           <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: bold; color: var(--acc);">XP İlerlemesi</span>
              <span style="color: var(--sub); font-size: 0.9rem;">\${state.xp} / \${nextLevelXP} XP</span>
           </div>
           <div class="xp-bar-bg">
              <div class="xp-bar-fill" style="width: \${progressPercent}%"></div>
           </div>
        </div>

        <div class="profile-badges-section">
           <h3 style="margin-bottom: 10px; font-size: 1.1rem; color: #e2e8f0;">Kazanılan Rozetler</h3>
           <div class="badges-container">
              \${badgesHtml}
           </div>
        </div>

      </div>
    \`;

    document.body.appendChild(this.overlay);

    document.getElementById('profileClose').addEventListener('click', () => {
      if(this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    });
  }
}
