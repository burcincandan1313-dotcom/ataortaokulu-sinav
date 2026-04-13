/**
 * duelArena.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import { askAI } from '../api.js';

export class DuelArena {
  constructor(appContainer) {
    this.container = appContainer;
    this.questions = [];
    this.currentIndex = 0;
    this.userScore = 0;
    this.botScore = 0;
    this.timer = null;
    this.timeLeft = 15;
    this.botName = "Gölge Rakip 🥷";
    this.isPlaying = false;
  }

  async startDuel(grade, subject, topic) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.setupUI();
    this.showLoading();

    const prompt = `Sen bir eğitim soru jeneratörüsün.
Bana ${grade} seviyesinde, ${subject} dersinin ${topic} konusuyla ilgili 5 adet çoktan seçmeli zor soru hazırla.
Çıktın KESİNLİKLE sadece aşağıdaki JSON formatında olmalıdır. Hiçbir açıklama yazma:
[
  {
    "q": "Soru metni",
    "opts": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
    "ans": 0 
  }
]
Not: 'ans' doğru cevabın 0-3 arası indeksidir.`;

    try {
      const raw = await askAI(prompt, "Sadece JSON formatında çıktı ver. Markdown bezeleme.");
      const match = raw.match(/\[[\s\S]*\]/);
      if(!match) throw new Error("JSON bulunamadı");
      
      this.questions = JSON.parse(match[0]);
      if(this.questions.length < 1) throw new Error("Soru yok");
      
      this.userScore = 0;
      this.botScore = 0;
      this.currentIndex = 0;
      
      this.renderQuestion();
      
    } catch (e) {
      console.error(e);
      alert("Düello başlatılamadı, sorular hazırlanamadı.");
      this.close();
    }
  }

  setupUI() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'dom-overlay';
    this.overlay.style.display = 'flex';
    this.overlay.style.zIndex = '99999';
    this.overlay.style.background = 'rgba(15, 23, 42, 0.95)';
    this.overlay.style.flexDirection = 'column';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';

    this.overlay.innerHTML = `
      <div style="width: 90%; max-width: 600px; background: var(--bg2); padding: 30px; border-radius: 20px; box-shadow: 0 0 50px rgba(220,38,38,0.2); border: 1px solid var(--bdr); position: relative;">
        <button id="duelClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; color: var(--sub); cursor: pointer;">✖</button>
        <h2 style="text-align: center; color: #dc2626; font-size: 2rem; margin-bottom: 20px; text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">⚔️ DÜELLO ARENASI</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="text-align: center; width: 45%;">
            <div style="font-size: 2rem;">🧑‍🎓</div>
            <div style="font-weight: bold; color: var(--acc);">Sen</div>
            <div style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; margin-top: 5px; overflow: hidden;">
               <div id="duelUserBar" style="height: 100%; width: 0%; background: #22c55e; transition: width 0.3s;"></div>
            </div>
          </div>
          
          <div style="font-size: 2rem; font-weight: 900; color: #ef4444; align-self: center;">VS</div>
          
          <div style="text-align: center; width: 45%;">
            <div style="font-size: 2rem;">🥷</div>
            <div style="font-weight: bold; color: #64748b;">${this.botName}</div>
             <div style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; margin-top: 5px; overflow: hidden;">
               <div id="duelBotBar" style="height: 100%; width: 0%; background: #ef4444; transition: width 0.3s;"></div>
            </div>
          </div>
        </div>

        <div id="duelTimerBox" style="text-align: center; font-size: 2rem; font-weight: bold; font-family: monospace; color: #eab308; margin-bottom: 20px;">⏱️ 15</div>
        
        <div id="duelContent" style="min-height: 200px;"></div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    document.getElementById('duelClose').addEventListener('click', () => this.close());
  }

  showLoading() {
    const content = document.getElementById('duelContent');
    if(content) {
      content.innerHTML = `<div style="text-align: center; padding: 40px;"><div class="jumping-dots"><span></span><span></span><span></span></div><p style="margin-top: 20px; color: var(--sub);">Arena hazırlanıyor... Rakip aranıyor...</p></div>`;
    }
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishDuel();
      return;
    }

    this.timeLeft = 15;
    this.updateTimerDisplay();

    const qData = this.questions[this.currentIndex];
    const content = document.getElementById('duelContent');
    
    let html = `
      <div style="text-align: center; margin-bottom: 10px; color: var(--sub); font-size: 0.9rem;">Soru ${this.currentIndex + 1} / ${this.questions.length}</div>
      <div style="font-size: 1.2rem; font-weight: 600; text-align: center; margin-bottom: 25px;">${qData.q}</div>
      <div style="display: flex; flex-direction: column; gap: 10px;" id="duelOpts">
    `;

    qData.opts.forEach((opt, idx) => {
      html += `<button class="v18-btn duel-opt-btn" data-idx="${idx}" style="padding: 15px; border-radius: 12px; font-size: 1rem; text-align: left; background: var(--bg); border: 2px solid var(--bdr); transition: all 0.2s;">${['A', 'B', 'C', 'D'][idx]}) ${opt}</button>`;
    });

    html += `</div>`;
    content.innerHTML = html;

    const btns = document.querySelectorAll('.duel-opt-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if(this.timer) clearInterval(this.timer);
        this.handleAnswer(parseInt(btn.getAttribute('data-idx')), btns);
      });
    });

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleAnswer(-1, btns); // Time out
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const tb = document.getElementById('duelTimerBox');
    if(tb) {
      tb.innerHTML = `⏱️ ${this.timeLeft}`;
      if(this.timeLeft <= 5) tb.style.color = '#ef4444';
      else tb.style.color = '#eab308';
    }
  }

  handleAnswer(userAnsIdx, btns) {
    const qData = this.questions[this.currentIndex];
    const correctIdx = qData.ans;
    
    // Simulate Shadow Bot answer (80% correct chance)
    const botCorrect = Math.random() < 0.8;
    const botAnsIdx = botCorrect ? correctIdx : (correctIdx + 1) % 4;

    // Show colors
    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === correctIdx) b.style.borderColor = '#22c55e'; // Green
      else if (i === userAnsIdx && userAnsIdx !== correctIdx) b.style.borderColor = '#ef4444'; // Red
    });

    // Update Scores
    if (userAnsIdx === correctIdx) this.userScore++;
    if (botAnsIdx === correctIdx) this.botScore++;

    this.updateProgressBars();

    setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 2000);
  }

  updateProgressBars() {
    const max = this.questions.length;
    const uBar = document.getElementById('duelUserBar');
    const bBar = document.getElementById('duelBotBar');
    if(uBar) uBar.style.width = `${(this.userScore / max) * 100}%`;
    if(bBar) bBar.style.width = `${(this.botScore / max) * 100}%`;
  }

  finishDuel() {
    const content = document.getElementById('duelContent');
    const uBar = document.getElementById('duelUserBar');
    uBar.parentElement.style.display = 'none';
    document.getElementById('duelBotBar').parentElement.style.display = 'none';
    document.getElementById('duelTimerBox').style.display = 'none';

    let resultHtml = "";
    if (this.userScore > this.botScore) {
      resultHtml = `<h1 style="color: #22c55e; font-size: 3rem; margin-bottom: 10px;">🏆 ZAFER!</h1><p style="font-size: 1.2rem;">Gölge botu mağlup ettin!</p>`;
      // Trigger confetti if exists globally
      if(window.triggerConfetti) window.triggerConfetti();
    } else if (this.userScore === this.botScore) {
      resultHtml = `<h1 style="color: #eab308; font-size: 3rem; margin-bottom: 10px;">🤝 BERABERE</h1><p style="font-size: 1.2rem;">Dişe diş bir mücadeleydi!</p>`;
    } else {
      resultHtml = `<h1 style="color: #ef4444; font-size: 3rem; margin-bottom: 10px;">💀 MAĞLUBİYET</h1><p style="font-size: 1.2rem;">Gölge bot senden ${this.botScore - this.userScore} puan önde!</p>`;
    }

    resultHtml += `<button class="onboard-btn ext-style-2" style="margin-top: 30px;" id="duelFinishBtn">Arenadan Çık</button>`;
    content.innerHTML = `<div style="text-align: center; padding: 30px;">${resultHtml}</div>`;

    document.getElementById('duelFinishBtn').addEventListener('click', () => this.close());
  }

  close() {
    if(this.timer) clearInterval(this.timer);
    this.isPlaying = false;
    if(this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
