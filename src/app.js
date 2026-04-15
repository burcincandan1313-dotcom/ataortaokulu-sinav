/**
 * app.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import './style.css';
import { renderLeaderboard } from './features/leaderboard.js';
import { renderDnaMap } from './features/dnaMap.js';
import { initDailyMissions, renderDailyQuests, updateMissionProgress } from './features/dailyMissions.js';
import { openTeacherPanel } from './features/teacherPanel.js';
window.updateMissionProgress = updateMissionProgress; // Make available globally
// src/app.js
// Uygulamanın ana orkestrasyon modülü — TÜM ÖZELLİKLER ÇALIŞIR

import { state, setIsLoading, addMessage, loadUserData, saveUserData } from './state.js';
import { askAI, generateImage } from './api.js';
import { initUI, appendMessage, streamMessage, toggleTypingIndicator, showError, updateBotStatus } from './ui.js';
import { curriculumData } from './curriculum.js';
import { openStudyWizard, studySelections } from './features/wizard.js';
import { DuelArena } from './features/duelArena.js';
import { SkillTree } from './features/skillTree.js';
import { certSystem } from './features/certificate.js';
import { SuperZekaDashboard } from './features/dashboard.js';
window.openStudyWizard = openStudyWizard;
import { initStudyPanel, studyAnalyzer } from './features/studyPanel.js';
import { renderGameMenu } from './features/games.js';
import { renderVisualDictionaryMenu } from './features/visualDictionary.js';
import { extractAndFixQuizJson } from './utils/aiParser.js';
import { initDB } from './utils/db.js';
import { v11SafeParse, v11Route, v11AddToMemory } from './core/v11Engine.js';
import { marked } from 'marked';
import { initTTS } from './features/tts.js';
import { formatMessage } from './utils/formatter.js';
import { renderModeSelector as renderModeSelectorCore, MODES } from './features/modeSelector.js';

let lastSentMessage = "";
let currentMode = 'normal';

// TTS API'sini Başlat
initTTS();

// Mod seçici için proxy
function renderModeSelector() {
  renderModeSelectorCore({
    currentMode,
    setCurrentMode: (mode) => { currentMode = mode; },
    renderGameMenu,
    openStudyWizard,
    addMessage,
    appendMessage,
    formatMessage
  });
}

// ═══════════════════════════════════════════
// TICKER BAR — Canlı bilgi çubuğu
// ═══════════════════════════════════════════
function renderTicker() {
  const ticker = document.getElementById('tickerInner');
  if (!ticker) return;
  const facts = [
    "💡 Biliyor muydun? Dünya'nın çekirdeği Güneş'in yüzeyi kadar sıcaktır!",
    "📚 Okuma ipucu: Günde 20 dakika okumak yılda 1.8 milyon kelime demektir!",
    "🧠 Beyin egzersizi: Yeni bir dil öğrenmek beyni güçlendirir!",
    "🌍 Dünya'nın %71'i su ile kaplıdır!",
    "🚀 Işık, Güneş'ten Dünya'ya 8 dakikada ulaşır!",
    "🎮 Oyun oynamak problem çözme becerisini geliştirir!",
    "⭐ Samanyolu galaksisinde 100-400 milyar yıldız vardır!",
    "🔬 İnsan DNA'sı Güneş Sistemi'ne 600 kez gidip gelecek kadar uzundur!",
  ];
  ticker.innerHTML = facts.map(f => `<span class="ticker-item">${f}</span>`).join('');
}

// ═══════════════════════════════════════════
// ROZETLER — badgeGrid doldurma
// ═══════════════════════════════════════════
function renderBadges() {
  const grid = document.getElementById('badgeGrid');
  if (!grid) return;
  const streak = state.streak || 0;
  const badges = [
    { icon: '🌟', name: 'Mega Beyin', earned: state.xp > 0 },
    { icon: '💬', name: 'Sohbet Ustası', earned: state.messages.length >= 5 },
    { icon: '🔥', name: '3 Günlük Seri', earned: streak >= 3 },
    { icon: '🔥', name: '7 Günlük Seri', earned: streak >= 7 },
    { icon: '🏆', name: 'Quiz Şampiyonu', earned: (StorageManager.get(StorageManager.keys.QUIZ_HISTORY, []).length > 0) },
    { icon: '🎖️', name: 'Efsanevi', earned: state.level >= 5 },
  ];
  
  // Üst menüde eğer seviye gösteriliyorsa Streak'i de ekleyebiliriz
  const statusEl = document.getElementById('botStatus');
  if (statusEl && streak > 0 && !statusEl.textContent.includes('🔥')) {
      const existing = statusEl.innerHTML;
      if (!existing.includes('🔥')) {
          statusEl.innerHTML = `${existing} &nbsp; <span style="background:linear-gradient(to right, #f97316, #ef4444);color:#fff;padding:2px 6px;border-radius:10px;font-size:0.8rem;font-weight:bold;">🔥 x${streak}</span>`;
      }
  }

  grid.innerHTML = badges.map(b => `
    <div class="badge-item ${b.earned ? 'earned' : 'locked'}" title="${b.name}">
      <span class="badge-icon">${b.earned ? b.icon : '🔒'}</span>
      <span class="badge-name">${b.name}</span>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════
// GÜNLÜK GÖREVLER — questCard doldurma
// ═══════════════════════════════════════════
import { StorageManager } from './state.js';

// Eski dailyQuests silindi, dailyMissions.js renderDailyQuests yüklendi
// ═══════════════════════════════════════════
// GÜNLÜK BİLGİ — dailyFact doldurma
// ═══════════════════════════════════════════
function renderDailyFact() {
  const el = document.getElementById('dailyFact');
  if (!el) return;
  const facts = [
    "🌍 Dünya'daki tüm okyanuslar tek bir süper okyanustan (Panthalassa) oluşmuştur!",
    "🧮 Sıfır (0) sayısı ilk kez Hintliler tarafından kullanılmıştır!",
    "🐙 Ahtapotların 3 kalbi ve mavi kanı vardır!",
    "🌙 Ay, Dünya'dan her yıl 3.8 cm uzaklaşıyor!",
    "🐝 Bal arıları 1 kg bal üretmek için 4 milyon çiçeği ziyaret eder!",
    "📖 Dünya'nın en eski üniversitesi Bologna Üniversitesi'dir (1088)!",
    "🦕 Dinozorlar 165 milyon yıl boyunca Dünya'da yaşadı!",
  ];
  const dayIdx = new Date().getDate() % facts.length;
  el.innerHTML = `<div class="daily-fact-text">💡 <b>Günün Bilgisi:</b> ${facts[dayIdx]}</div>`;
}

// ═══════════════════════════════════════════
// AVATAR PICKER — Onboarding'deki avatar seçici
// ═══════════════════════════════════════════
function renderAvatarPicker() {
  const picker = document.getElementById('avatarPicker');
  if (!picker) return;
  const avatars = ['👦','👧','🧑','👨‍🎓','👩‍🎓','🧒','🧑‍💻','👩‍💻','🦸','🦸‍♀️','🧙','🧙‍♀️'];
  const hiddenInput = document.getElementById('selectedAvatar');

  picker.innerHTML = avatars.map(a => `
    <button class="avatar-option ${a === '👦' ? 'selected' : ''}" data-avatar="${a}">${a}</button>
  `).join('');

  picker.querySelectorAll('.avatar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (hiddenInput) hiddenInput.value = btn.getAttribute('data-avatar');
    });
  });
}

// ═══════════════════════════════════════════
// MESAJ GÖNDERİMİ
// ═══════════════════════════════════════════
async function handleSendMessage(text) {
  if (!text || text.trim() === '') return;
  if (state.isLoading) return;
  
  const msg = text.trim();
  const lw = msg.toLowerCase();
  
  if (lw === '/ogretmen') {
      const inputEl = document.getElementById('userInput');
      if (inputEl) inputEl.value = '';
      openTeacherPanel();
      return;
  }
  
  // 1. Kullanıcı mesajını ekle
  lastSentMessage = msg;
  addMessage('user', msg);
  appendMessage('user', formatMessage('user', msg));
  if(window.updateMissionProgress) window.updateMissionProgress('msg', 1);
  
  // Input temizle
  const inputEl = document.getElementById('userInput');
  if (inputEl) inputEl.value = '';

  // İstatistik güncelle
  updateStats();

  // ==== SÜPER ÖNEMLİ: AKILLI INPUT ALGILAMA (PRE-AI INTERCEPTOR) ====
  const autoCmd = msg.trim().toLowerCase();
  if (/^\d+\s+\w+/.test(autoCmd) || /^(çiz|oluştur)\s+\d+\s+\w+/.test(autoCmd)) {
     // Örn: "3 elma" veya "çiz 5 kedi" - doğrudan görsel rutine saralım
     // AI'ye gitmeden de yapabiliriz ama AI Master Prompt bunu mükemmel ayıklıyor.
  }

  // Quiz cevap anahtarı kontrolü
  if (['a','b','c','d', 'a)','b)','c)','d)'].includes(autoCmd)) {
    if (window.activeQuizSession) {
      // Frontend answer checker'ı çalıştırabiliriz ama mevcut mimaride handleQuizAnswer global değil.
      // Şimdilik AI'ye yönlendirsek bile Master Prompt quiz_answer dönecek.
    }
  }

  // ==== COMMAND INTERCEPTOR (YAN MENÜ KOMUTLARI & ÖZEL İŞLEMLER) ====
  
    // ==== 0. SUBJECT WIZARD INTERCEPTOR ====
  const eduSubjects = ['matematik', 'türkçe', 'turkce', 'fen bilimleri', 'fen', 'sosyal bilgiler', 'sosyal', 'ingilizce', 'din kültürü', 'din', 'görsel sanatlar', 'bilişim', 'müzik', 'beden'];
  if (eduSubjects.some(sub => lw === sub || lw === sub + ' çalışmak istiyorum' || lw === sub + ' testi' || lw === sub + ' quiz')) {
     if (typeof openStudyWizard === 'function') {
        openStudyWizard();
        if(window.updateMissionProgress) window.updateMissionProgress('lesson', 1);
        addMessage('bot', 'Dersi ' + msg + ' olarak seçtin.');
        appendMessage('bot', formatMessage('bot', '<b>Harika!</b> Çalışmak istediğin dersi anladım. Şimdi açılan menüden konunu seçebilirsin.'));
        return;
     }
  }

  // A. ÇIKIŞ & SIFIRLAMA (Logout)
  if (['çıkış', 'çıkış yap', '/çıkış', 'reset', 'sıfırla', '/sıfırla'].includes(lw)) {
    localStorage.removeItem('mega_name');
    addMessage('bot', 'Çıkış yapıldı.');
    appendMessage('bot', formatMessage('bot', '✅ Kimlik bilgileriniz temizlendi. Lütfen sayfayı yenileyerek yeni bir isimle giriş yapın.'));
    setTimeout(() => location.reload(), 2500);
    return;
  }

  // A2. SINAVLARIM KOMUTU
  if (lw === '/sinavlarim' || lw === '/sınavlarım' || lw === 'sınavlarım' || lw === 'sinavlarim') {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = '📋 Sınavlarım';
    renderExamHistory();
    addMessage('bot', 'Sınavlarım açıldı.');
    appendMessage('bot', formatMessage('bot', '📋 <b>Sınavlarım</b> penceresini açtım! Geçmiş quiz sonuçlarınızı görebilirsiniz.'));
    return;
  }

  
  // A3. GÖRSEL SÖZLÜK
  if (lw === '/sozluk' || lw === '/sözlük' || lw === 'sözlük' || lw === 'görsel sözlük') {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = '🌟 Görsel Sözlük';
    renderVisualDictionaryMenu(document.getElementById('gameBody'));
    addMessage('bot', 'Görsel Sözlük açıldı.');
    appendMessage('bot', formatMessage('bot', '🖼️ <b>Görsel İnteraktif Sözlük</b> paneli açıldı! Yukarıdan dilediğiniz konuyu seçebilirsiniz.'));
    return;
  }

  // A4. GÖRSEL ÇİZ
  if (lw === '/çiz' || lw === '/ciz' || lw === 'görsel çiz') {
    window._drawMode = true;  // Sonraki mesajı resim isteği olarak işle
    addMessage('bot', 'Görsel çizme modu aktif.');
    appendMessage('bot', formatMessage('bot', '🎨 <b>Görsel Çiz Modu</b> aktif!<br>Ne çizmemi istersin? Sadece yaz, ben resim yapayım!<br><small style="color:var(--sub)">Örn: <code>mavi kedi</code> veya <code>güneşli orman</code></small>'));
    const inputEl = document.getElementById('userInput');
    if (inputEl) { inputEl.value = ''; inputEl.focus(); }
    return;
  }

  // A4b. ÇİZ MODU AKTİFSE → mesajı resim isteği'ne dönüştür
  if (window._drawMode) {
    window._drawMode = false;  // Bir kerelik, sonra normal moda dön
    // Kullanıcının yazdığını resim prompt'una çevir
    const drawPrompt = msg + ' resmi çiz';
    addMessage('bot', 'Resim hazırlanıyor...');
    appendMessage('bot', formatMessage('bot', `🎨 <b>"${msg}"</b> için resim oluşturuluyor... ⏳`));
    setIsLoading(true);
    toggleTypingIndicator(true);
    updateBotStatus('🟡 Çiziyor...', '#fbbf24');
    try {
      const imgData = await generateImage(msg + ', artistic illustration, colorful, high quality');
      toggleTypingIndicator(false);
      updateBotStatus('🟢 Çevrimiçi', '#4ade80');
      if (imgData) {
        const imageHtml = `<div style="background:rgba(0,0,0,.45);padding:14px;border-radius:12px;margin-top:8px;">
          <p style="font-weight:700;color:#c084fc;">🖼️ "${msg}" — Görsel Hazır!</p>
          <img src="${imgData}" style="width:100%;border-radius:8px;display:block;" alt="${msg}">
        </div>`;
        addMessage('bot', `(Görsel: ${msg})`);
        appendMessage('bot', formatMessage('bot', imageHtml));
      } else {
        appendMessage('bot', formatMessage('bot', '⚠️ Görsel oluşturulamadı, lütfen tekrar dene.'));
      }
    } catch(e) {
      toggleTypingIndicator(false);
      appendMessage('bot', formatMessage('bot', '⚠️ Görsel oluşturma hatası: ' + e.message));
    } finally {
      setIsLoading(false);
      updateBotStatus('🟢 Çevrimiçi', '#4ade80');
    }
    return;
  }
  // B. OYUN MERKEZİ & OYUNLAR (/oyun, oyun modu, vb.)
  const gameKeywords = ['/oyun', '/wordle', '/sudoku', '/hafıza', '/mateyar', '/macera', '/xox'];
  const isGameCommand = gameKeywords.some(k => lw.startsWith(k)) || ['oyun', 'oyun modu', 'oyun oyna', 'oyunlar'].includes(lw);
  if (isGameCommand) {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    renderGameMenu();
    addMessage('bot', '🎮 Oyun Merkezi açıldı!');
    appendMessage('bot', formatMessage('bot', '🎮 <b>Oyun Merkezi</b> penceresini açtım! Yukarıda açılan pencereden dilediğiniz eğitsel oyunu oynayabilirsiniz.'));
    return;
  }

  // B2. QUIZ İSTEĞİ (/quiz) — Artık sihirbazı açar
  if (lw === '/quiz' || lw === 'karışık quiz' || lw === 'karisik quiz' || lw === '/quiz-wizard') {
    openQuizWizard();
    return;
  }

  // C. AYARLAR MENÜSÜ (/ayarlar, ayarlar)
  if (lw.startsWith('/kurallar') || lw.startsWith('/ayar') || lw === 'ayarlar' || lw === 'kurallar') {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.style.display = 'flex';
    }
    addMessage('bot', '⚙️ Ayarlar paneli açıldı!');
    appendMessage('bot', formatMessage('bot', '⚙️ <b>Ayarlar & Kurallar</b> penceresini açtım!'));
    return;
  }

  // D. NOT DEFTERİ (/not)
  if (lw.startsWith('/not')) {
     const notArg = msg.substring(msg.indexOf(' ') + 1).trim();
     let notlar = JSON.parse(localStorage.getItem('mega_notlar') || '[]');
     if (lw === '/not' || notArg === '/not') {
       if (notlar.length === 0) {
         addMessage('bot', 'Not defteri boş.');
         appendMessage('bot', formatMessage('bot', '📋 <b>Not Defteriniz Boş</b><br>Not eklemek için: <code>/not Yarın matematik sınavı var</code>'));
       } else {
         const html = '📋 <b>Notlarınız:</b><br>' + notlar.map((n, i) => `<div style="padding:6px 10px;margin:4px 0;background:rgba(255,255,255,.06);border-radius:8px;border-left:3px solid var(--acc);"><small style="color:var(--sub)">${n.tarih}</small><br>${n.metin}</div>`).join('') + '<br><small style="color:var(--sub)">Temizlemek için: <code>/not temizle</code></small>';
         addMessage('bot', 'Notlar listelendi.');
         appendMessage('bot', formatMessage('bot', html));
       }
     } else if (notArg.toLowerCase() === 'temizle') {
       localStorage.removeItem('mega_notlar');
       addMessage('bot', 'Notlar temizlendi.');
       appendMessage('bot', formatMessage('bot', '🗑️ Tüm notlar temizlendi!'));
     } else {
       notlar.push({ metin: notArg, tarih: new Date().toLocaleString('tr-TR') });
       localStorage.setItem('mega_notlar', JSON.stringify(notlar));
       addMessage('bot', 'Not eklendi: ' + notArg);
       appendMessage('bot', formatMessage('bot', `✅ Not kaydedildi: <b>${notArg}</b><br><small style="color:var(--sub)">Toplam ${notlar.length} not. Görmek için: <code>/not</code></small>`));
     }
     return;
  }

  // E. POMODORO ZAMANLAYICI (/pomo)
  if (lw.startsWith('/pomo')) {
     const pomoId = 'pomo_' + Date.now();
     const pomoMinutes = 25;
     const pomoHtml = `<div id="${pomoId}" style="background:linear-gradient(135deg,rgba(239,68,68,.15),rgba(249,115,22,.15));padding:20px;border-radius:16px;text-align:center;border:1px solid rgba(239,68,68,.3);max-width:340px;">
       <div style="font-size:1.2rem;font-weight:700;margin-bottom:8px;">🍅 Pomodoro Zamanlayıcı</div>
       <div id="timer_${pomoId}" style="font-size:3rem;font-weight:800;font-family:monospace;color:#f97316;letter-spacing:2px;margin:12px 0;">${pomoMinutes}:00</div>
       <div id="status_${pomoId}" style="font-size:0.85rem;color:var(--sub);margin-bottom:12px;">⏳ Çalışma süresi başladı!</div>
       <div style="width:100%;background:rgba(255,255,255,.1);border-radius:8px;height:8px;overflow:hidden;margin-bottom:12px;"><div id="bar_${pomoId}" style="width:100%;height:100%;background:linear-gradient(90deg,#f97316,#ef4444);border-radius:8px;transition:width 1s linear;"></div></div>
       <div style="display:flex;gap:8px;justify-content:center;"><button id="pause_${pomoId}" style="padding:8px 16px;border:none;border-radius:8px;background:#f97316;color:#fff;cursor:pointer;font-weight:600;">⏸️ Duraklat</button><button id="stop_${pomoId}" style="padding:8px 16px;border:none;border-radius:8px;background:#ef4444;color:#fff;cursor:pointer;font-weight:600;">⏹️ Bitir</button></div>
     </div>`;
     addMessage('bot', '🍅 Pomodoro başladı!');
     appendMessage('bot', formatMessage('bot', pomoHtml));
     
     // Timer logic
     let totalSec = pomoMinutes * 60;
     let paused = false;
     const interval = setInterval(() => {
       if (paused) return;
       totalSec--;
       const m = Math.floor(totalSec / 60);
       const s = totalSec % 60;
       const timerEl = document.getElementById('timer_' + pomoId);
       const barEl = document.getElementById('bar_' + pomoId);
       const statusEl = document.getElementById('status_' + pomoId);
       if (timerEl) timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
       if (barEl) barEl.style.width = `${(totalSec / (pomoMinutes * 60)) * 100}%`;
       if (totalSec <= 0) {
         clearInterval(interval);
         if (timerEl) timerEl.textContent = '00:00';
         if (timerEl) timerEl.style.color = '#4ade80';
         if (statusEl) statusEl.textContent = '✅ Süre doldu! 5 dakika mola ver 🎉';
         addMessage('bot', '🍅 Pomodoro tamamlandı!');
         appendMessage('bot', formatMessage('bot', '🎉 <b>Pomodoro tamamlandı!</b> Harika iş çıkardın! Şimdi 5 dakika mola ver ve tekrarla. 💪'));
       }
     }, 1000);
     
     // Duraklat/Devam butonu
     setTimeout(() => {
       const pauseBtn = document.getElementById('pause_' + pomoId);
       const stopBtn = document.getElementById('stop_' + pomoId);
       if (pauseBtn) pauseBtn.addEventListener('click', () => {
         paused = !paused;
         pauseBtn.textContent = paused ? '▶️ Devam' : '⏸️ Duraklat';
         const statusEl = document.getElementById('status_' + pomoId);
         if (statusEl) statusEl.textContent = paused ? '⏸️ Duraklatıldı' : '⏳ Çalışma devam ediyor...';
       });
       if (stopBtn) stopBtn.addEventListener('click', () => {
         clearInterval(interval);
         const timerEl = document.getElementById('timer_' + pomoId);
         const statusEl = document.getElementById('status_' + pomoId);
         if (timerEl) timerEl.style.color = '#ef4444';
         if (statusEl) statusEl.textContent = '⏹️ Zamanlayıcı durduruldu.';
       });
     }, 100);
     return;
  }

  // F. AJANDA (/ajanda)
  if (lw.startsWith('/ajanda')) {
     const ajandaArg = msg.indexOf(' ') > -1 ? msg.substring(msg.indexOf(' ') + 1).trim() : '';
     let ajandaList = JSON.parse(localStorage.getItem('bot_agenda') || '[]');
     if (!ajandaArg) {
       if (ajandaList.length === 0) {
         addMessage('bot', 'Ajanda boş.');
         appendMessage('bot', formatMessage('bot', '📅 <b>Ajandanız Boş</b><br>Eklemek için: <code>/ajanda Matematik Sınavı (Cuma)</code>'));
       } else {
         const html = '📅 <b>Ajandanız:</b><br>' + ajandaList.map((a, i) => `<div style="padding:6px 10px;margin:4px 0;background:rgba(255,255,255,.06);border-radius:8px;">[${i+1}] ${a}</div>`).join('') + '<br><small style="color:var(--sub)">Temizlemek için: <code>/ajanda temizle</code></small>';
         addMessage('bot', 'Ajanda listelendi.');
         appendMessage('bot', formatMessage('bot', html));
       }
     } else if (ajandaArg.toLowerCase() === 'temizle') {
       localStorage.setItem('bot_agenda', '[]');
       addMessage('bot', 'Ajanda temizlendi.');
       appendMessage('bot', formatMessage('bot', '🗑️ Ajanda temizlendi!'));
     } else {
       ajandaList.push(ajandaArg);
       localStorage.setItem('bot_agenda', JSON.stringify(ajandaList));
       addMessage('bot', 'Ajandaya eklendi: ' + ajandaArg);
       appendMessage('bot', formatMessage('bot', `✅ Ajandaya eklendi: <b>${ajandaArg}</b><br><small style="color:var(--sub)">Toplam ${ajandaList.length} kayıt</small>`));
     }
     return;
  }

  // G. LİDERLİK TABLOSU (/liderlik)
  if (lw.startsWith('/liderlik')) {
     const userName = localStorage.getItem('mega_name') || 'Misafir';
     const userXP = state.xp || 0;
     const leaderboard = [
       { name: '🏫 Ata Sınıf Birincisi', xp: 2500 },
       { name: '📚 Kitap Kurdu Elif', xp: 1800 },
       { name: '🧮 Matematik Yıldızı Ali', xp: 1200 },
       { name: '🔬 Fen Kahramanı Zeynep', xp: 950 },
       { name: '🎨 Sanat Ustası Burak', xp: 700 },
     ];
     leaderboard.push({ name: `⭐ ${userName} (Sen)`, xp: userXP });
     leaderboard.sort((a, b) => b.xp - a.xp);
     let html = '🏆 <b>Liderlik Tablosu</b><br><div style="margin-top:8px;">';
     leaderboard.forEach((u, i) => {
       const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔹';
       const isMe = u.name.includes('(Sen)');
       html += `<div style="display:flex;justify-content:space-between;padding:8px 10px;margin:3px 0;background:${isMe ? 'rgba(74,222,128,.15)' : 'rgba(255,255,255,.06)'};border-radius:8px;${isMe ? 'border:1px solid rgba(74,222,128,.4);font-weight:700;' : ''}">
         <span>${medal} ${u.name}</span>
         <span style="color:#fde047;font-weight:bold;">${u.xp} XP</span>
       </div>`;
     });
     html += '</div><br><small style="color:var(--sub)">Daha çok sohbet ederek ve quiz çözerek XP kazan!</small>';
     addMessage('bot', 'Liderlik tablosu.');
     appendMessage('bot', formatMessage('bot', html));
     return;
  }

  // H. RAPOR (/rapor)
  if (lw.startsWith('/rapor')) {
     const toplamMesaj = state.messages.length;
     const kullaniciMesaj = state.messages.filter(m => m.role === 'user').length;
     const botMesaj = state.messages.filter(m => m.role === 'bot').length;
     const xp = state.xp || 0;
     const level = state.level || 1;
     const notlar = JSON.parse(localStorage.getItem('mega_notlar') || '[]').length;
     const ajanda = JSON.parse(localStorage.getItem('bot_agenda') || '[]').length;
     
     const html = `📊 <b>Oturum Raporu</b>
       <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#60a5fa;">${toplamMesaj}</div><small>Toplam Mesaj</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#4ade80;">${kullaniciMesaj}</div><small>Senin Mesajın</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#f97316;">${xp}</div><small>Toplam XP</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#c084fc;">Lv.${level}</div><small>Seviye</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#fbbf24;">${notlar}</div><small>Not</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#f472b6;">${ajanda}</div><small>Ajanda</small></div>
       </div>`;
     addMessage('bot', 'Rapor oluşturuldu.');
     appendMessage('bot', formatMessage('bot', html));
     return;
  }

  // I. SANAL MASKOT (/pet)
  if (lw.startsWith('/pet')) {
     setIsLoading(true);
     toggleTypingIndicator(true);
     updateBotStatus('🟢 Düşünüyor...', '#4ade80');
     try {
       const petPrompt = `Sen "Atik" adında sevimli bir sanal maskot köpeksin 🐕. Ata Ortaokulu'nun maskotusun. Kısa, sevimli ve eğlenceli cevaplar ver. Emoji bol kullan. Havlama sesleri ekle. Kullanıcıya moral ver ve onu motive et. Eğer kullanıcı sana yiyecek verirse mutlu ol (`;
       const response = await askAI(msg.replace('/pet', '').trim() || 'Merhaba Atik! Nasılsın?', petPrompt);
       addMessage('bot', response);
       toggleTypingIndicator(false);
       appendMessage('bot', formatMessage('bot', '🐕 <b>Atik:</b> ' + response));
       updateBotStatus('🟢 Çevrimiçi', '#4ade80');
     } catch(e) {
       toggleTypingIndicator(false);
       showError('Maskot yanıt veremedi.');
       updateBotStatus('🔴 Hata', '#ef4444');
     } finally { setIsLoading(false); }
     return;
  }

  // J. KARAKTER MODU (/karakter)
  if (lw.startsWith('/karakter')) {
     const karakterler = [
       { isim: 'Profesör Zeki', emoji: '🧑‍🔬', desc: 'Bilim meraklısı, her şeyi deneylerle açıklayan bir profesör' },
       { isim: 'Kaptan Keşif', emoji: '🧭', desc: 'Dünyayı gezen, coğrafya ve tarih anlatan bir kaşif' },
       { isim: 'Şef Lezzet', emoji: '👨‍🍳', desc: 'Yemek yaparken matematik ve fen öğreten bir aşçı' },
       { isim: 'Astronot Yıldız', emoji: '👩‍🚀', desc: 'Uzaydan dünyayı anlatan bir astronot' },
       { isim: 'Dedektif Mantık', emoji: '🕵️', desc: 'Her problemi mantık yürüterek çözen bir dedektif' },
     ];
     const k = karakterler[Math.floor(Math.random() * karakterler.length)];
     window._activeCharacter = k;
     const html = `🎭 <b>Karakter Modu Aktif!</b><br><br>
       <div style="background:rgba(255,255,255,.06);padding:14px;border-radius:12px;border-left:4px solid var(--acc);">
         <div style="font-size:1.5rem;margin-bottom:4px;">${k.emoji}</div>
         <div style="font-weight:700;font-size:1rem;">${k.isim}</div>
         <div style="color:var(--sub);font-size:0.85rem;margin-top:4px;">${k.desc}</div>
       </div>
       <br><small>Artık benimle bu karakter olarak sohbet edebilirsin! Normal moda dönmek için <code>/normal</code> yaz.</small>`;
     addMessage('bot', `Karakter: ${k.isim}`);
     appendMessage('bot', formatMessage('bot', html));
     return;
  }

  // K. RASTGELE KONU (/rastgele)
  if (lw.startsWith('/rastgele')) {
     setIsLoading(true);
     toggleTypingIndicator(true);
     updateBotStatus('🟢 Düşünüyor...', '#4ade80');
     try {
              const konular = ['Uzayda yaşam', 'Dinozorlar', 'İnsan beyni', 'Yapay zeka', 'Denizaltı volkanları', 'Antik Mısır', 'DNA', 'Kara delikler', 'Robotlar', "Atatürk'ün çocukluğu", 'Mucitler', 'Matematik tarihi', "Dünya'nın katmanları", 'Mikroplar', 'Gökkuşağı nasıl oluşur', "İstanbul'un fethi", 'Hayvan iletişimi', 'Volkanlar', 'Gezegenler', 'Fotosintez'];
       const secilen = konular[Math.floor(Math.random() * konular.length)];
       const response = await askAI('Bana ' + secilen + ' hakkında ilginç ve eğitici bilgiler ver.', 'Sen bir eğitim asistanısın. Rastgele seçilen konu hakkında kısa, ilginç ve eğlenceli bilgiler ver. Emoji kullan. 2-3 paragraftan fazla olmasın.');
       addMessage('bot', response);
       toggleTypingIndicator(false);
       appendMessage('bot', formatMessage('bot', `🎲 <b>Rastgele Konu: ${secilen}</b><br><br>${response}`));
       updateBotStatus('🟢 Çevrimiçi', '#4ade80');
     } catch(e) {
       toggleTypingIndicator(false);
       showError('Konu yüklenemedi.');
       updateBotStatus('🔴 Hata', '#ef4444');
     } finally { setIsLoading(false); }
     return;
  }

  // L. NORMAL MODA DÖN (/normal)
  if (lw.startsWith('/normal')) {
     currentMode = 'normal';
     window.activeQuizSession = false;
     window.activeOralSession = false;
     window._activeCharacter = null;
     const modeContainer = document.getElementById('modeSelector');
     if (modeContainer) {
       modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
       const normalBtn = modeContainer.querySelector('.mode-btn');
       if (normalBtn) normalBtn.classList.add('active');
     }
     const botName = document.getElementById('botName');
     if (botName) botName.textContent = '🏫 Ata Sohbet — Normal';
     addMessage('bot', 'Normal moda dönüldü.');
     appendMessage('bot', formatMessage('bot', '✅ <b>Normal Mod</b> aktif. Karakter ve quiz modları kapatıldı.'));
     return;
  }

  // M. RAPORLAMA PANELI AÇ (/rapor)
  if (lw.startsWith('/rapor') || lw.startsWith('/karne')) {
     renderReportPanel();
     addMessage('bot', 'Öğrenci gelişim raporu istendi.');
     appendMessage('bot', formatMessage('bot', '📊 <b>Raporlama Paneli</b> açılıyor...'));
     return;
  }

  // UI üzerinden gönderilen 'Sınav Modu' komutunu direkt Sihirbaza bağla
  if (lw === 'sınav modu' || lw === 'test sihirbazı' || lw === 'sınav menüsü') {
     document.getElementById('userInput').value = '';
     openQuizWizard();
     return;
  }

  // ==== 2. YÜKLENİYOR & AI ROUTER SÜRECİ (V11 ENGİNE) ====
  // Doğal dilde "ders anlat" kalıbı varsa otomatik ders moduna al
  const isDersRequest = lw.startsWith('/ders') || (/ders/.test(lw) && /anlat/.test(lw)) || (/konu/.test(lw) && /anlat/.test(lw));
  if (isDersRequest) {
     currentMode = 'ders';
     // /ders komutu gelince eski studySelections bağlamı yeni konuyla çakışmasın
     // Eğer sihirbazdan gelmiyorsa (studySelections.topic=boş ise) eski topic'i temizle
     if (!studySelections.topic) {
        studySelections.grade = null;
        studySelections.subject = '';
     }
  }

  setIsLoading(true);
  toggleTypingIndicator(true);
  updateBotStatus('🟢 Düşünüyor...', '#4ade80');
  
  // Kullanıcı mesajını V11 memory'e ekle
  v11AddToMemory('user', msg);
  
  try {
     // ═══════════════════════════════════════════
     // V11 STRICT ENGINE FLOW
     // USER → SafeParse → Validate → Route → Engine → Output
     // ═══════════════════════════════════════════

     // STEP 1: UI mod bypass (Quiz/Ders wizard'dan geliyorsa parser'ı atla)
     let intentData = null;
     if (currentMode === 'quiz' && window.activeQuizSession) {
       // Quiz modu aktif → direkt quiz intent
       intentData = { intent: 'quiz', grade: studySelections.grade, topic: studySelections.topic, difficulty: 'medium' };
     } else if (lw.startsWith('/quiz')) {
       // /quiz komutu → direkt quiz intent (AI parse'a gerek yok)
       intentData = { intent: 'quiz', grade: studySelections.grade, topic: studySelections.topic || msg, difficulty: 'medium' };
     } else if (isDersRequest) {
       // /ders komutu veya doğal dilde ders isteği → DOĞRUDAN chat intent (v11SafeParse atla!)
       // Çünkü SafeParse de askAI çağırır → throttle'a takılır → "2 saniye bekleyin" mesajı çıkar
       intentData = { intent: 'chat', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
     } else {
       // STEP 2: SafeParse (3 deneme retry ile intent tespiti)
       intentData = await v11SafeParse(msg);
     }

     console.log('[V11] Parsed intent:', intentData);

     // STEP 3: Route → Engine (Image / Quiz / Chat)
     await v11Route(intentData, msg, {
       currentMode,
       studySelections,
       activeCharacter: window._activeCharacter,
       lastDocument: window.lastAnalyzedDocument,

       // ── CHAT ENGINE CALLBACK ──
       onTextOutput: (text) => {
         toggleTypingIndicator(false);
         updateBotStatus('🟢 Çevrimiçi', '#4ade80');
         v11AddToMemory('bot', text);
         addMessage('bot', text);

         // suggest_quiz check: eğitim konusu sohbeti → quiz teklif et
         const isEduTopic = /(matematik|fizik|kimya|biyoloji|tarih|coğrafya|fen|edebiyat|türkçe|konu)/i.test(msg);
         let renderHtml = formatMessage('bot', text);
         if (isEduTopic && currentMode !== 'quiz') {
           renderHtml += `<br><br><div class="smart-suggestion-box"><p style="margin:0 0 10px 0;font-size:0.95em;">🌟 <b>Öneri:</b> Bu konuyu pekiştirmek için bir quiz çözmek ister misin?</p><button class="smart-btn wow-card" onclick="document.getElementById('userInput').value='Bu konuda quiz yap'; document.getElementById('btnSendMessage').click();" style="width:100%;padding:10px;background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">🟢 Quiz Başlat</button></div>`;
         }
         // Typewriter animasyonuyla yaz (uzun cevaplarda bekleme hissi ortadan kalkar)
         streamMessage(renderHtml, () => {
           if (currentMode === 'ders') appendLessonActionButtons();
         });
       },

       // ── IMAGE ENGINE CALLBACK ──
       onImageOutput: ({ count, object, imgData }) => {
         toggleTypingIndicator(false);
         updateBotStatus('🟢 Çevrimiçi', '#4ade80');
         const uid = 'img' + Date.now();
         const imageHtml = `<div id="${uid}" style="background:rgba(0,0,0,.45);padding:14px;border-radius:12px;margin-top:8px;">
           <p style="font-weight:700;color:#c084fc;">🖼️ Görsel Üretildi (${count} adet: ${object})</p>
           ${imgData ? `<img src="${imgData}" style="width:100%;border-radius:8px;display:block;" alt="${object}">` : '<p style="color:#ef4444;">⚠️ Görsel yüklenemedi. Tekrar deneyin.</p>'}
         </div>`;
         addMessage('bot', `(Görsel: ${count} ${object})`);
         appendMessage('bot', formatMessage('bot', imageHtml));
       },

       // ── QUIZ ENGINE CALLBACK ──
       onQuizOutput: ({ grade, subject, topic, difficulty }) => {
         toggleTypingIndicator(false);
         updateBotStatus('🟢 Çevrimiçi', '#4ade80');
         currentMode = 'quiz';
         window.activeQuizSession = true;
         const label = `${grade} ${subject} - ${topic}`;
         addMessage('bot', `📝 Quiz: ${label}`);
         appendMessage('bot', formatMessage('bot', `📝 <b>Test Hazırlanıyor:</b> ${label}<br><br><div class="jumping-dots"><span></span><span></span><span></span></div>`));
         if (typeof generateDynamicQuiz === 'function') {
           generateDynamicQuiz(grade, subject, topic, difficulty);
         }
       },

       // ── ERROR CALLBACK ──
       onError: (errMsg) => {
         toggleTypingIndicator(false);
         updateBotStatus('🔴 Hata', '#ef4444');
         addMessage('bot', 'Hata: ' + errMsg);
         appendMessage('bot', formatMessage('bot', `⚠️ ${errMsg}`));
       }
     });

     renderDailyQuests();
     updateBotStatus('🟢 Çevrimiçi', '#4ade80');

  } catch(e) {
     console.error("[V11] Critical Error:", e);
     updateBotStatus('🔴 Hata', '#ef4444');
     addMessage('bot', 'AI Engine Error');
     appendMessage('bot', formatMessage('bot', '⚠️ Sistem hatası oluştu, lütfen tekrar deneyin.'));
  } finally {
     setIsLoading(false);
     saveUserData();
     toggleTypingIndicator(false);
     updateStats();
  }
}

// ═══════════════════════════════════════════
// DERS MODU AKSİYON BUTONLARI
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// 🎯 QUIZ SİHİRBAZI — Kullanıcı seçer, AI üretir
// ═══════════════════════════════════════════
function openQuizWizard() {
  // Varsa öncekini kaldır
  const existing = document.getElementById('quizWizardOverlay');
  if (existing) existing.remove();

  const grades = [1,2,3,4,5,6,7,8,9,10,11,12];
  const questionTypes = [
    { id: 'coktan', label: '📋 Çoktan Seçmeli', desc: 'Klasik 4 şıklı test' },
    { id: 'dogru_yanlis', label: '✅ Doğru / Yanlış', desc: '2 şıklı hızlı test' },
    { id: 'bosluk', label: '📝 Boşluk Doldurma', desc: 'Eksik kelimeyi bul' },
    { id: 'lgs', label: '🎯 LGS Tarzı', desc: 'Paragraf & çıkarım' },
    { id: 'yks', label: '🏫 YKS/TYT Tarzı', desc: 'Analiz & sentez' },
    { id: 'karma', label: '🎲 Karma Soru', desc: 'Karışık soru tipleri' },
  ];

  const overlay = document.createElement('div');
  overlay.id = 'quizWizardOverlay';
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px;`;

  overlay.innerHTML = `
    <div style="background:var(--bg2,#1e293b);border-radius:20px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,.7);border:1px solid var(--bdr,rgba(255,255,255,.1));">
      
      <!-- HEADER -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px 16px;border-bottom:1px solid var(--bdr,rgba(255,255,255,.1));">
        <div>
          <h2 style="margin:0;font-size:1.3rem;color:var(--acc,#38bdf8);">🎯 Test Sihirbazı</h2>
          <p id="qwStepLabel" style="margin:4px 0 0;font-size:.82rem;color:var(--sub,#64748b);">Adım 1/3 — Sınıf seçin</p>
        </div>
        <button id="qwClose" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;padding:4px 8px;border-radius:8px;">✖</button>
      </div>

      <!-- ADIM 1: SINIF SEÇİMİ -->
      <div id="qwStep1" style="padding:20px 24px;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Hangi sınıf düzeyinde test çözmek istiyorsun?</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${grades.map(g => `
            <button class="qw-grade-btn" data-grade="${g}" style="padding:12px 8px;border-radius:12px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);font-weight:700;font-size:.95rem;cursor:pointer;transition:all .2s;">
              ${g}. Sınıf
            </button>
          `).join('')}
        </div>
      </div>

      <!-- ADIM 2: DERS SEÇİMİ -->
      <div id="qwStep2" style="padding:20px 24px;display:none;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Hangi dersten test çözmek istiyorsun?</p>
        <div id="qwSubjectGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
      </div>

      <!-- ADIM 3: SORU TİPİ SEÇİMİ -->
      <div id="qwStep3" style="padding:20px 24px;display:none;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Nasıl bir soru tipi istersin?</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${questionTypes.map(qt => `
            <button class="qw-type-btn" data-type="${qt.id}" style="padding:12px 16px;border-radius:12px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px;text-align:left;">
              <span style="font-size:1.1rem;">${qt.label}</span>
              <span style="font-size:.8rem;color:var(--sub,#64748b);margin-left:auto;">${qt.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- ADIM 4: SORU SAYISI SEÇİMİ -->
      <div id="qwStep4" style="padding:20px 24px;display:none;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Testte kaç soru olsun?</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${[2, 5, 8, 10].map(cnt => `
            <button class="qw-count-btn" data-count="${cnt}" style="padding:12px 8px;border-radius:12px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);font-weight:700;font-size:1.1rem;cursor:pointer;transition:all .2s;">
              ${cnt}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- FOOTER NAVİGASYON -->
      <div style="padding:16px 24px;border-top:1px solid var(--bdr,rgba(255,255,255,.1));display:flex;justify-content:space-between;">
        <button id="qwBack" style="padding:10px 20px;border-radius:10px;border:1px solid var(--bdr,rgba(255,255,255,.15));background:none;color:var(--sub,#64748b);cursor:pointer;display:none;">← Geri</button>
        <div id="qwSelection" style="font-size:.82rem;color:var(--acc,#38bdf8);align-self:center;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // State
  let selectedGrade = null;
  let selectedSubject = null;
  let step = 1;

  const stepLabel = overlay.querySelector('#qwStepLabel');
  const selectionDisplay = overlay.querySelector('#qwSelection');
  const backBtn = overlay.querySelector('#qwBack');

  // KAPAT
  overlay.querySelector('#qwClose').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  // GERİ
  backBtn.addEventListener('click', () => {
    if (step === 2) {
      step = 1;
      overlay.querySelector('#qwStep1').style.display = '';
      overlay.querySelector('#qwStep2').style.display = 'none';
      stepLabel.textContent = 'Adım 1/3 — Sınıf seçin';
      backBtn.style.display = 'none';
      selectionDisplay.textContent = '';
    } else if (step === 3) {
      step = 2;
      overlay.querySelector('#qwStep2').style.display = '';
      overlay.querySelector('#qwStep3').style.display = 'none';
      stepLabel.textContent = 'Adım 2/3 — Ders seçin';
      selectionDisplay.textContent = `${selectedGrade}. Sınıf`;
    } else if (step === 4) {
      step = 3;
      overlay.querySelector('#qwStep3').style.display = '';
      overlay.querySelector('#qwStep4').style.display = 'none';
      stepLabel.textContent = 'Adım 3/3 — Soru tipini seçin';
    }
  });

  // ADIM 1: Sınıf seçimi
  overlay.querySelectorAll('.qw-grade-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.borderColor = 'var(--acc,#38bdf8)');
    btn.addEventListener('mouseleave', () => { if (!btn.classList.contains('selected')) btn.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))'; });
    btn.addEventListener('click', () => {
      selectedGrade = parseInt(btn.dataset.grade);
      step = 2;

      // Dersleri yükle
      const subjects = Object.keys(curriculumData[selectedGrade] || {});
      const subGrid = overlay.querySelector('#qwSubjectGrid');
      subGrid.innerHTML = subjects.map(s => `
        <button class="qw-sub-btn" data-subject="${s}" style="padding:10px 12px;border-radius:10px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);font-size:.88rem;cursor:pointer;transition:all .2s;">
          ${s}
        </button>
      `).join('');

      overlay.querySelector('#qwStep1').style.display = 'none';
      overlay.querySelector('#qwStep2').style.display = '';
      stepLabel.textContent = `Adım 2/3 — Ders seçin`;
      selectionDisplay.textContent = `${selectedGrade}. Sınıf`;
      backBtn.style.display = '';

      // Ders seçimi
      subGrid.querySelectorAll('.qw-sub-btn').forEach(sb => {
        sb.addEventListener('mouseenter', () => sb.style.borderColor = 'var(--acc,#38bdf8)');
        sb.addEventListener('mouseleave', () => { if (!sb.classList.contains('selected')) sb.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))'; });
        sb.addEventListener('click', () => {
          selectedSubject = sb.dataset.subject;
          step = 3;
          overlay.querySelector('#qwStep2').style.display = 'none';
          overlay.querySelector('#qwStep3').style.display = '';
          stepLabel.textContent = 'Adım 3/3 — Soru tipini seçin';
          selectionDisplay.textContent = `${selectedGrade}. Sınıf • ${selectedSubject}`;
          
          // Kademe bazlı LGS ve YKS filtresi
          overlay.querySelectorAll('.qw-type-btn').forEach(btn => {
            const type = btn.dataset.type;
            if (type === 'lgs' && selectedGrade !== 8) {
               btn.style.display = 'none';
            } else if (type === 'yks' && selectedGrade < 8) {
               btn.style.display = 'none';
            } else {
               btn.style.display = 'flex';
            }
          });
        });
      });
    });
  });

  // ADIM 3: Soru tipi seçimi → Adım 4'e Geçiş
  let selectedType = null;
  overlay.querySelectorAll('.qw-type-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.borderColor = 'var(--acc2,#818cf8)');
    btn.addEventListener('mouseleave', () => btn.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))');
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      step = 4;
      overlay.querySelector('#qwStep3').style.display = 'none';
      overlay.querySelector('#qwStep4').style.display = '';
      stepLabel.textContent = 'Adım 4/4 — Soru sayısı seçin';
    });
  });

  // ADIM 4: Soru sayısı seçimi → Quiz Başlat
  overlay.querySelectorAll('.qw-count-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.borderColor = 'var(--acc2,#818cf8)');
    btn.addEventListener('mouseleave', () => btn.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))');
    btn.addEventListener('click', () => {
      const qCount = parseInt(btn.dataset.count);
      overlay.remove();

      const typeLabels = {
        coktan: 'Çoktan Seçmeli',
        dogru_yanlis: 'Doğru/Yanlış',
        bosluk: 'Boşluk Doldurma',
        lgs: 'LGS Tarzı',
        yks: 'YKS/TYT Tarzı',
        karma: 'Karma Soru',
      };
      const topicList = curriculumData[selectedGrade]?.[selectedSubject] || ['Genel Konu'];
      const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];
      const quizTitle = `${selectedGrade}. Sınıf ${selectedSubject} — ${typeLabels[selectedType] || 'Test'}`;

      addMessage('bot', `${quizTitle} hazırlanıyor...`);
      appendMessage('bot', formatMessage('bot', `🎯 <b>${quizTitle}</b><br>Konu: <b>${randomTopic}</b><br>Soru Sayısı: ${qCount}<br><div class="jumping-dots"><span></span><span></span><span></span></div>`));
      generateDynamicQuiz(selectedGrade, selectedSubject, randomTopic, selectedType === 'yks' ? 'hard' : selectedType === 'lgs' ? 'medium' : 'medium', selectedType, qCount);
    });
  });
}

// V10: DINAMIK QUIZ ENGINE (State Machine)
async function generateDynamicQuiz(grade, subject, topic, difficulty, qType, customCount = null) {

  // ── Kademe tespiti ──────────────────────────────────────────────
  const gradeNum = parseInt(grade);
  let kademeTalimat = '';
  let formatTalimat = 'Çoktan seçmeli, 4 şık (A, B, C, D).';
  let zorluklarDagilim = '1 kolay, 3 orta, 1 zor';
  let typeRule = '';

  if (gradeNum >= 1 && gradeNum <= 4) {
    kademeTalimat = `İlkokul ${gradeNum}. Sınıf düzeyinde: somut örnekler ve günlük hayat nesneleriyle açıkla, cümleler kısa ve net olsun, hikayeleştirme tekniğinden yararlan, oyunsu ve sevecen bir dil kullan. Soyut kavramlardan kaçın.`;
    formatTalimat = 'Çoktan seçmeli, 3 şık (A, B, C). Şıklar çok kısa olsun.';
    zorluklarDagilim = '2 kolay, 2 orta, 1 biraz zorlu';
  } else if (gradeNum >= 5 && gradeNum <= 8) {
    kademeTalimat = `Ortaokul ${gradeNum}. Sınıf düzeyinde: LGS formatına yakın sorular oluştur. Okuduğunu anlama ve çıkarım yapma gerektiren sorular tercih et. Gerekirse "Aşağıdakilerden hangisi doğrudur?" veya "I, II, III" formatındaki sorular kullan. MEB müfredatına uygun ol.`;
  } else if (gradeNum >= 9 && gradeNum <= 12) {
    kademeTalimat = `Lise ${gradeNum}. Sınıf düzeyinde: YKS/TYT-AYT formatında sorular oluştur. Akademik terminoloji kullan, analiz ve sentez düzeyinde düşünme gerektirsin.`;
    zorluklarDagilim = '1 kolay, 2 orta, 2 zor';
  } else {
    kademeTalimat = `Ortaokul genel düzeyinde, MEB müfredatına uygun.`;
  }

  let templateOptions = `{ "A": "...", "B": "...", "C": "...", "D": "..." }`;

  // qType zorlamaları (Front-end 4 şıklı yapı bekler, o yüzden bunu maskeliyoruz)
  if (qType === 'bosluk') {
    formatTalimat = `Çoktan seçmeli, 4 şık (A, B, C, D). Soru metni içinde tamamlanması gereken bir boşluk için alt tireler (______) kullan. 
    İstersen cümlenin sonuna ipucu şıkları parantez içinde ekleyebilirsin.
    Örnek Kalıplar:
    - I ______ a student. (am / is / are)
    - Türkiye'nin başkenti ______'dır.
    - Ders çalıştı ______ sınavda başarılı olamadı. (fakat / veya / çünkü)
    LÜTFEN HİÇBİR YERDE ÇİFT TIRNAK (") İŞARETİ KULLANMA, TEK TIRNAK (') KULLAN. Açıklamaları (aciklama alanını) EN FAZLA 3 kelime tut ki sorular yarım kesilmesin.`;
  } else if (qType === 'dogru_yanlis') {
    formatTalimat = 'Soru metni doğrudan kesin bir İDDİA (cümle) olmalıdır. (Örn: "Dünya Güneş etrafında döner.") SADECE 2 şık ver! Şıkların içeriği KESİNLİKLE "Doğru" ve "Yanlış" kelimeleri olsun.';
    templateOptions = `{ "A": "Doğru", "B": "Yanlış" }`;
  } else if (qType === 'lgs') {
    formatTalimat = 'Okuduğunu anlama, grafik yorumlama veya mantık çıkarımına dayalı yeni nesil çoktan seçmeli, 4 şıklı.';
  } else if (qType === 'yks') {
    formatTalimat = 'YKS/TYT tarzında, çeldiricisi güçlü, analiz ve önbilgi gerektiren çoktan seçmeli, 4 şıklı.';
  }

  // ── Zorluk ayarı ───────────────────────────────────────────────
  const difficultyMap = {
    easy:   'Tüm sorular kolay, kavram tanıma düzeyinde olsun.',
    medium: `Zorluk dağılımı: ${zorluklarDagilim}.`,
    hard:   'Tüm sorular zor; akıl yürütme, analiz ve kavram yanılgılarını hedefleyen çeldiriciler kullan.'
  };
  const difficultyTalimat = difficultyMap[difficulty] || difficultyMap['medium'];

  // ── Ana pedagojik prompt ────────────────────────────────────────
  const isKarmaTen = qType === 'karma';
  const soruSayisi = customCount || (isKarmaTen ? 10 : 3);
  const qMsg = `GÖREV: ${grade} sınıf "${subject}" dersi "${topic}" konusu için ${soruSayisi} soru hazırla. ${soruSayisi >= 5 ? "DİKKAT: Yarıda kesilmemesi için soruların 'aciklama' (açıklama) kısımlarını ÇOK KISA tut (1 cümle)." : ""}

ZORLUK: ${difficultyTalimat}
KADEME/FORMAT: ${kademeTalimat} ${formatTalimat}

MECBURİ JSON FORMATI (SADECE AŞAĞIDAKİ YAPIYI DÖNDÜR, BAŞKA HİÇBİR ŞEY YAZMA!):
[
  {
    "soru": "Soru metni...",
    "secenekler": ${templateOptions},
    "dogru_cevap": "A",
    "aciklama": "Neden doğru..."
  }
]

ÇOK ÖNEMLİ:
- İçeriklerde kesinlikle çift tırnak (") kullanma, formatı koparır. Eğik tırnak (') kullanabilirsin.
- JSON içine ekstra anahtar (konu, id vb) EKLEME. Sadece yukarıdaki diziyi dön.`;

  let rawRes = "<Bos>";
  try {
    // Cache'de kalmış hatalı üretilmiş küçük JSON'ları ezip yeni response almak için timestamp ekliyoruz
    const cacheBuster = `\n_noCache: ${Date.now()}_`;
    // Quiz için 2000 Token sınırı: uzun Türkçe hikayeleştirmeler tokenları çabuk doldurur.
    const res = await askAI(qMsg + cacheBuster, 'Sen bir soru üretme motorusun. SADECE geçerli JSON dizisi döndür. Asla başka bir karakter ekleme.', 2000);
    rawRes = res;
    console.log("[Quiz Engine] RAW AI Output:\n", res);
    
    let parsed = null;
    if (res) {
      parsed = extractAndFixQuizJson(res);
    }

    if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
      setTimeout(() => {
        if (typeof launchInteractiveQuiz === 'function') {
          launchInteractiveQuiz(parsed.quiz, { subject, topic, grade });
        } else {
          console.error('launchInteractiveQuiz bulunamadı!');
        }
      }, 500);
    } else {
      throw new Error('Invalid output format');
    }
  } catch(e) {
    console.warn('Quiz Gen Error:', e);
    addMessage('bot', 'Test içeriği oluşturulamadı.');
    appendMessage('bot', formatMessage('bot', '⚠️ Soru oluşturulamadı, lütfen tekrar dene.\n\n<span style="font-size:0.7em;color:gray;">AI Çıktısı (ilk 300 harf): ' + (rawRes ? rawRes.substring(0, 300) : "null") + '</span>'));
  }
}


function appendLessonActionButtons() {
  const chatbox = document.getElementById('chatbox');
  if (!chatbox) return;

  const actionBarId = 'lesson-action-bar-' + Date.now();
  const actionHtml = `
    <div class="lesson-action-bar" id="${actionBarId}">
      <button class="lesson-action-btn continue" data-action="continue">
        <span class="lesson-action-icon">▶️</span>
        <span>Devam Et</span>
      </button>
      <button class="lesson-action-btn quiz" data-action="quiz">
        <span class="lesson-action-icon">📊</span>
        <span>Sınav Modu</span>
      </button>
      <button class="lesson-action-btn topic" data-action="topic">
        <span class="lesson-action-icon">🔀</span>
        <span>Başka Konuya Geç</span>
      </button>
      <button class="lesson-action-btn normal" data-action="normal">
        <span class="lesson-action-icon">💬</span>
        <span>Normal Moda Dön</span>
      </button>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.className = 'msg bot';
  wrapper.innerHTML = actionHtml;
  chatbox.appendChild(wrapper);
  chatbox.scrollTop = chatbox.scrollHeight;

  // Button event listeners
  const actionBar = document.getElementById(actionBarId);
  if (!actionBar) return;

  actionBar.querySelectorAll('.lesson-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');

      // Butonları devre dışı bırak
      actionBar.querySelectorAll('.lesson-action-btn').forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.5';
        b.style.pointerEvents = 'none';
      });
      // Tıklanan butonu vurgula
      btn.style.opacity = '1';
      btn.classList.add('selected');

      if (action === 'continue') {
        handleSendMessage('devam et');
      } else if (action === 'quiz') {
        // Mevcut konu için quiz oluştur
        if (studySelections.topic) {
          handleSendMessage(`/quiz ${studySelections.grade}. Sınıf ${studySelections.subject}, ${studySelections.topic} konusunda bana quiz oluştur.`);
        } else {
          handleSendMessage('test oluştur');
        }
      } else if (action === 'topic') {
        openTopicChangePopup();
      } else if (action === 'normal') {
        // Normal moda geri dön
        currentMode = 'normal';
        const botName = document.getElementById('botName');
        if (botName) botName.textContent = '🏫 Ata Sohbet — Normal';
        // Mode selector güncelle
        const modeContainer = document.getElementById('modeSelector');
        if (modeContainer) {
          modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
          const normalBtn = [...modeContainer.querySelectorAll('.mode-btn')].find(b => b.textContent.includes('Normal'));
          if (normalBtn) normalBtn.classList.add('active');
        }
        appendMessage('bot', formatMessage('bot', '💬 Normal sohbet moduna geri dönüldü. Bana istediğin her şeyi sorabilirsin!'));
      }
    });
  });
}

// ═══════════════════════════════════════════
// KONU DEĞİŞTİR POPUP
// ═══════════════════════════════════════════

function openTopicChangePopup() {
  // Eğer zaten açıksa kapat
  const existing = document.getElementById('topicChangePopup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'topicChangePopup';
  popup.className = 'topic-popup-overlay';
  popup.innerHTML = `
    <div class="topic-popup">
      <div class="topic-popup-header">
        <span class="topic-popup-title">🔀 Başka Konuya Geç</span>
        <button class="topic-popup-close" id="topicPopupClose">✕</button>
      </div>
      <div class="topic-popup-body">
        <label class="topic-popup-label" for="topicInput">Hangi konuyu öğrenmek istiyorsun?</label>
        <input 
          type="text" 
          id="topicPopupInput" 
          class="topic-popup-input" 
          placeholder="Örn: Kesirlerle İşlemler, Osmanlı Tarihi, DNA..." 
          autocomplete="off"
          autofocus
        />
        <button class="topic-popup-submit" id="topicPopupSubmit">🚀 Bu Konuyu Anlat</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // Animasyon için küçük gecikme
  requestAnimationFrame(() => {
    popup.classList.add('active');
  });

  const closePopup = () => {
    popup.classList.remove('active');
    setTimeout(() => popup.remove(), 300);
  };

  // Arka plana tıklayınca kapat
  // Arka plana tıklayınca kapat
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  // Kapat butonuna tıklayınca
  document.getElementById('topicPopupClose').addEventListener('click', closePopup);

  // Escape ile kapat
  const escHandler = (e) => {
    if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  // Submit butonu
  const submitBtn = document.getElementById('topicPopupSubmit');
  const inputEl = document.getElementById('topicPopupInput');

  const doSubmit = () => {
    const topic = inputEl.value.trim();
    if (!topic) {
      inputEl.style.borderColor = '#ef4444';
      inputEl.placeholder = 'Lütfen bir konu yazın...';
      inputEl.focus();
      return;
    }

    closePopup();

    // ÖNEMLİ: Eski ders bağlamını temizle ki AI eski konuya takılmasın
    studySelections.topic = '';
    studySelections.subject = '';
    studySelections.grade = null;
    studySelections.mode = '';

    // Ders modu aktif kalsın, yeni konuyu gönder
    handleSendMessage(`/ders ${topic} konusunu detaylıca ve öğretici bir şekilde anlat.`);
  };

  submitBtn.addEventListener('click', doSubmit);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doSubmit();
  });

  // Otofokus
  setTimeout(() => inputEl.focus(), 100);
}

// ═══════════════════════════════════════════
// YAN MENÜ BUTONLARI EVENT LISTENER'LAR
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // LB Event Listener
  document.getElementById('btnOpenLeaderboard')?.addEventListener('click', () => {
     renderLeaderboard();
     document.body.classList.remove('sidebar-collapsed');
  });

  // DNA Map Event Listener
  document.getElementById('btnOpenDnaMap')?.addEventListener('click', () => {
     renderDnaMap();
     document.body.classList.remove('sidebar-collapsed');
  });

  // Skill Tree Event Listener
  const skillTree = new SkillTree(document.body);
  document.getElementById('btnOpenSkillTree')?.addEventListener('click', () => {
     skillTree.open();
     document.body.classList.remove('sidebar-collapsed');
  });

  // Oyun Merkezi (Game Overlay)
  const btnOpenGameMenu = document.getElementById('btnOpenGameMenu');
  const gameOverlay = document.getElementById('gameOverlay');
  if (btnOpenGameMenu && gameOverlay) {
    btnOpenGameMenu.addEventListener('click', () => {
      gameOverlay.style.display = 'flex';
      renderGameMenu();
    });
  }

  // Düello
  const btnOpenDuelArena = document.getElementById('btnOpenDuelArena');
  const duelArenaInst = new DuelArena(document.body);
  if (btnOpenDuelArena) {
    btnOpenDuelArena.addEventListener('click', () => {
      const g = studySelections?.grade || 7;
      const s = studySelections?.subject || 'Matematik';
      const t = studySelections?.topic || 'Genel';
      duelArenaInst.startDuel(g, s, t);
    });
  }

  // Sınav Geçmişim
  const btnOpenExamHistory = document.getElementById('btnOpenExamHistory');
  const dashboardInst = new SuperZekaDashboard(document.body);
  if (btnOpenExamHistory) {
      btnOpenExamHistory.addEventListener('click', () => {
          dashboardInst.open();
          document.body.classList.remove('sidebar-collapsed');
      });
  }

  // Sözlü Sınav
  const btnOpenVoiceExam = document.getElementById('btnOpenVoiceExam');
  if (btnOpenVoiceExam) {
     btnOpenVoiceExam.addEventListener('click', () => {
         const btnSend = document.getElementById('btnSendMessage');
         const userInput = document.getElementById('userInput');
         const btnToggleVoice = document.getElementById('btnToggleVoice');
         
         if(btnSend && userInput) {
            window.activeOralSession = true;
            userInput.value = "Şu andan itibaren Sözlü Mülakat Modundasın. Bana dersimle ilgili kısa bir sözlü sorusu sor. Ben cevaplayınca not verip diğerine geç.";
            btnSend.click();
            setTimeout(() => {
               if(btnToggleVoice) btnToggleVoice.click();
            }, 1500);
         }
         document.body.classList.remove('sidebar-collapsed');
     });
  }

  // Konu Çalış Wizard'ı
  const btnOpenStudyWizard = document.getElementById('btnOpenStudyWizard');
  if (btnOpenStudyWizard) {
     btnOpenStudyWizard.addEventListener('click', () => {
         if (typeof openStudyWizard === 'function') {
             openStudyWizard('lesson');
         }
         document.body.classList.remove('sidebar-collapsed');
     });
  }
});

// ═══════════════════════════════════════════
// İSTATİSTİK GÜNCELLEME
// ═══════════════════════════════════════════
function updateStats() {
  const msgCount = state.messages.length;
  const el = document.getElementById('stMsg');
  if (el) el.textContent = msgCount;

  // PROGRESS BAR & LEVEL SİSTEMİ (V17 XP Algoritması)
  const xp = state.xp || 0;
  // Basit bir Level 1 = 1000, 2 = 2500, 3 = 5000 XP eğrisi
  let currentLevel = 1;
  let maxXP = 1000;
  let levelTitle = "Başlangıç Düzeyi";

  if (xp > 15000) { currentLevel = 5; maxXP = 30000; levelTitle = "Efsanevi Öğrenci"; }
  else if (xp > 5000) { currentLevel = 4; maxXP = 15000; levelTitle = "Usta Çırak"; }
  else if (xp > 2500) { currentLevel = 3; maxXP = 5000; levelTitle = "Gelişmiş Zihin"; }
  else if (xp > 1000) { currentLevel = 2; maxXP = 2500; levelTitle = "Keşif Yolcusu"; }

  state.level = currentLevel;

  const lblLevelTitle = document.getElementById('lblLevelTitle');
  const lblXpInfo = document.getElementById('lblXpInfo');
  const xpProgressBar = document.getElementById('xpProgressBar');

  if (lblLevelTitle) lblLevelTitle.innerHTML = `${levelTitle} (Seviye ${currentLevel})`;
  if (lblXpInfo) lblXpInfo.innerText = `${xp} / ${maxXP} XP`;
  if (xpProgressBar) {
      const pct = Math.min(((xp / maxXP) * 100), 100);
      xpProgressBar.style.width = pct + "%";
  }

  // --- V18 GAMIFICATION (LİDERLİK TABLOSU) ---
  const currentUserName = localStorage.getItem('mega_name') || "Sen";
  const lbNameSpan = document.getElementById('lbCurrentUserName');
  const lbXpSpan = document.getElementById('lbCurrentUserXp');
  if (lbNameSpan) lbNameSpan.textContent = currentUserName;
  if (lbXpSpan) lbXpSpan.textContent = `${xp} XP`;
  
  // Rozetleri ve Menü UI'ını güncelle
  if (typeof renderBadges === 'function') renderBadges();
}

// ═══════════════════════════════════════════
// Global retry işlevi (Yeniden Dene butonu için)
// ═══════════════════════════════════════════
window.retryLastMessage = async function() {
  if (lastSentMessage && !state.isLoading) {
    const chatbox = document.getElementById('chatbox');
    
    // 1. Hata mesajını (Bot) kaldır
    if (chatbox && chatbox.lastElementChild && chatbox.lastElementChild.classList.contains('bot')) {
        chatbox.removeChild(chatbox.lastElementChild);
    }
    
    // 2. Bir önceki gönderilen Kullanıcı mesajını da DOM'dan ve state'den kaldır 
    //    (çünkü handleSendMessage tekrar ekleyecek)
    if (chatbox && chatbox.lastElementChild && chatbox.lastElementChild.classList.contains('user')) {
        chatbox.removeChild(chatbox.lastElementChild);
    }
    if (state.messages.length > 0 && state.messages[state.messages.length - 1].role === 'user') {
        state.messages.pop(); // Son user mesajını state'den çıkart
    }
    
    await handleSendMessage(lastSentMessage);
  }
}

// ═══════════════════════════════════════════
// EVENT LISTENERS — TÜM BUTONLAR
// ═══════════════════════════════════════════
function setupEventListeners() {
  const sendBtn = document.getElementById('btnSendMessage');
  const chatInput = document.getElementById('userInput');
  
  // Mesaj gönder — input ANINDA temizle (async bekleme yok)
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (chatInput) {
        const val = chatInput.value;
        chatInput.value = '';   // ← senkron temizle, hemen boşalsın
        handleSendMessage(val);
      }
    });
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const val = chatInput.value;
        chatInput.value = '';   // ← senkron temizle, hemen boşalsın
        handleSendMessage(val);
      }
    });
  }

  // Sağ/Sol menü "Hızlı Komut" (.chip[data-qcmd]) butonları
  // chatInput'a bağımlı değil — doğrudan handleSendMessage çağrılır
  const chips = document.querySelectorAll('.chip[data-qcmd]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-qcmd');
      if (!cmd) return;
      // Input'u temizle (varsa)
      if (chatInput) chatInput.value = '';
      handleSendMessage(cmd);
    });
  });

  // ═══════════════════════════════════════════
  // Oyun Merkezi (Game Overlay) buton handler'ları
  // ═══════════════════════════════════════════
  const btnOpenGameMenu = document.getElementById('btnOpenGameMenu');
  const gameOverlay = document.getElementById('gameOverlay');
  const btnCloseGameModal = document.getElementById('btnCloseGameModal');
  
  if (btnOpenGameMenu && gameOverlay) {
    btnOpenGameMenu.addEventListener('click', () => {
      gameOverlay.style.display = 'flex';
      renderGameMenu();
    });
  }
  if (btnCloseGameModal && gameOverlay) {
    btnCloseGameModal.addEventListener('click', () => {
      gameOverlay.style.display = 'none';
    });
  }

  // Sınavlarım butonu
  const btnOpenExamHistory = document.getElementById('btnOpenExamHistory');
  if (btnOpenExamHistory) {
    btnOpenExamHistory.addEventListener('click', () => {
      const gameOverlay = document.getElementById('gameOverlay');
      if (gameOverlay) gameOverlay.style.display = 'flex';
      const gameTitle = document.getElementById('gameTitle');
      if (gameTitle) gameTitle.textContent = '📋 Sınavlarım';
      renderExamHistory();
    });
  }

  // Tam ekran butonu
  const btnToggleGameFullscreen = document.getElementById('btnToggleGameFullscreen');
  if (btnToggleGameFullscreen) {
    btnToggleGameFullscreen.addEventListener('click', () => {
      const modal = document.getElementById('gameModal');
      if (modal) modal.classList.toggle('fullscreen');
    });
  }

  // ═══════════════════════════════════════════
  // Kurallar / Ayarlar modülü açma-kapama
  // ═══════════════════════════════════════════
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  const settingsModal = document.getElementById('settingsModal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');

  if (btnOpenSettings && settingsModal) {
    btnOpenSettings.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
    });
  }
  if (btnCloseSettings && settingsModal) {
    btnCloseSettings.addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });
  }

  // Settings Tabs
  const settingsTabs = document.querySelectorAll('.stab');
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      settingsTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.stab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('panel' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
      if (panel) panel.classList.add('active');
    });
  });

  // Profil & Kişiselleştirme Kaydetme
  const btnSaveProfile = document.getElementById('btnSaveProfile');
  if (btnSaveProfile) {
    btnSaveProfile.addEventListener('click', () => {
      const nameInput = document.getElementById('settingUserName').value.trim();
      const botInput = document.getElementById('settingBotName').value.trim();
      
      if (nameInput) {
         localStorage.setItem('mega_name', nameInput);
      }
      if (botInput) {
         const botNameEl = document.getElementById('botName');
         if (botNameEl) botNameEl.textContent = botInput;
         addMessage('bot', 'İsmim güncellendi: ' + botInput);
      }
      
      btnSaveProfile.textContent = '✅ Kaydedildi!';
      setTimeout(() => { btnSaveProfile.textContent = '💾 Bilgileri Kaydet'; }, 2000);
    });
  }

  // Aydınlık / Karanlık Tema Seçimi
  const btnThemeDark = document.getElementById('btnThemeDark');
  const btnThemeLight = document.getElementById('btnThemeLight');
  if (btnThemeDark && btnThemeLight) {
    btnThemeDark.addEventListener('click', () => {
       document.documentElement.removeAttribute('data-theme');
    });
    btnThemeLight.addEventListener('click', () => {
       document.documentElement.setAttribute('data-theme', 'light');
    });
  }

  // ═══════════════════════════════════════════
  // ÇIKIŞ YAP BUTONU
  // ═══════════════════════════════════════════
  const btnLogout = document.getElementById('btnLogoutUser');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('mega_name');
      localStorage.removeItem('selectedAvatar');
      addMessage('bot', 'Çıkış yapıldı.');
      appendMessage('bot', formatMessage('bot', '✅ Çıkış yapıldı! Sayfa yenileniyor...'));
      setTimeout(() => location.reload(), 1500);
    });
  }

  // ═══════════════════════════════════════════
  // HAFIZAYI SIFIRLA BUTONU
  // ═══════════════════════════════════════════
  const btnClearMemory = document.getElementById('btnClearMemory');
  if (btnClearMemory) {
    btnClearMemory.addEventListener('click', () => {
      if (confirm('Tüm sohbet geçmişi ve ayarlar silinecektir. Emin misiniz?')) {
        localStorage.clear();
        addMessage('bot', 'Hafıza sıfırlandı.');
        appendMessage('bot', formatMessage('bot', '🗑️ Tüm veriler temizlendi! Sayfa yenileniyor...'));
        setTimeout(() => location.reload(), 1500);
      }
    });
  }

  // ═══════════════════════════════════════════
  // SOHBETİ İNDİR BUTONU
  // ═══════════════════════════════════════════
  const btnExport = document.getElementById('btnExportChat');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const msgs = state.messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
      const blob = new Blob([`Ata Ortaokulu Sohbet Geçmişi\n${'='.repeat(40)}\nTarih: ${new Date().toLocaleString('tr-TR')}\n\n${msgs}`], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `sohbet_gecmisi_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
      appendMessage('bot', formatMessage('bot', '💾 Sohbet geçmişi indirildi!'));
    });
  }

  // ═══════════════════════════════════════════
  // KARNEYİ İNDİR BUTONU
  // ═══════════════════════════════════════════
  const btnExportKarne = document.getElementById('btnExportKarne');
  if (btnExportKarne) {
    btnExportKarne.addEventListener('click', () => {
      const name = localStorage.getItem('mega_name') || 'Öğrenci';
      let report = `Ata Ortaokulu Zeka ve Gelişim Karnesi\n`;
      report += `========================================\n`;
      report += `Öğrenci: ${name}\n`;
      report += `Seviye: ${state.level}\n`;
      report += `Deneyim Puanı (XP): ${state.xp}\n`;
      report += `Tarih: ${new Date().toLocaleString('tr-TR')}\n\n`;

      const historyStr = localStorage.getItem('mega_quiz_history');
      if (historyStr) {
        try {
          const history = JSON.parse(historyStr);
          if (history.length > 0) {
            report += `=== Sınav Geçmişi ===\n`;
            history.forEach((r, i) => {
              const dateStr = new Date(r.date).toLocaleDateString('tr-TR');
              const subject = r.subject ? `${r.grade}. Sınıf ${r.subject}` : 'Quiz';
              const topic = r.topic || 'Genel';
              report += `${i + 1}. [${dateStr}] ${subject} - ${topic}  => Başarı: %${r.pct} (${r.correct}/${r.total})\n`;
            });
          } else {
            report += `Henüz çözülmüş bir sınav bulunmuyor.\n`;
          }
        } catch (e) {
          report += `Sınav geçmişi okunamadı.\n`;
        }
      } else {
        report += `Henüz çözülmüş bir sınav bulunmuyor.\n`;
      }

      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `karnem_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
      appendMessage('bot', formatMessage('bot', '🎓 Karnen başarıyla indirildi! Başarılarının devamını dilerim.'));
    });
  }

  // ═══════════════════════════════════════════
  // MOBİL MENÜ BUTONU (Unified — active + visible class)
  // ═══════════════════════════════════════════
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  function openMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.classList.add('visible');
    }
  }
  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (backdrop) {
      backdrop.classList.remove('active');
      backdrop.classList.remove('visible');
    }
  }
  // Global helper for other modules
  window._closeMobileSidebar = closeMobileSidebar;

  if (btnMobileMenu && sidebar) {
    btnMobileMenu.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  // Mobilde sidebar içindeki butonlara tıklayınca sidebar'ı otomatik kapat
  if (sidebar) {
    sidebar.querySelectorAll('.v18-btn, .chip, .sb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setTimeout(() => closeMobileSidebar(), 200);
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // EĞİTİM SEÇİM SİHİRBAZI BUTONLARI
  // ═══════════════════════════════════════════
  const btnCloseStudyModal = document.getElementById('btnCloseStudyModal');
  const btnStartStudy = document.getElementById('btnStartStudy');
  const studyOverlay = document.getElementById('studyOverlay');

  // 🎯 Test Sihirbazı butonu
  const btnOpenQuizWizard = document.getElementById('btnOpenQuizWizard');
  if (btnOpenQuizWizard) {
    btnOpenQuizWizard.addEventListener('click', () => openQuizWizard());
  }


  if (btnCloseStudyModal && studyOverlay) {
    btnCloseStudyModal.addEventListener('click', () => {
      studyOverlay.classList.remove('active');
      setTimeout(() => studyOverlay.style.display = 'none', 300);
    });
  }

  if (btnStartStudy) {
    btnStartStudy.addEventListener('click', () => {
      if (!studySelections.grade || !studySelections.subject || !studySelections.topic) return;
      
      const { mode, grade, subject, topic } = studySelections;
      const chatInput = document.getElementById('userInput');
      
      // Modu değiştir
      currentMode = mode === 'quiz' ? 'quiz' : 'ders';
      if (mode === 'quiz') window.activeQuizSession = true;
      
      // Header güncelle
      const botName = document.getElementById('botName');
      if (botName) botName.textContent = `🏫 Ata Sohbet — ${mode === 'quiz' ? 'Quiz' : 'Ders'}`;
      
      // Mode selector aktif butonu güncelle
      const modeContainer = document.getElementById('modeSelector');
      if (modeContainer) {
        modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        const targetBtn = [...modeContainer.querySelectorAll('.mode-btn')].find(b => b.textContent.includes(mode === 'quiz' ? 'Quiz' : 'Ders'));
        if (targetBtn) targetBtn.classList.add('active');
      }
      
      if (chatInput) {
        if (mode === 'quiz') {
          chatInput.value = `/quiz ${grade}. Sınıf ${subject}, ${topic} konusunda bana öğretici bir quiz oluştur.`;
        } else {
          chatInput.value = `/ders ${grade}. Sınıf ${subject}, ${topic} konusunu detaylıca ve öğretici bir şekilde anlat.`;
        }
        
        studyOverlay.classList.remove('active');
        setTimeout(() => studyOverlay.style.display = 'none', 300);
        
        handleSendMessage(chatInput.value);
      }
    });
  }

  const btnChatStudy = document.getElementById('btnChatStudy');
  if (btnChatStudy) {
    btnChatStudy.addEventListener('click', () => {
      if (!studySelections.grade || !studySelections.subject || !studySelections.topic) return;
      
      const { grade, subject, topic } = studySelections;
      const chatInput = document.getElementById('userInput');
      
      currentMode = 'normal';
      
      // Header güncelle
      const botName = document.getElementById('botName');
      if (botName) botName.textContent = `🤖 Ata Mentor - Rehber`;
      
      if (chatInput) {
        // Konu anlatımı yerine sadece soruyor: "Bu konuda ne öğrenmek istersin?"
        chatInput.value = `Merhaba, ${grade}. Sınıf ${subject} dersinin ${topic} konusunu çalışmak istiyorum. Bu konuyla ilgili hafif bir sohbetle başlayalım, bana doğrudan uzun uzun anlatma, konuya giriş yapalım.`;
        
        studyOverlay.classList.remove('active');
        setTimeout(() => studyOverlay.style.display = 'none', 300);
        
        handleSendMessage(chatInput.value);
      }
    });
  }

  // ═══════════════════════════════════════════
  // SES BUTONU
  // ═══════════════════════════════════════════
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  if (btnAudioToggle) {
    let audioOn = true;
    btnAudioToggle.addEventListener('click', () => {
      audioOn = !audioOn;
      btnAudioToggle.textContent = audioOn ? '🔊' : '🔇';
    });
  }

  // ═══════════════════════════════════════════
  // KOMUT PALETİ (Ctrl+K)
  // ═══════════════════════════════════════════
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput = document.getElementById('cmdInput');
  const cmdList = document.getElementById('cmdList');

  if (cmdOverlay && cmdInput && cmdList) {
    const commands = [
      { cmd: '/quiz', icon: '📊', desc: 'Quiz başlat' },
      { cmd: '/sinavlarim', icon: '📋', desc: 'Sınavlarım geçmişi' },
      { cmd: '/ders', icon: '📚', desc: 'Ders modu' },
      { cmd: '/oyun', icon: '🎮', desc: 'Oyun merkezi' },
      { cmd: '/motivasyon', icon: '🚀', desc: 'Motivasyon mesajı' },
      { cmd: '/hava Istanbul', icon: '🌡️', desc: 'Hava durumu' },
      { cmd: '/çiz', icon: '🎨', desc: 'Görsel oluştur' },
      { cmd: '/görsel', icon: '🖼️', desc: 'Görsel komut' },
      { cmd: '/rastgele', icon: '🎲', desc: 'Rastgele konu' },
      { cmd: '/karakter', icon: '🎭', desc: 'Karakter modu' },
      { cmd: 'çıkış', icon: '🚪', desc: 'Çıkış yap' },
    ];

    function renderCmdList(filter = '') {
      const filtered = filter ? commands.filter(c => c.cmd.includes(filter) || c.desc.toLowerCase().includes(filter.toLowerCase())) : commands;
      cmdList.innerHTML = filtered.map(c => `<button class="cmd-item" data-cmd="${c.cmd}">${c.icon} <b>${c.cmd}</b> — ${c.desc}</button>`).join('');
      cmdList.querySelectorAll('.cmd-item').forEach(item => {
        item.addEventListener('click', () => {
          const cmd = item.getAttribute('data-cmd');
          cmdOverlay.style.display = 'none';
          handleSendMessage(cmd);
        });
      });
    }

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        cmdOverlay.style.display = cmdOverlay.style.display === 'flex' ? 'none' : 'flex';
        if (cmdOverlay.style.display === 'flex') {
          cmdInput.value = '';
          cmdInput.focus();
          renderCmdList();
        }
      }
      if (e.key === 'Escape' && cmdOverlay.style.display === 'flex') {
        cmdOverlay.style.display = 'none';
      }
    });

    cmdInput.addEventListener('input', () => {
      renderCmdList(cmdInput.value);
    });

    // Arka plana tıklayınca kapat
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) cmdOverlay.style.display = 'none';
    });
  }

  // ═══════════════════════════════════════════
  // GOOGLE GİRİŞ BUTONU (Stub — Firebase aktif değil)
  // ═══════════════════════════════════════════
  const btnLoginGoogle = document.getElementById('btnLoginGoogle');
  if (btnLoginGoogle) {
    btnLoginGoogle.addEventListener('click', () => {
      // Firebase aktif olmadığı için kullanıcıya bilgi ver
      alert('🌐 Google ile giriş özelliği şu an geliştirme aşamasındadır. Lütfen isim yazarak veya Misafir olarak giriş yapın.');
    });
  }

  // ═══════════════════════════════════════════
  // PDF Yükleme butonu
  // ═══════════════════════════════════════════
  const btnUploadPdf = document.getElementById('btnUploadPdf');
  const pdfInput = document.getElementById('pdfUploadInput');
  if (btnUploadPdf && pdfInput) {
    btnUploadPdf.addEventListener('click', () => pdfInput.click());
    pdfInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        let text = '';
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          text = await file.text();
        } else if (file.type === 'application/pdf') {
          appendMessage('bot', formatMessage('bot', `⏳ <b>${file.name}</b> işleniyor, lütfen bekleyin...`));
          text = await extractTextFromPDF(file);
        } else {
          appendMessage('bot', formatMessage('bot', `❌ Geçersiz dosya türü. Sadece TXT veya PDF kabul edilir.`));
          return;
        }
        
        if (text && text.length > 0) {
          appendMessage('bot', formatMessage('bot', `📄 <b>${file.name}</b> dosyası başarıyla analiz edildi (${text.length} karakter okundu). Şimdi bu dosyanın içeriğiyle ilgili sorular sorabilirsin!`));
          window.lastAnalyzedDocument = text.substring(0, 15000); 
        } else {
          appendMessage('bot', formatMessage('bot', `❌ Dosyanın içinden metin okunamadı. Resim veya taranmış belge olabilir.`));
        }
      } catch (err) {
        appendMessage('bot', formatMessage('bot', `❌ PDF okunurken hata: ${err.message}`));
      }
      pdfInput.value = '';
    });
  }

  // ═══════════════════════════════════════════
  // Performans Modu toggle
  // ═══════════════════════════════════════════
  const toggleLowEnd = document.getElementById('toggleLowEnd');
  if (toggleLowEnd) {
    toggleLowEnd.checked = document.body.classList.contains('lowend');
    toggleLowEnd.addEventListener('change', () => {
      if (toggleLowEnd.checked) {
        document.body.classList.add('lowend');
        localStorage.setItem('mega_low_end', 'true');
      } else {
        document.body.classList.remove('lowend');
        localStorage.removeItem('mega_low_end');
      }
    });
  }
}

// ═══════════════════════════════════════════
// Sesli Giriş (Web Speech API)
// ═══════════════════════════════════════════
function setupVoiceInput() {
  const btnToggleVoice = document.getElementById('btnToggleVoice');
  const chatInput = document.getElementById('userInput');
  
  if (!btnToggleVoice || !chatInput) return;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btnToggleVoice.style.display = 'none';
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'tr-TR';
  recognition.interimResults = false;
  
  btnToggleVoice.addEventListener('click', () => {
    btnToggleVoice.classList.add('listening');
    recognition.start();
  });
  
  recognition.addEventListener('result', (e) => {
    const text = e.results[0][0].transcript;
    chatInput.value = text;
    handleSendMessage(text);
  });
  
  recognition.addEventListener('end', () => {
    btnToggleVoice.classList.remove('listening');
  });
}

// ═══════════════════════════════════════════
// Tema / Dark Mode
// ═══════════════════════════════════════════
function setupThemes() {
  const tbtns = document.querySelectorAll('.tbtn');
  tbtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const t = e.target.getAttribute('data-theme');
      document.body.setAttribute('data-theme', t);
      
      tbtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      localStorage.setItem('mega_theme', t);
    });
  });

  // Kaydedilmiş temayı uygula
  const saved = localStorage.getItem('mega_theme');
  if (saved) {
    document.body.setAttribute('data-theme', saved);
    tbtns.forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-theme') === saved) b.classList.add('active');
    });
  }
}

// ═══════════════════════════════════════════
// Onboarding Logic
// ═══════════════════════════════════════════
function initOnboarding() {
  const overlay = document.getElementById('onboardOverlay');
  const btnStart = document.getElementById('btnCompleteOnboarding');
  const btnDemo = document.getElementById('btnDemoOnboarding');
  const nameInput = document.getElementById('onboardName');
  
  // If user info exists, hide overlay and return
  const savedName = localStorage.getItem('mega_name');
  if (savedName) {
    if (overlay) overlay.style.display = 'none';
    document.body.classList.remove('ui-locked');
    const userMeta = document.querySelector('.user-meta');
    if(userMeta) userMeta.textContent = savedName;
    // Avatar da varsa güncelle
    const savedAvatar = localStorage.getItem('selectedAvatar') || '🧑‍🎓';
    const avatarEl = document.querySelector('.user-avatar');
    if (avatarEl) avatarEl.textContent = savedAvatar;
    return;
  }
  
  // Otherwise, show onboarding
  if (overlay) overlay.style.display = 'flex';
  renderAvatarPicker();
  
  const finishOnboarding = (name) => {
    // EĞER BU YENİ BİR BAŞLANGIÇ İSE, ESKİ KULLANICININ KALINTI DATALARINI SIFIRLA!
    localStorage.clear();

    const avatar = document.getElementById('selectedAvatar')?.value || '👦';
    localStorage.setItem('mega_name', name);
    localStorage.setItem('selectedAvatar', avatar);
    localStorage.setItem('mega_xp', '0');
    localStorage.setItem('mega_level', '1');
    localStorage.setItem('bot_messages', '[]');
    
    // Uygulamanın tüm state ve UI'ı temiz verilerle ayağa kaldırması için sayfayı tazele.
    window.location.reload();
  };
  
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const name = nameInput ? nameInput.value.trim() : 'Öğrenci';
      finishOnboarding(name || 'Öğrenci');
    });
  }
  
  if (btnDemo) {
    btnDemo.addEventListener('click', () => {
      finishOnboarding('Misafir');
    });
  }

  // Enter ile de başlatabilsin
  if (nameInput) {
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = nameInput.value.trim() || 'Öğrenci';
        finishOnboarding(name);
      }
    });
  }
}

// ═══════════════════════════════════════════
// DOMINANCE MODE (PSİKOLOJİK BAŞLANGIÇ)
// ═══════════════════════════════════════════
function initDominanceMode() {
  const domOverlay = document.getElementById('dominanceOverlay');
  const domPhase1 = document.getElementById('domPhase1');
  const domText1 = document.getElementById('domText1');
  const domText2 = document.getElementById('domText2');
  const domText3 = document.getElementById('domText3');
  const btnStart = document.getElementById('btnDomStart');
  const domPhase2 = document.getElementById('domPhase2');
  const btnTest = document.getElementById('btnDomTest');
  
  if (!domOverlay) return;
  domOverlay.classList.remove('hidden');

  // Sinematik akış
  setTimeout(() => domText1.classList.add('show'), 1500); // 1.5 sn sonra
  setTimeout(() => domText2.classList.add('show'), 4000); // 2.5 sn daha
  setTimeout(() => {
     domText3.classList.add('show');
     btnStart.classList.remove('hidden');
     setTimeout(() => btnStart.classList.add('show'), 50); // fade in için kısa delay
  }, 6000);

  if (btnStart) {
    btnStart.addEventListener('click', () => {
        domPhase1.classList.add('hidden');
        domPhase2.classList.remove('hidden');

        // Daha Havalı (Cooler) Staggered Fade-in Efekti
        const p2Items = domPhase2.querySelectorAll('.dom-p2-item');
        p2Items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('hidden');
                item.classList.add('show');
            }, 800 * (index + 1)); // Her biri 0.8 saniye arayla gelecek
        });
    });
  }

  if (btnTest) {
    btnTest.addEventListener('click', () => {
        // Ekran karararak kalkar, ardından asıl sistem açılır
        domOverlay.style.opacity = '0';
        setTimeout(() => {
            domOverlay.classList.add('hidden');
            initOnboarding(); // Asıl ATA CORE AI Sihirbazını başlat
        }, 1000);
    });
  }
}

// ═══════════════════════════════════════════
// İNTERAKTİF QUIZ MOTORU (Step-by-step)
// ═══════════════════════════════════════════

function launchInteractiveQuiz(questions, meta) {
  const gameOverlay = document.getElementById('gameOverlay');
  const gameTitle = document.getElementById('gameTitle');
  const gameBody = document.getElementById('gameBody');
  if (!gameOverlay || !gameBody) return;

  gameOverlay.style.display = 'flex';
  if (gameTitle) gameTitle.textContent = `📝 ${meta.topic || 'Quiz'}`;

  let currentQ = 0;
  let answers = []; // { qIdx, selected, correct, isCorrect }
  let answered = false;

  if (!questions || questions.length === 0) {
     gameBody.innerHTML = `
        <div style="text-align:center; padding:40px;">
           <h2 style="color:var(--err); margin-bottom:15px;">⚠️ Soru Yüklenemedi</h2>
           <p style="color:var(--sub); margin-bottom:20px;">Yapay zeka soruları uygun formatta üretemediği için boş döndü. Lütfen tekrar deneyin.</p>
           <button class="btn-save" onclick="document.getElementById('gameOverlay').style.display='none';" style="background:var(--acc);">Kapat ve Yeniden Dene</button>
        </div>
     `;
     return;
  }

  function renderQuestion() {
    const q = questions[currentQ];
    const total = questions.length;
    const progress = ((currentQ) / total) * 100;
    answered = false;

    // AI HATA ÖNLEYİCİ: secenekler eksikse veya array olarak geldiyse toparla
    let sOpts = q.secenekler;
    if (!sOpts || typeof sOpts !== 'object') {
       // Tamamen uydurma şıklar üret ki UI çökmesin (Boşluk/Doğru-Yanlış hatası)
       sOpts = { "A": "Doğru / Evet", "B": "Yanlış / Hayır" };
       q.secenekler = sOpts;
       if (!q.dogru_cevap) q.dogru_cevap = "A";
    } else if (Array.isArray(sOpts)) {
       // Eğer ["Elma", "Armut"] gibi liste döndüyse {"A": "Elma", "B": "Armut"} yap
       const newOpts = {};
       const letters = ['A','B','C','D','E'];
       sOpts.forEach((opt, idx) => {
          newOpts[letters[idx] || idx] = opt;
          // Eğer dogru_cevap "Elma" ise onu "A" yap
          if (q.dogru_cevap === opt) q.dogru_cevap = letters[idx] || String(idx);
       });
       q.secenekler = newOpts;
       sOpts = newOpts;
    }
    const optionKeys = Object.keys(sOpts);

    gameBody.innerHTML = `
      <div class="iq-container">
        <div class="iq-progress">
          <div class="iq-progress-fill" style="width:${progress}%"></div>
        </div>
        <div class="iq-header">
          <span class="iq-counter">SORU ${currentQ + 1} / ${total}</span>
          <span class="iq-difficulty ${(q.zorluk || 'orta').toLowerCase()}">${q.zorluk || 'orta'}</span>
        </div>
        <div class="iq-question">${q.soru}</div>
        <div class="iq-options">
          ${optionKeys.map(key => `
            <div class="iq-option" data-key="${key}">
              <div class="iq-option-letter">${key}</div>
              <div class="iq-option-text">${q.secenekler[key]}</div>
            </div>
          `).join('')}
        </div>
        <div id="iqFeedback"></div>
        <div class="iq-nav">
          <button class="iq-nav-btn next" id="iqNextBtn" disabled>
            ${currentQ < total - 1 ? 'Sonraki Soru →' : 'Sonuçları Gör 🏆'}
          </button>
        </div>
      </div>
    `;

    // Option click handlers
    gameBody.querySelectorAll('.iq-option').forEach(opt => {
      opt.addEventListener('click', () => {
        if (answered || opt.classList.contains('disabled')) return;

        const selected = opt.getAttribute('data-key');
        const correctKey = q.dogru_cevap;
        const isCorrect = selected === correctKey;

        if (!isCorrect) {
          // YANLIŞ CEVAP DURUMU (V15 Öğreten Test)
          opt.classList.add('disabled', 'wrong');
          q.failedOnce = true; // Eksik tespiti için işaretle
          
          const fb = document.getElementById('iqFeedback');
          if (fb) {
            fb.innerHTML = `
              <div class="iq-feedback wrong-fb" style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span>❌ Yanlış! Ama PES ETMEK YOK, tekrar dene! 💪</span>
                  <button id="btnHint" style="background:var(--acc); color:#fff; border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:bold;">💡 İpucu Al</button>
                </div>
                <div id="hintBox" style="display:none; font-size:0.9em; background:rgba(139,92,246,0.15); padding:10px; border-radius:8px; border-left:4px solid #8b5cf6;"></div>
              </div>`;
            
            document.getElementById('btnHint').addEventListener('click', async () => {
              const hbox = document.getElementById('hintBox');
              hbox.style.display = 'block';
              hbox.innerHTML = '<i>🧠 İpucu düşünülüyor...</i>';
              // Hızlı bir ipucu üretmesi için AI engine'e sor
              const hintPrompt = `Öğrenci testi çözerken şu soruyu yanlış yaptı:\n"${q.soru}"\n\nDoğru cevap "${q.secenekler[correctKey]}". Öğrenciye cevabı direkt VERMEDEN, 1-2 cümlelik çok kısa ve yönlendirici bir ipucu ver. İpucu öğretici olsun.`;
              try {
                const hintRes = await askAI(hintPrompt, "Sen bir öğretmensin, kısa ipucu veriyorsun.");
                hbox.innerHTML = `🧠 <b>Öğretmeninin İpucusu:</b> ${hintRes}`;
              } catch(e) {
                hbox.innerHTML = `🧠 <b>İpucu:</b> Şıkları tekrar dikkatlice oku, cevabın çok uzağında değilsin!`;
              }
            });
          }
        } else {
          // DOĞRU CEVAP DURUMU
          answered = true;
          answers.push({
            qIdx: currentQ,
            selected,
            correct: correctKey,
            isCorrect: !q.failedOnce, // İlk seferde bilmediyse "tam doğru" saymıyoruz
            question: q.soru
          });

          gameBody.querySelectorAll('.iq-option').forEach(o => {
            const k = o.getAttribute('data-key');
            o.classList.add('disabled');
            if (k === selected) o.classList.add('correct');
          });

          const fb = document.getElementById('iqFeedback');
          if (fb) {
            const aciklama = q.aciklama ? `<div style="margin-top:8px;font-size:0.88em;background:rgba(34,197,94,0.12);padding:10px;border-radius:8px;border-left:4px solid #22c55e;"><b>📖 Açıklama:</b> ${q.aciklama}</div>` : '';
            fb.innerHTML = `<div class="iq-feedback correct-fb">✅ Doğru! Harika iş çıkardın! 🎉${aciklama}</div>`;
          }

          const nextBtn = document.getElementById('iqNextBtn');
          if (nextBtn) nextBtn.disabled = false;
        }
      });
    });

    // Next button
    const nextBtn = document.getElementById('iqNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!answered) return;
        currentQ++;
        if (currentQ < total) {
          renderQuestion();
        } else {
          renderResult();
        }
      });
    }
  }

  function renderResult() {
    const total = questions.length;
    const correctCount = answers.filter(a => a.isCorrect).length; // Yalnızca ilk seferde bilinenler
    const wrongCount = total - correctCount;
    const pct = Math.round((correctCount / total) * 100);

    let emoji, title, subtitle, expLevel;
    if (pct >= 80) {
      emoji = '🏆'; title = 'Müthiş Başarı!'; subtitle = 'Konuyu çok iyi öğrenmişsin!'; expLevel = 'İleri';
    } else if (pct >= 60) {
      emoji = '👍'; title = 'İyi İş!'; subtitle = 'Biraz daha çalışarak mükemmel olabilirsin.'; expLevel = 'Orta';
    } else if (pct >= 40) {
      emoji = '💪'; title = 'Devam Et!'; subtitle = 'Konuyu tekrar gözden geçirmeni öneririm.'; expLevel = 'Temel';
    } else {
      emoji = '📚'; title = 'Daha Fazla Çalışmalısın!'; subtitle = 'Sistemin sana özel konu anlatımını kullanmalısın.'; expLevel = 'Başlangıç';
    }

    // Oyunlaştırma Ödülü Dağıtımı
    const earnedXp = correctCount * 15;
    state.xp = (state.xp || 0) + earnedXp;
    saveUserData(); // state.js içerisindeki fonksiyon
    updateStats(); // UI'ı yenile


    // Save to history
    saveQuizResult({
      date: new Date().toISOString(),
      grade: meta.grade,
      subject: meta.subject,
      topic: meta.topic,
      total,
      correct: correctCount,
      wrong: wrongCount,
      pct,
      details: answers.map(a => ({
        question: a.question,
        selected: a.selected,
        correct: a.correct,
        isCorrect: a.isCorrect
      }))
    });

    gameBody.innerHTML = `
      <div class="iq-result-wow">
        <h1>${emoji}</h1>
        <h2>${title}</h2>
        <p>${subtitle}</p>

        <div class="iq-score-card">
          %${pct} BAŞARI <br>
          <span style="font-size:0.5em; font-weight:normal; display:block; margin-top:5px; opacity:0.9;">(${total} Soruda ${correctCount} Doğru)</span>
        </div>

        <div class="iq-detail-list" style="text-align:left; background:var(--bg); border:1px solid var(--border); padding:10px; border-radius:12px;">
          ${answers.map((a, i) => `
            <div class="iq-detail-item ${a.isCorrect ? 'correct-d' : 'wrong-d'}">
              <span class="iq-detail-icon">${a.isCorrect ? '✅' : '❌'}</span>
              <div class="iq-detail-text">
                <strong>Soru ${i + 1}:</strong> ${a.question}<br>
                <span style="font-size:.76rem; opacity:0.8;">Senin cevabın: ${a.selected} ${a.isCorrect ? '' : '→ Doğrusu: ' + a.correct}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="iq-result-actions" style="margin-top:25px; display:flex; gap:10px; justify-content:center; flex-direction:column;">
          <!-- V17 SISTEM DONGUSÜ BUTONLARI -->
          <button class="iq-result-btn primary" id="iqAnalyzeBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #ec4899, #8b5cf6); color:white; border:none; border-bottom:3px solid #7c3aed;">
             Sadece Yanlış Yaptığım Konuları Anlat
          </button>
          
          <button class="iq-result-btn" id="iqNormalChatBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #3b82f6, #06b6d4); color:white; border:none; border-bottom:3px solid #0284c7; margin-top: 10px;">
             Normal Sohbete Dön
          </button>
          
          <div style="display:flex; gap:10px;">
             <button class="iq-result-btn secondary" id="iqHistoryBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold;flex:1;">📋 Geçmiş</button>
             <button class="iq-result-btn secondary" id="iqCloseBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold;flex:1;">✖ Kapat</button>
          </div>
          
          <button class="iq-result-btn primary" id="iqNewQuizBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #f59e0b, #ea580c); color:white; border:none; border-bottom:3px solid #c2410c; margin-top: 5px;">
             🚀 Yeni Test Çöz
          </button>
        </div>
      </div>
    `;

    // Button handlers
    document.getElementById('iqNewQuizBtn')?.addEventListener('click', () => {
       const gameOverlay = document.getElementById('gameOverlay');
       if (gameOverlay) gameOverlay.style.display = 'none';
       window.activeQuizSession = false;
       window.activeOralSession = false;
       currentMode = 'normal';
       openQuizWizard();
    });
    document.getElementById('iqAnalyzeBtn')?.addEventListener('click', () => {
       const gameOverlay = document.getElementById('gameOverlay');
       if (gameOverlay) gameOverlay.style.display = 'none';

       window.activeQuizSession = false;
       window.activeOralSession = false;
       currentMode = 'ders';

       // Hangi sorular yanlış yapıldı metnini çıkar
       const wrongAnswers = answers.filter(a => !a.isCorrect).map(a => a.question);
       let prompt = "";
       if (wrongAnswers.length === 0) {
          prompt = `Süper, tüm soruları doğru yaptım! Lütfen bana başarımı pekiştirmek için 1-2 farklı zor soru daha sor.`;
       } else {
          prompt = `Ben şu konularda yanlış yaptım: \n${wrongAnswers.join(' \n')}\nLütfen bildiğim yerleri atla ve SADECE yanlış yaptığım bu spesifik detaylar üzerinde bana "Neden Yanlış Düşündüğümü" gösteren bir mini 5 dakikalık tekrar planı oluştur.`;
       }

       const input = document.getElementById('userInput');
       if (input) {
          input.value = prompt;
          document.getElementById('btnSendMessage')?.click();
       }
    });

        document.getElementById('iqNormalChatBtn')?.addEventListener('click', () => {
      const gameOverlay = document.getElementById('gameOverlay');
      if (gameOverlay) gameOverlay.style.display = 'none';
      window.activeQuizSession = false;
      window.activeOralSession = false;
      currentMode = 'normal';
      const botName = document.getElementById('botName');
      if (botName) botName.textContent = '🤖 Ata Sohbet - Normal';
      const input = document.getElementById('userInput');
      if (input) {
         input.value = "Testi bitirdim, normal sohbete döndüm.";
         document.getElementById('btnSendMessage')?.click();
      }
    });

    document.getElementById('iqCloseBtn')?.addEventListener('click', () => {
      window.activeQuizSession = false;
      const gameOverlay = document.getElementById('gameOverlay');
      if (gameOverlay) gameOverlay.style.display = 'none';
    });

    document.getElementById('iqHistoryBtn')?.addEventListener('click', () => {
      const gameTitle = document.getElementById('gameTitle');
      if (gameTitle) gameTitle.textContent = '📋 Sınavlarım';
      renderExamHistory();
    });
  }

  renderQuestion();
}

// ═══════════════════════════════════════════
// SINAV GEÇMİŞİ — LocalStorage Kayıt/Okuma
// ═══════════════════════════════════════════

function saveQuizResult(result) {
  // Speed mode check
  if (window.activeSpeedMode && result && result.correct > 0) {
     window.speedScore += result.correct;
     const sc = document.getElementById('speedScoreNum');
     if(sc) sc.innerText = window.speedScore;
  }
  
  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
  history.unshift(result); // En yeni en başta
  // Maksimum 50 kayıt tut
  if (history.length > 50) history.length = 50;
  localStorage.setItem('quiz_history', JSON.stringify(history));
  try{ StorageManager.set(StorageManager.keys.QUIZ_HISTORY, history); }catch(e){}
  if(window.updateMissionProgress) {
     // completed exactly 1 quiz session, giving credit for 5 questions
     window.updateMissionProgress('quiz', 5);
  }
  if(window._renderDailyQuests) window._renderDailyQuests();
}

function getQuizHistory() {
  return JSON.parse(localStorage.getItem('quiz_history') || '[]');
}

function deleteQuizResult(index) {
  const history = getQuizHistory();
  history.splice(index, 1);
  localStorage.setItem('quiz_history', JSON.stringify(history));
}

function clearQuizHistory() {
  localStorage.removeItem('quiz_history');
}

// ═══════════════════════════════════════════
// VELİ / ÖĞRETMEN RAPORLAMA PANELİ
// ═══════════════════════════════════════════

function renderReportPanel() {
  const overlay = document.getElementById('reportOverlay');
  if (!overlay) return;

  const history = getQuizHistory();
  
  // Üst Panel Verileri
  document.getElementById('repTotalXp').textContent = state.xp;
  document.getElementById('repLevelTitle').textContent = `Lv.${state.level}`;
  document.getElementById('repStreak').textContent = `${StorageManager.get(StorageManager.keys.STREAK_DAYS) || 0} 🔥`;
  document.getElementById('repTotalQ').textContent = history.length;

  // Ders Bazlı Hesaplama (Reduce)
  const stats = {};
  history.forEach(q => {
     if (!q.subject) return;
     if (!stats[q.subject]) stats[q.subject] = { total: 0, correct: 0, wrong: 0, exams: 0 };
     stats[q.subject].exams++;
     stats[q.subject].total += q.total;
     stats[q.subject].correct += q.correct;
     stats[q.subject].wrong += q.wrong;
  });

  const repSubjectGrid = document.getElementById('repSubjectGrid');
  repSubjectGrid.innerHTML = '';
  
  let worstSubject = null;
  let worstAccuracy = 100;

  if (Object.keys(stats).length === 0) {
      repSubjectGrid.innerHTML = '<div style="color:var(--sub); font-size:0.9rem;">Henüz çözülmüş test bulunmuyor.</div>';
  } else {
      for (const [subj, data] of Object.entries(stats)) {
         let accuracy = Math.round((data.correct / data.total) * 100) || 0;
         
         if (accuracy < worstAccuracy && data.exams >= 1) {
             worstAccuracy = accuracy;
             worstSubject = subj;
         }

         // Renk algosu
         let color = '#22c55e'; // yeşil
         if (accuracy < 50) color = '#ef4444'; // kırmızı
         else if (accuracy < 75) color = '#fbbf24'; // sarı

         repSubjectGrid.innerHTML += `
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:15px; display:flex; flex-direction:column; gap:8px;">
               <div style="font-weight:700; color:var(--txt); font-size:1.1rem;">${subj}</div>
               <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--sub);">
                  <span>${data.exams} Sınav</span>
                  <span style="color:${color}; font-weight:800;">%${accuracy} Başarı</span>
               </div>
               <div style="width:100%; height:8px; background:rgba(0,0,0,0.3); border-radius:4px; overflow:hidden;">
                  <div style="height:100%; width:${accuracy}%; background:${color}; border-radius:4px;"></div>
               </div>
               <div style="font-size:0.8rem; color:var(--sub); display:flex; justify-content:space-between;">
                  <span>✅ ${data.correct} D</span>
                  <span>❌ ${data.wrong} Y</span>
               </div>
            </div>
         `;
      }
  }

  // Röntgen (AI Advice)
  const repAiAdvice = document.getElementById('repAiAdvice');
  if (worstSubject) {
      repAiAdvice.innerHTML = `Öğrenci özellikle <strong>${worstSubject}</strong> alanında <strong>%${worstAccuracy}</strong> gibi düşük bir başarı yüzdesine sahip. Ata Öğretmen sisteminin yönlendirmelerine uyarak bu derse ağırlık verilmesi ve quiz döngülerinde ${worstSubject} telafi testlerinin seçilmesi şiddetle tavsiye edilir.`;
  } else {
      repAiAdvice.innerHTML = "Öğrenci henüz yeterli sınava girmediği için kapsamlı bir zafiyet tespiti yapılamadı.";
  }

  // Göster
  overlay.style.display = 'flex';
}

// ═══════════════════════════════════════════
// SINAVLARIM — Geçmiş Sınav Sonuçları UI
// ═══════════════════════════════════════════

function renderExamHistory() {
  const gameBody = document.getElementById('gameBody');
  if (!gameBody) return;

  const history = getQuizHistory();

  if (history.length === 0) {
    gameBody.innerHTML = `
      <div class="iq-history">
        <div class="iq-history-title">📋 Sınavlarım</div>
        <div class="iq-history-empty">
          <div class="iq-history-empty-icon">📝</div>
          <div class="iq-history-empty-text">Henüz hiç sınav sonucunuz yok.<br>Quiz çözerek buraya kayıt ekleyin!</div>
        </div>
      </div>
    `;
    addBackButton(gameBody);
    return;
  }

  // Summary stats
  const totalExams = history.length;
  const avgPct = Math.round(history.reduce((s, r) => s + r.pct, 0) / totalExams);
  const totalCorrect = history.reduce((s, r) => s + r.correct, 0);

  gameBody.innerHTML = `
    <div class="iq-history">
      <div class="iq-history-title">📋 Sınavlarım <span style="font-size:.72rem;color:var(--sub);font-weight:400;">(${totalExams} sınav)</span></div>

      <div class="iq-history-summary">
        <div class="iq-history-stat">
          <div class="iq-history-stat-val">${totalExams}</div>
          <div class="iq-history-stat-lbl">Toplam Sınav</div>
        </div>
        <div class="iq-history-stat">
          <div class="iq-history-stat-val">%${avgPct}</div>
          <div class="iq-history-stat-lbl">Ort. Başarı</div>
        </div>
        <div class="iq-history-stat">
          <div class="iq-history-stat-val">${totalCorrect}</div>
          <div class="iq-history-stat-lbl">Toplam Doğru</div>
        </div>
      </div>

      <div class="iq-history-list">
        ${history.map((r, i) => {
          const scoreClass = r.pct >= 70 ? 'high' : r.pct >= 40 ? 'mid' : 'low';
          const dateStr = new Date(r.date).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });
          const label = r.grade ? `${r.grade}. Sınıf ${r.subject}` : (r.subject || 'Quiz');
          return `
            <div class="iq-history-card" data-idx="${i}">
              <div class="iq-history-score ${scoreClass}">%${r.pct}</div>
              <div class="iq-history-info">
                <div class="iq-history-subject">${label}</div>
                <div class="iq-history-meta">
                  <span>📖 ${r.topic || '-'}</span>
                  <span>✅ ${r.correct}/${r.total}</span>
                  <span>📅 ${dateStr}</span>
                </div>
              </div>
              <button class="iq-history-delete" data-del="${i}" title="Sil">🗑</button>
            </div>
          `;
        }).join('')}
      </div>

      <div style="text-align:center;margin-top:16px;">
        <button class="iq-history-clear" id="iqClearAll">🗑 Tüm Geçmişi Temizle</button>
      </div>
    </div>
  `;

  addBackButton(gameBody);

  // Delete individual
  gameBody.querySelectorAll('.iq-history-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-del'));
      if (confirm('Bu sınav kaydını silmek istediğinize emin misiniz?')) {
        deleteQuizResult(idx);
        renderExamHistory();
      }
    });
  });

  // Clear all
  const clearBtn = document.getElementById('iqClearAll');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Tüm sınav geçmişiniz silinecektir. Emin misiniz?')) {
        clearQuizHistory();
        renderExamHistory();
      }
    });
  }
}

// ═══════════════════════════════════════════
// HIZ MODU (60s SPEED QUIZ)
// ═══════════════════════════════════════════
window.startSpeedMode = function() {
  window.activeSpeedMode = true;
  window.speedScore = 0;
  window.speedTime = 60;
  
  if (typeof window._handleSendMessage === 'function') { 
      window._handleSendMessage("Kısa ve çok net 4 şıklı sorular sor. Sadece soruları ver. Hız moduna (60 saniye) başladık!"); 
  }
  
  const existing = document.getElementById('speedTimerOverlay');
  if(existing) existing.remove();
  
  const timerHtml = `
    <div id="speedTimerOverlay" style="position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.95); border:2px solid #eab308; border-radius:30px; padding:15px 30px; z-index:999999; box-shadow:0 10px 30px rgba(234,179,8,0.3); display:flex; gap:20px; align-items:center;">
       <div style="font-size:2rem; font-weight:900; color:#eab308;" id="speedTimeNum">⏱️ 60</div>
       <div style="width:2px; height:30px; background:var(--bdr);"></div>
       <div style="font-size:1.5rem; font-weight:bold; color:var(--txt);">Skor: <span id="speedScoreNum" style="color:#22c55e;">0</span></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', timerHtml);
  
  window.speedInterval = setInterval(() => {
     window.speedTime--;
     const tb = document.getElementById('speedTimeNum');
     if(tb) {
         tb.innerText = "⏱️ " + window.speedTime;
         if(window.speedTime <= 10) tb.style.color = '#ef4444';
     }
     
     if (window.speedTime <= 0) {
        window.endSpeedMode();
     }
  }, 1000);
};

window.endSpeedMode = function() {
  window.activeSpeedMode = false;
  clearInterval(window.speedInterval);
  const existing = document.getElementById('speedTimerOverlay');
  if(existing) existing.remove();
  
  const bonusXp = window.speedScore * 15;
  state.xp += bonusXp;
  
  const finishHtml = `
    <div class="dom-overlay speed-mode-summary" style="z-index:9999999; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(0,0,0,0.9);">
      <h1 style="color:#eab308; font-size:4rem; margin-bottom:10px; animation:bounceIn 0.5s;">SÜRE BİTTİ! ⏱️</h1>
      <div style="background:var(--bg2); padding:30px; border-radius:20px; text-align:center; border:2px solid var(--acc); min-width:300px;">
         <div style="font-size:1.5rem; color:var(--sub); margin-bottom:10px;">Toplam Doğru</div>
         <div style="font-size:4rem; font-weight:900; color:#22c55e;">${window.speedScore}</div>
         <div style="margin-top:20px; color:var(--acc); font-weight:bold;">+${bonusXp} XP Kazanıldı!</div>
      </div>
      <button class="onboard-btn ext-style-2" style="margin-top:20px;" onclick="this.parentElement.remove()">Kapat</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', finishHtml);
  if(window.triggerConfetti) window.triggerConfetti();
  
  const event = new CustomEvent('mega_xp_updated');
  document.dispatchEvent(event);
};

// ═══════════════════════════════════════════
// SINAV TİPİ SEÇİM MENÜSÜ (Global)
// ═══════════════════════════════════════════
window._openExamTypeMenu = function() {
  let existing = document.getElementById('examTypeOverlay');
  if (existing) { existing.style.display = 'flex'; existing.style.opacity = '1'; existing.style.pointerEvents = 'auto'; return; }
  const overlay = document.createElement('div');
  overlay.id = 'examTypeOverlay';
  overlay.className = 'exam-type-overlay';
  overlay.innerHTML = `
    <div class="exam-type-modal">
      <div class="exam-type-header">
        <h2>📝 Sınav Yap — Soru Tipi Seç</h2>
        <button class="exam-type-close" id="btnCloseExamType">✕</button>
      </div>
      <div class="exam-type-desc">Oluşturmak istediğin soru tipini seç:</div>
      <div class="exam-type-section">
        <div class="exam-type-section-title">📋 Soru Formatları</div>
        <div class="exam-type-grid">
          <button class="exam-type-btn" data-prompt="Çoktan seçmeli (A-B-C-D) test soruları oluştur. Her sorunun 4 şıkkı ve doğru cevabı olsun."><span class="etb-icon">🔘</span><span class="etb-text">Çoktan Seçmeli</span></button>
          <button class="exam-type-btn" data-prompt="Boşluk doldurmalı sorular üret. Cümlelerde önemli kavramları boşluk bırak, öğrenci doğru kelimeyi yazsın."><span class="etb-icon">📝</span><span class="etb-text">Boşluk Doldurma</span></button>
          <button class="exam-type-btn" data-prompt="Doğru-Yanlış soruları hazırla. Her ifadenin doğru mu yanlış mı olduğunu belirt ve açıklamasını yap."><span class="etb-icon">✅</span><span class="etb-text">Doğru / Yanlış</span></button>
          <button class="exam-type-btn" data-prompt="Açık uçlu sorular sor. Öğrencinin kendi cümleleriyle cevaplayacağı, düşündüren ve yorumlama gerektiren sorular hazırla."><span class="etb-icon">💭</span><span class="etb-text">Açık Uçlu</span></button>
          <button class="exam-type-btn" data-prompt="Eşleştirme soruları üret. Bir sütunda kavramlar, diğer sütunda tanımlar olsun, öğrenci eşleştirsin."><span class="etb-icon">🔗</span><span class="etb-text">Eşleştirme</span></button>
          <button class="exam-type-btn" data-prompt="Kısa cevaplı sorular hazırla. Öğrencinin 1-2 kelime veya kısa bir cümle ile cevaplayacağı sorular olsun."><span class="etb-icon">✏️</span><span class="etb-text">Kısa Cevaplı</span></button>
          <button class="exam-type-btn" data-prompt="Klasik (yazılı sınav) soruları oluştur. Paragraf cevap gerektiren, bilgi seviyesini ölçen detaylı sorular hazırla."><span class="etb-icon">📄</span><span class="etb-text">Klasik Soru</span></button>
        </div>
      </div>
      <div class="exam-type-section">
        <div class="exam-type-section-title">🎯 Sınava Hazırlık</div>
        <div class="exam-type-grid">
          <button class="exam-type-btn prep" data-prompt="Türkiye Yüzyılı Maarif Modeli müfredatına uygun, kazanım odaklı sorular hazırla. Üst düzey düşünme becerileri ölçen sorular olsun."><span class="etb-icon">🏫</span><span class="etb-text">Maarif Modeli</span></button>
          <button class="exam-type-btn prep" data-prompt="LGS tarzı sorular oluştur. Paragraf tabanlı, muhakeme ve yorum gerektiren, çoktan seçmeli 4 şıklı sorular hazırla."><span class="etb-icon">🎓</span><span class="etb-text">LGS Hazırlık</span></button>
          <button class="exam-type-btn prep" data-prompt="YKS/ÖSS tarzı üniversite sınavı soruları oluştur. Analitik düşünme ve problem çözme ölçen sorular hazırla."><span class="etb-icon">🏆</span><span class="etb-text">YKS/ÖSS Hazırlık</span></button>
        </div>
      </div>
      <div class="exam-type-section">
        <div class="exam-type-section-title">⏱️ Hızlı ve Sınırlı</div>
        <div class="exam-type-grid">
          <button class="exam-type-btn" style="border-color:#eab308; background:rgba(234,179,8,0.1);" data-prompt="/speedquiz" id="btnSpeedQuiz"><span class="etb-icon">⚡</span><span class="etb-text">Hız Modu (60s)</span></button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#btnCloseExamType').addEventListener('click', () => { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; setTimeout(() => overlay.style.display = 'none', 300); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; setTimeout(() => overlay.style.display = 'none', 300); } });
  overlay.querySelectorAll('.exam-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let prompt = btn.getAttribute('data-prompt');
      overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none';
      setTimeout(() => overlay.style.display = 'none', 300);
      
      if(prompt === '/speedquiz') {
         // HIZ MODU BAŞLAT
         if (typeof window.startSpeedMode === 'function') {
            window.startSpeedMode();
         } else {
            if (typeof window._handleSendMessage === 'function') { window._handleSendMessage("Bana arka arkaya hızlı cevaplayabileceğim çoktan seçmeli karışık sorular sor. Hız modu başladı!"); }
         }
      } else {
         if (typeof window._handleSendMessage === 'function') { window._handleSendMessage(prompt); }
      }
    });
  });
  requestAnimationFrame(() => { overlay.style.display = 'flex'; requestAnimationFrame(() => { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto'; }); });
};

// ═══════════════════════════════════════════
// V17 SİSTEM MİMARİSİ (AŞAMALI ONBOARDING)
// ═══════════════════════════════════════════
function initV17SystemWizard() {
  const overlay = document.getElementById('onboardingOverlay');
  if (!overlay) return;
  if (!overlay.classList.contains('hidden')) { document.body.classList.add('ui-locked'); }

  const s1 = document.getElementById('onbStep1');
  const s2 = document.getElementById('onbStep2');
  const s3 = document.getElementById('onbStep3');
  const s4 = document.getElementById('onbStep4');
  const s5 = document.getElementById('onbStep5');
  const btn1 = document.getElementById('btnOnb1');
  const btn2 = document.getElementById('btnOnb2');
  const btn3 = document.getElementById('btnOnb3');
  const btn4 = document.getElementById('btnOnb4');
  const btnFinal = document.getElementById('btnOnbFinal');
  const gradeSel = document.getElementById('onbGrade');
  const goalSel = document.getElementById('onbGoal');
  const weakSubjSel = document.getElementById('onbWeakSubject');
  const chosenSubjText = document.getElementById('onbChosenSubjectHighlight');

  const history = getQuizHistory();
  let latestFailedSubject = null;
  let latestFailedGrade = null;
  for (let i = 0; i < history.length; i++) {
     if (history[i].wrong > 0 && history[i].subject) {
        latestFailedSubject = history[i].subject;
        latestFailedGrade = history[i].grade;
        break;
     }
  }

  const memOverlay = document.getElementById('memorySystemOverlay');
  
  // Eğer bu oturumda zaten gösterildiyse bir daha gösterme (Ana sayfa logosuna tıklandığında sürekli çıkmasını engeller)
  const isMemOverlayShownBefore = sessionStorage.getItem('memOverlayShown');

  if (latestFailedSubject && memOverlay && !isMemOverlayShownBefore) {
     sessionStorage.setItem('memOverlayShown', 'true');
     s1.classList.add('hidden');
     memOverlay.classList.remove('hidden');
     const uName = localStorage.getItem('mega_name') || "Şampiyon";
     const memNameSpan = document.getElementById('memUserName');
     const memSubjSpan = document.getElementById('memSubjectName');
     if (memNameSpan) memNameSpan.textContent = uName;
     if (memSubjSpan) memSubjSpan.textContent = latestFailedSubject;

     // Evet, Eksiğimi Kapat
     document.getElementById('btnMemYes')?.addEventListener('click', () => {
         memOverlay.classList.add('hidden');
         document.body.classList.remove('ui-locked');
         const gradeStr = (latestFailedGrade === 'lise' || latestFailedGrade === 'genel') ? "Lise" : `${latestFailedGrade}. Sınıf`;
         
         // Zayıf konu hafızasından quiz gönderilirken sistemi o derse odakla (Hata vermemesi için)
         if(typeof studySelections !== 'undefined') {
            studySelections.grade = latestFailedGrade;
            studySelections.subject = latestFailedSubject;
            studySelections.topic = 'Eksik Telafisi';
         }

         const input = document.getElementById('userInput');
         input.value = `Selam! Dünkü denememde ${gradeStr} ${latestFailedSubject} dersinde bazı eksiklerim olduğunu fark ettim. Lütfen bana DOĞRUDAN TEST YAPMA. Önce bana bu konudaki eksiklerimi kapatacak önemli püf noktalarını, taktikleri ve konu özetini anlat. Anlatımını mutlaka geçmiş yıllarda çıkmış LGS veya YKS (ÖSS) benzeri çıkmış örnek sorular ve bunların tek tek çözümü ile destekle ki hafızama kazınsın.`;
         document.getElementById('btnSendMessage').click();
     });

     // Hayır, Yeni Konu Seç
     document.getElementById('btnMemNo')?.addEventListener('click', () => {
         memOverlay.classList.add('hidden');
         s1.classList.remove('hidden');
     });
  }

  // Adım 1 -> 2
  btn1.addEventListener('click', () => {
    s1.classList.add('hidden');
    s2.classList.remove('hidden');
  });

  // Adım 2 (Sınıf) -> Enable btn2
  gradeSel.addEventListener('change', () => {
    if (gradeSel.value) btn2.disabled = false;
  });

  // Adım 2 -> 3
  btn2.addEventListener('click', () => {
    s2.classList.add('hidden');
    s3.classList.remove('hidden');
    
    // Sınıf seçimine göre Zayıf Ders dropdownunu doldur (Adım 4 için hazırlık)
    const g = gradeSel.value;
    weakSubjSel.innerHTML = '<option value="" disabled selected>Zorlandığın Dersi Seç</option>';
    let subjects = [];
    if(g && curriculumData[g]) {
       subjects = Object.keys(curriculumData[g]);
    } else if (g === 'lise' || g === 'genel') {
       subjects = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Edebiyat", "Tarih", "Coğrafya"];
    } else {
       subjects = ["Matematik", "Fen Bilimleri", "Türkçe"]; // Fallback
    }
    
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      weakSubjSel.appendChild(opt);
    });
  });

  // Adım 3 (Hedef) -> Enable btn3
  goalSel.addEventListener('change', () => {
    if (goalSel.value) btn3.disabled = false;
  });

  // Adım 3 -> 4
  btn3.addEventListener('click', () => {
    s3.classList.add('hidden');
    s4.classList.remove('hidden');
  });

  // Adım 4 (Ders) -> Enable btn4
  weakSubjSel.addEventListener('change', () => {
    if (weakSubjSel.value) btn4.disabled = false;
  });

  // Adım 4 -> 5 (Sistemi Kur)
  btn4.addEventListener('click', () => {
    s4.classList.add('hidden');
    s5.classList.remove('hidden');
    
    const g = gradeSel.value;
    const gradeStr = (g === 'lise' || g === 'genel') ? "Lise" : `${g}. Sınıf`;
    const target = goalSel.options[goalSel.selectedIndex].text;
    const weakS = weakSubjSel.value;
    
    chosenSubjText.textContent = `${gradeStr} ${weakS} (${target})`;

    // Global state kaydedici (Merkezi AI belleğine işlendi)
    studySelections.grade = g;
    studySelections.subject = weakS;
    studySelections.topic = 'Genel';
    studySelections.goal = target;
    window.studySelections = studySelections; // Her ihtimale karşı global yansıma
  });

  // Adım 5 -> Analizi Başlat
  btnFinal.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.classList.remove('ui-locked');
    const g = studySelections.grade;
    const s = studySelections.subject;
    const target = studySelections.goal;
    const gradeStr = (g === 'lise' || g === 'genel') ? "Lise" : `${g}. Sınıf`;

    const input = document.getElementById('userInput');
    input.value = `Merhaba! Ben ${gradeStr} öğrencisiyim. Hedefim: ${target}. Lütfen bana ${s} dersinin müfredatındaki ana konuları listele ve ardından beklemeden VAKİT KAYBETMEDEN İLK konuyu (çok uzun olmayacak şekilde, sıkmadan) anlatmaya başla. Anlatımdan sonra ben 'devam et' dersem bir sonraki konuya geçersin. İstersem daha sonra sana 'test yap' diyebilirim ama şu an test İSTEMİYORUM, lütfen bana konuyu öğret.`;
    document.getElementById('btnSendMessage').click();
  });
}

// ═══════════════════════════════════════════
// UYGULAMA BAŞLATICI (BOOTSTRAPPER)
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  // 1. IndexedDB Başlat Bağlantı Kurulumu
  try {
     await initDB();
     console.log("IndexedDB Başarıyla Başlatıldı.");

   } catch(e) {
     console.error("DB Başlatma hatası", e);
  }

  initDailyMissions();
  initUI();
  loadUserData();
  setupEventListeners();
  setupVoiceInput();
  setupThemes();
  
  const savedName = localStorage.getItem('mega_name');
  if (!savedName) {
      document.body.classList.add('ui-locked');
      initOnboarding();
  } else {
      initOnboarding();
  }
  
  initV17SystemWizard();
  
  // Settings PDF/TXT Panel Listener Init
  initStudyPanel(handleSendMessage, appendMessage, formatMessage);
  
  // Sidebar bileşenlerini render et
  renderTicker();
  renderBadges();
  renderDailyQuests();
  renderDailyFact();

  const sidebarLowEnd = document.getElementById('sidebarToggleLowEnd');
  if (sidebarLowEnd) {
     const isLowEnd = localStorage.getItem('mega_low_end') === 'true';
     sidebarLowEnd.checked = isLowEnd;
     if(isLowEnd) document.body.classList.add('lowend');
     
     sidebarLowEnd.addEventListener('change', (e) => {
        if (e.target.checked) {
           document.body.classList.add('lowend');
           localStorage.setItem('mega_low_end', 'true');
        } else {
           document.body.classList.remove('lowend');
           localStorage.setItem('mega_low_end', 'false');
        }
     });
  }

  // Yönlendirici (Welcome) Dashboard Ekleme 
  setTimeout(() => {
     const chatbox = document.getElementById('chatbox');
     const savedNm = localStorage.getItem('mega_name');
     // Chatbox boşsa veya sadece gizli typing-indicator varsa dashboard'u göster!
     const messageElements = chatbox ? chatbox.querySelectorAll('.msg-bot, .msg-user') : [];
     if (savedNm && chatbox && messageElements.length === 0) {
        const userName = savedNm || 'Öğrenci';
        const dHtml = `
          <div class="welcome-dash-v2">
            <!-- Renkli Başlık -->
            <h2 class="dash-hero-title">
              <span class="dh-b">B</span><span class="dh-u">u</span><span class="dh-g">g</span><span class="dh-u2">ü</span><span class="dh-n">n</span>
              <span class="dh-space"> </span>
              <span class="dh-n2">n</span><span class="dh-e">e</span>
              <span class="dh-space"> </span>
              <span class="dh-o">ö</span><span class="dh-g2">ğ</span><span class="dh-r">r</span><span class="dh-e2">e</span><span class="dh-n3">n</span><span class="dh-e3">e</span><span class="dh-c">c</span><span class="dh-e4">e</span><span class="dh-k">k</span><span class="dh-s">s</span><span class="dh-i">i</span><span class="dh-n4">n</span><span class="dh-soru">?</span>
            </h2>
            
            <!-- Arama Çubuğu -->
            <div class="dash-search-wrapper">
              <div class="dash-search-box">
                <span class="dash-search-icon">🔍</span>
                <input type="text" id="dashSearchInput" class="dash-search-input" placeholder="Örn: Kesirler 5. sınıf, Osmanlı Tarihi, İngilizce zamanlar..." autocomplete="off">
                <button class="dash-search-btn" id="dashSearchBtn" title="Ara">➤</button>
              </div>
            </div>
            
            <!-- Filtre Chip'leri -->
            <div class="dash-filter-row">
              <button class="dash-filter-chip" onclick="document.getElementById('btnOpenStudyWizard')?.click()">📚 Konu Çalış</button>
              <button class="dash-filter-chip" onclick="document.getElementById('btnOpenQuizWizard')?.click()">🎯 Test Oluştur</button>
              <button class="dash-filter-chip" onclick="document.getElementById('btnOpenVoiceExam')?.click()">🎤 Sözlü Sınav</button>
              <button class="dash-filter-chip" onclick="document.querySelector('.chip[data-qcmd=\\'/normal\\']')?.click()">💬 Sohbet</button>
            </div>

            <!-- Kompakt Alt Butonlar -->
            <div class="dash-mini-grid">
               <button class="dash-mini-btn" onclick="document.getElementById('btnOpenStudyWizard')?.click()">
                 <span class="dmb-icon">📚</span>
                 <span class="dmb-text">Konu Çalış</span>
               </button>
               <button class="dash-mini-btn" onclick="document.getElementById('btnOpenQuizWizard')?.click()">
                 <span class="dmb-icon">🎯</span>
                 <span class="dmb-text">Test Sihirbazı</span>
               </button>
               <button class="dash-mini-btn" onclick="document.getElementById('btnOpenVoiceExam')?.click()">
                 <span class="dmb-icon">🎤</span>
                 <span class="dmb-text">Sözlü Sınav</span>
               </button>
               <button class="dash-mini-btn" onclick="document.querySelector('.chip[data-qcmd=\\'/normal\\']')?.click()">
                 <span class="dmb-icon">💬</span>
                 <span class="dmb-text">Sohbet Başlat</span>
               </button>
            </div>
          </div>
        `;
        appendMessage('bot', dHtml);

        // Arama çubuğu event listener
        setTimeout(() => {
          const searchInput = document.getElementById('dashSearchInput');
          const searchBtn = document.getElementById('dashSearchBtn');
          if (searchInput && searchBtn) {
            const doSearch = () => {
              const q = searchInput.value.trim();
              if (!q) return;
              // Dashboard'u kaldır
              const dashEl = document.querySelector('.welcome-dash-v2');
              if (dashEl) dashEl.closest('.chat-message')?.remove();
              // Ders modunda arama yap
              handleSendMessage(q + ' konusunu detaylıca ders anlat');
            };
            searchBtn.addEventListener('click', doSearch);
            searchInput.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') doSearch();
            });
            searchInput.focus();
          }
        }, 100);
     }
  }, 400);
  
  // Desktop Sidebar Toggle Logic (Unified — uses closeMobileSidebar from above)
  const btnMenu = document.getElementById('btnMobileMenu');
  const sidebarEl = document.querySelector('.sidebar');
  if(sidebarEl && btnMenu) {
     // Desktop: sadece sidebar-collapsed class toggle
     // Mobile: openMobileSidebar/closeMobileSidebar zaten yukarıda bağlı
     // Bu handler sadece desktop için çalışır
     btnMenu.addEventListener('click', (e) => {
        if (window.innerWidth > 768) {
             document.body.classList.toggle('sidebar-collapsed');
        }
        // Mobile handling is already done by the unified handler above
     });
     
     // Add a close chevron directly inside the sidebar header for Desktop users
     const sbHeader = sidebarEl.querySelector('h2');
     if(sbHeader && !document.getElementById('btnCollapseSidebar')) {
         const closeBtn = document.createElement('button');
         closeBtn.id = 'btnCollapseSidebar';
         closeBtn.innerHTML = '◀';
         closeBtn.style.cssText = 'float:right; background:none; border:none; color:var(--sub); cursor:pointer; font-size:1rem; outline:none;';
         closeBtn.title = 'Paneli Gizle';
         sbHeader.appendChild(closeBtn);
         
         closeBtn.addEventListener('click', () => {
             document.body.classList.add('sidebar-collapsed');
             btnMenu.style.display = 'block'; 
         });
     }
  }

  // ═══════════════════════════════════════════
  // CİHAZ MODU SEÇİCİ (Telefon / Uygulama / Web)
  // ═══════════════════════════════════════════
  const deviceSelector = document.getElementById('deviceModeSelector');
  if (deviceSelector) {
    // Kayıtlı seçimi yükle
    const savedDevice = localStorage.getItem('ata_device_mode') || 'web';
    applyDeviceMode(savedDevice);

    deviceSelector.querySelectorAll('.device-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-device');
        applyDeviceMode(mode);
        localStorage.setItem('ata_device_mode', mode);
      });
    });
  }

  function applyDeviceMode(mode) {
    // Body class'larını temizle
    document.body.classList.remove('device-phone', 'device-app', 'device-web');
    if (mode === 'phone') document.body.classList.add('device-phone');
    else if (mode === 'app') document.body.classList.add('device-app');
    // web = varsayılan, ek class gerekmez

    // Buton active durumlarını güncelle
    const selector = document.getElementById('deviceModeSelector');
    if (selector) {
      selector.querySelectorAll('.device-mode-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-device') === mode);
      });
    }
  }

  // VAY BE REÇETESİ ENTEGRASYONLARI
  setupVayBeFeatures();
  
  // Güncel Yenilikler Popup'ı (Sadece bir kez gösterilir ve 3.5 sn sonra kapanır)
  const updateChangelogOverlay = document.getElementById('updateChangelogOverlay');
  if (updateChangelogOverlay && !localStorage.getItem('changelog_v18_seen')) {
    updateChangelogOverlay.style.display = 'flex';
    localStorage.setItem('changelog_v18_seen', 'true');
    window.updateChangelogTimer = setTimeout(() => {
      updateChangelogOverlay.style.display = 'none';
    }, 3500);
  }
  
  // --- LOGO HOME BUTTON (Ana Sayfaya Dön) ---
  const btnLogoHome = document.getElementById('btnLogoHome');
  if (btnLogoHome) {
     btnLogoHome.addEventListener('click', () => {
        // Overlay'leri kapat
        document.querySelectorAll('.game-overlay, .onboard-overlay, .modal-overlay, .cmd-overlay').forEach(el => {
           el.style.display = 'none';
        });
        
        // Sınav / Ders modlarını sıfırla
        window.activeQuizSession = false;
        window.activeOralSession = false;
        window._activeCharacter = null;
        
        // Mode Selector Normal moda ayarla
        const modeContainer = document.getElementById('modeSelector');
        if (modeContainer) {
           modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
           const normalBtn = modeContainer.querySelector('.mode-btn'); // first one is normal
           if (normalBtn) normalBtn.classList.add('active');
        }
        
        // Üst panel başlığını düzelt 
        const botName = document.getElementById('botName');
        if (botName) botName.textContent = '🏫 Ata Sohbet — Normal';
        
        // Mobildeyse sidebar kapansın
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar && sidebar.classList.contains('active')) {
           sidebar.classList.remove('active');
           if (backdrop) backdrop.classList.remove('active');
        }

        // location reload çalışmıyorsa URL'ye yönlendir
        window.location.href = window.location.pathname;
     });
  }
  
  // Başlangıç mesajı iptal edildi (Seçim Duvarı otomatik olarak tetikliyor)
});

// VAY BE REÇETESİ ÖZELLİK KURULUMU
function setupVayBeFeatures() {
  // 1. PWA Installation Prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const pwaContainer = document.getElementById('pwaInstallContainer');
    if (pwaContainer && !localStorage.getItem('pwa_dismissed')) {
      pwaContainer.style.display = 'flex';
    }
  });
  
  document.getElementById('btnInstallPwa')?.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        document.getElementById('pwaInstallContainer').style.display = 'none';
      }
      deferredPrompt = null;
    }
  });

  document.getElementById('btnDismissPwa')?.addEventListener('click', () => {
    document.getElementById('pwaInstallContainer').style.display = 'none';
    localStorage.setItem('pwa_dismissed', 'true');
  });

  // 2. Dinamik Karşılama Saati
  const lblTimeGreeting = document.getElementById('lblDynamicTimeGreeting');
  if (lblTimeGreeting) {
    const hour = new Date().getHours();
    let greeting = 'İyi geceler, ';
    if (hour >= 6 && hour < 12) greeting = 'Günaydın, ';
    else if (hour >= 12 && hour < 18) greeting = 'İyi günler, ';
    else if (hour >= 18 && hour < 22) greeting = 'İyi akşamlar, ';
    lblTimeGreeting.innerHTML = `<span style="color:var(--acc); font-weight:800; margin-right:4px;">${greeting}</span>`;
  }

  // 3. Tema Değiştirici (Ay / Güneş)
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
       const body = document.body;
       const currentTheme = body.getAttribute('data-theme') || 'default';
       if (currentTheme !== 'light') {
           body.setAttribute('data-theme', 'light');
           document.documentElement.style.setProperty('--bg', '#f8fafc');
           document.documentElement.style.setProperty('--bg2', '#ffffff');
           document.documentElement.style.setProperty('--txt', '#0f172a');
           document.documentElement.style.setProperty('--bdr', '#cbd5e1');
           document.documentElement.style.setProperty('--sub', '#475569');
           btnThemeToggle.textContent = '☀️';
       } else {
           body.setAttribute('data-theme', 'default');
           document.documentElement.style.setProperty('--bg', '#020617');
           document.documentElement.style.setProperty('--bg2', '#0f172a');
           document.documentElement.style.setProperty('--txt', '#f8fafc');
           document.documentElement.style.setProperty('--bdr', '#1e293b');
           document.documentElement.style.setProperty('--sub', '#94a3b8');
           btnThemeToggle.textContent = '🌙';
       }
    });
  }

  // 4. Feedback Balonu
  const btnFeedback = document.getElementById('btnFeedbackBubble');
  if (btnFeedback) {
     btnFeedback.addEventListener('click', () => {
        const userInput = document.getElementById('userInput');
        if (userInput) {
           userInput.value = "Sisteme şu özelliği eklerseniz çok iyi olur: ";
           userInput.focus();
           
           const chatbox = document.getElementById('chatbox');
           document.getElementById('quickShortcuts').style.display = 'none';
        }
     });
  }

  // 5. Akıllı Arama & Mesaj Kısayolları Yok Etme
  const btnSend = document.getElementById('btnSendMessage');
  if (btnSend) {
     btnSend.addEventListener('click', () => {
         const qs = document.getElementById('quickShortcuts');
         if (qs) qs.style.display = 'none';
     });
  }
}



// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('ServiceWorker başarılı: ', reg.scope);
    }).catch(err => {
      console.log('ServiceWorker hata: ', err);
    });
  });
}
