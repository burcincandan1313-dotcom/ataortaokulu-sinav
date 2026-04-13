/**
 * games.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/features/games.js
// Oyun Merkezi modülü

/**
 * games.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import DOMPurify from 'dompurify';

export const GAMES = [
  { id: 'ztype', icon: '⌨️', name: 'Klavye Ustası', desc: 'Düşen kelimeleri yaz' },
  { id: 'wordle',  icon: '🔤', name: 'Kelime Bulmaca', desc: '5 harfli kelime bul' },
  { id: 'xox',     icon: '⭕', name: 'XOX (TicTacToe)', desc: 'Bilgisayara karşı oyna' },
  { id: 'hafiza',  icon: '🃏', name: 'Hafıza Oyunu', desc: 'Eş kartları bul' },
  { id: 'mateyar', icon: '🔢', name: 'Matematik Yarışı', desc: 'Hızlı hesaplama' },
  { id: 'sudoku',  icon: '🧩', name: 'Mini Sudoku', desc: '4x4 Sudoku' },
  { id: 'quiz',    icon: '❓', name: 'Hızlı Quiz', desc: 'Genel kültür soruları' },
];

export function renderGameMenu() {
  const body = document.getElementById('gameBody');
  if (!body) return;
  const title = document.getElementById('gameTitle');
  if (title) title.textContent = '🎮 Oyun Merkezi';

  body.innerHTML = DOMPurify.sanitize(`
    <div class="game-menu-grid">
      ${GAMES.map(g => `
        <button class="game-card" data-game="${g.id}">
          <span class="game-card-icon">${g.icon}</span>
          <span class="game-card-name">${g.name}</span>
          <span class="game-card-desc">${g.desc}</span>
        </button>
      `).join('')}
    </div>
  `, { ALLOW_DATA_ATTR: true, ADD_ATTR: ['data-game'] });

  body.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game');
      startGame(gameId);
    });
  });
}

function startGame(gameId) {
  const body = document.getElementById('gameBody');
  const title = document.getElementById('gameTitle');
  if (!body || !title) return;

  try {
    import('../state.js').then(({ StorageManager }) => {
      StorageManager.set('mega_game_played', true);
    });
  } catch(e) {}
  if(window._renderDailyQuests) window._renderDailyQuests();

  switch(gameId) {
    case 'ztype':
      title.textContent = '⌨️ Klavye Ustası';
      renderZTypeGame(body);
      break;
    case 'xox':
      title.textContent = '⭕ XOX Oyunu';
      renderXOX(body);
      break;
    case 'mateyar':
      title.textContent = '🔢 Matematik Yarışı';
      renderMathGame(body);
      break;
    case 'hafiza':
      title.textContent = '🃏 Hafıza Oyunu';
      renderMemoryGame(body);
      break;
    case 'wordle':
      title.textContent = '🔤 Kelime Bulmaca';
      renderWordleGame(body);
      break;
    case 'quiz':
      title.textContent = '❓ Hızlı Quiz';
      renderQuickQuiz(body);
      break;
    case 'sudoku':
      title.textContent = '🧩 Mini Sudoku';
      renderSudoku(body);
      break;
    default:
      body.innerHTML = `<div style="text-align:center;padding:40px;"><p>Bu oyun yakında eklenecek!</p><button class="game-back-btn" onclick="document.getElementById('gameBody').innerHTML='';window.__renderGameMenu && window.__renderGameMenu();">← Geri</button></div>`;
  }
}

// Geri butonu helper
window.__renderGameMenu = renderGameMenu;

function addBackButton(body) {
  const back = document.createElement('button');
  back.className = 'game-back-btn';
  back.textContent = '← Menüye Dön';
  back.addEventListener('click', renderGameMenu);
  body.prepend(back);
}

// —— XOX Oyunu ——
function renderXOX(body) {
  let board = Array(9).fill('');
  let turn = 'X';
  let gameOver = false;

  function render() {
    body.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <p class="game-status" id="xoxStatus">Sıra: ${turn} (Sen X'sin)</p>
        <div class="xox-grid">
          ${board.map((c, i) => `<button class="xox-cell ${c ? 'filled' : ''}" data-i="${i}">${c}</button>`).join('')}
        </div>
        <button class="game-restart-btn" id="xoxRestart">🔄 Yeniden Başla</button>
      </div>
    `;
    addBackButton(body);

    body.querySelectorAll('.xox-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        if (gameOver || cell.textContent || turn !== 'X') return;
        const idx = parseInt(cell.getAttribute('data-i'));
        board[idx] = 'X';
        turn = 'O';
        if (checkWin('X')) { gameOver = true; render(); document.getElementById('xoxStatus').textContent = '🎉 Kazandın!'; return; }
        if (board.every(c => c)) { gameOver = true; render(); document.getElementById('xoxStatus').textContent = '🤝 Berabere!'; return; }
        let botTimeout;
        // Bot oynasın
        botTimeout = setTimeout(() => {
          const empty = board.map((c,i) => c ? -1 : i).filter(i => i >= 0);
          if (empty.length > 0 && !gameOver) {
            board[empty[Math.floor(Math.random() * empty.length)]] = 'O';
            turn = 'X';
            if (checkWin('O')) { gameOver = true; render(); document.getElementById('xoxStatus').textContent = '😔 Bilgisayar Kazandı!'; return; }
            if (board.every(c => c)) { gameOver = true; render(); document.getElementById('xoxStatus').textContent = '🤝 Berabere!'; return; }
            render();
          }
        }, 400);
      });
    });

    const restart = document.getElementById('xoxRestart');
    if (restart) restart.addEventListener('click', () => { 
       board = Array(9).fill(''); 
       turn = 'X'; 
       gameOver = false; 
       if(typeof botTimeout !== 'undefined') clearTimeout(botTimeout);
       render(); 
    });
  }

  function checkWin(p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(w => w.every(i => board[i] === p));
  }

  render();
}

// —— Matematik Yarışı ——
function renderMathGame(body) {
  let score = 0;
  let questionNum = 0;
  const totalQ = 10;
  let timerInterval;

  function newQuestion() {
    if (questionNum >= totalQ) {
      clearInterval(timerInterval);
      body.innerHTML = `<div style="text-align:center;padding:40px;"><h3>🏆 Skor: ${score}/${totalQ}</h3><p>${score >= 8 ? 'Harika!' : score >= 5 ? 'İyi!' : 'Biraz daha çalış!'}</p><button class="game-restart-btn" id="mathRestart">🔄 Tekrar</button></div>`;
      addBackButton(body);
      document.getElementById('mathRestart').addEventListener('click', () => { score = 0; questionNum = 0; newQuestion(); });
      return;
    }
    questionNum++;
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let answer;
    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else answer = a * b;

    // Yanlış seçenekler üret
    const choices = [answer];
    while (choices.length < 4) {
      const wrong = answer + Math.floor(Math.random() * 11) - 5;
      if (wrong !== answer && !choices.includes(wrong)) choices.push(wrong);
    }
    choices.sort(() => Math.random() - 0.5);

    body.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <p style="font-size:0.8rem;color:var(--sub);">Soru ${questionNum}/${totalQ} — Skor: ${score}</p>
        <p style="font-size:2rem;font-weight:800;margin:16px 0;">${a} ${op} ${b} = ?</p>
        <div class="math-choices">
          ${choices.map(c => `<button class="math-choice" data-val="${c}">${c}</button>`).join('')}
        </div>
      </div>
    `;
    addBackButton(body);

    body.querySelectorAll('.math-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (parseInt(btn.getAttribute('data-val')) === answer) {
          score++;
          btn.style.background = '#22c55e';
        } else {
          btn.style.background = '#ef4444';
        }
        setTimeout(newQuestion, 600);
      });
    });
  }

  newQuestion();
}

// —— Hafıza Oyunu ——
function renderMemoryGame(body) {
  const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
  const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = [];
  let moves = 0;

  function render() {
    body.innerHTML = `
      <div style="text-align:center;padding:16px;">
        <p style="font-size:0.85rem;color:var(--sub);">Hamle: ${moves} | Eşleşen: ${matched.length / 2}/${emojis.length}</p>
        <div class="memory-grid">
          ${cards.map((c, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(i);
            return `<button class="memory-card ${isFlipped ? 'flipped' : ''} ${matched.includes(i) ? 'matched' : ''}" data-i="${i}">${isFlipped ? c : '❓'}</button>`;
          }).join('')}
        </div>
      </div>
    `;
    addBackButton(body);

    if (matched.length === cards.length) {
      body.innerHTML += `<div style="text-align:center;padding:14px;"><h3>🎉 Tebrikler! ${moves} hamlede tamamladın!</h3><button class="game-restart-btn" id="memRestart">🔄 Tekrar</button></div>`;
      document.getElementById('memRestart').addEventListener('click', () => renderMemoryGame(body));
      return;
    }

    body.querySelectorAll('.memory-card:not(.matched)').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-i'));
        if (flipped.includes(idx) || flipped.length >= 2) return;
        flipped.push(idx);
        render();
        if (flipped.length === 2) {
          moves++;
          setTimeout(() => {
            if (cards[flipped[0]] === cards[flipped[1]]) {
              matched.push(flipped[0], flipped[1]);
            }
            flipped = [];
            render();
          }, 800);
        }
      });
    });
  }

  render();
}

// —— Kelime Bulmaca (Basit Wordle) ——
function renderWordleGame(body) {
  const words = [
    'KALEM','KİTAP','BİLİM','SINIF','OKUMA','YAZMA','TARİH','SANAT','BULUT','SEVGİ',
    'SAYGI','BARIŞ','YAŞAM','DÜNYA','EVREN','YILDIZ','GÜNEŞ','BİLGİ','IŞIK','HAYAT',
    'GECE','GÜNDÜZ','UZAY','DOĞA','DENİZ','ORMAN','ÇİÇEK','HAYAL','UMUT','CESUR'
  ];
  const target = words[Math.floor(Math.random() * words.length)].replace(/İ/g, 'I').replace(/Ş/g, 'S').replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
  let guesses = [];
  let currentGuess = '';
  const maxGuesses = 6;

  function render() {
    const won = guesses.some(g => g === target);
    const lost = guesses.length >= maxGuesses && !won;

    body.innerHTML = `
      <div style="text-align:center;padding:16px;">
        <p style="font-size:0.8rem;color:var(--sub);margin-bottom:8px;">5 harfli kelimeyi ${maxGuesses} denemede bul!</p>
        <div class="wordle-board">
          ${guesses.map(g => `<div class="wordle-row">${g.split('').map((c, i) => {
            let cls = 'wordle-cell wrong';
            if (c === target[i]) cls = 'wordle-cell correct';
            else if (target.includes(c)) cls = 'wordle-cell partial';
            return `<span class="${cls}">${c}</span>`;
          }).join('')}</div>`).join('')}
          ${!won && !lost ? `<div class="wordle-row current">${currentGuess.padEnd(5, '_').split('').map(c => `<span class="wordle-cell">${c === '_' ? '' : c}</span>`).join('')}</div>` : ''}
        </div>
        ${won ? '<p style="color:#22c55e;font-weight:700;margin-top:12px;">🎉 Doğru bildiin!</p>' : ''}
        ${lost ? `<p style="color:#ef4444;font-weight:700;margin-top:12px;">😔 Kelime: ${target}</p>` : ''}
        ${!won && !lost ? `
          <input type="text" id="wordleInput" maxlength="5" placeholder="5 harf yaz..." style="margin-top:12px;padding:8px 12px;border-radius:8px;border:1px solid var(--bdr);background:var(--bg2);color:var(--fg);font-size:1rem;text-transform:uppercase;width:160px;text-align:center;" autocomplete="off">
          <button class="game-restart-btn" id="wordleGuess" style="margin-top:8px;">Tahmin Et</button>
        ` : `<button class="game-restart-btn" id="wordleRestart">🔄 Yeni Kelime</button>`}
      </div>
    `;
    addBackButton(body);

    const guessBtn = document.getElementById('wordleGuess');
    const input = document.getElementById('wordleInput');
    if (guessBtn && input) {
      input.focus();
      const doGuess = () => {
        const val = input.value.toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, '');
        if (val.length === 5) {
          guesses.push(val);
          currentGuess = '';
          render();
        }
      };
      guessBtn.addEventListener('click', doGuess);
      input.addEventListener('keypress', (e) => { if (e.key === 'Enter') doGuess(); });
    }
    const restart = document.getElementById('wordleRestart');
    if (restart) restart.addEventListener('click', () => renderWordleGame(body));
  }

  render();
}

// —— Hızlı Quiz ——
function renderQuickQuiz(body) {
  const questions = [
    {q: 'Türkiye\'nin başkenti neresidir?', opts: ['İstanbul','Ankara','İzmir','Bursa'], a: 1},
    {q: 'Dünyanın en büyük okyanusu hangisidir?', opts: ['Atlas','Hint','Büyük (Pasifik)','Arktik'], a: 2},
    {q: 'Atatürk hangi yıl doğdu?', opts: ['1879','1880','1881','1882'], a: 2},
    {q: 'Suyun kimyasal formülü nedir?', opts: ['CO2','H2O','NaCl','O2'], a: 1},
    {q: 'Güneş sistemimizdeki en büyük gezegen hangisidir?', opts: ['Mars','Satürn','Jüpiter','Neptün'], a: 2},
    {q: 'Türk bayrağındaki yıldız kaç köşelidir?', opts: ['4','5','6','8'], a: 1},
    {q: 'İnsan vücudunda kaç kemik vardır?', opts: ['186','206','226','256'], a: 1},
    {q: 'Işık hızı saniyede kaç km\'dir?', opts: ['100.000','200.000','300.000','400.000'], a: 2},
  ];
  let qIdx = 0;
  let score = 0;

  function showQ() {
    if (qIdx >= questions.length) {
      body.innerHTML = `<div style="text-align:center;padding:40px;"><h3>${score >= 6 ? '🏆' : score >=4 ? '👍' : '💪'} Skor: ${score}/${questions.length}</h3><button class="game-restart-btn" id="quizRestart">🔄 Tekrar</button></div>`;
      addBackButton(body);
      document.getElementById('quizRestart').addEventListener('click', () => { qIdx=0; score=0; showQ(); });
      return;
    }
    const q = questions[qIdx];
    body.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <p style="font-size:0.8rem;color:var(--sub);">Soru ${qIdx+1}/${questions.length}</p>
        <p style="font-size:1.1rem;font-weight:700;margin:14px 0;">${q.q}</p>
        <div class="quiz-choices">
          ${q.opts.map((o,i) => `<button class="quiz-choice" data-i="${i}">${o}</button>`).join('')}
        </div>
      </div>
    `;
    addBackButton(body);
    body.querySelectorAll('.quiz-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = parseInt(btn.getAttribute('data-i'));
        if (sel === q.a) { score++; btn.style.background='#22c55e'; }
        else { btn.style.background='#ef4444'; body.querySelectorAll('.quiz-choice')[q.a].style.background='#22c55e'; }
        qIdx++;
        setTimeout(showQ, 800);
      });
    });
  }
  showQ();
}

// —— Mini Sudoku (4x4) ——
function renderSudoku(body) {
  // basit 4x4 sudoku
  const solution = [
    [1,2,3,4],
    [3,4,1,2],
    [2,3,4,1],
    [4,1,2,3]
  ];
  // Bazı hücreleri gizle
  const puzzle = solution.map(row => row.map(c => Math.random() > 0.5 ? c : 0));

  body.innerHTML = `
    <div style="text-align:center;padding:20px;">
      <p style="font-size:0.85rem;color:var(--sub);margin-bottom:12px;">Her satır ve sütunya 1-4 arası rakamları yerleştir!</p>
      <div class="sudoku-grid">
        ${puzzle.map((row, r) => row.map((c, col) => {
          if (c !== 0) return `<input class="sudoku-cell fixed" value="${c}" disabled data-r="${r}" data-c="${col}">`;
          return `<input class="sudoku-cell" maxlength="1" data-r="${r}" data-c="${col}" data-answer="${solution[r][col]}">`;
        }).join('')).join('')}
      </div>
      <button class="game-restart-btn" id="sudokuCheck" style="margin-top:12px;">✅ Kontrol Et</button>
      <p id="sudokuResult" style="margin-top:8px;font-weight:700;"></p>
    </div>
  `;
  addBackButton(body);

  document.getElementById('sudokuCheck').addEventListener('click', () => {
    let correct = true;
    body.querySelectorAll('.sudoku-cell:not(.fixed)').forEach(cell => {
      const val = parseInt(cell.value);
      const ans = parseInt(cell.getAttribute('data-answer'));
      if (val !== ans) { correct = false; cell.style.borderColor = '#ef4444'; }
      else { cell.style.borderColor = '#22c55e'; }
    });
    document.getElementById('sudokuResult').textContent = correct ? '🎉 Doğru! Tebrikler!' : '❌ Bazı hatalar var, tekrar dene!';
  });
}


// —— Klavye Ustası (ZType Clone) ——
function renderZTypeGame(body) {
  const dictionary = [
    "ATATÜRK", "BİLİM", "SANAT", "EVREN", "GÜNEŞ", "BİLGİSAYAR", "YAZILIM", "KODLAMA",
    "KLAVYE", "EKRAN", "TÜRKİYE", "İSTANBUL", "ANKARA", "YILDIZ", "GEZEGEN", "ASTRONOMİ",
    "MATEMATİK", "FİZİK", "KİMYA", "BİYOLOJİ", "OKUL", "ÖĞRENCİ", "ÖĞRETMEN", "EĞİTİM",
    "MİMARİ", "MÜHENDİS", "DOKTOR", "TEKNOLOJİ", "İNTERNET", "SİBER", "GÜVENLİK", "OYUN"
  ];

  let score = 0;
  let level = 1;
  let health = 5;
  let activeWords = [];
  let currentTarget = null;
  let dropSpeed = 1; // px per frame
  let spawnRate = 2000; // ms
  let isGameOver = false;
  let gameLoop;
  let spawnLoop;
  let container;
  let laser;

  // Temel UI kurulumu
  body.innerHTML = `
    <div style="padding:10px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
         <span style="font-weight:bold; color:var(--acc);">Skor: <span id="ztScore">0</span> | Seviye: <span id="ztLevel">1</span></span>
         <span style="font-weight:bold; color:#ef4444;">Can: <span id="ztHealth">${"❤️".repeat(health)}</span></span>
      </div>
      <div class="ztype-container" id="ztContainer">
        <div class="ztype-shooter"></div>
        <div class="ztype-laser" id="ztLaser" style="opacity:0;"></div>
      </div>
    </div>
  `;
  addBackButton(body);
  
  container = document.getElementById('ztContainer');
  laser = document.getElementById('ztLaser');

  function spawnWord() {
    if (isGameOver) return;
    const str = dictionary[Math.floor(Math.random() * dictionary.length)];
    const el = document.createElement('div');
    el.className = 'ztype-word';
    el.textContent = str;
    
    // Rastgele x pozisyonu (padding payı bırakarak)
    const maxLeft = container.clientWidth - (str.length * 15) - 20; 
    let left = Math.floor(Math.random() * Math.max(10, maxLeft));
    if (left < 10) left = 10;

    el.style.left = left + 'px';
    el.style.top = '-30px';
    
    container.appendChild(el);
    activeWords.push({
      str: str,
      el: el,
      y: -30,
      typedIdx: 0
    });
  }

  function update() {
    if (isGameOver) return;
    const containerH = container.clientHeight;
    
    // Tüm kelimeleri aşağı kaydır
    for (let i = 0; i < activeWords.length; i++) {
       const w = activeWords[i];
       w.y += dropSpeed;
       w.el.style.top = w.y + 'px';
       
       if (w.y > containerH - 40) {
          // Kelime aşağı ulaştı -> Can kaybı
          health--;
          const healthEl = document.getElementById('ztHealth');
          if(healthEl) healthEl.innerText = "❤️".repeat(Math.max(0, health));
          
          container.removeChild(w.el);
          if (currentTarget === w) currentTarget = null;
          activeWords.splice(i, 1);
          i--;
          
          if (health <= 0) {
            gameOver();
            return;
          }
       }
    }
    
    // Laser çizimi (eğer target varsa)
    if (currentTarget) {
      const rect = currentTarget.el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      
      const targetX = rect.left - contRect.left + (rect.width/2);
      const targetY = rect.top - contRect.top + rect.height;
      
      const shooterX = container.clientWidth / 2;
      const shooterY = containerH;
      
      const dx = targetX - shooterX;
      const dy = targetY - shooterY;
      const length = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90; // +90 for rotation
      
      laser.style.opacity = '1';
      laser.style.height = length + 'px';
      laser.style.transform = `rotate(${angle}deg)`;
      laser.style.left = shooterX + 'px';
      laser.style.bottom = '0px';
    } else {
      laser.style.opacity = '0';
    }

    gameLoop = requestAnimationFrame(update);
  }

  function updateWordUI(w) {
     const str = w.str;
     const typed = str.substring(0, w.typedIdx);
     const current = str.substring(w.typedIdx, w.typedIdx + 1);
     const rem = str.substring(w.typedIdx + 1);
     
     w.el.innerHTML = `<span class="ztype-letter-typed">${typed}</span><span class="ztype-letter-cursor">${current}</span>${rem}`;
  }

  function handleKeydown(e) {
    if (isGameOver) return;
    
    // İngilizce karakterlere çevir veya direkt al (Klavye farkları için büyük harf)
    const key = e.key.toLocaleUpperCase('tr-TR');
    if (!/^[A-ZÇĞİÖŞÜ]$/.test(key)) return;
    
    e.preventDefault();

    if (!currentTarget) {
      // Hedef yoksa, basılan tuşla başlayan VE en alttaki (en büyük Y) kelimeyi bul
      let possibleMatch = null;
      let maxY = -999;
      for (const w of activeWords) {
        if (w.str[0] === key && w.y > maxY) {
           maxY = w.y;
           possibleMatch = w;
        }
      }
      
      if (possibleMatch) {
         currentTarget = possibleMatch;
         currentTarget.el.classList.add('targeted');
         currentTarget.typedIdx = 1;
         updateWordUI(currentTarget);
         checkTargetDestroy();
      }
    } else {
      // Hedef varsa
      if (currentTarget.str[currentTarget.typedIdx] === key) {
         currentTarget.typedIdx++;
         updateWordUI(currentTarget);
         checkTargetDestroy();
      }
    }
  }

  function checkTargetDestroy() {
     if (currentTarget && currentTarget.typedIdx >= currentTarget.str.length) {
        // Yok edildi!
        container.removeChild(currentTarget.el);
        activeWords = activeWords.filter(w => w !== currentTarget);
        currentTarget = null;
        laser.style.opacity = '0';
        
        score += 10;
        document.getElementById('ztScore').textContent = score;
        
        // Seviye atlama kontrolü (her 50 puanda)
        if (score % 50 === 0) {
           level++;
           document.getElementById('ztLevel').textContent = level;
           dropSpeed += 0.3;
           spawnRate = Math.max(500, spawnRate - 200); // 500ms altına düşmesin
           
           clearInterval(spawnLoop);
           spawnLoop = setInterval(spawnWord, spawnRate);
           
           // Seviye atlama efekti
           container.style.boxShadow = 'inset 0 0 40px var(--acc)';
           setTimeout(() => { container.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)'; }, 300);
        }
     }
  }

  function gameOver() {
     isGameOver = true;
     cancelAnimationFrame(gameLoop);
     clearInterval(spawnLoop);
     document.removeEventListener('keydown', handleKeydown);
     
     const overlay = document.createElement('div');
     overlay.className = 'ztype-overlay';
     overlay.innerHTML = `
        <h2 style="color:var(--text-color); font-size:2rem; margin-bottom:10px;">Oyun Bitti!</h2>
        <p style="color:white; font-size:1.2rem; margin-bottom:20px;">Skor: ${score} | Seviye: ${level}</p>
        <button class="game-restart-btn" id="ztRestart">🔄 Tekrar Oyna</button>
     `;
     container.appendChild(overlay);
     
     document.getElementById('ztRestart').addEventListener('click', () => {
        renderZTypeGame(body);
     });
  }

  // Başlangıç beklemesi
  const startOverlay = document.createElement('div');
  startOverlay.className = 'ztype-overlay';
  startOverlay.innerHTML = `<button class="game-restart-btn" id="ztStartBtn" style="font-size:1.5rem; padding:15px 30px;">▶️ Başla</button>`;
  container.appendChild(startOverlay);

  document.getElementById('ztStartBtn').addEventListener('click', () => {
     container.removeChild(startOverlay);
     document.addEventListener('keydown', handleKeydown);
     spawnWord();
     spawnLoop = setInterval(spawnWord, spawnRate);
     gameLoop = requestAnimationFrame(update);
  });
  
  // Eğer temizlik lazımsa body içeriği değişirken eventi silmek için:
  const observer = new MutationObserver((mutations) => {
    if (!document.body.contains(container)) {
       document.removeEventListener('keydown', handleKeydown);
       cancelAnimationFrame(gameLoop);
       clearInterval(spawnLoop);
       observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
