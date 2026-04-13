export class SuperZekaDashboard {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
  }

  loadData() {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('quiz_history')) || [];
    } catch(e) {}
    
    // Aggregation for Dashboard
    const data = {
      totalQuizzes: history.length,
      correctAnswers: history.filter(h => h.isCorrect).length,
      wrongAnswers: history.filter(h => !h.isCorrect).length,
      subjects: {}
    };

    data.successRate = data.totalQuizzes > 0 ? Math.round((data.correctAnswers / data.totalQuizzes) * 100) : 0;

    history.forEach(h => {
      if(!data.subjects[h.subject]) {
        data.subjects[h.subject] = { total: 0, correct: 0 };
      }
      data.subjects[h.subject].total += 1;
      if (h.isCorrect) data.subjects[h.subject].correct += 1;
    });

    return data;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    
    const data = this.loadData();
    
    this.overlay = document.createElement('div');
    this.overlay.className = 'dom-overlay';
    this.overlay.style.display = 'flex';
    this.overlay.style.zIndex = '99999';
    this.overlay.style.background = 'rgba(15, 23, 42, 0.95)';
    this.overlay.style.flexDirection = 'column';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';

    let subjectBars = '';
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    let cIdx = 0;

    Object.keys(data.subjects).forEach(key => {
      const s = data.subjects[key];
      const percent = Math.round((s.correct / s.total) * 100);
      const color = colors[cIdx % colors.length];
      
      subjectBars += `
        <div style="margin-bottom: 15px;">
           <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #cbd5e1; margin-bottom: 5px;">
              <span>${key}</span>
              <span>%${percent} (${s.correct}/${s.total})</span>
           </div>
           <div style="height: 12px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; border: 1px solid #334155;">
              <div style="width: ${percent}%; height: 100%; background: ${color}; transition: width 1s ease-out; box-shadow: 0 0 10px ${color};"></div>
           </div>
        </div>
      `;
      cIdx++;
    });

    if(Object.keys(data.subjects).length === 0) {
      subjectBars = '<div style="color:#64748b; text-align:center; padding: 20px;">Henüz hiç sınav verisi yok. Önce biraz çalış! 🤓</div>';
    }

    this.overlay.innerHTML = `
      <div style="width: 90%; max-width: 900px; background: #0f172a; padding: 30px; border-radius: 20px; border: 1px solid #334155; box-shadow: 0 0 50px rgba(0,0,0,0.8); position: relative; color: white;">
        <button id="dashClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 2rem; color: #64748b; cursor: pointer;">✖</button>
        
        <h2 style="font-size: 2.5rem; margin: 0 0 10px 0; color: #e2e8f0; display:flex; align-items:center; gap: 10px;"><span style="font-size: 3rem;">📊</span> Süper Zeka Zirvesi</h2>
        <p style="color: #94a3b8; margin-bottom: 30px;">Öğrenci Analitik Raporu</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
           <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid #334155;">
              <div style="font-size: 3rem; font-weight: 900; color: #3b82f6;">${data.totalQuizzes}</div>
              <div style="color: #94a3b8; font-size: 0.9rem;">Toplam Çözülen Soru</div>
           </div>
           
           <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid #334155;">
              <div style="font-size: 3rem; font-weight: 900; color: #10b981;">${data.correctAnswers}</div>
              <div style="color: #94a3b8; font-size: 0.9rem;">Doğru Cevaplar</div>
           </div>

           <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 20px; border-radius: 15px; text-align: center; border: 1px solid #334155;">
              <div style="font-size: 3rem; font-weight: 900; color: #f59e0b;">%${data.successRate}</div>
              <div style="color: #94a3b8; font-size: 0.9rem;">Genel Başarı Oranı</div>
           </div>
        </div>

        <div style="background: rgba(30, 41, 59, 0.5); padding: 25px; border-radius: 15px; border: 1px solid #334155;">
           <h3 style="margin-top: 0; color: #e2e8f0; font-size: 1.5rem; margin-bottom: 20px;">Ders Bazlı Performans</h3>
           ${subjectBars}
        </div>

      </div>
    `;

    document.body.appendChild(this.overlay);

    document.getElementById('dashClose').addEventListener('click', () => this.close());
  }

  close() {
    this.isOpen = false;
    if(this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
