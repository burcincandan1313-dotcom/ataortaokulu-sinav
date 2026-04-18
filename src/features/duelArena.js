/**
 * duelArena.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import { askAI } from '../api.js';
import DOMPurify from 'dompurify';
import { addXP } from '../state.js';
import { QuestsBoard } from './quests.js';
import { curriculumData } from '../curriculum.js';

export class DuelArena {
  constructor(appContainer) {
    this.container = appContainer;
    this.questions = [];
    this.currentIndex = 0;
    this.userScore = 0;
    this.botScore = 0;
    this.timer = null;
    this.timeLeft = 15;
    this.maxTime = 15;
    this.botName = "Gölge Rakip 🥷";
    this.isPlaying = false;
  }

  // Lobby ekranı
  openLobby(defaultGrade) {
    if (this.isPlaying) return;
    const grade = defaultGrade || '8';
    let subjects = ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilgiler', 'İngilizce', 'Din Kültürü ve Ahlak Bilgisi'];
    if (curriculumData[grade]) {
      subjects = Object.keys(curriculumData[grade]);
    }

    this.setupLobbyUI(grade, subjects);
  }

  setupLobbyUI(grade, subjects) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'dom-overlay';
    this.overlay.style.display = 'flex';
    this.overlay.style.zIndex = '99999';
    this.overlay.style.background = 'rgba(15, 23, 42, 0.95)';
    this.overlay.style.flexDirection = 'column';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';

    const subjectOptions = subjects.map(s => `<option value="${s}">${s}</option>`).join('');

    this.overlay.innerHTML = `
      <div style="width: 90%; max-width: 600px; background: var(--bg2); padding: 30px; border-radius: 20px; box-shadow: 0 0 50px rgba(220,38,38,0.2); border: 1px solid var(--bdr); position: relative;">
        <button id="duelClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; color: var(--sub); cursor: pointer;">✖️</button>
        <h2 style="text-align: center; color: #dc2626; font-size: 2rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 900; letter-spacing: 2px;">⚔️ DÜELLO ARENASI LOBİSİ</h2>
        <p style="text-align: center; color: var(--sub); margin-bottom: 25px;">Rakibin Gölge Bot seni bekliyor. Ayarlarını yap ve savaşa hazırlan!</p>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div>
            <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Sınıf Seçimi:</label>
            <select id="lobbyGrade" style="width: 100%; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.3); color: var(--txt); border: 1px solid var(--bdr); outline: none;">
              <option value="1">1. Sınıf</option>
              <option value="2">2. Sınıf</option>
              <option value="3">3. Sınıf</option>
              <option value="4">4. Sınıf</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8" selected>8. Sınıf</option>
              <option value="9">9. Sınıf</option>
              <option value="10">10. Sınıf</option>
              <option value="11">11. Sınıf</option>
              <option value="12">12. Sınıf</option>
            </select>
          </div>
          <div>
            <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Ders Seçimi:</label>
            <select id="lobbySubject" style="width: 100%; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.3); color: var(--txt); border: 1px solid var(--bdr); outline: none;">
              ${subjectOptions}
            </select>
          </div>
          <div>
            <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Konu Seçimi:</label>
            <select id="lobbyTopic" style="width: 100%; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.3); color: var(--txt); border: 1px solid var(--bdr); outline: none;">
              <option value="Genel">Tüm Konular (Genel)</option>
            </select>
          </div>
          <div style="display: flex; gap: 15px;">
             <div style="flex: 1;">
                <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Soru Sayısı:</label>
                <select id="lobbyQCount" style="width: 100%; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.3); color: var(--txt); border: 1px solid var(--bdr); outline: none;">
                  <option value="5" selected>5 Soru (Hızlı)</option>
                  <option value="10">10 Soru (Standart)</option>
                  <option value="15">15 Soru (Maraton)</option>
                </select>
             </div>
             <div style="flex: 1;">
                <label style="color: var(--txt); font-weight: bold; margin-bottom: 5px; display: block;">Soru Başı Süre:</label>
                <select id="lobbyTime" style="width: 100%; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.3); color: var(--txt); border: 1px solid var(--bdr); outline: none;">
                  <option value="10">10 Saniye (Zor)</option>
                  <option value="15" selected>15 Saniye (Normal)</option>
                  <option value="30">30 Saniye (Rahat)</option>
                </select>
             </div>
          </div>
        </div>

        <button id="btnStartDuelActual" class="onboard-btn" style="width: 100%; margin-top: 30px; background: linear-gradient(135deg, #dc2626, #b91c1c); border: none; padding: 15px; border-radius: 12px; font-weight: bold; font-size: 1.2rem; cursor: pointer; color: white;">⚔️ SAVAŞA BAŞLA!</button>
      </div>
    `;

    document.body.appendChild(this.overlay);

    const gradeSelect = document.getElementById('lobbyGrade');
    const subjectSelect = document.getElementById('lobbySubject');
    const topicSelect = document.getElementById('lobbyTopic');

    const updateSubjects = () => {
      const g = gradeSelect.value;
      let newSubjects = ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilgiler', 'İngilizce', 'Din Kültürü ve Ahlak Bilgisi'];
      if (curriculumData[g]) {
        newSubjects = Object.keys(curriculumData[g]);
      }
      subjectSelect.innerHTML = newSubjects.map(s => `<option value="${s}">${s}</option>`).join('');
      updateTopics();
    };

    const updateTopics = () => {
      const g = gradeSelect.value;
      const subj = subjectSelect.value;
      if (curriculumData[g] && curriculumData[g][subj]) {
        const topics = curriculumData[g][subj];
        topicSelect.innerHTML = '<option value="Genel">Tüm Konular (Genel)</option>' + topics.map(t => `<option value="${t}">${t}</option>`).join('');
      } else {
        topicSelect.innerHTML = '<option value="Genel">Tüm Konular (Genel)</option>';
      }
    };

    gradeSelect.addEventListener('change', updateSubjects);
    subjectSelect.addEventListener('change', updateTopics);
    
    // Initialize subjects for selected grade
    if(gradeSelect.value !== grade) {
       gradeSelect.value = grade;
    }
    updateSubjects();

    document.getElementById('duelClose').addEventListener('click', () => {
      if(this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    });

    document.getElementById('btnStartDuelActual').addEventListener('click', () => {
      const s = subjectSelect.value;
      const t = topicSelect.value;
      const qc = parseInt(document.getElementById('lobbyQCount').value);
      const time = parseInt(document.getElementById('lobbyTime').value);
      const g = document.getElementById('lobbyGrade').value;
      this.startActualDuel(g, s, t, qc, time);
    });
  }

  // Bu metot dışarıdan çağrıldığında uyumluluk için korundu, ancak artık Lobby açacak
  startDuel(grade, subject, topic) {
     this.openLobby(grade);
  }

  async startActualDuel(grade, subject, topic, qCount, timeLimit) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.maxTime = timeLimit;
    
    // Eski UI'yi temizle ve arenayı kur
    if(this.overlay && this.overlay.parentNode) {
       this.overlay.parentNode.removeChild(this.overlay);
    }
    this.setupArenaUI();
    this.showLoading();

    // Throttle bypass: 2.1 sn bekle (son API çağrısından sonra)
    await new Promise(r => setTimeout(r, 2100));

    const gradeNum = parseInt(grade);
    let kademeTalimat = gradeNum <= 4
      ? 'Çok kısa, somut, günlük hayattan sorular. 3 şık (A, B, C). Şıkları çok kısa tut.'
      : gradeNum <= 8
      ? 'LGS tarzı, okuduğunu anlama gerektiren. 4 şık (A, B, C, D). MEB müfredatına uygun.'
      : 'YKS tarzı, analiz gerektiren. 4 şık (A, B, C, D). Akademik dil kullan.';

    const prompt = `Sen bir soru üretme motorusun.
${grade} düzeyinde, ${subject} dersinin ${topic} konusundan ${qCount} adet çoktan seçmeli soru hazırla.
${kademeTalimat}
Kavram yanılgılarını hedefleyen çeldiriciler kullan. Ezber değil, düşündüren sorular olsun.
SADECE şu JSON array formatında dön, başka hiçbir şey yazma:
[{"q":"Soru metni","opts":["A şıkkı","B şıkkı","C şıkkı","D şıkkı"],"ans":0}]
Not: ans = doğru cevabın 0-3 arası indeksi.`;


    // Yedek sorular (AI başarısız olursa)
    const fallbackQuestions = [
      { q: "Türkiye'nin başkenti hangisidir?", opts: ["İstanbul", "Ankara", "İzmir", "Bursa"], ans: 1 },
      { q: "Güneş sistemindeki en büyük gezegen hangisidir?", opts: ["Satürn", "Mars", "Jüpiter", "Neptün"], ans: 2 },
      { q: "Su'nun kimyasal formülü nedir?", opts: ["CO2", "NaCl", "H2O", "O2"], ans: 2 },
      { q: "Bir yılda kaç ay vardır?", opts: ["10", "11", "12", "13"], ans: 2 },
      { q: "Fotosentez hangi organda gerçekleşir?", opts: ["Kök", "Gövde", "Kloroplast", "Çekirdek"], ans: 2 },
    ];

    try {
      const raw = await askAI(prompt, "Sadece JSON dizisi döndür. Açıklama yazma. Markdown kullanma.", 1000);

      if (!raw || raw.includes('bekleyin') || raw.length < 20) {
        throw new Error("Geçersiz yanıt");
      }

      let cleaned = raw.trim()
        .replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
      
      let parsed = [];
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const match = cleaned.match(/\\[[\\s\\S]*\\]/);
        if (!match) throw new Error("JSON bulunamadı");
        parsed = JSON.parse(match[0]);
      }
      
      this.questions = (Array.isArray(parsed) && parsed.length > 0) ? parsed : fallbackQuestions;
      
      // Eğer soru sayısı istenenden az veya çoksa kes/çoğalt
      if(this.questions.length > qCount) this.questions = this.questions.slice(0, qCount);
    } catch (e) {
      console.warn('[DuelArena] AI başarısız, yedek sorular kullanılıyor:', e.message);
      this.questions = fallbackQuestions.slice(0, qCount);
    }

    this.userScore = 0;
    this.botScore = 0;
    this.currentIndex = 0;
    this.renderQuestion();
  }


  setupArenaUI() {
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
        <button id="duelClose" style="position: absolute; right: 20px; top: 20px; background: transparent; border: none; font-size: 1.5rem; color: var(--sub); cursor: pointer;">✖️</button>
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

        <div id="duelTimerBox" style="text-align: center; font-size: 2rem; font-weight: bold; font-family: monospace; color: #eab308; margin-bottom: 20px;">⏱️ ${this.maxTime}</div>
        
        <div id="duelContent" style="min-height: 200px;"></div>
      </div>
    `;

    document.body.appendChild(this.overlay);
    document.getElementById('duelClose').addEventListener('click', () => this.close());
  }

  showLoading() {
    const content = document.getElementById('duelContent');
    if(content) {
      content.innerHTML = DOMPurify.sanitize(`<div style="text-align: center; padding: 40px;"><div class="jumping-dots"><span></span><span></span><span></span></div><p style="margin-top: 20px; color: var(--sub);">Arena hazırlanıyor... Rakip aranıyor...</p></div>`);
    }
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishDuel();
      return;
    }

    this.timeLeft = this.maxTime;
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
    content.innerHTML = DOMPurify.sanitize(html, { ALLOW_DATA_ATTR: true });

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
      tb.innerHTML = `⏱️ ${this.timeLeft}`;
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
      addXP(150);
      const qb = new QuestsBoard(document.body);
      qb.updateProgress('duel_win', 1);
    } else if (this.userScore === this.botScore) {
      resultHtml = `<h1 style="color: #eab308; font-size: 3rem; margin-bottom: 10px;">🤝 BERABERE</h1><p style="font-size: 1.2rem;">Dişe diş bir mücadeleydi!</p>`;
    } else {
      resultHtml = `<h1 style="color: #ef4444; font-size: 3rem; margin-bottom: 10px;">💀 MAĞLUBİYET</h1><p style="font-size: 1.2rem;">Gölge bot senden ${this.botScore - this.userScore} puan önde!</p>`;
    }

    resultHtml += `<button class="onboard-btn ext-style-2" style="margin-top: 30px;" id="duelFinishBtn">Arenadan Çık</button>`;
    content.innerHTML = DOMPurify.sanitize(`<div style="text-align: center; padding: 30px;">${resultHtml}</div>`);

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

