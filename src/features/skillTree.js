/**
 * skillTree.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import { askAI } from '../api.js';

export class SkillTree {
  constructor(appContainer) {
    this.container = appContainer;
    this.isOpen = false;
    // Core structure of our skill tree
    this.treeData = {
      core: { name: "Ata Çekirdeği", level: 1, req: 0 },
      branches: [
        { id: "math", name: "Matematik", sub: ["Sayılar", "Geometri", "Cebir"], icon: "🔢", color: "#3b82f6" },
        { id: "sci", name: "Fen Bilimleri", sub: ["Fizik", "Kimya", "Biyoloji"], icon: "🔬", color: "#10b981" },
        { id: "lang", name: "Türkçe", sub: ["Dil Bilgisi", "Paragraf", "Kelime"], icon: "📖", color: "#f59e0b" },
        { id: "social", name: "Sosyal", sub: ["Tarih", "Coğrafya", "Vatandaşlık"], icon: "🌍", color: "#6366f1" }
      ]
    };
  }

  loadStats() {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('quiz_history')) || [];
    } catch(e) {}
    
    // Aggregation
    const stats = {};
    history.forEach(h => {
      const subject = h.subject.toLowerCase();
      if(!stats[subject]) stats[subject] = 0;
      if(h.isCorrect) stats[subject] += 1;
    });
    
    return stats;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    const stats = this.loadStats();
    
    this.overlay = document.createElement('div');
    this.overlay.className = 'dom-overlay';
    this.overlay.style.display = 'flex';
    this.overlay.style.zIndex = '99999';
    this.overlay.style.background = 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)';
    this.overlay.style.flexDirection = 'column';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';

    let branchesHTML = '';

    // Calculate dynamic branching based on RPG level
    this.treeData.branches.forEach((branch, idx) => {
      // Fuzzy matching for subjects
      const matchKey = Object.keys(stats).find(k => k.includes(branch.name.toLowerCase().substring(0,3)));
      const exp = matchKey ? stats[matchKey] : 0;
      
      let level = 1; // Başlangıçta hepsi 1. level açık olsun
      if(exp > 0) level = 2;
      if(exp >= 5) level = 3;

      let subHtml = '';
      branch.sub.forEach((s, i) => {
        const isUnlocked = level >= (i + 1);
        subHtml += `
          <div style="font-size: 0.8rem; padding: 5px 10px; background: ${isUnlocked ? branch.color : '#334155'}; color: ${isUnlocked ? '#fff' : '#64748b'}; border-radius: 12px; margin: 3px; border: 1px solid ${isUnlocked ? '#fff' : '#475569'}; ${isUnlocked ? 'box-shadow: 0 0 10px '+branch.color : ''}; transition: all 0.3s; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};" class="sk-node" data-sub="${s}" data-subject="${branch.name}">
             ${isUnlocked ? '✨' : '🔒'} ${s}
          </div>
        `;
      });

      const glow = level > 0 ? `box-shadow: 0 0 20px ${branch.color}; border-color: ${branch.color};` : 'border-color: #334155; opacity: 0.7;';

      branchesHTML += `
        <div style="display: flex; flex-direction: column; align-items: center; margin: 10px;">
           <div style="font-size: 2.5rem; background: #0f172a; border: 3px solid; ${glow} border-radius: 50%; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; position: relative;">
              ${branch.icon}
              <div style="position: absolute; bottom: -10px; background: #000; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; border: 1px solid ${branch.color}; color: #fff;">LVL ${level}</div>
           </div>
           <strong style="color: ${level > 0 ? '#fff' : '#64748b'}; margin-bottom: 10px;">${branch.name}</strong>
           <div style="display: flex; flex-direction: column; gap: 5px; opacity: ${level > 0 ? 1 : 0.5}">
              ${subHtml}
           </div>
        </div>
      `;
    });

    this.overlay.innerHTML = `
      <div style="width: 95%; max-width: 800px; padding: 20px; position: relative; color: white;">
        <button id="skillClose" style="position: absolute; right: 10px; top: 10px; background: transparent; border: none; font-size: 2.2rem; color: #ef4444; cursor: pointer; z-index: 999999; transition: transform 0.2s; outline: none;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Kapat">✖</button>
        
        <div style="text-align: center; margin-bottom: 40px;">
           <h2 style="font-size: 3rem; margin: 0; color: #fbbf24; text-shadow: 0 0 20px rgba(251,191,36,0.5);">🌳 YETENEK AĞACI</h2>
           <p style="color: #94a3b8;">Quiz çözdükçe yetenek dalların aydınlanır ve güçlenir.</p>
        </div>

        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; position: relative;">
           <!-- Central Core -->
           <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -1; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%);"></div>
           
           ${branchesHTML}
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    const closeBtn = this.overlay.querySelector('#skillClose');
    if(closeBtn) {
       closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.close();
       });
    }
    
    // Add interactive click to unlocked nodes
    const nodes = this.overlay.querySelectorAll('.sk-node');
    nodes.forEach(node => {
       node.addEventListener('click', () => {
         if (node.innerText.includes('🔒')) {
             if(window.triggerError) window.triggerError("Bu dalı açmak için ana derste daha fazla Quiz çözmelisin!");
             return;
         }
         // Start an instant quiz directly for that specific skill
         const sub = node.getAttribute('data-sub');
         const subject = node.getAttribute('data-subject');
         
         if(typeof window.openStudyWizard !== 'undefined' || true) { // Bypass check
            this.close();
            // Direkt quiz komutunu chat'e bas ve yolla
            const grade = window.studySelections?.grade || 7;
            if(!window.studySelections) window.studySelections = {};
            window.studySelections.subject = subject;
            window.studySelections.topic = sub;
            const msg = `/quiz ${grade}. Sınıf ${subject}, ${sub} konusu hakkında 3 soruluk test oluştur.`;
            const inp = document.getElementById('userInput');
            const btn = document.getElementById('btnSendMessage');
            if(inp && btn) {
               inp.value = msg;
               btn.click();
            }
         }
       })
    });
  }

  close() {
    this.isOpen = false;
    if(this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

