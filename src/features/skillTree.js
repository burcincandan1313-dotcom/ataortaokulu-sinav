/**
 * skillTree.js
 * Ata Quest: Yetenek Ağacı Modülü
 */
import { state, unlockSkill } from '../state.js';
import DOMPurify from 'dompurify';

export class SkillTree {
  constructor(appContainer) {
    this.container = appContainer;
    this.skillData = [
      {
        id: 'timeBender',
        name: 'Zaman Bükücü',
        icon: '⏳',
        desc: 'Düello Arenasında ek +5 saniye kazandırır.',
        cost: 1,
        color: '#3b82f6'
      },
      {
        id: 'clairvoyant',
        name: 'Kahin Gözü',
        icon: '👁️',
        desc: 'Quiz Sihirbazı\\'nda yapay zeka ipuçlarının kilidini açar.',
        cost: 2,
        color: '#8b5cf6'
      },
      {
        id: 'luckyAngel',
        name: 'Şans Meleği',
        icon: '🎲',
        desc: 'Zorlu sorularda 50/50 (iki yanlış şıkkı eleme) hakkı verir.',
        cost: 3,
        color: '#ec4899'
      },
      {
        id: 'cosmeticMaster',
        name: 'Kozmetik Ustası',
        icon: '✨',
        desc: 'Karakter kartında efsanevi (Legendary) parlayan efektleri açar.',
        cost: 5,
        color: '#f59e0b'
      }
    ];
  }

  openTree() {
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
    let treeHtml = \`
      <div class="rpg-skill-tree-card">
        <button id="treeClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; color: var(--sub); cursor: pointer;">✖</button>
        <h2 style="text-align: center; color: #10b981; font-size: 2rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">🌳 YETENEK AĞACI</h2>
        <p style="text-align: center; color: var(--sub); margin-bottom: 20px;">Kullanılabilir Yetenek Puanı (SP): <strong style="color: #fbbf24; font-size: 1.2rem;">\${state.skillPoints} SP</strong></p>
        
        <div class="skills-grid">
    \`;

    this.skillData.forEach(skill => {
      const isUnlocked = state.skills?.[skill.id] === true;
      const canUnlock = !isUnlocked && state.skillPoints >= skill.cost;
      
      let statusHtml = '';
      let borderStyle = 'border: 2px solid rgba(255,255,255,0.1);';
      let btnHtml = '';

      if (isUnlocked) {
         statusHtml = '<div style="color: #10b981; font-weight: bold; font-size: 0.8rem; margin-top: 10px;">✅ KİLİDİ AÇIK</div>';
         borderStyle = \`border: 2px solid \${skill.color}; box-shadow: 0 0 15px \${skill.color}40;\`;
      } else {
         if (canUnlock) {
            btnHtml = \`<button class="unlock-btn" data-id="\${skill.id}" data-cost="\${skill.cost}" style="margin-top: 10px; width: 100%; padding: 8px; background: \${skill.color}; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;">Kilidi Aç (\${skill.cost} SP)</button>\`;
         } else {
            statusHtml = \`<div style="color: #ef4444; font-weight: bold; font-size: 0.8rem; margin-top: 10px;">❌ YETERSİZ SP (\${skill.cost} Gerekli)</div>\`;
         }
      }

      treeHtml += \`
        <div class="skill-node" style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 15px; text-align: center; position: relative; transition: transform 0.2s; \${borderStyle}">
           <div style="font-size: 2.5rem; margin-bottom: 10px;">\${skill.icon}</div>
           <h3 style="margin: 0 0 5px 0; color: #f8fafc; font-size: 1.1rem;">\${skill.name}</h3>
           <p style="color: var(--sub); font-size: 0.85rem; line-height: 1.3; margin: 0; min-height: 40px;">\${skill.desc}</p>
           \${statusHtml}
           \${btnHtml}
        </div>
      \`;
    });

    treeHtml += \`
        </div>
      </div>
    \`;

    this.overlay.innerHTML = DOMPurify.sanitize(treeHtml, { ALLOW_DATA_ATTR: true });

    const closeBtn = document.getElementById('treeClose');
    if(closeBtn) {
       closeBtn.addEventListener('click', () => {
         if(this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
       });
    }

    const unlockBtns = this.overlay.querySelectorAll('.unlock-btn');
    unlockBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
         const id = btn.getAttribute('data-id');
         const cost = parseInt(btn.getAttribute('data-cost'), 10);
         if(unlockSkill(id, cost)) {
            // Re-render
            this.render();
         }
      });
    });
  }
}
