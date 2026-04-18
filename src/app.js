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
// UygulamanÃ„Â±n ana orkestrasyon modÃƒÂ¼lÃƒÂ¼ Ã¢â‚¬â€ TÃƒÅ“M Ãƒâ€“ZELLÃ„Â°KLER Ãƒâ€¡ALIÃ…ÂIR

import { state, setIsLoading, addMessage, loadUserData, saveUserData, addXP, subscribe } from './state.js';
import { askAI, generateImage } from './api.js';
import { initUI, appendMessage, streamMessage, toggleTypingIndicator, showError, updateBotStatus } from './ui.js';
import { curriculumData } from './curriculum.js';
import { openStudyWizard, studySelections } from './features/wizard.js';
import { DuelArena } from './features/duelArena.js';
import { SkillTree } from './features/skillTree.js';
import { CharacterProfile } from './features/characterProfile.js';
import { QuestsBoard } from './features/quests.js';
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

// TTS API'sini BaÃ…Å¸lat
initTTS();

// Mod seÃƒÂ§ici iÃƒÂ§in proxy
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

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// TICKER BAR Ã¢â‚¬â€ CanlÃ„Â± bilgi ÃƒÂ§ubuÃ„Å¸u
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function renderTicker() {
  const ticker = document.getElementById('tickerInner');
  if (!ticker) return;
  const facts = [
    "🚀 YENİ GÜNCELLEME: Ata Quest RPG Sistemi Aktif! Soruları bil, XP kazan, seviye atla ve yeni yeteneklerin kilidini aç!",
    "ÄŸÅ¸â€™Â¡ Biliyor muydun? DÃƒÂ¼nya'nÃ„Â±n ÃƒÂ§ekirdeÃ„Å¸i GÃƒÂ¼neÃ…Å¸'in yÃƒÂ¼zeyi kadar sÃ„Â±caktÃ„Â±r!",
    "ÄŸÅ¸â€œÅ¡ Okuma ipucu: GÃƒÂ¼nde 20 dakika okumak yÃ„Â±lda 1.8 milyon kelime demektir!",
    "ÄŸÅ¸Â§Â  Beyin egzersizi: Yeni bir dil ÃƒÂ¶Ã„Å¸renmek beyni gÃƒÂ¼ÃƒÂ§lendirir!",
    "ÄŸÅ¸Å’Â DÃƒÂ¼nya'nÃ„Â±n %71'i su ile kaplÃ„Â±dÃ„Â±r!",
    "ÄŸÅ¸Å¡â‚¬ IÃ…Å¸Ã„Â±k, GÃƒÂ¼neÃ…Å¸'ten DÃƒÂ¼nya'ya 8 dakikada ulaÃ…Å¸Ã„Â±r!",
    "ÄŸÅ¸ÂÂ® Oyun oynamak problem ÃƒÂ§ÃƒÂ¶zme becerisini geliÃ…Å¸tirir!",
    "Ã¢Â­Â Samanyolu galaksisinde 100-400 milyar yÃ„Â±ldÃ„Â±z vardÃ„Â±r!",
    "ÄŸÅ¸â€Â¬ Ã„Â°nsan DNA'sÃ„Â± GÃƒÂ¼neÃ…Å¸ Sistemi'ne 600 kez gidip gelecek kadar uzundur!",
  ];
  ticker.innerHTML = facts.map(f => `<span class="ticker-item">${f}</span>`).join('');
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// ROZETLER Ã¢â‚¬â€ badgeGrid doldurma
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function renderBadges() {
  const grid = document.getElementById('badgeGrid');
  if (!grid) return;
  const streak = state.streak || 0;
  const badges = [
    { icon: 'ÄŸÅ¸Å’Å¸', name: 'Mega Beyin', earned: state.xp > 0 },
    { icon: 'ÄŸÅ¸â€™Â¬', name: 'Sohbet UstasÃ„Â±', earned: state.messages.length >= 5 },
    { icon: 'ÄŸÅ¸â€Â¥', name: '3 GÃƒÂ¼nlÃƒÂ¼k Seri', earned: streak >= 3 },
    { icon: 'ÄŸÅ¸â€Â¥', name: '7 GÃƒÂ¼nlÃƒÂ¼k Seri', earned: streak >= 7 },
    { icon: 'ÄŸÅ¸Ââ€ ', name: 'Quiz Ã…Âampiyonu', earned: (StorageManager.get(StorageManager.keys.QUIZ_HISTORY, []).length > 0) },
    { icon: 'ÄŸÅ¸Ââ€“Ã¯Â¸Â', name: 'Efsanevi', earned: state.level >= 5 },
  ];
  
  // ÃƒÅ“st menÃƒÂ¼de eÃ„Å¸er seviye gÃƒÂ¶steriliyorsa Streak'i de ekleyebiliriz
  const statusEl = document.getElementById('botStatus');
  if (statusEl && streak > 0 && !statusEl.textContent.includes('ÄŸÅ¸â€Â¥')) {
      const existing = statusEl.innerHTML;
      if (!existing.includes('ÄŸÅ¸â€Â¥')) {
          statusEl.innerHTML = `${existing} &nbsp; <span style="background:linear-gradient(to right, #f97316, #ef4444);color:#fff;padding:2px 6px;border-radius:10px;font-size:0.8rem;font-weight:bold;">ÄŸÅ¸â€Â¥ x${streak}</span>`;
      }
  }

  grid.innerHTML = badges.map(b => `
    <div class="badge-item ${b.earned ? 'earned' : 'locked'}" title="${b.name}">
      <span class="badge-icon">${b.earned ? b.icon : 'ÄŸÅ¸â€â€™'}</span>
      <span class="badge-name">${b.name}</span>
    </div>
  `).join('');
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// GÃƒÅ“NLÃƒÅ“K GÃƒâ€“REVLER Ã¢â‚¬â€ questCard doldurma
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
import { StorageManager } from './state.js';

// Eski dailyQuests silindi, dailyMissions.js renderDailyQuests yÃƒÂ¼klendi
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// GÃƒÅ“NLÃƒÅ“K BÃ„Â°LGÃ„Â° Ã¢â‚¬â€ dailyFact doldurma
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function renderDailyFact() {
  const el = document.getElementById('dailyFact');
  if (!el) return;
  const facts = [
    "🚀 YENİ GÜNCELLEME: Ata Quest RPG Sistemi Aktif! Soruları bil, XP kazan, seviye atla ve yeni yeteneklerin kilidini aç!",
    "ÄŸÅ¸Å’Â DÃƒÂ¼nya'daki tÃƒÂ¼m okyanuslar tek bir sÃƒÂ¼per okyanustan (Panthalassa) oluÃ…Å¸muÃ…Å¸tur!",
    "ÄŸÅ¸Â§Â® SÃ„Â±fÃ„Â±r (0) sayÃ„Â±sÃ„Â± ilk kez Hintliler tarafÃ„Â±ndan kullanÃ„Â±lmÃ„Â±Ã…Å¸tÃ„Â±r!",
    "ÄŸÅ¸Ââ„¢ AhtapotlarÃ„Â±n 3 kalbi ve mavi kanÃ„Â± vardÃ„Â±r!",
    "ÄŸÅ¸Å’â„¢ Ay, DÃƒÂ¼nya'dan her yÃ„Â±l 3.8 cm uzaklaÃ…Å¸Ã„Â±yor!",
    "ÄŸÅ¸ÂÂ Bal arÃ„Â±larÃ„Â± 1 kg bal ÃƒÂ¼retmek iÃƒÂ§in 4 milyon ÃƒÂ§iÃƒÂ§eÃ„Å¸i ziyaret eder!",
    "ÄŸÅ¸â€œâ€“ DÃƒÂ¼nya'nÃ„Â±n en eski ÃƒÂ¼niversitesi Bologna ÃƒÅ“niversitesi'dir (1088)!",
    "ÄŸÅ¸Â¦â€¢ Dinozorlar 165 milyon yÃ„Â±l boyunca DÃƒÂ¼nya'da yaÃ…Å¸adÃ„Â±!",
  ];
  const dayIdx = new Date().getDate() % facts.length;
  el.innerHTML = `<div class="daily-fact-text">ÄŸÅ¸â€™Â¡ <b>GÃƒÂ¼nÃƒÂ¼n Bilgisi:</b> ${facts[dayIdx]}</div>`;
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// AVATAR PICKER Ã¢â‚¬â€ Onboarding'deki avatar seÃƒÂ§ici
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function renderAvatarPicker() {
  const picker = document.getElementById('avatarPicker');
  if (!picker) return;
  const avatars = ['ÄŸÅ¸â€˜Â¦','ÄŸÅ¸â€˜Â§','ÄŸÅ¸Â§â€˜','ÄŸÅ¸â€˜Â¨Ã¢â‚¬ÂÄŸÅ¸Ââ€œ','ÄŸÅ¸â€˜Â©Ã¢â‚¬ÂÄŸÅ¸Ââ€œ','ÄŸÅ¸Â§â€™','ÄŸÅ¸Â§â€˜Ã¢â‚¬ÂÄŸÅ¸â€™Â»','ÄŸÅ¸â€˜Â©Ã¢â‚¬ÂÄŸÅ¸â€™Â»','ÄŸÅ¸Â¦Â¸','ÄŸÅ¸Â¦Â¸Ã¢â‚¬ÂÃ¢â„¢â‚¬Ã¯Â¸Â','ÄŸÅ¸Â§â„¢','ÄŸÅ¸Â§â„¢Ã¢â‚¬ÂÃ¢â„¢â‚¬Ã¯Â¸Â'];
  const hiddenInput = document.getElementById('selectedAvatar');

  picker.innerHTML = avatars.map(a => `
    <button class="avatar-option ${a === 'ÄŸÅ¸â€˜Â¦' ? 'selected' : ''}" data-avatar="${a}">${a}</button>
  `).join('');

  picker.querySelectorAll('.avatar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (hiddenInput) hiddenInput.value = btn.getAttribute('data-avatar');
    });
  });
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// MESAJ GÃƒâ€“NDERÃ„Â°MÃ„Â°
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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
  
  if (lw === '/kullanicilar' || lw === 'kullanÃ„Â±cÃ„Â±lar' || lw === 'kullanicilar') {
      const historyStr = localStorage.getItem('mega_user_history') || '[]';
      let historyArr = [];
      try { historyArr = JSON.parse(historyStr); } catch(e){}
      let text = "ÄŸÅ¸â€˜Â¥ **Giren KullanÃ„Â±cÃ„Â±larÃ„Â±n Listesi:**\n";
      if(historyArr.length === 0){
         text += "HenÃƒÂ¼z kaydedilmiÃ…Å¸ kullanÃ„Â±cÃ„Â± yok.";
      } else {
         historyArr.forEach((u, i) => { text += `${i+1}. ${u.name} (Tarih: ${u.date})\n`; });
      }
      addMessage('bot', 'KullanÃ„Â±cÃ„Â± listesi istendi.');
      appendMessage('bot', formatMessage('bot', text));
      return;
  }
  
  // 1. KullanÃ„Â±cÃ„Â± mesajÃ„Â±nÃ„Â± ekle
  lastSentMessage = msg;
  addMessage('user', msg);
  appendMessage('user', formatMessage('user', msg));
  if(window.updateMissionProgress) window.updateMissionProgress('msg', 1);
  
  // Input temizle
  const inputEl = document.getElementById('userInput');
  if (inputEl) inputEl.value = '';

  // Ã„Â°statistik gÃƒÂ¼ncelle
  updateStats();

  // ==== SÃƒÅ“PER Ãƒâ€“NEMLÃ„Â°: AKILLI INPUT ALGILAMA (PRE-AI INTERCEPTOR) ====
  const autoCmd = msg.trim().toLowerCase();
  if (/^\d+\s+\w+/.test(autoCmd) || /^(ÃƒÂ§iz|oluÃ…Å¸tur)\s+\d+\s+\w+/.test(autoCmd)) {
     // Ãƒâ€“rn: "3 elma" veya "ÃƒÂ§iz 5 kedi" - doÃ„Å¸rudan gÃƒÂ¶rsel rutine saralÃ„Â±m
     // AI'ye gitmeden de yapabiliriz ama AI Master Prompt bunu mÃƒÂ¼kemmel ayÃ„Â±klÃ„Â±yor.
  }

  // Quiz cevap anahtarÃ„Â± kontrolÃƒÂ¼
  if (['a','b','c','d', 'a)','b)','c)','d)'].includes(autoCmd)) {
    if (window.activeQuizSession) {
      // Frontend answer checker'Ã„Â± ÃƒÂ§alÃ„Â±Ã…Å¸tÃ„Â±rabiliriz ama mevcut mimaride handleQuizAnswer global deÃ„Å¸il.
      // Ã…Âimdilik AI'ye yÃƒÂ¶nlendirsek bile Master Prompt quiz_answer dÃƒÂ¶necek.
    }
  }

  // ==== COMMAND INTERCEPTOR (YAN MENÃƒÅ“ KOMUTLARI & Ãƒâ€“ZEL Ã„Â°Ã…ÂLEMLER) ====
  
    // ==== 0. SUBJECT WIZARD INTERCEPTOR ====
  const eduSubjects = ['matematik', 'tÃƒÂ¼rkÃƒÂ§e', 'turkce', 'fen bilimleri', 'fen', 'sosyal bilgiler', 'sosyal', 'ingilizce', 'din kÃƒÂ¼ltÃƒÂ¼rÃƒÂ¼', 'din', 'gÃƒÂ¶rsel sanatlar', 'biliÃ…Å¸im', 'mÃƒÂ¼zik', 'beden'];
  if (eduSubjects.some(sub => lw === sub || lw === sub + ' ÃƒÂ§alÃ„Â±Ã…Å¸mak istiyorum' || lw === sub + ' testi' || lw === sub + ' quiz')) {
     if (typeof openStudyWizard === 'function') {
        openStudyWizard();
        if(window.updateMissionProgress) window.updateMissionProgress('lesson', 1);
        addMessage('bot', 'Dersi ' + msg + ' olarak seÃƒÂ§tin.');
        appendMessage('bot', formatMessage('bot', '<b>Harika!</b> Ãƒâ€¡alÃ„Â±Ã…Å¸mak istediÃ„Å¸in dersi anladÃ„Â±m. Ã…Âimdi aÃƒÂ§Ã„Â±lan menÃƒÂ¼den konunu seÃƒÂ§ebilirsin.'));
        return;
     }
  }

  // A. Ãƒâ€¡IKIÃ…Â & SIFIRLAMA (Logout)
  if (['ÃƒÂ§Ã„Â±kÃ„Â±Ã…Å¸', 'ÃƒÂ§Ã„Â±kÃ„Â±Ã…Å¸ yap', '/ÃƒÂ§Ã„Â±kÃ„Â±Ã…Å¸', 'reset', 'sÃ„Â±fÃ„Â±rla', '/sÃ„Â±fÃ„Â±rla'].includes(lw)) {
    localStorage.removeItem('mega_name');
    addMessage('bot', 'Ãƒâ€¡Ã„Â±kÃ„Â±Ã…Å¸ yapÃ„Â±ldÃ„Â±.');
    appendMessage('bot', formatMessage('bot', 'Ã¢Å“â€¦ Kimlik bilgileriniz temizlendi. LÃƒÂ¼tfen sayfayÃ„Â± yenileyerek yeni bir isimle giriÃ…Å¸ yapÃ„Â±n.'));
    setTimeout(() => location.reload(), 2500);
    return;
  }

  // A2. SINAVLARIM KOMUTU
  if (lw === '/sinavlarim' || lw === '/sÃ„Â±navlarÃ„Â±m' || lw === 'sÃ„Â±navlarÃ„Â±m' || lw === 'sinavlarim') {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = 'ÄŸÅ¸â€œâ€¹ SÃ„Â±navlarÃ„Â±m';
    renderExamHistory();
    addMessage('bot', 'SÃ„Â±navlarÃ„Â±m aÃƒÂ§Ã„Â±ldÃ„Â±.');
    appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€œâ€¹ <b>SÃ„Â±navlarÃ„Â±m</b> penceresini aÃƒÂ§tÃ„Â±m! GeÃƒÂ§miÃ…Å¸ quiz sonuÃƒÂ§larÃ„Â±nÃ„Â±zÃ„Â± gÃƒÂ¶rebilirsiniz.'));
    return;
  }

  
  // A3. GÃƒâ€“RSEL SÃƒâ€“ZLÃƒÅ“K
  if (lw === '/sozluk' || lw === '/sÃƒÂ¶zlÃƒÂ¼k' || lw === 'sÃƒÂ¶zlÃƒÂ¼k' || lw === 'gÃƒÂ¶rsel sÃƒÂ¶zlÃƒÂ¼k') {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = 'ÄŸÅ¸Å’Å¸ GÃƒÂ¶rsel SÃƒÂ¶zlÃƒÂ¼k';
    renderVisualDictionaryMenu(document.getElementById('gameBody'));
    addMessage('bot', 'GÃƒÂ¶rsel SÃƒÂ¶zlÃƒÂ¼k aÃƒÂ§Ã„Â±ldÃ„Â±.');
    appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€“Â¼Ã¯Â¸Â <b>GÃƒÂ¶rsel Ã„Â°nteraktif SÃƒÂ¶zlÃƒÂ¼k</b> paneli aÃƒÂ§Ã„Â±ldÃ„Â±! YukarÃ„Â±dan dilediÃ„Å¸iniz konuyu seÃƒÂ§ebilirsiniz.'));
    return;
  }

  // A4. GÃƒâ€“RSEL Ãƒâ€¡Ã„Â°Z
  if (lw === '/ÃƒÂ§iz' || lw === '/ciz' || lw === 'gÃƒÂ¶rsel ÃƒÂ§iz') {
    window._drawMode = true;  // Sonraki mesajÃ„Â± resim isteÃ„Å¸i olarak iÃ…Å¸le
    addMessage('bot', 'GÃƒÂ¶rsel ÃƒÂ§izme modu aktif.');
    appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸ÂÂ¨ <b>GÃƒÂ¶rsel Ãƒâ€¡iz Modu</b> aktif!<br>Ne ÃƒÂ§izmemi istersin? Sadece yaz, ben resim yapayÃ„Â±m!<br><small style="color:var(--sub)">Ãƒâ€“rn: <code>mavi kedi</code> veya <code>gÃƒÂ¼neÃ…Å¸li orman</code></small>'));
    const inputEl = document.getElementById('userInput');
    if (inputEl) { inputEl.value = ''; inputEl.focus(); }
    return;
  }

  // A4b. Ãƒâ€¡Ã„Â°Z MODU AKTÃ„Â°FSE Ã¢â€ â€™ mesajÃ„Â± resim isteÃ„Å¸i'ne dÃƒÂ¶nÃƒÂ¼Ã…Å¸tÃƒÂ¼r
  if (window._drawMode) {
    window._drawMode = false;  // Bir kerelik, sonra normal moda dÃƒÂ¶n
    // KullanÃ„Â±cÃ„Â±nÃ„Â±n yazdÃ„Â±Ã„Å¸Ã„Â±nÃ„Â± resim prompt'una ÃƒÂ§evir
    const drawPrompt = msg + ' resmi ÃƒÂ§iz';
    addMessage('bot', 'Resim hazÃ„Â±rlanÃ„Â±yor...');
    appendMessage('bot', formatMessage('bot', `ÄŸÅ¸ÂÂ¨ <b>"${msg}"</b> iÃƒÂ§in resim oluÃ…Å¸turuluyor... Ã¢ÂÂ³`));
    setIsLoading(true);
    toggleTypingIndicator(true);
    updateBotStatus('ÄŸÅ¸Å¸Â¡ Ãƒâ€¡iziyor...', '#fbbf24');
    try {
      const imgData = await generateImage(msg + ', artistic illustration, colorful, high quality');
      toggleTypingIndicator(false);
      updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
      if (imgData) {
        const imageHtml = `<div style="background:rgba(0,0,0,.45);padding:14px;border-radius:12px;margin-top:8px;">
          <p style="font-weight:700;color:#c084fc;">ÄŸÅ¸â€“Â¼Ã¯Â¸Â "${msg}" Ã¢â‚¬â€ GÃƒÂ¶rsel HazÃ„Â±r!</p>
          <img src="${imgData}" style="width:100%;border-radius:8px;display:block;" alt="${msg}">
        </div>`;
        addMessage('bot', `(GÃƒÂ¶rsel: ${msg})`);
        appendMessage('bot', formatMessage('bot', imageHtml));
      } else {
        appendMessage('bot', formatMessage('bot', 'Ã¢Å¡Â Ã¯Â¸Â GÃƒÂ¶rsel oluÃ…Å¸turulamadÃ„Â±, lÃƒÂ¼tfen tekrar dene.'));
      }
    } catch(e) {
      toggleTypingIndicator(false);
      appendMessage('bot', formatMessage('bot', 'Ã¢Å¡Â Ã¯Â¸Â GÃƒÂ¶rsel oluÃ…Å¸turma hatasÃ„Â±: ' + e.message));
    } finally {
      setIsLoading(false);
      updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
    }
    return;
  }
  // B. OYUN MERKEZÃ„Â° & OYUNLAR (/oyun, oyun modu, vb.)
  const gameKeywords = ['/oyun', '/wordle', '/sudoku', '/hafÃ„Â±za', '/mateyar', '/macera', '/xox'];
  const isGameCommand = gameKeywords.some(k => lw.startsWith(k)) || ['oyun', 'oyun modu', 'oyun oyna', 'oyunlar'].includes(lw);
  if (isGameCommand) {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    renderGameMenu();
    addMessage('bot', 'ÄŸÅ¸ÂÂ® Oyun Merkezi aÃƒÂ§Ã„Â±ldÃ„Â±!');
    appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸ÂÂ® <b>Oyun Merkezi</b> penceresini aÃƒÂ§tÃ„Â±m! YukarÃ„Â±da aÃƒÂ§Ã„Â±lan pencereden dilediÃ„Å¸iniz eÃ„Å¸itsel oyunu oynayabilirsiniz.'));
    return;
  }

  // B2. QUIZ Ã„Â°STEÃ„ÂÃ„Â° (/quiz) Ã¢â‚¬â€ ArtÃ„Â±k sihirbazÃ„Â± aÃƒÂ§ar
  if (lw === '/quiz' || lw === 'karÃ„Â±Ã…Å¸Ã„Â±k quiz' || lw === 'karisik quiz' || lw === '/quiz-wizard') {
    openQuizWizard();
    return;
  }

  // C. AYARLAR MENÃƒÅ“SÃƒÅ“ (/ayarlar, ayarlar)
  if (lw.startsWith('/kurallar') || lw.startsWith('/ayar') || lw === 'ayarlar' || lw === 'kurallar') {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.style.display = 'flex';
    }
    addMessage('bot', 'Ã¢Å¡â„¢Ã¯Â¸Â Ayarlar paneli aÃƒÂ§Ã„Â±ldÃ„Â±!');
    appendMessage('bot', formatMessage('bot', 'Ã¢Å¡â„¢Ã¯Â¸Â <b>Ayarlar & Kurallar</b> penceresini aÃƒÂ§tÃ„Â±m!'));
    return;
  }

  // D. NOT DEFTERÃ„Â° (/not)
  if (lw.startsWith('/not')) {
     const notArg = msg.substring(msg.indexOf(' ') + 1).trim();
     let notlar = JSON.parse(localStorage.getItem('mega_notlar') || '[]');
     if (lw === '/not' || notArg === '/not') {
       if (notlar.length === 0) {
         addMessage('bot', 'Not defteri boÃ…Å¸.');
         appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€œâ€¹ <b>Not Defteriniz BoÃ…Å¸</b><br>Not eklemek iÃƒÂ§in: <code>/not YarÃ„Â±n matematik sÃ„Â±navÃ„Â± var</code>'));
       } else {
         const html = 'ÄŸÅ¸â€œâ€¹ <b>NotlarÃ„Â±nÃ„Â±z:</b><br>' + notlar.map((n, i) => `<div style="padding:6px 10px;margin:4px 0;background:rgba(255,255,255,.06);border-radius:8px;border-left:3px solid var(--acc);"><small style="color:var(--sub)">${n.tarih}</small><br>${n.metin}</div>`).join('') + '<br><small style="color:var(--sub)">Temizlemek iÃƒÂ§in: <code>/not temizle</code></small>';
         addMessage('bot', 'Notlar listelendi.');
         appendMessage('bot', formatMessage('bot', html));
       }
     } else if (notArg.toLowerCase() === 'temizle') {
       localStorage.removeItem('mega_notlar');
       addMessage('bot', 'Notlar temizlendi.');
       appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€”â€˜Ã¯Â¸Â TÃƒÂ¼m notlar temizlendi!'));
     } else {
       notlar.push({ metin: notArg, tarih: new Date().toLocaleString('tr-TR') });
       localStorage.setItem('mega_notlar', JSON.stringify(notlar));
       addMessage('bot', 'Not eklendi: ' + notArg);
       appendMessage('bot', formatMessage('bot', `Ã¢Å“â€¦ Not kaydedildi: <b>${notArg}</b><br><small style="color:var(--sub)">Toplam ${notlar.length} not. GÃƒÂ¶rmek iÃƒÂ§in: <code>/not</code></small>`));
     }
     return;
  }

  // E. POMODORO ZAMANLAYICI (/pomo)
  if (lw.startsWith('/pomo')) {
     const pomoId = 'pomo_' + Date.now();
     const pomoMinutes = 25;
     const pomoHtml = `<div id="${pomoId}" style="background:linear-gradient(135deg,rgba(239,68,68,.15),rgba(249,115,22,.15));padding:20px;border-radius:16px;text-align:center;border:1px solid rgba(239,68,68,.3);max-width:340px;">
       <div style="font-size:1.2rem;font-weight:700;margin-bottom:8px;">ÄŸÅ¸Ââ€¦ Pomodoro ZamanlayÃ„Â±cÃ„Â±</div>
       <div id="timer_${pomoId}" style="font-size:3rem;font-weight:800;font-family:monospace;color:#f97316;letter-spacing:2px;margin:12px 0;">${pomoMinutes}:00</div>
       <div id="status_${pomoId}" style="font-size:0.85rem;color:var(--sub);margin-bottom:12px;">Ã¢ÂÂ³ Ãƒâ€¡alÃ„Â±Ã…Å¸ma sÃƒÂ¼resi baÃ…Å¸ladÃ„Â±!</div>
       <div style="width:100%;background:rgba(255,255,255,.1);border-radius:8px;height:8px;overflow:hidden;margin-bottom:12px;"><div id="bar_${pomoId}" style="width:100%;height:100%;background:linear-gradient(90deg,#f97316,#ef4444);border-radius:8px;transition:width 1s linear;"></div></div>
       <div style="display:flex;gap:8px;justify-content:center;"><button id="pause_${pomoId}" style="padding:8px 16px;border:none;border-radius:8px;background:#f97316;color:#fff;cursor:pointer;font-weight:600;">Ã¢ÂÂ¸Ã¯Â¸Â Duraklat</button><button id="stop_${pomoId}" style="padding:8px 16px;border:none;border-radius:8px;background:#ef4444;color:#fff;cursor:pointer;font-weight:600;">Ã¢ÂÂ¹Ã¯Â¸Â Bitir</button></div>
     </div>`;
     addMessage('bot', 'ÄŸÅ¸Ââ€¦ Pomodoro baÃ…Å¸ladÃ„Â±!');
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
         if (statusEl) statusEl.textContent = 'Ã¢Å“â€¦ SÃƒÂ¼re doldu! 5 dakika mola ver ÄŸÅ¸Ââ€°';
         addMessage('bot', 'ÄŸÅ¸Ââ€¦ Pomodoro tamamlandÃ„Â±!');
         appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸Ââ€° <b>Pomodoro tamamlandÃ„Â±!</b> Harika iÃ…Å¸ ÃƒÂ§Ã„Â±kardÃ„Â±n! Ã…Âimdi 5 dakika mola ver ve tekrarla. ÄŸÅ¸â€™Âª'));
       }
     }, 1000);
     
     // Duraklat/Devam butonu
     setTimeout(() => {
       const pauseBtn = document.getElementById('pause_' + pomoId);
       const stopBtn = document.getElementById('stop_' + pomoId);
       if (pauseBtn) pauseBtn.addEventListener('click', () => {
         paused = !paused;
         pauseBtn.textContent = paused ? 'Ã¢â€“Â¶Ã¯Â¸Â Devam' : 'Ã¢ÂÂ¸Ã¯Â¸Â Duraklat';
         const statusEl = document.getElementById('status_' + pomoId);
         if (statusEl) statusEl.textContent = paused ? 'Ã¢ÂÂ¸Ã¯Â¸Â DuraklatÃ„Â±ldÃ„Â±' : 'Ã¢ÂÂ³ Ãƒâ€¡alÃ„Â±Ã…Å¸ma devam ediyor...';
       });
       if (stopBtn) stopBtn.addEventListener('click', () => {
         clearInterval(interval);
         const timerEl = document.getElementById('timer_' + pomoId);
         const statusEl = document.getElementById('status_' + pomoId);
         if (timerEl) timerEl.style.color = '#ef4444';
         if (statusEl) statusEl.textContent = 'Ã¢ÂÂ¹Ã¯Â¸Â ZamanlayÃ„Â±cÃ„Â± durduruldu.';
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
         addMessage('bot', 'Ajanda boÃ…Å¸.');
         appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€œâ€¦ <b>AjandanÃ„Â±z BoÃ…Å¸</b><br>Eklemek iÃƒÂ§in: <code>/ajanda Matematik SÃ„Â±navÃ„Â± (Cuma)</code>'));
       } else {
         const html = 'ÄŸÅ¸â€œâ€¦ <b>AjandanÃ„Â±z:</b><br>' + ajandaList.map((a, i) => `<div style="padding:6px 10px;margin:4px 0;background:rgba(255,255,255,.06);border-radius:8px;">[${i+1}] ${a}</div>`).join('') + '<br><small style="color:var(--sub)">Temizlemek iÃƒÂ§in: <code>/ajanda temizle</code></small>';
         addMessage('bot', 'Ajanda listelendi.');
         appendMessage('bot', formatMessage('bot', html));
       }
     } else if (ajandaArg.toLowerCase() === 'temizle') {
       localStorage.setItem('bot_agenda', '[]');
       addMessage('bot', 'Ajanda temizlendi.');
       appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€”â€˜Ã¯Â¸Â Ajanda temizlendi!'));
     } else {
       ajandaList.push(ajandaArg);
       localStorage.setItem('bot_agenda', JSON.stringify(ajandaList));
       addMessage('bot', 'Ajandaya eklendi: ' + ajandaArg);
       appendMessage('bot', formatMessage('bot', `Ã¢Å“â€¦ Ajandaya eklendi: <b>${ajandaArg}</b><br><small style="color:var(--sub)">Toplam ${ajandaList.length} kayÃ„Â±t</small>`));
     }
     return;
  }

  // PDR 1. MOTÃ„Â°VASYON KOÃƒâ€¡U (/motivasyon)
  if (lw.startsWith('/motivasyon')) {
    setIsLoading(true);
    toggleTypingIndicator(true);
    updateBotStatus('ÄŸÅ¸Å¸Â¢ DÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼yor...', '#4ade80');
    try {
      const pdrPrompt = `Sen Ata Ortaokulu'nun en enerjik, pozitif ve anlayÃ„Â±Ã…Å¸lÃ„Â± psikolojik danÃ„Â±Ã…Å¸manÃ„Â± ve motivasyon koÃƒÂ§usun. Ãƒâ€“Ã„Å¸rencilere sÃ„Â±nav stresi (LGS/YKS) veya gÃƒÂ¼nlÃƒÂ¼k ders ÃƒÂ§alÃ„Â±Ã…Å¸ma zorluklarÃ„Â± konusunda ilham verici, kÃ„Â±sa ve net tavsiyeler vereceksin. Emoji kullanmayÃ„Â± unutma. KonuÃ…Å¸maya sÃ„Â±cak bir merhaba ile baÃ…Å¸la ve ne konuda yardÃ„Â±ma ihtiyacÃ„Â± olduÃ„Å¸unu sor.`;
      const response = await askAI('Merhaba, biraz motivasyona ve morale ihtiyacÃ„Â±m var. Bana yardÃ„Â±mcÃ„Â± olur musun?', pdrPrompt);
      addMessage('bot', response);
      toggleTypingIndicator(false);
      appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€Â¥ <b>Motivasyon KoÃƒÂ§u:</b><br>' + response));
      updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
    } catch(e) {
      toggleTypingIndicator(false);
      showError('Motivasyon koÃƒÂ§u yanÃ„Â±t veremedi.');
      updateBotStatus('ÄŸÅ¸â€Â´ Hata', '#ef4444');
    } finally { setIsLoading(false); }
    return;
  }

  // PDR 2. STRES YÃƒâ€“NETÃ„Â°MÃ„Â° (/stres)
  if (lw.startsWith('/stres')) {
    setIsLoading(true);
    toggleTypingIndicator(true);
    updateBotStatus('ÄŸÅ¸Å¸Â¢ DÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼yor...', '#4ade80');
    try {
      const pdrPrompt = `Sen bir psikolojik danÃ„Â±Ã…Å¸mansÃ„Â±n. Ãƒâ€“Ã„Å¸rencilerin sÃ„Â±nav stresi ve kaygÃ„Â±sÃ„Â±nÃ„Â± hafifletecek pratik nefes egzersizleri (Ãƒâ€“rn: 4-7-8 tekniÃ„Å¸i) ve kÃ„Â±sa rahatlama taktikleri vereceksin. AÃƒÂ§Ã„Â±klayÃ„Â±cÃ„Â± ve sakinleÃ…Å¸tirici bir ÃƒÂ¼slup kullan.`;
      const response = await askAI('Ã…Âu an biraz stresli ve kaygÃ„Â±lÃ„Â± hissediyorum. Beni rahatlatacak bir teknik sÃƒÂ¶yler misin?', pdrPrompt);
      addMessage('bot', response);
      toggleTypingIndicator(false);
      appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸Â§Ëœ <b>Stres YÃƒÂ¶netimi ve Rahatlama:</b><br>' + response));
      updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
    } catch(e) {
      toggleTypingIndicator(false);
      showError('Stres yÃƒÂ¶netimi yanÃ„Â±t veremedi.');
    } finally { setIsLoading(false); }
    return;
  }

  // PDR 3. MESLEK SEÃƒâ€¡Ã„Â°MÃ„Â° TESTÃ„Â° (/kariyer)
  if (lw.startsWith('/kariyer')) {
    setIsLoading(true);
    toggleTypingIndicator(true);
    updateBotStatus('ÄŸÅ¸Å¸Â¢ DÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼yor...', '#4ade80');
    try {
      const pdrPrompt = `Sen bir Kariyer ve Meslek DanÃ„Â±Ã…Å¸manÃ„Â±sÃ„Â±n. Ãƒâ€“Ã„Å¸renciye meslek seÃƒÂ§imi konusunda yardÃ„Â±mcÃ„Â± olmak iÃƒÂ§in 3 kÃ„Â±sa soruluk bir mini envanter testi yapacaksÃ„Â±n. Birinci soruyu sor (Hangi dersleri seviyorsun, hobilerin neler vs.) ve cevabÃ„Â±nÃ„Â± bekle. TÃƒÂ¼m sorularÃ„Â± aynÃ„Â± anda sorma.`;
      const response = await askAI('Meslek seÃƒÂ§imi testi yapmak istiyorum. Ã„Â°lk soruyu sorar mÃ„Â±sÃ„Â±n?', pdrPrompt);
      addMessage('bot', response);
      toggleTypingIndicator(false);
      appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸Â§Â­ <b>Kariyer DanÃ„Â±Ã…Å¸manÃ„Â±:</b><br>' + response));
      updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
    } catch(e) {
      toggleTypingIndicator(false);
      showError('Kariyer danÃ„Â±Ã…Å¸manÃ„Â± yanÃ„Â±t veremedi.');
    } finally { setIsLoading(false); }
    return;
  }

  // PDR 4. Ãƒâ€¡ALIÃ…ÂMA PROGRAMI (/program) Ã¢â‚¬â€ AdÃ„Â±m 1: SÃ„Â±nÃ„Â±f seÃƒÂ§imi
  if (lw.startsWith('/program')) {
    addMessage('bot', 'Ãƒâ€¡alÃ„Â±Ã…Å¸ma ProgramÃ„Â± SihirbazÃ„Â± baÃ…Å¸latÃ„Â±ldÃ„Â±.');
    const wizardHtml = `
      <div id="programWizard" class="wow-container" style="background:linear-gradient(135deg,rgba(16,185,129,.12),rgba(6,182,212,.12));padding:20px;border-radius:16px;border:1px solid rgba(16,185,129,.35);max-width:420px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <span style="font-size:1.8rem;">ÄŸÅ¸â€œâ€¦</span>
          <div>
            <div style="font-weight:800;font-size:1.05rem;color:#10b981;">Ãƒâ€¡alÃ„Â±Ã…Å¸ma ProgramÃ„Â± AsistanÃ„Â±</div>
            <div style="font-size:0.8rem;color:var(--sub);">KiÃ…Å¸iye ÃƒÂ¶zel haftalÃ„Â±k program oluÃ…Å¸tur</div>
          </div>
        </div>
        <div style="font-weight:700;margin-bottom:10px;font-size:0.95rem;">ÄŸÅ¸â€œÅ¡ 1. AdÃ„Â±m: SÃ„Â±nÃ„Â±fÃ„Â±nÃ„Â± seÃƒÂ§</div>
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:6px;margin-bottom:4px;">
          ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
             let label = n + '. SÃ„Â±nÃ„Â±f';
             let extra = '';
             let style = 'padding:10px 2px;border:2px solid rgba(16,185,129,.4);background:rgba(16,185,129,.1);border-radius:8px;color:inherit;cursor:pointer;font-weight:600;font-size:0.85rem;transition:all .2s;text-align:center;';
             if (n === 8) {
                label = '8. SÃ„Â±nÃ„Â±f (LGS)'; extra = ' ÄŸÅ¸ÂÂ¯';
                style = 'padding:10px 2px;border:2px solid rgba(249,115,22,.5);background:rgba(249,115,22,.12);border-radius:8px;color:inherit;cursor:pointer;font-weight:700;font-size:0.85rem;transition:all .2s;text-align:center;';
             }
             if (n === 12) {
                label = '12. SÃ„Â±nÃ„Â±f (YKS)'; extra = ' ÄŸÅ¸Ââ€œ';
                style = 'padding:10px 2px;border:2px solid rgba(168,85,247,.5);background:rgba(168,85,247,.12);border-radius:8px;color:inherit;cursor:pointer;font-weight:700;font-size:0.85rem;transition:all .2s;text-align:center;';
             }
             return '<button class="pw-sinif-btn" data-sinif="'+label+'" style="'+style+'">'+n+'.'+extra+'</button>';
          }).join('')}
        </div>
      </div>`;
    appendMessage('bot', wizardHtml);

    // SÃ„Â±nÃ„Â±f buton tÃ„Â±klamalarÃ„Â±
    setTimeout(() => {
      document.querySelectorAll('.pw-sinif-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.04)'; btn.style.boxShadow = '0 4px 16px rgba(16,185,129,.3)'; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.boxShadow = ''; });
        btn.addEventListener('click', () => {
          const sinif = btn.getAttribute('data-sinif');
          document.querySelectorAll('.pw-sinif-btn').forEach(b => { b.style.background = 'rgba(16,185,129,.1)'; b.style.borderColor = 'rgba(16,185,129,.4)'; });
          btn.style.background = 'rgba(16,185,129,.35)';
          btn.style.borderColor = '#10b981';

          // AdÃ„Â±m 2: Program tÃƒÂ¼rÃƒÂ¼
          const step2Html = `
            <div id="programWizardStep2" class="wow-container" style="background:linear-gradient(135deg,rgba(6,182,212,.12),rgba(99,102,241,.12));padding:20px;border-radius:16px;border:1px solid rgba(6,182,212,.35);max-width:420px;margin-top:4px;">
              <div style="font-size:0.85rem;color:var(--sub);margin-bottom:12px;">Ã¢Å“â€¦ SeÃƒÂ§ilen sÃ„Â±nÃ„Â±f: <b style="color:#10b981;">${sinif}</b></div>
              <div style="font-weight:700;margin-bottom:10px;font-size:0.95rem;">ÄŸÅ¸ÂÂ¯ 2. AdÃ„Â±m: Program tÃƒÂ¼rÃƒÂ¼nÃƒÂ¼ seÃƒÂ§</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <button class="pw-tur-btn" data-tur="LGS" data-sinif="${sinif}"
                  style="padding:12px 8px;border:2px solid rgba(239,68,68,.45);background:rgba(239,68,68,.1);border-radius:10px;color:inherit;cursor:pointer;font-weight:700;font-size:0.85rem;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <span style="font-size:1.4rem;">ÄŸÅ¸ÂÂ¯</span>LGS HazÃ„Â±rlÃ„Â±k
                </button>
                <button class="pw-tur-btn" data-tur="Ãƒâ€“SSS" data-sinif="${sinif}"
                  style="padding:12px 8px;border:2px solid rgba(168,85,247,.45);background:rgba(168,85,247,.1);border-radius:10px;color:inherit;cursor:pointer;font-weight:700;font-size:0.85rem;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <span style="font-size:1.4rem;">ÄŸÅ¸Ââ€ </span>Ãƒâ€“SSS HazÃ„Â±rlÃ„Â±k
                </button>
                <button class="pw-tur-btn" data-tur="Konu TekrarÃ„Â±" data-sinif="${sinif}"
                  style="padding:12px 8px;border:2px solid rgba(251,191,36,.45);background:rgba(251,191,36,.1);border-radius:10px;color:inherit;cursor:pointer;font-weight:700;font-size:0.85rem;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <span style="font-size:1.4rem;">ÄŸÅ¸â€â€</span>Konu TekrarÃ„Â±
                </button>
                <button class="pw-tur-btn" data-tur="Normal Ders" data-sinif="${sinif}"
                  style="padding:12px 8px;border:2px solid rgba(74,222,128,.45);background:rgba(74,222,128,.1);border-radius:10px;color:inherit;cursor:pointer;font-weight:700;font-size:0.85rem;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <span style="font-size:1.4rem;">ÄŸÅ¸â€œâ€“</span>Normal Ders
                </button>
              </div>
            </div>`;
          appendMessage('bot', step2Html);

          // Program tÃƒÂ¼rÃƒÂ¼ buton tÃ„Â±klamalarÃ„Â±
          setTimeout(() => {
            document.querySelectorAll('.pw-tur-btn').forEach(tBtn => {
              tBtn.addEventListener('mouseenter', () => { tBtn.style.transform = 'scale(1.04)'; });
              tBtn.addEventListener('mouseleave', () => { tBtn.style.transform = ''; });
              tBtn.addEventListener('click', async () => {
                const tur = tBtn.getAttribute('data-tur');
                const secilenSinif = tBtn.getAttribute('data-sinif');

                document.querySelectorAll('.pw-tur-btn').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
                tBtn.style.opacity = '1';
                tBtn.innerHTML = tBtn.innerHTML + ' Ã¢Å“â€¦';

                // YÃƒÂ¼kleniyor mesajÃ„Â±
                appendMessage('bot', formatMessage('bot', `Ã¢ÂÂ³ <b>${secilenSinif} Ã¢â‚¬â€ ${tur}</b> programÃ„Â± hazÃ„Â±rlanÃ„Â±yor...`));
                setIsLoading(true);
                toggleTypingIndicator(true);
                updateBotStatus('ÄŸÅ¸Å¸Â¢ HazÃ„Â±rlÃ„Â±yor...', '#10b981');

                try {
                  const turAciklama = {
                    'LGS': 'Bu ÃƒÂ¶Ã„Å¸renci LGS (Liselere GeÃƒÂ§iÃ…Å¸ SÃ„Â±navÃ„Â±) hazÃ„Â±rlÃ„Â±Ã„Å¸Ã„Â± yapÃ„Â±yor. AÃ„Å¸Ã„Â±rlÃ„Â±klÃ„Â± olarak Matematik, Fen Bilimleri, TÃƒÂ¼rkÃƒÂ§e, Ã„Â°ngilizce ve T.C. Ã„Â°nkÃ„Â±lap Tarihi derslerine odaklan. Soru ÃƒÂ§ÃƒÂ¶zÃƒÂ¼mÃƒÂ¼ ve deneme sÃ„Â±navlarÃ„Â±na yer ver.',
                    'Ãƒâ€“SSS': 'Bu ÃƒÂ¶Ã„Å¸renci Ãƒâ€“SSS hazÃ„Â±rlÃ„Â±Ã„Å¸Ã„Â± yapÃ„Â±yor. Genel kÃƒÂ¼ltÃƒÂ¼r, TÃƒÂ¼rkÃƒÂ§e ve temel akademik becerilere odaklan.',
                    'Konu TekrarÃ„Â±': 'Bu ÃƒÂ¶Ã„Å¸renci konu tekrarÃ„Â± yapÃ„Â±yor. Her derse dengeli zaman ayÃ„Â±r, zayÃ„Â±f konulara ek ÃƒÂ§alÃ„Â±Ã…Å¸ma ekle, test/soru ÃƒÂ§ÃƒÂ¶zÃƒÂ¼mÃƒÂ¼ ile pekiÃ…Å¸tir.',
                    'Normal Ders': 'Bu ÃƒÂ¶Ã„Å¸renci normal okul dersleri iÃƒÂ§in ÃƒÂ§alÃ„Â±Ã…Å¸Ã„Â±yor. Ãƒâ€“dev, gÃƒÂ¼nlÃƒÂ¼k ders tekrarÃ„Â± ve haftalÃ„Â±k konularÃ„Â± dengeli Ã…Å¸ekilde planla.'
                  }[tur] || '';

                  const pdrPrompt = `Sen bir eÃ„Å¸itim danÃ„Â±Ã…Å¸manÃ„Â±sÃ„Â±n. ${secilenSinif} ÃƒÂ¶Ã„Å¸rencisi iÃƒÂ§in ${tur} tÃƒÂ¼rÃƒÂ¼nde haftalÃ„Â±k ÃƒÂ§alÃ„Â±Ã…Å¸ma programÃ„Â± oluÃ…Å¸tur. ${turAciklama}

Ãƒâ€¡IKTI FORMAT KURALLARI (ZORUNLU):
- Sadece HTML tablosu ÃƒÂ¼ret, baÃ…Å¸ka aÃƒÂ§Ã„Â±klama EKLEME.
- DÃ„Â°KKAT: Tabloyu YARIM BIRAKMA! Pazartesi'den Pazar'a kadar 7 GÃƒÅ“NÃƒÅ“N TAMAMINI (Pzt, Sal, Ãƒâ€¡ar, Per, Cum, Cmt, Paz) eksiksiz olarak tabloya ekle. Token tasarrufu yapma, 7 gÃƒÂ¼nÃƒÂ¼ de tam olarak yaz!
- Tablonun ÃƒÂ¼stÃƒÂ¼ne kÃ„Â±sa (1 satÃ„Â±r) bir baÃ…Å¸lÃ„Â±k yaz.
- Tablo yapÃ„Â±sÃ„Â±: 4 sÃƒÂ¼tun Ã¢â€ â€™ GÃƒÂ¼n | Sabah (08:00-12:00) | Ãƒâ€“Ã„Å¸le (12:00-14:00) | AkÃ…Å¸am (18:00-22:00)
- SatÃ„Â±rlar: Pazartesi, SalÃ„Â±, Ãƒâ€¡arÃ…Å¸amba, PerÃ…Å¸embe, Cuma, Cumartesi, Pazar
- Ãƒâ€“NEMLÃ„Â°: Tablo hÃƒÂ¼crelerini Ãƒâ€¡OK KISA tut (maksimum 2-3 kelime). CÃƒÂ¼mle kurma! BÃƒÂ¶ylece 7 gÃƒÂ¼nÃƒÂ¼n tamamÃ„Â± tabloya sÃ„Â±Ã„Å¸abilir.
- Ãƒâ€“Ã„Å¸le sÃƒÂ¼tununu HER SATIRDA "ÄŸÅ¸ÂÂ½Ã¯Â¸Â Yemek ve Dinlenme" yap
- Cumartesi sabahÃ„Â±nÃ„Â± "Ãƒâ€“dev & Proje", akÃ…Å¸amÃ„Â±nÃ„Â± ilgi alanlarÃ„Â±na ayÃ„Â±r
- Pazar sabahÃ„Â±nÃ„Â± "ÄŸÅ¸ËœÂ´ Dinlenme", akÃ…Å¸amÃ„Â±nÃ„Â± "ÄŸÅ¸â€œâ€¹ Planlama & Hafif Tekrar" yap
- Tablodan sonra 1-2 cÃƒÂ¼mle kÃ„Â±sa ipucu ekle
HTML TABLE:
<table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-top:12px;">
  <thead>
    <tr style="background:linear-gradient(90deg,#0f766e,#0891b2);color:#fff;">
      <th style="padding:10px 12px;text-align:left;border:2px solid #0f766e;min-width:90px;">ÄŸÅ¸â€œâ€¦ GÃƒÂ¼n</th>
      <th style="padding:10px 12px;text-align:left;border:2px solid #0f766e;">Ã¢Ëœâ‚¬Ã¯Â¸Â Sabah (08:00-12:00)</th>
      <th style="padding:10px 12px;text-align:left;border:2px solid #0f766e;">ÄŸÅ¸Å’Â¤Ã¯Â¸Â Ãƒâ€“Ã„Å¸le (12:00-14:00)</th>
      <th style="padding:10px 12px;text-align:left;border:2px solid #0f766e;">ÄŸÅ¸Å’â„¢ AkÃ…Å¸am (18:00-22:00)</th>
    </tr>
  </thead>
  <tbody>
    <!-- BURAYA 7 GÃƒÅ“N Ã„Â°Ãƒâ€¡Ã„Â°N SATIRLARI YAZ. Sadece basit <tr> ve <td> kullan, Ã„Â°Ãƒâ€¡LERÃ„Â°NE HÃ„Â°Ãƒâ€¡BÃ„Â°R STYLE EKLEME! -->
  </tbody>
</table>`;

                  const response = await askAI(
                    `${secilenSinif} ÃƒÂ¶Ã„Å¸rencisi iÃƒÂ§in ${tur} haftalÃ„Â±k ÃƒÂ§alÃ„Â±Ã…Å¸ma programÃ„Â± tablosu oluÃ…Å¸tur. 7 GÃƒÅ“NÃƒÅ“N TAMAMI (PAZARTESÃ„Â°-PAZAR) EKSÃ„Â°KSÃ„Â°Z OLMALIDIR. YarÃ„Â±da kesme!`,
                    pdrPrompt,
                    4000
                  );

                  toggleTypingIndicator(false);
                  updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
                  addMessage('bot', `${secilenSinif} ${tur} programÃ„Â± hazÃ„Â±r.`);

                  const programHtml = `
                    <div class="wow-container" style="background:linear-gradient(135deg,rgba(15,118,110,.12),rgba(8,145,178,.12));padding:18px;border-radius:16px;border:1px solid rgba(15,118,110,.4);">
                      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
                        <span style="font-size:1.6rem;">ÄŸÅ¸â€œâ€¦</span>
                        <div>
                          <div style="font-weight:800;color:#34d399;font-size:1rem;">HaftalÃ„Â±k Ãƒâ€¡alÃ„Â±Ã…Å¸ma ProgramÃ„Â±</div>
                          <div style="font-size:0.8rem;color:var(--sub);">${secilenSinif} Ã‚Â· ${tur}</div>
                        </div>
                      </div>
                      <div style="overflow-x:auto;">${response}</div>
                      <div style="margin-top:14px;padding:10px 14px;background:rgba(16,185,129,.12);border-radius:10px;border-left:4px solid #10b981;font-size:0.85rem;color:var(--sub);">
                        ÄŸÅ¸â€™Â¡ <b style="color:#10b981;">Ã„Â°pucu:</b> Bu programÃ„Â± kendi ÃƒÂ¶Ã„Å¸renme hÃ„Â±zÃ„Â±na gÃƒÂ¶re Ã…Å¸ekillendirebilirsin. ZorlandÃ„Â±Ã„Å¸Ã„Â±n derslere daha fazla zaman ayÃ„Â±r!
                      </div>
                      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                        <button onclick="document.getElementById('userInput').value='/program'; document.getElementById('btnSendMessage').click();"
                          style="padding:7px 14px;background:rgba(16,185,129,.2);border:1px solid rgba(16,185,129,.5);border-radius:8px;color:#34d399;cursor:pointer;font-size:0.82rem;font-weight:600;">
                          ÄŸÅ¸â€â€ Yeni Program
                        </button>
                        <button onclick="document.getElementById('userInput').value='Bu programa Pomodoro ekle'; document.getElementById('btnSendMessage').click();"
                          style="padding:7px 14px;background:rgba(249,115,22,.15);border:1px solid rgba(249,115,22,.4);border-radius:8px;color:#fb923c;cursor:pointer;font-size:0.82rem;font-weight:600;">
                          ÄŸÅ¸Ââ€¦ Pomodoro Ekle
                        </button>
                      </div>
                    </div>`;
                  appendMessage('bot', programHtml);

                } catch(e) {
                  toggleTypingIndicator(false);
                  showError('Program oluÃ…Å¸turulamadÃ„Â±, lÃƒÂ¼tfen tekrar dene.');
                } finally {
                  setIsLoading(false);
                  updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
                }
              });
            });
          }, 150);
        });
      });
    }, 150);
    return;
  }

  // G. LÃ„Â°DERLÃ„Â°K TABLOSU (/liderlik)
  if (lw.startsWith('/liderlik')) {
     const userName = localStorage.getItem('mega_name') || 'Misafir';
     const userXP = state.xp || 0;
     const leaderboard = [
       { name: 'ÄŸÅ¸ÂÂ« Ata SÃ„Â±nÃ„Â±f Birincisi', xp: 2500 },
       { name: 'ÄŸÅ¸â€œÅ¡ Kitap Kurdu Elif', xp: 1800 },
       { name: 'ÄŸÅ¸Â§Â® Matematik YÃ„Â±ldÃ„Â±zÃ„Â± Ali', xp: 1200 },
       { name: 'ÄŸÅ¸â€Â¬ Fen KahramanÃ„Â± Zeynep', xp: 950 },
       { name: 'ÄŸÅ¸ÂÂ¨ Sanat UstasÃ„Â± Burak', xp: 700 },
     ];
     leaderboard.push({ name: `Ã¢Â­Â ${userName} (Sen)`, xp: userXP });
     leaderboard.sort((a, b) => b.xp - a.xp);
     let html = 'ÄŸÅ¸Ââ€  <b>Liderlik Tablosu</b><br><div style="margin-top:8px;">';
     leaderboard.forEach((u, i) => {
       const medal = i === 0 ? 'ÄŸÅ¸Â¥â€¡' : i === 1 ? 'ÄŸÅ¸Â¥Ë†' : i === 2 ? 'ÄŸÅ¸Â¥â€°' : 'ÄŸÅ¸â€Â¹';
       const isMe = u.name.includes('(Sen)');
       html += `<div style="display:flex;justify-content:space-between;padding:8px 10px;margin:3px 0;background:${isMe ? 'rgba(74,222,128,.15)' : 'rgba(255,255,255,.06)'};border-radius:8px;${isMe ? 'border:1px solid rgba(74,222,128,.4);font-weight:700;' : ''}">
         <span>${medal} ${u.name}</span>
         <span style="color:#fde047;font-weight:bold;">${u.xp} XP</span>
       </div>`;
     });
     html += '</div><br><small style="color:var(--sub)">Daha ÃƒÂ§ok sohbet ederek ve quiz ÃƒÂ§ÃƒÂ¶zerek XP kazan!</small>';
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
     
     const html = `ÄŸÅ¸â€œÅ  <b>Oturum Raporu</b>
       <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#60a5fa;">${toplamMesaj}</div><small>Toplam Mesaj</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#4ade80;">${kullaniciMesaj}</div><small>Senin MesajÃ„Â±n</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#f97316;">${xp}</div><small>Toplam XP</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#c084fc;">Lv.${level}</div><small>Seviye</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#fbbf24;">${notlar}</div><small>Not</small></div>
         <div style="background:rgba(255,255,255,.06);padding:12px;border-radius:10px;text-align:center;"><div style="font-size:1.4rem;font-weight:800;color:#f472b6;">${ajanda}</div><small>Ajanda</small></div>
       </div>`;
     addMessage('bot', 'Rapor oluÃ…Å¸turuldu.');
     appendMessage('bot', formatMessage('bot', html));
     return;
  }

  // I. SANAL MASKOT (/pet)
  if (lw.startsWith('/pet')) {
     setIsLoading(true);
     toggleTypingIndicator(true);
     updateBotStatus('ÄŸÅ¸Å¸Â¢ DÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼yor...', '#4ade80');
     try {
       const petPrompt = `Sen "Atik" adÃ„Â±nda sevimli bir sanal maskot kÃƒÂ¶peksin ÄŸÅ¸Ââ€¢. Ata Ortaokulu'nun maskotusun. KÃ„Â±sa, sevimli ve eÃ„Å¸lenceli cevaplar ver. Emoji bol kullan. Havlama sesleri ekle. KullanÃ„Â±cÃ„Â±ya moral ver ve onu motive et. EÃ„Å¸er kullanÃ„Â±cÃ„Â± sana yiyecek verirse mutlu ol (`;
       const response = await askAI(msg.replace('/pet', '').trim() || 'Merhaba Atik! NasÃ„Â±lsÃ„Â±n?', petPrompt);
       addMessage('bot', response);
       toggleTypingIndicator(false);
       appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸Ââ€¢ <b>Atik:</b> ' + response));
       updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
     } catch(e) {
       toggleTypingIndicator(false);
       showError('Maskot yanÃ„Â±t veremedi.');
       updateBotStatus('ÄŸÅ¸â€Â´ Hata', '#ef4444');
     } finally { setIsLoading(false); }
     return;
  }

  // J. KARAKTER MODU (/karakter)
  if (lw.startsWith('/karakter')) {
     const karakterler = [
       { isim: 'ProfesÃƒÂ¶r Zeki', emoji: 'ÄŸÅ¸Â§â€˜Ã¢â‚¬ÂÄŸÅ¸â€Â¬', desc: 'Bilim meraklÃ„Â±sÃ„Â±, her Ã…Å¸eyi deneylerle aÃƒÂ§Ã„Â±klayan bir profesÃƒÂ¶r' },
       { isim: 'Kaptan KeÃ…Å¸if', emoji: 'ÄŸÅ¸Â§Â­', desc: 'DÃƒÂ¼nyayÃ„Â± gezen, coÃ„Å¸rafya ve tarih anlatan bir kaÃ…Å¸if' },
       { isim: 'Ã…Âef Lezzet', emoji: 'ÄŸÅ¸â€˜Â¨Ã¢â‚¬ÂÄŸÅ¸ÂÂ³', desc: 'Yemek yaparken matematik ve fen ÃƒÂ¶Ã„Å¸reten bir aÃ…Å¸ÃƒÂ§Ã„Â±' },
       { isim: 'Astronot YÃ„Â±ldÃ„Â±z', emoji: 'ÄŸÅ¸â€˜Â©Ã¢â‚¬ÂÄŸÅ¸Å¡â‚¬', desc: 'Uzaydan dÃƒÂ¼nyayÃ„Â± anlatan bir astronot' },
       { isim: 'Dedektif MantÃ„Â±k', emoji: 'ÄŸÅ¸â€¢ÂµÃ¯Â¸Â', desc: 'Her problemi mantÃ„Â±k yÃƒÂ¼rÃƒÂ¼terek ÃƒÂ§ÃƒÂ¶zen bir dedektif' },
     ];
     const k = karakterler[Math.floor(Math.random() * karakterler.length)];
     window._activeCharacter = k;
     const html = `ÄŸÅ¸ÂÂ­ <b>Karakter Modu Aktif!</b><br><br>
       <div style="background:rgba(255,255,255,.06);padding:14px;border-radius:12px;border-left:4px solid var(--acc);">
         <div style="font-size:1.5rem;margin-bottom:4px;">${k.emoji}</div>
         <div style="font-weight:700;font-size:1rem;">${k.isim}</div>
         <div style="color:var(--sub);font-size:0.85rem;margin-top:4px;">${k.desc}</div>
       </div>
       <br><small>ArtÃ„Â±k benimle bu karakter olarak sohbet edebilirsin! Normal moda dÃƒÂ¶nmek iÃƒÂ§in <code>/normal</code> yaz.</small>`;
     addMessage('bot', `Karakter: ${k.isim}`);
     appendMessage('bot', formatMessage('bot', html));
     return;
  }

  // K. RASTGELE KONU (/rastgele)
  if (lw.startsWith('/rastgele')) {
     setIsLoading(true);
     toggleTypingIndicator(true);
     updateBotStatus('ÄŸÅ¸Å¸Â¢ DÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼yor...', '#4ade80');
     try {
              const konular = ['Uzayda yaÃ…Å¸am', 'Dinozorlar', 'Ã„Â°nsan beyni', 'Yapay zeka', 'DenizaltÃ„Â± volkanlarÃ„Â±', 'Antik MÃ„Â±sÃ„Â±r', 'DNA', 'Kara delikler', 'Robotlar', "AtatÃƒÂ¼rk'ÃƒÂ¼n ÃƒÂ§ocukluÃ„Å¸u", 'Mucitler', 'Matematik tarihi', "DÃƒÂ¼nya'nÃ„Â±n katmanlarÃ„Â±", 'Mikroplar', 'GÃƒÂ¶kkuÃ…Å¸aÃ„Å¸Ã„Â± nasÃ„Â±l oluÃ…Å¸ur', "Ã„Â°stanbul'un fethi", 'Hayvan iletiÃ…Å¸imi', 'Volkanlar', 'Gezegenler', 'Fotosintez'];
       const secilen = konular[Math.floor(Math.random() * konular.length)];
       const response = await askAI('Bana ' + secilen + ' hakkÃ„Â±nda ilginÃƒÂ§ ve eÃ„Å¸itici bilgiler ver.', 'Sen bir eÃ„Å¸itim asistanÃ„Â±sÃ„Â±n. Rastgele seÃƒÂ§ilen konu hakkÃ„Â±nda kÃ„Â±sa, ilginÃƒÂ§ ve eÃ„Å¸lenceli bilgiler ver. Emoji kullan. 2-3 paragraftan fazla olmasÃ„Â±n.');
       addMessage('bot', response);
       toggleTypingIndicator(false);
       appendMessage('bot', formatMessage('bot', `ÄŸÅ¸ÂÂ² <b>Rastgele Konu: ${secilen}</b><br><br>${response}`));
       updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
     } catch(e) {
       toggleTypingIndicator(false);
       showError('Konu yÃƒÂ¼klenemedi.');
       updateBotStatus('ÄŸÅ¸â€Â´ Hata', '#ef4444');
     } finally { setIsLoading(false); }
     return;
  }

  // L. NORMAL MODA DÃƒâ€“N (/normal)
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
     if (botName) botName.textContent = 'ÄŸÅ¸ÂÂ« Ata Sohbet Ã¢â‚¬â€ Normal';
     addMessage('bot', 'Normal moda dÃƒÂ¶nÃƒÂ¼ldÃƒÂ¼.');
     appendMessage('bot', formatMessage('bot', 'Ã¢Å“â€¦ <b>Normal Mod</b> aktif. Karakter ve quiz modlarÃ„Â± kapatÃ„Â±ldÃ„Â±.'));
     return;
  }

  // M. RAPORLAMA PANELI AÃƒâ€¡ (/rapor)
  if (lw.startsWith('/rapor') || lw.startsWith('/karne')) {
     renderReportPanel();
     addMessage('bot', 'Ãƒâ€“Ã„Å¸renci geliÃ…Å¸im raporu istendi.');
     appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€œÅ  <b>Raporlama Paneli</b> aÃƒÂ§Ã„Â±lÃ„Â±yor...'));
     return;
  }

  // UI ÃƒÂ¼zerinden gÃƒÂ¶nderilen 'SÃ„Â±nav Modu' komutunu direkt Sihirbaza baÃ„Å¸la
  if (lw === 'sÃ„Â±nav modu' || lw === 'test sihirbazÃ„Â±' || lw === 'sÃ„Â±nav menÃƒÂ¼sÃƒÂ¼') {
     document.getElementById('userInput').value = '';
     openQuizWizard();
     return;
  }

  // ==== 2. YÃƒÅ“KLENÃ„Â°YOR & AI ROUTER SÃƒÅ“RECÃ„Â° (V11 ENGÃ„Â°NE) ====
  // DoÃ„Å¸al dilde "ders anlat" kalÃ„Â±bÃ„Â± varsa otomatik ders moduna al
  const isDersRequest = lw.startsWith('/ders') || (/ders/.test(lw) && /anlat/.test(lw)) || (/konu/.test(lw) && /anlat/.test(lw));
  if (isDersRequest) {
     currentMode = 'ders';
     // /ders komutu gelince eski studySelections baÃ„Å¸lamÃ„Â± yeni konuyla ÃƒÂ§akÃ„Â±Ã…Å¸masÃ„Â±n
     // EÃ„Å¸er sihirbazdan gelmiyorsa (studySelections.topic=boÃ…Å¸ ise) eski topic'i temizle
     if (!studySelections.topic) {
        studySelections.grade = null;
        studySelections.subject = '';
     }
  }

  setIsLoading(true);
  toggleTypingIndicator(true);
  updateBotStatus('ÄŸÅ¸Å¸Â¢ DÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼yor...', '#4ade80');
  
  // KullanÃ„Â±cÃ„Â± mesajÃ„Â±nÃ„Â± V11 memory'e ekle
  v11AddToMemory('user', msg);
  
  try {
     // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
     // V11 STRICT ENGINE FLOW
     // USER Ã¢â€ â€™ SafeParse Ã¢â€ â€™ Validate Ã¢â€ â€™ Route Ã¢â€ â€™ Engine Ã¢â€ â€™ Output
     // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

     // STEP 1: UI mod bypass (Quiz/Ders wizard'dan geliyorsa parser'Ã„Â± atla)
     let intentData = null;
     if (currentMode === 'quiz' && window.activeQuizSession) {
       // Quiz modu aktif Ã¢â€ â€™ direkt quiz intent
       intentData = { intent: 'quiz', grade: studySelections.grade, topic: studySelections.topic, difficulty: 'medium' };
     } else if (window.activeOralSession) {
       // Sozlu sinav modu aktif (direkt chat, quiz tetiklenmemeli)
       intentData = { intent: 'chat', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
     } else if (lw.startsWith('/quiz')) {
       // /quiz komutu Ã¢â€ â€™ direkt quiz intent (AI parse'a gerek yok)
       intentData = { intent: 'quiz', grade: studySelections.grade, subject: studySelections.subject || 'Genel', topic: studySelections.topic || msg, difficulty: 'medium' };
     } else if (isDersRequest) {
       // /ders komutu veya doÃ„Å¸al dilde ders isteÃ„Å¸i Ã¢â€ â€™ DOÃ„ÂRUDAN chat intent (v11SafeParse atla!)
       // Ãƒâ€¡ÃƒÂ¼nkÃƒÂ¼ SafeParse de askAI ÃƒÂ§aÃ„Å¸Ã„Â±rÃ„Â±r Ã¢â€ â€™ throttle'a takÃ„Â±lÃ„Â±r Ã¢â€ â€™ "2 saniye bekleyin" mesajÃ„Â± ÃƒÂ§Ã„Â±kar
       intentData = { intent: 'chat', object: '', count: 1, subject: '', topic: '', difficulty: 'medium', grade: null };
     } else {
       // STEP 2: SafeParse (3 deneme retry ile intent tespiti)
       intentData = await v11SafeParse(msg);
     }

     console.log('[V11] Parsed intent:', intentData);

     // STEP 3: Route Ã¢â€ â€™ Engine (Image / Quiz / Chat)
     await v11Route(intentData, msg, {
       currentMode,
       studySelections,
       activeCharacter: window._activeCharacter,
       lastDocument: window.lastAnalyzedDocument,

       // Ã¢â€â‚¬Ã¢â€â‚¬ CHAT ENGINE CALLBACK Ã¢â€â‚¬Ã¢â€â‚¬
       onTextOutput: (text) => {
         toggleTypingIndicator(false);
         updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
         v11AddToMemory('bot', text);
         addMessage('bot', text);

         // suggest_quiz check: eÃ„Å¸itim konusu sohbeti Ã¢â€ â€™ quiz teklif et
         const isEduTopic = /(matematik|fizik|kimya|biyoloji|tarih|coÃ„Å¸rafya|fen|edebiyat|tÃƒÂ¼rkÃƒÂ§e|konu)/i.test(msg);
         let renderHtml = formatMessage('bot', text);
         if (isEduTopic && currentMode !== 'quiz') {
           renderHtml += `<br><br><div class="smart-suggestion-box"><p style="margin:0 0 10px 0;font-size:0.95em;">ÄŸÅ¸Å’Å¸ <b>Ãƒâ€“neri:</b> Bu konuyu pekiÃ…Å¸tirmek iÃƒÂ§in bir quiz ÃƒÂ§ÃƒÂ¶zmek ister misin?</p><button class="smart-btn wow-card" onclick="document.getElementById('userInput').value='Bu konuda quiz yap'; document.getElementById('btnSendMessage').click();" style="width:100%;padding:10px;background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">ÄŸÅ¸Å¸Â¢ Quiz BaÃ…Å¸lat</button></div>`;
         }
         // Typewriter animasyonuyla yaz (uzun cevaplarda bekleme hissi ortadan kalkar)
         streamMessage(renderHtml, () => {
           if (currentMode === 'ders') appendLessonActionButtons();
           if (window.activeOralSession) appendOralExamButtons();
         });
       },

       // Ã¢â€â‚¬Ã¢â€â‚¬ IMAGE ENGINE CALLBACK Ã¢â€â‚¬Ã¢â€â‚¬
       onImageOutput: ({ count, object, imgData }) => {
         toggleTypingIndicator(false);
         updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
         const uid = 'img' + Date.now();
         const imageHtml = `<div id="${uid}" style="background:rgba(0,0,0,.45);padding:14px;border-radius:12px;margin-top:8px;">
           <p style="font-weight:700;color:#c084fc;">ÄŸÅ¸â€“Â¼Ã¯Â¸Â GÃƒÂ¶rsel ÃƒÅ“retildi (${count} adet: ${object})</p>
           ${imgData ? `<img src="${imgData}" style="width:100%;border-radius:8px;display:block;" alt="${object}">` : '<p style="color:#ef4444;">Ã¢Å¡Â Ã¯Â¸Â GÃƒÂ¶rsel yÃƒÂ¼klenemedi. Tekrar deneyin.</p>'}
         </div>`;
         addMessage('bot', `(GÃƒÂ¶rsel: ${count} ${object})`);
         appendMessage('bot', formatMessage('bot', imageHtml));
       },

       // Ã¢â€â‚¬Ã¢â€â‚¬ QUIZ ENGINE CALLBACK Ã¢â€â‚¬Ã¢â€â‚¬
       onQuizOutput: ({ grade, subject, topic, difficulty }) => {
         toggleTypingIndicator(false);
         updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');
         currentMode = 'quiz';
         window.activeQuizSession = true;
         const label = `${grade} ${subject} - ${topic}`;
         addMessage('bot', `ÄŸÅ¸â€œÂ Quiz: ${label}`);
         appendMessage('bot', formatMessage('bot', `ÄŸÅ¸â€œÂ <b>Test HazÃ„Â±rlanÃ„Â±yor:</b> ${label}<br><br><div class="jumping-dots"><span></span><span></span><span></span></div>`));
         if (typeof generateDynamicQuiz === 'function') {
           generateDynamicQuiz(grade, subject, topic, difficulty);
         }
       },

       // Ã¢â€â‚¬Ã¢â€â‚¬ ERROR CALLBACK Ã¢â€â‚¬Ã¢â€â‚¬
       onError: (errMsg) => {
         toggleTypingIndicator(false);
         updateBotStatus('ÄŸÅ¸â€Â´ Hata', '#ef4444');
         addMessage('bot', 'Hata: ' + errMsg);
         appendMessage('bot', formatMessage('bot', `Ã¢Å¡Â Ã¯Â¸Â ${errMsg}`));
       }
     });

     renderDailyQuests();
     updateBotStatus('ÄŸÅ¸Å¸Â¢ Ãƒâ€¡evrimiÃƒÂ§i', '#4ade80');

  } catch(e) {
     console.error("[V11] Critical Error:", e);
     updateBotStatus('ÄŸÅ¸â€Â´ Hata', '#ef4444');
     addMessage('bot', 'AI Engine Error');
     appendMessage('bot', formatMessage('bot', 'Ã¢Å¡Â Ã¯Â¸Â Sistem hatasÃ„Â± oluÃ…Å¸tu, lÃƒÂ¼tfen tekrar deneyin.'));
  } finally {
     setIsLoading(false);
     saveUserData();
     toggleTypingIndicator(false);
     updateStats();
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// DERS MODU AKSÃ„Â°YON BUTONLARI
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// ÄŸÅ¸ÂÂ¯ QUIZ SÃ„Â°HÃ„Â°RBAZI Ã¢â‚¬â€ KullanÃ„Â±cÃ„Â± seÃƒÂ§er, AI ÃƒÂ¼retir
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function openQuizWizard() {
  // Varsa ÃƒÂ¶ncekini kaldÃ„Â±r
  const existing = document.getElementById('quizWizardOverlay');
  if (existing) existing.remove();

  const grades = [1,2,3,4,5,6,7,8,9,10,11,12];
  const questionTypes = [
    { id: 'coktan', label: 'ÄŸÅ¸â€œâ€¹ Ãƒâ€¡oktan SeÃƒÂ§meli', desc: 'Klasik 4 Ã…Å¸Ã„Â±klÃ„Â± test' },
    { id: 'dogru_yanlis', label: 'Ã¢Å“â€¦ DoÃ„Å¸ru / YanlÃ„Â±Ã…Å¸', desc: '2 Ã…Å¸Ã„Â±klÃ„Â± hÃ„Â±zlÃ„Â± test' },
    { id: 'bosluk', label: 'ÄŸÅ¸â€œÂ BoÃ…Å¸luk Doldurma', desc: 'Eksik kelimeyi bul' },
    { id: 'lgs', label: 'ÄŸÅ¸ÂÂ¯ LGS TarzÃ„Â±', desc: 'Paragraf & ÃƒÂ§Ã„Â±karÃ„Â±m' },
    { id: 'yks', label: 'ÄŸÅ¸ÂÂ« YKS/TYT TarzÃ„Â±', desc: 'Analiz & sentez' },
    { id: 'karma', label: 'ÄŸÅ¸ÂÂ² Karma Soru', desc: 'KarÃ„Â±Ã…Å¸Ã„Â±k soru tipleri' },
  ];

  const overlay = document.createElement('div');
  overlay.id = 'quizWizardOverlay';
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px;`;

  overlay.innerHTML = `
    <div style="background:var(--bg2,#1e293b);border-radius:20px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,.7);border:1px solid var(--bdr,rgba(255,255,255,.1));">
      
      <!-- HEADER -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 24px 16px;border-bottom:1px solid var(--bdr,rgba(255,255,255,.1));">
        <div>
          <h2 style="margin:0;font-size:1.3rem;color:var(--acc,#38bdf8);">ÄŸÅ¸ÂÂ¯ Test SihirbazÃ„Â±</h2>
          <p id="qwStepLabel" style="margin:4px 0 0;font-size:.82rem;color:var(--sub,#64748b);">AdÃ„Â±m 1/3 Ã¢â‚¬â€ SÃ„Â±nÃ„Â±f seÃƒÂ§in</p>
        </div>
        <button id="qwClose" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;padding:4px 8px;border-radius:8px;">Ã¢Å“â€“</button>
      </div>

      <!-- ADIM 1: SINIF SEÃƒâ€¡Ã„Â°MÃ„Â° -->
      <div id="qwStep1" style="padding:20px 24px;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Hangi sÃ„Â±nÃ„Â±f dÃƒÂ¼zeyinde test ÃƒÂ§ÃƒÂ¶zmek istiyorsun?</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${grades.map(g => `
            <button class="qw-grade-btn" data-grade="${g}" style="padding:12px 8px;border-radius:12px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);font-weight:700;font-size:.95rem;cursor:pointer;transition:all .2s;">
              ${g}. SÃ„Â±nÃ„Â±f
            </button>
          `).join('')}
        </div>
      </div>

      <!-- ADIM 2: DERS SEÃƒâ€¡Ã„Â°MÃ„Â° -->
      <div id="qwStep2" style="padding:20px 24px;display:none;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Hangi dersten test ÃƒÂ§ÃƒÂ¶zmek istiyorsun?</p>
        <div id="qwSubjectGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"></div>
      </div>

      <!-- ADIM 3: SORU TÃ„Â°PÃ„Â° SEÃƒâ€¡Ã„Â°MÃ„Â° -->
      <div id="qwStep3" style="padding:20px 24px;display:none;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">NasÃ„Â±l bir soru tipi istersin?</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${questionTypes.map(qt => `
            <button class="qw-type-btn" data-type="${qt.id}" style="padding:12px 16px;border-radius:12px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px;text-align:left;">
              <span style="font-size:1.1rem;">${qt.label}</span>
              <span style="font-size:.8rem;color:var(--sub,#64748b);margin-left:auto;">${qt.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- ADIM 4: SORU SAYISI SEÃƒâ€¡Ã„Â°MÃ„Â° -->
      <div id="qwStep4" style="padding:20px 24px;display:none;">
        <p style="color:var(--sub,#64748b);font-size:.88rem;margin-bottom:14px;">Testte kaÃƒÂ§ soru olsun?</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
          ${[2, 5, 8, 10].map(cnt => `
            <button class="qw-count-btn" data-count="${cnt}" style="padding:12px 8px;border-radius:12px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);font-weight:700;font-size:1.1rem;cursor:pointer;transition:all .2s;">
              ${cnt}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- FOOTER NAVÃ„Â°GASYON -->
      <div style="padding:16px 24px;border-top:1px solid var(--bdr,rgba(255,255,255,.1));display:flex;justify-content:space-between;">
        <button id="qwBack" style="padding:10px 20px;border-radius:10px;border:1px solid var(--bdr,rgba(255,255,255,.15));background:none;color:var(--sub,#64748b);cursor:pointer;display:none;">Ã¢â€ Â Geri</button>
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

  // GERÃ„Â°
  backBtn.addEventListener('click', () => {
    if (step === 2) {
      step = 1;
      overlay.querySelector('#qwStep1').style.display = '';
      overlay.querySelector('#qwStep2').style.display = 'none';
      stepLabel.textContent = 'AdÃ„Â±m 1/3 Ã¢â‚¬â€ SÃ„Â±nÃ„Â±f seÃƒÂ§in';
      backBtn.style.display = 'none';
      selectionDisplay.textContent = '';
    } else if (step === 3) {
      step = 2;
      overlay.querySelector('#qwStep2').style.display = '';
      overlay.querySelector('#qwStep3').style.display = 'none';
      stepLabel.textContent = 'AdÃ„Â±m 2/3 Ã¢â‚¬â€ Ders seÃƒÂ§in';
      selectionDisplay.textContent = `${selectedGrade}. SÃ„Â±nÃ„Â±f`;
    } else if (step === 4) {
      step = 3;
      overlay.querySelector('#qwStep3').style.display = '';
      overlay.querySelector('#qwStep4').style.display = 'none';
      stepLabel.textContent = 'AdÃ„Â±m 3/3 Ã¢â‚¬â€ Soru tipini seÃƒÂ§in';
    }
  });

  // ADIM 1: SÃ„Â±nÃ„Â±f seÃƒÂ§imi
  overlay.querySelectorAll('.qw-grade-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.borderColor = 'var(--acc,#38bdf8)');
    btn.addEventListener('mouseleave', () => { if (!btn.classList.contains('selected')) btn.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))'; });
    btn.addEventListener('click', () => {
      selectedGrade = parseInt(btn.dataset.grade);
      step = 2;

      // Dersleri yÃƒÂ¼kle
      const subjects = Object.keys(curriculumData[selectedGrade] || {});
      const subGrid = overlay.querySelector('#qwSubjectGrid');
      subGrid.innerHTML = subjects.map(s => `
        <button class="qw-sub-btn" data-subject="${s}" style="padding:10px 12px;border-radius:10px;border:2px solid var(--bdr,rgba(255,255,255,.1));background:var(--bg,#0f172a);color:var(--txt,#e2e8f0);font-size:.88rem;cursor:pointer;transition:all .2s;">
          ${s}
        </button>
      `).join('');

      overlay.querySelector('#qwStep1').style.display = 'none';
      overlay.querySelector('#qwStep2').style.display = '';
      stepLabel.textContent = `AdÃ„Â±m 2/3 Ã¢â‚¬â€ Ders seÃƒÂ§in`;
      selectionDisplay.textContent = `${selectedGrade}. SÃ„Â±nÃ„Â±f`;
      backBtn.style.display = '';

      // Ders seÃƒÂ§imi
      subGrid.querySelectorAll('.qw-sub-btn').forEach(sb => {
        sb.addEventListener('mouseenter', () => sb.style.borderColor = 'var(--acc,#38bdf8)');
        sb.addEventListener('mouseleave', () => { if (!sb.classList.contains('selected')) sb.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))'; });
        sb.addEventListener('click', () => {
          selectedSubject = sb.dataset.subject;
          step = 3;
          overlay.querySelector('#qwStep2').style.display = 'none';
          overlay.querySelector('#qwStep3').style.display = '';
          stepLabel.textContent = 'AdÃ„Â±m 3/3 Ã¢â‚¬â€ Soru tipini seÃƒÂ§in';
          selectionDisplay.textContent = `${selectedGrade}. SÃ„Â±nÃ„Â±f Ã¢â‚¬Â¢ ${selectedSubject}`;
          
          // Kademe bazlÃ„Â± LGS ve YKS filtresi
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

  // ADIM 3: Soru tipi seÃƒÂ§imi Ã¢â€ â€™ AdÃ„Â±m 4'e GeÃƒÂ§iÃ…Å¸
  let selectedType = null;
  overlay.querySelectorAll('.qw-type-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.borderColor = 'var(--acc2,#818cf8)');
    btn.addEventListener('mouseleave', () => btn.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))');
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      step = 4;
      overlay.querySelector('#qwStep3').style.display = 'none';
      overlay.querySelector('#qwStep4').style.display = '';
      stepLabel.textContent = 'AdÃ„Â±m 4/4 Ã¢â‚¬â€ Soru sayÃ„Â±sÃ„Â± seÃƒÂ§in';
    });
  });

  // ADIM 4: Soru sayÃ„Â±sÃ„Â± seÃƒÂ§imi Ã¢â€ â€™ Quiz BaÃ…Å¸lat
  overlay.querySelectorAll('.qw-count-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.borderColor = 'var(--acc2,#818cf8)');
    btn.addEventListener('mouseleave', () => btn.style.borderColor = 'var(--bdr,rgba(255,255,255,.1))');
    btn.addEventListener('click', () => {
      const qCount = parseInt(btn.dataset.count);
      overlay.remove();

      const typeLabels = {
        coktan: 'Ãƒâ€¡oktan SeÃƒÂ§meli',
        dogru_yanlis: 'DoÃ„Å¸ru/YanlÃ„Â±Ã…Å¸',
        bosluk: 'BoÃ…Å¸luk Doldurma',
        lgs: 'LGS TarzÃ„Â±',
        yks: 'YKS/TYT TarzÃ„Â±',
        karma: 'Karma Soru',
      };
      const topicList = curriculumData[selectedGrade]?.[selectedSubject] || ['Genel Konu'];
      const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];
      const quizTitle = `${selectedGrade}. SÃ„Â±nÃ„Â±f ${selectedSubject} Ã¢â‚¬â€ ${typeLabels[selectedType] || 'Test'}`;

      addMessage('bot', `${quizTitle} hazÃ„Â±rlanÃ„Â±yor...`);
      appendMessage('bot', formatMessage('bot', `ÄŸÅ¸ÂÂ¯ <b>${quizTitle}</b><br>Konu: <b>${randomTopic}</b><br>Soru SayÃ„Â±sÃ„Â±: ${qCount}<br><div class="jumping-dots"><span></span><span></span><span></span></div>`));
      generateDynamicQuiz(selectedGrade, selectedSubject, randomTopic, selectedType === 'yks' ? 'hard' : selectedType === 'lgs' ? 'medium' : 'medium', selectedType, qCount);
    });
  });
}

// V10: DINAMIK QUIZ ENGINE (State Machine)
async function generateDynamicQuiz(grade, subject, topic, difficulty, qType, customCount = null) {

  // Ã¢â€â‚¬Ã¢â€â‚¬ Kademe tespiti Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const gradeNum = parseInt(grade);
  let kademeTalimat = '';
  let formatTalimat = 'Ãƒâ€¡oktan seÃƒÂ§meli, 4 Ã…Å¸Ã„Â±k (A, B, C, D).';
  let zorluklarDagilim = '1 kolay, 3 orta, 1 zor';
  let typeRule = '';

  if (gradeNum >= 1 && gradeNum <= 4) {
    kademeTalimat = `Ã„Â°lkokul ${gradeNum}. SÃ„Â±nÃ„Â±f dÃƒÂ¼zeyinde: somut ÃƒÂ¶rnekler ve gÃƒÂ¼nlÃƒÂ¼k hayat nesneleriyle aÃƒÂ§Ã„Â±kla, cÃƒÂ¼mleler kÃ„Â±sa ve net olsun, hikayeleÃ…Å¸tirme tekniÃ„Å¸inden yararlan, oyunsu ve sevecen bir dil kullan. Soyut kavramlardan kaÃƒÂ§Ã„Â±n.`;
    formatTalimat = 'Ãƒâ€¡oktan seÃƒÂ§meli, 3 Ã…Å¸Ã„Â±k (A, B, C). Ã…ÂÃ„Â±klar ÃƒÂ§ok kÃ„Â±sa olsun.';
    zorluklarDagilim = '2 kolay, 2 orta, 1 biraz zorlu';
  } else if (gradeNum >= 5 && gradeNum <= 8) {
    kademeTalimat = `Ortaokul ${gradeNum}. SÃ„Â±nÃ„Â±f dÃƒÂ¼zeyinde: LGS formatÃ„Â±na yakÃ„Â±n sorular oluÃ…Å¸tur. OkuduÃ„Å¸unu anlama ve ÃƒÂ§Ã„Â±karÃ„Â±m yapma gerektiren sorular tercih et. Gerekirse "AÃ…Å¸aÃ„Å¸Ã„Â±dakilerden hangisi doÃ„Å¸rudur?" veya "I, II, III" formatÃ„Â±ndaki sorular kullan. MEB mÃƒÂ¼fredatÃ„Â±na uygun ol.`;
  } else if (gradeNum >= 9 && gradeNum <= 12) {
    kademeTalimat = `Lise ${gradeNum}. SÃ„Â±nÃ„Â±f dÃƒÂ¼zeyinde: YKS/TYT-AYT formatÃ„Â±nda sorular oluÃ…Å¸tur. Akademik terminoloji kullan, analiz ve sentez dÃƒÂ¼zeyinde dÃƒÂ¼Ã…Å¸ÃƒÂ¼nme gerektirsin.`;
    zorluklarDagilim = '1 kolay, 2 orta, 2 zor';
  } else {
    kademeTalimat = `Ortaokul genel dÃƒÂ¼zeyinde, MEB mÃƒÂ¼fredatÃ„Â±na uygun.`;
  }

  let templateOptions = `{ "A": "...", "B": "...", "C": "...", "D": "..." }`;

  // qType zorlamalarÃ„Â± (Front-end 4 Ã…Å¸Ã„Â±klÃ„Â± yapÃ„Â± bekler, o yÃƒÂ¼zden bunu maskeliyoruz)
  if (qType === 'bosluk') {
    formatTalimat = `Ãƒâ€¡oktan seÃƒÂ§meli, 4 Ã…Å¸Ã„Â±k (A, B, C, D). Soru metni iÃƒÂ§inde tamamlanmasÃ„Â± gereken bir boÃ…Å¸luk iÃƒÂ§in alt tireler (______) kullan. 
    Ã„Â°stersen cÃƒÂ¼mlenin sonuna ipucu Ã…Å¸Ã„Â±klarÃ„Â± parantez iÃƒÂ§inde ekleyebilirsin.
    Ãƒâ€“rnek KalÃ„Â±plar:
    - I ______ a student. (am / is / are)
    - TÃƒÂ¼rkiye'nin baÃ…Å¸kenti ______'dÃ„Â±r.
    - Ders ÃƒÂ§alÃ„Â±Ã…Å¸tÃ„Â± ______ sÃ„Â±navda baÃ…Å¸arÃ„Â±lÃ„Â± olamadÃ„Â±. (fakat / veya / ÃƒÂ§ÃƒÂ¼nkÃƒÂ¼)
    LÃƒÅ“TFEN HÃ„Â°Ãƒâ€¡BÃ„Â°R YERDE Ãƒâ€¡Ã„Â°FT TIRNAK (") Ã„Â°Ã…ÂARETÃ„Â° KULLANMA, TEK TIRNAK (') KULLAN. AÃƒÂ§Ã„Â±klamalarÃ„Â± (aciklama alanÃ„Â±nÃ„Â±) EN FAZLA 3 kelime tut ki sorular yarÃ„Â±m kesilmesin.`;
  } else if (qType === 'dogru_yanlis') {
    formatTalimat = 'Soru metni doÃ„Å¸rudan kesin bir Ã„Â°DDÃ„Â°A (cÃƒÂ¼mle) olmalÃ„Â±dÃ„Â±r. (Ãƒâ€“rn: "DÃƒÂ¼nya GÃƒÂ¼neÃ…Å¸ etrafÃ„Â±nda dÃƒÂ¶ner.") SADECE 2 Ã…Å¸Ã„Â±k ver! Ã…ÂÃ„Â±klarÃ„Â±n iÃƒÂ§eriÃ„Å¸i KESÃ„Â°NLÃ„Â°KLE "DoÃ„Å¸ru" ve "YanlÃ„Â±Ã…Å¸" kelimeleri olsun.';
    templateOptions = `{ "A": "DoÃ„Å¸ru", "B": "YanlÃ„Â±Ã…Å¸" }`;
  } else if (qType === 'lgs') {
    formatTalimat = 'OkuduÃ„Å¸unu anlama, grafik yorumlama veya mantÃ„Â±k ÃƒÂ§Ã„Â±karÃ„Â±mÃ„Â±na dayalÃ„Â± yeni nesil ÃƒÂ§oktan seÃƒÂ§meli, 4 Ã…Å¸Ã„Â±klÃ„Â±.';
  } else if (qType === 'yks') {
    formatTalimat = 'YKS/TYT tarzÃ„Â±nda, ÃƒÂ§eldiricisi gÃƒÂ¼ÃƒÂ§lÃƒÂ¼, analiz ve ÃƒÂ¶nbilgi gerektiren ÃƒÂ§oktan seÃƒÂ§meli, 4 Ã…Å¸Ã„Â±klÃ„Â±.';
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ Zorluk ayarÃ„Â± Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const difficultyMap = {
    easy:   'TÃƒÂ¼m sorular kolay, kavram tanÃ„Â±ma dÃƒÂ¼zeyinde olsun.',
    medium: `Zorluk daÃ„Å¸Ã„Â±lÃ„Â±mÃ„Â±: ${zorluklarDagilim}.`,
    hard:   'TÃƒÂ¼m sorular zor; akÃ„Â±l yÃƒÂ¼rÃƒÂ¼tme, analiz ve kavram yanÃ„Â±lgÃ„Â±larÃ„Â±nÃ„Â± hedefleyen ÃƒÂ§eldiriciler kullan.'
  };
  const difficultyTalimat = difficultyMap[difficulty] || difficultyMap['medium'];

  // Ã¢â€â‚¬Ã¢â€â‚¬ Ana pedagojik prompt Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  const isKarmaTen = qType === 'karma';
  const soruSayisi = customCount || (isKarmaTen ? 10 : 3);
  const qMsg = `GÃƒâ€“REV: ${grade} sÃ„Â±nÃ„Â±f "${subject}" dersi "${topic}" konusu iÃƒÂ§in ${soruSayisi} soru hazÃ„Â±rla. ${soruSayisi >= 5 ? "DÃ„Â°KKAT: YarÃ„Â±da kesilmemesi iÃƒÂ§in sorularÃ„Â±n 'aciklama' (aÃƒÂ§Ã„Â±klama) kÃ„Â±sÃ„Â±mlarÃ„Â±nÃ„Â± Ãƒâ€¡OK KISA tut (1 cÃƒÂ¼mle)." : ""}

ZORLUK: ${difficultyTalimat}
KADEME/FORMAT: ${kademeTalimat} ${formatTalimat}

MECBURÃ„Â° JSON FORMATI (SADECE AÃ…ÂAÃ„ÂIDAKÃ„Â° YAPIYI DÃƒâ€“NDÃƒÅ“R, BAÃ…ÂKA HÃ„Â°Ãƒâ€¡BÃ„Â°R Ã…ÂEY YAZMA!):
[
  {
    "soru": "Soru metni...",
    "secenekler": ${templateOptions},
    "dogru_cevap": "A",
    "aciklama": "Neden doÃ„Å¸ru..."
  }
]

Ãƒâ€¡OK Ãƒâ€“NEMLÃ„Â°:
- Ã„Â°ÃƒÂ§eriklerde kesinlikle ÃƒÂ§ift tÃ„Â±rnak (") kullanma, formatÃ„Â± koparÃ„Â±r. EÃ„Å¸ik tÃ„Â±rnak (') kullanabilirsin.
- JSON iÃƒÂ§ine ekstra anahtar (konu, id vb) EKLEME. Sadece yukarÃ„Â±daki diziyi dÃƒÂ¶n.`;

  let rawRes = "<Bos>";
  try {
    // Cache'de kalmÃ„Â±Ã…Å¸ hatalÃ„Â± ÃƒÂ¼retilmiÃ…Å¸ kÃƒÂ¼ÃƒÂ§ÃƒÂ¼k JSON'larÃ„Â± ezip yeni response almak iÃƒÂ§in timestamp ekliyoruz
    const cacheBuster = `\n_noCache: ${Date.now()}_`;
    // Quiz iÃƒÂ§in 2000 Token sÃ„Â±nÃ„Â±rÃ„Â±: uzun TÃƒÂ¼rkÃƒÂ§e hikayeleÃ…Å¸tirmeler tokenlarÃ„Â± ÃƒÂ§abuk doldurur.
    const res = await askAI(qMsg + cacheBuster, 'Sen bir soru ÃƒÂ¼retme motorusun. SADECE geÃƒÂ§erli JSON dizisi dÃƒÂ¶ndÃƒÂ¼r. Asla baÃ…Å¸ka bir karakter ekleme.', 2000);
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
          console.error('launchInteractiveQuiz bulunamadÃ„Â±!');
        }
      }, 500);
    } else {
      throw new Error('Invalid output format');
    }
  } catch(e) {
    console.warn('Quiz Gen Error:', e);
    addMessage('bot', 'Test iÃƒÂ§eriÃ„Å¸i oluÃ…Å¸turulamadÃ„Â±.');
    appendMessage('bot', formatMessage('bot', 'Ã¢Å¡Â Ã¯Â¸Â Soru oluÃ…Å¸turulamadÃ„Â±, lÃƒÂ¼tfen tekrar dene.\n\n<span style="font-size:0.7em;color:gray;">AI Ãƒâ€¡Ã„Â±ktÃ„Â±sÃ„Â± (ilk 300 harf): ' + (rawRes ? rawRes.substring(0, 300) : "null") + '</span>'));
  }
}


function appendLessonActionButtons() {
  const chatbox = document.getElementById('chatbox');
  if (!chatbox) return;

  const actionBarId = 'lesson-action-bar-' + Date.now();
  const actionHtml = `
    <div class="lesson-action-bar" id="${actionBarId}">
      <button class="lesson-action-btn continue" data-action="continue">
        <span class="lesson-action-icon">Ã¢â€“Â¶Ã¯Â¸Â</span>
        <span>Devam Et</span>
      </button>
      <button class="lesson-action-btn quiz" data-action="quiz">
        <span class="lesson-action-icon">ÄŸÅ¸â€œÅ </span>
        <span>SÃ„Â±nav Modu</span>
      </button>
      <button class="lesson-action-btn topic" data-action="topic">
        <span class="lesson-action-icon">ÄŸÅ¸â€â‚¬</span>
        <span>BaÃ…Å¸ka Konuya GeÃƒÂ§</span>
      </button>
      <button class="lesson-action-btn normal" data-action="normal">
        <span class="lesson-action-icon">ÄŸÅ¸â€™Â¬</span>
        <span>Normal Moda DÃƒÂ¶n</span>
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

      // ButonlarÃ„Â± devre dÃ„Â±Ã…Å¸Ã„Â± bÃ„Â±rak
      actionBar.querySelectorAll('.lesson-action-btn').forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.5';
        b.style.pointerEvents = 'none';
      });
      // TÃ„Â±klanan butonu vurgula
      btn.style.opacity = '1';
      btn.classList.add('selected');

      if (action === 'continue') {
        handleSendMessage('devam et');
      } else if (action === 'quiz') {
        // Mevcut konu iÃƒÂ§in quiz oluÃ…Å¸tur
        if (studySelections.topic) {
          handleSendMessage(`/quiz ${studySelections.grade}. SÃ„Â±nÃ„Â±f ${studySelections.subject}, ${studySelections.topic} konusunda bana quiz oluÃ…Å¸tur.`);
        } else {
          handleSendMessage('test oluÃ…Å¸tur');
        }
      } else if (action === 'topic') {
        openTopicChangePopup();
      } else if (action === 'normal') {
        // Normal moda geri dÃƒÂ¶n
        currentMode = 'normal';
        const botName = document.getElementById('botName');
        if (botName) botName.textContent = 'ÄŸÅ¸ÂÂ« Ata Sohbet Ã¢â‚¬â€ Normal';
        // Mode selector gÃƒÂ¼ncelle
        const modeContainer = document.getElementById('modeSelector');
        if (modeContainer) {
          modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
          const normalBtn = [...modeContainer.querySelectorAll('.mode-btn')].find(b => b.textContent.includes('Normal'));
          if (normalBtn) normalBtn.classList.add('active');
        }
        appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€™Â¬ Normal sohbet moduna geri dÃƒÂ¶nÃƒÂ¼ldÃƒÂ¼. Bana istediÃ„Å¸in her Ã…Å¸eyi sorabilirsin!'));
      }
    });
  });
}


// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// SOZLU SINAV AKSIYON BUTONLARI
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function appendOralExamButtons() {
  const chatbox = document.getElementById('chatbox');
  if (!chatbox) return;

  if (!window.oralQuestionCount) window.oralQuestionCount = 0;
  if (!window.oralMaxQuestions) window.oralMaxQuestions = 5;
  window.oralQuestionCount++;

  const remaining = window.oralMaxQuestions - window.oralQuestionCount;
  const barId = 'oral-bar-' + Date.now();

  const wrapper = document.createElement('div');
  wrapper.id = barId;
  wrapper.style.cssText = 'margin:6px 0;padding:10px 12px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

  const counterHtml = remaining > 0
    ? '<span style="font-size:.8rem;color:var(--sub);flex:1;">Soru ' + window.oralQuestionCount + ' / ' + window.oralMaxQuestions + '</span>'
    : '<span style="font-size:.8rem;color:#f59e0b;flex:1;">Son soru tamamlandi!</span>';

  const nextHtml = remaining > 0
    ? '<button class="oral-next-btn" style="padding:7px 15px;background:linear-gradient(135deg,#00d4ff,#3a7bfd);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.84rem;">Sonraki Soru Ã¢â€ â€™</button>'
    : '';

  wrapper.innerHTML = counterHtml + nextHtml + '<button class="oral-end-btn" style="padding:7px 15px;background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.3);border-radius:8px;font-weight:700;cursor:pointer;font-size:.84rem;">Ã¢ÂÂ¹ Sinavi Bitir</button>';

  chatbox.appendChild(wrapper);
  chatbox.scrollTop = chatbox.scrollHeight;

  const disableAll = () => {
    wrapper.querySelectorAll('button').forEach(b => { b.disabled = true; b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; });
  };

  const nextBtn = wrapper.querySelector('.oral-next-btn');
  const endBtn = wrapper.querySelector('.oral-end-btn');

  if (nextBtn) nextBtn.addEventListener('click', () => {
    disableAll();
    handleSendMessage('Devam et. Bir sonraki soruyu sor ve onceki cevabimi degerlendir.');
  });

  if (endBtn) endBtn.addEventListener('click', () => {
    disableAll();
    window.activeOralSession = false;
    const total = window.oralMaxQuestions;
    window.oralQuestionCount = 0;
    handleSendMessage('Sozlu sinavim tamamlandi (' + total + ' soru). Toplam performansimi degerlendir, guclu ve zayif yonlerimi belirt ve genel bir not ver.');
  });

  // Auto-end after last question (4s delay)
  if (window.oralQuestionCount >= window.oralMaxQuestions) {
    setTimeout(() => {
      if (endBtn && !endBtn.disabled) endBtn.click();
    }, 5000);
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// KONU DEÃ„ÂÃ„Â°Ã…ÂTÃ„Â°R POPUP
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function openTopicChangePopup() {
  // EÃ„Å¸er zaten aÃƒÂ§Ã„Â±ksa kapat
  const existing = document.getElementById('topicChangePopup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'topicChangePopup';
  popup.className = 'topic-popup-overlay';
  popup.innerHTML = `
    <div class="topic-popup">
      <div class="topic-popup-header">
        <span class="topic-popup-title">ÄŸÅ¸â€â‚¬ BaÃ…Å¸ka Konuya GeÃƒÂ§</span>
        <button class="topic-popup-close" id="topicPopupClose">Ã¢Å“â€¢</button>
      </div>
      <div class="topic-popup-body">
        <label class="topic-popup-label" for="topicInput">Hangi konuyu ÃƒÂ¶Ã„Å¸renmek istiyorsun?</label>
        <input 
          type="text" 
          id="topicPopupInput" 
          class="topic-popup-input" 
          placeholder="Ãƒâ€“rn: Kesirlerle Ã„Â°Ã…Å¸lemler, OsmanlÃ„Â± Tarihi, DNA..." 
          autocomplete="off"
          autofocus
        />
        <button class="topic-popup-submit" id="topicPopupSubmit">ÄŸÅ¸Å¡â‚¬ Bu Konuyu Anlat</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // Animasyon iÃƒÂ§in kÃƒÂ¼ÃƒÂ§ÃƒÂ¼k gecikme
  requestAnimationFrame(() => {
    popup.classList.add('active');
  });

  const closePopup = () => {
    popup.classList.remove('active');
    setTimeout(() => popup.remove(), 300);
  };

  // Arka plana tÃ„Â±klayÃ„Â±nca kapat
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  // Kapat butonuna tÃ„Â±klayÃ„Â±nca
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
      inputEl.placeholder = 'LÃƒÂ¼tfen bir konu yazÃ„Â±n...';
      inputEl.focus();
      return;
    }

    closePopup();

    // Ãƒâ€“NEMLÃ„Â°: Eski ders baÃ„Å¸lamÃ„Â±nÃ„Â± temizle ki AI eski konuya takÃ„Â±lmasÃ„Â±n
    studySelections.topic = '';
    studySelections.subject = '';
    studySelections.grade = null;
    studySelections.mode = '';

    // Ders modu aktif kalsÃ„Â±n, yeni konuyu gÃƒÂ¶nder
    handleSendMessage(`/ders ${topic} konusunu detaylÃ„Â±ca ve ÃƒÂ¶Ã„Å¸retici bir Ã…Å¸ekilde anlat.`);
  };

  submitBtn.addEventListener('click', doSubmit);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doSubmit();
  });

  // Otofokus
  setTimeout(() => inputEl.focus(), 100);
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// YAN MENÃƒÅ“ BUTONLARI EVENT LISTENER'LAR
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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
  const skillTreeInst = new SkillTree(document.body);
  document.getElementById('btnOpenSkillTree')?.addEventListener('click', () => {
     skillTreeInst.openTree();
     document.body.classList.remove('sidebar-collapsed');
  });

  // Quests Board Event Listener
  const questsBoardInst = new QuestsBoard(document.body);
  const questCard = document.getElementById('questCard');
  if (questCard) {
    questCard.addEventListener('click', () => {
       questsBoardInst.openBoard();
       document.body.classList.remove('sidebar-collapsed');
    });
    questCard.style.cursor = 'pointer';
    questCard.title = "GÃƒÂ¶rev Panosunu AÃƒÂ§";
    questCard.innerHTML = "ÄŸÅ¸â€œÅ“ GÃƒÂ¼nlÃƒÂ¼k GÃƒÂ¶revler Panosu<br><span style='font-size:0.8rem;color:var(--sub);font-weight:normal;'>GÃƒÂ¶revleri gÃƒÂ¶rmek iÃƒÂ§in tÃ„Â±kla</span>";
  }

  // Character Profile Event Listener
  const charProfileInst = new CharacterProfile(document.body);
  const userCard = document.getElementById('userCard');
  if (userCard) {
     userCard.addEventListener('click', () => {
        charProfileInst.openProfile();
        document.body.classList.remove('sidebar-collapsed');
     });
     userCard.style.cursor = 'pointer';
     userCard.title = "Karakter Profilini GÃƒÂ¶rÃƒÂ¼ntÃƒÂ¼le";
  }

  // Oyun Merkezi (Game Overlay)
  const btnOpenGameMenu = document.getElementById('btnOpenGameMenu');
  const gameOverlay = document.getElementById('gameOverlay');
  if (btnOpenGameMenu && gameOverlay) {
    btnOpenGameMenu.addEventListener('click', () => {
      gameOverlay.style.display = 'flex';
      renderGameMenu();
    });
  }

  // DÃƒÂ¼ello
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

  // SÃ„Â±nav GeÃƒÂ§miÃ…Å¸im
  const btnOpenExamHistory = document.getElementById('btnOpenExamHistory');
  const dashboardInst = new SuperZekaDashboard(document.body);
  if (btnOpenExamHistory) {
      btnOpenExamHistory.addEventListener('click', () => {
          dashboardInst.open();
          document.body.classList.remove('sidebar-collapsed');
      });
  }

  // SÃƒÂ¶zlÃƒÂ¼ SÃ„Â±nav
  const btnOpenVoiceExam = document.getElementById('btnOpenVoiceExam');
  if (btnOpenVoiceExam) {
     btnOpenVoiceExam.addEventListener('click', () => {
         const btnSend = document.getElementById('btnSendMessage');
         const userInput = document.getElementById('userInput');
         const btnToggleVoice = document.getElementById('btnToggleVoice');
         
         if(btnSend && userInput) {
            window.activeOralSession = true;
            window.oralQuestionCount = 0;
            window.oralMaxQuestions = 5;
            userInput.value = "SÃƒÂ¶zlÃƒÂ¼ MÃƒÂ¼lakat Modunu baÃ…Å¸lat: Bana ders konularÃ„Â±mla ilgili SADECE tek bir kÃ„Â±sa soru sor. Ben cevapla, sen de cevabÃ„Â±mÃ„Â± deÃ„Å¸erlendirip bÃƒÂ¼yuk/kÃƒÂ¼ÃƒÂ§ÃƒÂ¼k harfle 'SORU [N]' baÃ…Å¸lÃ„Â±Ã„Å¸Ã„Â± altÃ„Â±nda bir sonraki soru sor.";
            btnSend.click();
            setTimeout(() => {
               if(btnToggleVoice) btnToggleVoice.click();
            }, 1500);
         }
         document.body.classList.remove('sidebar-collapsed');
     });
  }

  // Konu Ãƒâ€¡alÃ„Â±Ã…Å¸ Wizard'Ã„Â±
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

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// Ã„Â°STATÃ„Â°STÃ„Â°K GÃƒÅ“NCELLEME
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function updateStats() {
  const msgCount = state.messages.length;
  const el = document.getElementById('stMsg');
  if (el) el.textContent = msgCount;

  // PROGRESS BAR & LEVEL SÃ„Â°STEMÃ„Â° (V17 XP AlgoritmasÃ„Â±)
  const xp = state.xp || 0;
  // Basit bir Level 1 = 1000, 2 = 2500, 3 = 5000 XP eÃ„Å¸risi
  let currentLevel = 1;
  let maxXP = 1000;
  let levelTitle = "BaÃ…Å¸langÃ„Â±ÃƒÂ§ DÃƒÂ¼zeyi";

  if (xp > 15000) { currentLevel = 5; maxXP = 30000; levelTitle = "Efsanevi Ãƒâ€“Ã„Å¸renci"; }
  else if (xp > 5000) { currentLevel = 4; maxXP = 15000; levelTitle = "Usta Ãƒâ€¡Ã„Â±rak"; }
  else if (xp > 2500) { currentLevel = 3; maxXP = 5000; levelTitle = "GeliÃ…Å¸miÃ…Å¸ Zihin"; }
  else if (xp > 1000) { currentLevel = 2; maxXP = 2500; levelTitle = "KeÃ…Å¸if Yolcusu"; }

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

  // --- V18 GAMIFICATION (LÃ„Â°DERLÃ„Â°K TABLOSU) ---
  const currentUserName = localStorage.getItem('mega_name') || "Sen";
  const lbNameSpan = document.getElementById('lbCurrentUserName');
  const lbXpSpan = document.getElementById('lbCurrentUserXp');
  if (lbNameSpan) lbNameSpan.textContent = currentUserName;
  if (lbXpSpan) lbXpSpan.textContent = `${xp} XP`;
  
  // Rozetleri ve MenÃƒÂ¼ UI'Ã„Â±nÃ„Â± gÃƒÂ¼ncelle
  if (typeof renderBadges === 'function') renderBadges();
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// Global retry iÃ…Å¸levi (Yeniden Dene butonu iÃƒÂ§in)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

// RPG UI State Subscriber
subscribe((currentState) => {

   // Update user card title
   const lvText = document.getElementById('lvText');
   if (lvText) {
      let title = "Ãƒâ€¡aylak";
      if(currentState.level >= 5) title = "Ãƒâ€“Ã„Å¸renci";
      if(currentState.level >= 10) title = "Bilgi AvcÃ„Â±sÃ„Â±";
      if(currentState.level >= 20) title = "Kahin";
      if(currentState.level >= 30) title = "Bilge";
      lvText.textContent = `Lv.${currentState.level} ${title}`;
   }
   
   // Update XP section
   const xpLevelLabel = document.getElementById('xpLevelLabel');
   const xpValueLabel = document.getElementById('xpValueLabel');
   const xpBarFill = document.getElementById('xpBarFill');
   const xpRank = document.getElementById('xpRank');
   
   if (xpLevelLabel) xpLevelLabel.textContent = `Ã¢Â­Â Lv.${currentState.level}`;
   const nextLevelXP = currentState.level * 100;
   if (xpValueLabel) xpValueLabel.textContent = `${currentState.xp}/${nextLevelXP} XP`;
   if (xpBarFill) xpBarFill.style.width = `${Math.min((currentState.xp / nextLevelXP) * 100, 100)}%`;
   if (xpRank) xpRank.textContent = `Sonraki: ${nextLevelXP} XP`;
});

// INIT FONKSÃ„Â°YONU
async function init() {
  if (lastSentMessage && !state.isLoading) {
    const chatbox = document.getElementById('chatbox');
    
    // 1. Hata mesajÃ„Â±nÃ„Â± (Bot) kaldÃ„Â±r
    if (chatbox && chatbox.lastElementChild && chatbox.lastElementChild.classList.contains('bot')) {
        chatbox.removeChild(chatbox.lastElementChild);
    }
    
    // 2. Bir ÃƒÂ¶nceki gÃƒÂ¶nderilen KullanÃ„Â±cÃ„Â± mesajÃ„Â±nÃ„Â± da DOM'dan ve state'den kaldÃ„Â±r 
    //    (ÃƒÂ§ÃƒÂ¼nkÃƒÂ¼ handleSendMessage tekrar ekleyecek)
    if (chatbox && chatbox.lastElementChild && chatbox.lastElementChild.classList.contains('user')) {
        chatbox.removeChild(chatbox.lastElementChild);
    }
    if (state.messages.length > 0 && state.messages[state.messages.length - 1].role === 'user') {
        state.messages.pop(); // Son user mesajÃ„Â±nÃ„Â± state'den ÃƒÂ§Ã„Â±kart
    }
    
    await handleSendMessage(lastSentMessage);
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// EVENT LISTENERS Ã¢â‚¬â€ TÃƒÅ“M BUTONLAR
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
function setupEventListeners() {
  const sendBtn = document.getElementById('btnSendMessage');
  const chatInput = document.getElementById('userInput');
  
  // Mesaj gÃƒÂ¶nder Ã¢â‚¬â€ input ANINDA temizle (async bekleme yok)
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (chatInput) {
        const val = chatInput.value;
        chatInput.value = '';   // Ã¢â€ Â senkron temizle, hemen boÃ…Å¸alsÃ„Â±n
        handleSendMessage(val);
      }
    });
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const val = chatInput.value;
        chatInput.value = '';   // Ã¢â€ Â senkron temizle, hemen boÃ…Å¸alsÃ„Â±n
        handleSendMessage(val);
      }
    });
  }

  // SaÃ„Å¸/Sol menÃƒÂ¼ "HÃ„Â±zlÃ„Â± Komut" (.chip[data-qcmd]) butonlarÃ„Â±
  // chatInput'a baÃ„Å¸Ã„Â±mlÃ„Â± deÃ„Å¸il Ã¢â‚¬â€ doÃ„Å¸rudan handleSendMessage ÃƒÂ§aÃ„Å¸rÃ„Â±lÃ„Â±r
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

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // Oyun Merkezi (Game Overlay) buton handler'larÃ„Â±
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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

  // SÃ„Â±navlarÃ„Â±m butonu
  const btnOpenExamHistory = document.getElementById('btnOpenExamHistory');
  if (btnOpenExamHistory) {
    btnOpenExamHistory.addEventListener('click', () => {
      const gameOverlay = document.getElementById('gameOverlay');
      if (gameOverlay) gameOverlay.style.display = 'flex';
      const gameTitle = document.getElementById('gameTitle');
      if (gameTitle) gameTitle.textContent = 'ÄŸÅ¸â€œâ€¹ SÃ„Â±navlarÃ„Â±m';
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

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // Kurallar / Ayarlar modÃƒÂ¼lÃƒÂ¼ aÃƒÂ§ma-kapama
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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

  // Profil & KiÃ…Å¸iselleÃ…Å¸tirme Kaydetme
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
         addMessage('bot', 'Ã„Â°smim gÃƒÂ¼ncellendi: ' + botInput);
      }
      
      btnSaveProfile.textContent = 'Ã¢Å“â€¦ Kaydedildi!';
      setTimeout(() => { btnSaveProfile.textContent = 'ÄŸÅ¸â€™Â¾ Bilgileri Kaydet'; }, 2000);
    });
  }

  // AydÃ„Â±nlÃ„Â±k / KaranlÃ„Â±k Tema SeÃƒÂ§imi
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

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // Ãƒâ€¡IKIÃ…Â YAP BUTONU
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnLogout = document.getElementById('btnLogoutUser');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('mega_name');
      localStorage.removeItem('selectedAvatar');
      addMessage('bot', 'Ãƒâ€¡Ã„Â±kÃ„Â±Ã…Å¸ yapÃ„Â±ldÃ„Â±.');
      appendMessage('bot', formatMessage('bot', 'Ã¢Å“â€¦ Ãƒâ€¡Ã„Â±kÃ„Â±Ã…Å¸ yapÃ„Â±ldÃ„Â±! Sayfa yenileniyor...'));
      setTimeout(() => location.reload(), 1500);
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // HAFIZAYI SIFIRLA BUTONU
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnClearMemory = document.getElementById('btnClearMemory');
  if (btnClearMemory) {
    btnClearMemory.addEventListener('click', () => {
      if (confirm('TÃƒÂ¼m sohbet geÃƒÂ§miÃ…Å¸i ve ayarlar silinecektir. Emin misiniz?')) {
        localStorage.clear();
        addMessage('bot', 'HafÃ„Â±za sÃ„Â±fÃ„Â±rlandÃ„Â±.');
        appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€”â€˜Ã¯Â¸Â TÃƒÂ¼m veriler temizlendi! Sayfa yenileniyor...'));
        setTimeout(() => location.reload(), 1500);
      }
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // SOHBETÃ„Â° Ã„Â°NDÃ„Â°R BUTONU
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnExport = document.getElementById('btnExportChat');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const msgs = state.messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
      const blob = new Blob([`Ata Ortaokulu Sohbet GeÃƒÂ§miÃ…Å¸i\n${'='.repeat(40)}\nTarih: ${new Date().toLocaleString('tr-TR')}\n\n${msgs}`], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `sohbet_gecmisi_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
      appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸â€™Â¾ Sohbet geÃƒÂ§miÃ…Å¸i indirildi!'));
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // KARNEYÃ„Â° Ã„Â°NDÃ„Â°R BUTONU
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnExportKarne = document.getElementById('btnExportKarne');
  if (btnExportKarne) {
    btnExportKarne.addEventListener('click', () => {
      const name = localStorage.getItem('mega_name') || 'Ãƒâ€“Ã„Å¸renci';
      let report = `Ata Ortaokulu Zeka ve GeliÃ…Å¸im Karnesi\n`;
      report += `========================================\n`;
      report += `Ãƒâ€“Ã„Å¸renci: ${name}\n`;
      report += `Seviye: ${state.level}\n`;
      report += `Deneyim PuanÃ„Â± (XP): ${state.xp}\n`;
      report += `Tarih: ${new Date().toLocaleString('tr-TR')}\n\n`;

      const historyStr = localStorage.getItem('mega_quiz_history');
      if (historyStr) {
        try {
          const history = JSON.parse(historyStr);
          if (history.length > 0) {
            report += `=== SÃ„Â±nav GeÃƒÂ§miÃ…Å¸i ===\n`;
            history.forEach((r, i) => {
              const dateStr = new Date(r.date).toLocaleDateString('tr-TR');
              const subject = r.subject ? `${r.grade}. SÃ„Â±nÃ„Â±f ${r.subject}` : 'Quiz';
              const topic = r.topic || 'Genel';
              report += `${i + 1}. [${dateStr}] ${subject} - ${topic}  => BaÃ…Å¸arÃ„Â±: %${r.pct} (${r.correct}/${r.total})\n`;
            });
          } else {
            report += `HenÃƒÂ¼z ÃƒÂ§ÃƒÂ¶zÃƒÂ¼lmÃƒÂ¼Ã…Å¸ bir sÃ„Â±nav bulunmuyor.\n`;
          }
        } catch (e) {
          report += `SÃ„Â±nav geÃƒÂ§miÃ…Å¸i okunamadÃ„Â±.\n`;
        }
      } else {
        report += `HenÃƒÂ¼z ÃƒÂ§ÃƒÂ¶zÃƒÂ¼lmÃƒÂ¼Ã…Å¸ bir sÃ„Â±nav bulunmuyor.\n`;
      }

      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `karnem_${new Date().toISOString().slice(0,10)}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
      appendMessage('bot', formatMessage('bot', 'ÄŸÅ¸Ââ€œ Karnen baÃ…Å¸arÃ„Â±yla indirildi! BaÃ…Å¸arÃ„Â±larÃ„Â±nÃ„Â±n devamÃ„Â±nÃ„Â± dilerim.'));
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // MOBÃ„Â°L MENÃƒÅ“ BUTONU (Unified Ã¢â‚¬â€ active + visible class)
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const btnMobileMenuRight = document.getElementById('btnMobileMenuRight');
  const btnToggleLeft = document.getElementById('btnToggleLeft');
  const btnToggleRight = document.getElementById('btnToggleRight');
  const sidebar = document.querySelector('.sidebar');
  const rightSidebar = document.querySelector('.right-sidebar');
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

  const toggleSidebarGlobal = () => {
    if (window.innerWidth <= 768 || document.body.classList.contains('device-phone')) {
      if (sidebar && sidebar.classList.contains('open')) closeMobileSidebar();
      else openMobileSidebar();
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  };

  if (btnMobileMenu) btnMobileMenu.addEventListener('click', toggleSidebarGlobal);
  if (btnToggleLeft) btnToggleLeft.addEventListener('click', toggleSidebarGlobal);

  const toggleRightSidebarGlobal = () => {
    if (window.innerWidth <= 1024 || document.body.classList.contains('device-phone') || document.body.classList.contains('device-app')) {
      if (rightSidebar.classList.contains('open')) {
         rightSidebar.classList.remove('open');
         if (backdrop) { backdrop.classList.remove('active'); backdrop.classList.remove('visible'); }
      } else {
         closeMobileSidebar();
         rightSidebar.classList.add('open');
         if (backdrop) { backdrop.classList.add('active'); backdrop.classList.add('visible'); }
      }
    } else {
      rightSidebar.classList.toggle('collapsed');
      const icon = btnToggleRight ? btnToggleRight.querySelector('i') : null;
      if (icon) {
        if(rightSidebar.classList.contains('collapsed')) {
          icon.className = "fa-solid fa-gamepad";
          icon.style.opacity = "0.5";
        } else {
          icon.className = "fa-solid fa-gamepad";
          icon.style.opacity = "1";
        }
      }
    }
  };

  if (btnToggleRight && rightSidebar) {
    btnToggleRight.addEventListener('click', toggleRightSidebarGlobal);
  }
  if (btnMobileMenuRight && rightSidebar) {
    btnMobileMenuRight.addEventListener('click', toggleRightSidebarGlobal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeMobileSidebar();
      if (rightSidebar) {
         rightSidebar.classList.remove('open');
      }
    });
  }

  // Mobilde sidebar iÃƒÂ§indeki butonlara tÃ„Â±klayÃ„Â±nca sidebar'Ã„Â± otomatik kapat
  if (sidebar) {
    sidebar.querySelectorAll('.v18-btn, .chip, .sb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setTimeout(() => closeMobileSidebar(), 200);
        }
      });
    });
  }

  if (rightSidebar) {
    rightSidebar.querySelectorAll('.v18-btn, .chip, .sb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          setTimeout(() => {
             rightSidebar.classList.remove('open');
             if (backdrop) { backdrop.classList.remove('active'); backdrop.classList.remove('visible'); }
          }, 200);
        }
      });
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // EÃ„ÂÃ„Â°TÃ„Â°M SEÃƒâ€¡Ã„Â°M SÃ„Â°HÃ„Â°RBAZI BUTONLARI
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnCloseStudyModal = document.getElementById('btnCloseStudyModal');
  const btnStartStudy = document.getElementById('btnStartStudy');
  const studyOverlay = document.getElementById('studyOverlay');

  // ÄŸÅ¸ÂÂ¯ Test SihirbazÃ„Â± butonu
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
      
      // Modu deÃ„Å¸iÃ…Å¸tir
      currentMode = mode === 'quiz' ? 'quiz' : 'ders';
      if (mode === 'quiz') window.activeQuizSession = true;
      
      // Header gÃƒÂ¼ncelle
      const botName = document.getElementById('botName');
      if (botName) botName.textContent = `ÄŸÅ¸ÂÂ« Ata Sohbet Ã¢â‚¬â€ ${mode === 'quiz' ? 'Quiz' : 'Ders'}`;
      
      // Mode selector aktif butonu gÃƒÂ¼ncelle
      const modeContainer = document.getElementById('modeSelector');
      if (modeContainer) {
        modeContainer.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        const targetBtn = [...modeContainer.querySelectorAll('.mode-btn')].find(b => b.textContent.includes(mode === 'quiz' ? 'Quiz' : 'Ders'));
        if (targetBtn) targetBtn.classList.add('active');
      }
      
      if (chatInput) {
        if (mode === 'quiz') {
          chatInput.value = `/quiz ${grade}. SÃ„Â±nÃ„Â±f ${subject}, ${topic} konusunda bana ÃƒÂ¶Ã„Å¸retici bir quiz oluÃ…Å¸tur.`;
        } else {
          chatInput.value = `/ders ${grade}. SÃ„Â±nÃ„Â±f ${subject}, ${topic} konusunu detaylÃ„Â±ca ve ÃƒÂ¶Ã„Å¸retici bir Ã…Å¸ekilde anlat.`;
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
      
      // Header gÃƒÂ¼ncelle
      const botName = document.getElementById('botName');
      if (botName) botName.textContent = `ÄŸÅ¸Â¤â€“ Ata Mentor - Rehber`;
      
      if (chatInput) {
        // Konu anlatÃ„Â±mÃ„Â± yerine sadece soruyor: "Bu konuda ne ÃƒÂ¶Ã„Å¸renmek istersin?"
        chatInput.value = `Merhaba, ${grade}. SÃ„Â±nÃ„Â±f ${subject} dersinin ${topic} konusunu ÃƒÂ§alÃ„Â±Ã…Å¸mak istiyorum. Bu konuyla ilgili hafif bir sohbetle baÃ…Å¸layalÃ„Â±m, bana doÃ„Å¸rudan uzun uzun anlatma, konuya giriÃ…Å¸ yapalÃ„Â±m.`;
        
        studyOverlay.classList.remove('active');
        setTimeout(() => studyOverlay.style.display = 'none', 300);
        
        handleSendMessage(chatInput.value);
      }
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // SES BUTONU
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  if (btnAudioToggle) {
    let audioOn = true;
    btnAudioToggle.addEventListener('click', () => {
      audioOn = !audioOn;
      btnAudioToggle.textContent = audioOn ? 'ÄŸÅ¸â€Å ' : 'ÄŸÅ¸â€â€¡';
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // KOMUT PALETÃ„Â° (Ctrl+K)
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput = document.getElementById('cmdInput');
  const cmdList = document.getElementById('cmdList');

  if (cmdOverlay && cmdInput && cmdList) {
    const commands = [
      { cmd: '/quiz', icon: 'ÄŸÅ¸â€œÅ ', desc: 'Quiz baÃ…Å¸lat' },
      { cmd: '/sinavlarim', icon: 'ÄŸÅ¸â€œâ€¹', desc: 'SÃ„Â±navlarÃ„Â±m geÃƒÂ§miÃ…Å¸i' },
      { cmd: '/ders', icon: 'ÄŸÅ¸â€œÅ¡', desc: 'Ders modu' },
      { cmd: '/oyun', icon: 'ÄŸÅ¸ÂÂ®', desc: 'Oyun merkezi' },
      { cmd: '/motivasyon', icon: 'ÄŸÅ¸Å¡â‚¬', desc: 'Motivasyon mesajÃ„Â±' },
      { cmd: '/hava Istanbul', icon: 'ÄŸÅ¸Å’Â¡Ã¯Â¸Â', desc: 'Hava durumu' },
      { cmd: '/ÃƒÂ§iz', icon: 'ÄŸÅ¸ÂÂ¨', desc: 'GÃƒÂ¶rsel oluÃ…Å¸tur' },
      { cmd: '/gÃƒÂ¶rsel', icon: 'ÄŸÅ¸â€“Â¼Ã¯Â¸Â', desc: 'GÃƒÂ¶rsel komut' },
      { cmd: '/rastgele', icon: 'ÄŸÅ¸ÂÂ²', desc: 'Rastgele konu' },
      { cmd: '/karakter', icon: 'ÄŸÅ¸ÂÂ­', desc: 'Karakter modu' },
      { cmd: 'ÃƒÂ§Ã„Â±kÃ„Â±Ã…Å¸', icon: 'ÄŸÅ¸Å¡Âª', desc: 'Ãƒâ€¡Ã„Â±kÃ„Â±Ã…Å¸ yap' },
    ];

    function renderCmdList(filter = '') {
      const filtered = filter ? commands.filter(c => c.cmd.includes(filter) || c.desc.toLowerCase().includes(filter.toLowerCase())) : commands;
      cmdList.innerHTML = filtered.map(c => `<button class="cmd-item" data-cmd="${c.cmd}">${c.icon} <b>${c.cmd}</b> Ã¢â‚¬â€ ${c.desc}</button>`).join('');
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

    // Arka plana tÃ„Â±klayÃ„Â±nca kapat
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) cmdOverlay.style.display = 'none';
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // GOOGLE GÃ„Â°RÃ„Â°Ã…Â BUTONU (Stub Ã¢â‚¬â€ Firebase aktif deÃ„Å¸il)
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnLoginGoogle = document.getElementById('btnLoginGoogle');
  if (btnLoginGoogle) {
    btnLoginGoogle.addEventListener('click', () => {
      // Firebase aktif olmadÃ„Â±Ã„Å¸Ã„Â± iÃƒÂ§in kullanÃ„Â±cÃ„Â±ya bilgi ver
      alert('ÄŸÅ¸Å’Â Google ile giriÃ…Å¸ ÃƒÂ¶zelliÃ„Å¸i Ã…Å¸u an geliÃ…Å¸tirme aÃ…Å¸amasÃ„Â±ndadÃ„Â±r. LÃƒÂ¼tfen isim yazarak veya Misafir olarak giriÃ…Å¸ yapÃ„Â±n.');
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // PDF YÃƒÂ¼kleme butonu
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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
          appendMessage('bot', formatMessage('bot', `Ã¢ÂÂ³ <b>${file.name}</b> iÃ…Å¸leniyor, lÃƒÂ¼tfen bekleyin...`));
          text = await extractTextFromPDF(file);
        } else {
          appendMessage('bot', formatMessage('bot', `Ã¢ÂÅ’ GeÃƒÂ§ersiz dosya tÃƒÂ¼rÃƒÂ¼. Sadece TXT veya PDF kabul edilir.`));
          return;
        }
        
        if (text && text.length > 0) {
          appendMessage('bot', formatMessage('bot', `ÄŸÅ¸â€œâ€ <b>${file.name}</b> dosyasÃ„Â± baÃ…Å¸arÃ„Â±yla analiz edildi (${text.length} karakter okundu). Ã…Âimdi bu dosyanÃ„Â±n iÃƒÂ§eriÃ„Å¸iyle ilgili sorular sorabilirsin!`));
          window.lastAnalyzedDocument = text.substring(0, 15000); 
        } else {
          appendMessage('bot', formatMessage('bot', `Ã¢ÂÅ’ DosyanÃ„Â±n iÃƒÂ§inden metin okunamadÃ„Â±. Resim veya taranmÃ„Â±Ã…Å¸ belge olabilir.`));
        }
      } catch (err) {
        appendMessage('bot', formatMessage('bot', `Ã¢ÂÅ’ PDF okunurken hata: ${err.message}`));
      }
      pdfInput.value = '';
    });
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // Performans Modu toggle
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // MENÃƒÅ“ BÃ„Â°LGÃ„Â° BUTONU (?) handler
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // === ANA BÃ„Â°LGÃ„Â° BUTONU (?) Ã¢â‚¬â€ Uygulama Ã„Â°ntrosu ===
  const btnMenuInfo = document.getElementById('btnMenuInfo');
  if (btnMenuInfo) {
    btnMenuInfo.addEventListener('click', () => {
      if (typeof Swal === 'undefined') return;
      Swal.fire({
        title: '',
        html: `
          <div style="text-align:center;margin-bottom:18px;">
            <div style="font-size:3.5rem;margin-bottom:8px;">ÄŸÅ¸ÂÂ«</div>
            <h2 style="margin:0;font-size:1.45rem;font-weight:800;background:linear-gradient(135deg,#00d4ff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Ata Mentor</h2>
            <p style="color:#64748b;font-size:.83rem;margin:4px 0 0;">Yapay Zeka Destekli EÃ„Å¸itim AsistanÃ„Â±</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left;margin-bottom:16px;">
            <div style="padding:10px 12px;background:rgba(244,114,182,.08);border-radius:10px;border:1px solid rgba(244,114,182,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">ÄŸÅ¸â€œÅ¡</div>
              <b style="color:#f472b6;font-size:.85rem;">Konu Ãƒâ€¡alÃ„Â±Ã…Å¸</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">Yapay zeka ile adÃ„Â±m adÃ„Â±m ders anlat, sorularÃ„Â±nÃ„Â± sor</p>
            </div>
            <div style="padding:10px 12px;background:rgba(56,189,248,.08);border-radius:10px;border:1px solid rgba(56,189,248,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">ÄŸÅ¸ÂÂ¯</div>
              <b style="color:#38bdf8;font-size:.85rem;">Test SihirbazÃ„Â±</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">LGS/Maarif formatÃ„Â±nda ÃƒÂ¶zel quiz sorularÃ„Â± ÃƒÂ§ÃƒÂ¶z</p>
            </div>
            <div style="padding:10px 12px;background:rgba(129,140,248,.08);border-radius:10px;border:1px solid rgba(129,140,248,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">ÄŸÅ¸ÂÂ¤</div>
              <b style="color:#818cf8;font-size:.85rem;">SÃƒÂ¶zlÃƒÂ¼ SÃ„Â±nav</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">5 soru, sesli cevap, otomatik deÃ„Å¸erlendirme</p>
            </div>
            <div style="padding:10px 12px;background:rgba(251,146,60,.08);border-radius:10px;border:1px solid rgba(251,146,60,.2);">
              <div style="font-size:1.3rem;margin-bottom:4px;">ÄŸÅ¸ÂÂ®</div>
              <b style="color:#fb923c;font-size:.85rem;">Oyun Merkezi</b>
              <p style="color:#94a3b8;font-size:.78rem;margin:3px 0 0;">Klavye UstasÃ„Â±, bilgi yarÃ„Â±Ã…Å¸masÃ„Â± ve daha fazlasÃ„Â±</p>
            </div>
          </div>
          <div style="padding:10px;background:rgba(0,212,255,.06);border-radius:10px;border:1px solid rgba(0,212,255,.15);text-align:center;">
            <span style="color:#00d4ff;font-size:.85rem;font-weight:700;">Ã¢Â­Â XP kazan Ã¢â€ â€™ Rozet al Ã¢â€ â€™ Yetenek AÃ„Å¸acÃ„Â±nÃ„Â± bÃƒÂ¼yÃƒÂ¼t!</span>
          </div>
        `,
        confirmButtonText: 'ÄŸÅ¸Å¡â‚¬ Hadi BaÃ…Å¸layalÃ„Â±m!',
        confirmButtonColor: '#00d4ff',
        background: '#0f172a',
        color: '#f8fafc',
        width: '520px',
        showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' }
      });
    });
  }

  // === BÃ„Â°LDÃ„Â°RÃ„Â°M ZÃ„Â°LÃ„Â° Ã¢â‚¬â€ Yenilikler Changelog ===
  const _notifBtn = document.getElementById('btnNotif');
  if (_notifBtn) {
    if (localStorage.getItem('mega_notif_read') === 'true') {
       const _wrap = _notifBtn.closest('div[style*=\"position:relative\"]') || _notifBtn.parentElement;
       const _badge = _wrap ? _wrap.querySelector('span') : null;
       if (_badge) { _badge.style.opacity = '0'; _badge.style.display = 'none'; }
    }
    _notifBtn.addEventListener('click', () => {
      // Badge gizle
      const _wrap = _notifBtn.closest('div[style*="position:relative"]') || _notifBtn.parentElement;
      const _badge = _wrap ? _wrap.querySelector('span') : null;
      if (_badge) { _badge.style.opacity = '0'; _badge.style.display = 'none'; localStorage.setItem('mega_notif_read', 'true'); }

      if (typeof Swal === 'undefined') return;
      const items = [
        { date: '16 Nisan 2026', color: '#00d4ff', title: 'Ã¢Å’Â¨Ã¯Â¸Â Klavye UstasÃ„Â± GÃƒÂ¼ncellendi',  text: 'YavaÃ…Å¸ / Orta / HÃ„Â±zlÃ„Â± seviye seÃƒÂ§imi ve bÃƒÂ¼yÃƒÂ¼tÃƒÂ¼lmÃƒÂ¼Ã…Å¸ ekran.' },
        { date: '16 Nisan 2026', color: '#38bdf8', title: 'ÄŸÅ¸ÂÂ¤ SÃƒÂ¶zlÃƒÂ¼ SÃ„Â±nav Ã„Â°yileÃ…Å¸tirmesi', text: '5 soruda bitiyor, her yanÃ„Â±tta Sonraki Soru / SÃ„Â±navÃ„Â± Bitir butonlarÃ„Â±.' },
        { date: '16 Nisan 2026', color: '#22c55e', title: 'ÄŸÅ¸â€œÅ¡ MÃƒÂ¼fredat DÃƒÂ¼zeltmesi',        text: '7. sÃ„Â±nÃ„Â±f Fen Bilimleri konularÃ„Â± dÃƒÂ¼zeltildi.' },
        { date: '15 Nisan 2026', color: '#8b5cf6', title: 'ÄŸÅ¸Å’â„¢ Tema DÃƒÂ¼zeltmesi',            text: 'Gece/GÃƒÂ¼ndÃƒÂ¼z mod ÃƒÂ§akÃ„Â±Ã…Å¸masÃ„Â± tamamen giderildi.' },
        { date: '14 Nisan 2026', color: '#f59e0b', title: 'ÄŸÅ¸Â¤â€“ AI BaÃ„Å¸lantÃ„Â±sÃ„Â± GÃƒÂ¼ÃƒÂ§lendi',    text: 'Cloudflare ÃƒÂ¶nbellekleme ile kesintiler azaldÃ„Â±.' }
      ];
      const html = '<div style="text-align:left;max-height:340px;overflow-y:auto;padding-right:6px;">' +
        items.map(it =>
          '<div style="margin-bottom:9px;padding:9px 11px;background:rgba(255,255,255,.03);border-radius:9px;border-left:3px solid ' + it.color + ';">' +
            '<div style="font-size:.7rem;color:#64748b;">' + it.date + '</div>' +
            '<b style="color:' + it.color + ';font-size:.87rem;">' + it.title + '</b>' +
            '<p style="color:#94a3b8;font-size:.82rem;margin:3px 0 0;">' + it.text + '</p>' +
          '</div>'
        ).join('') + '</div>';
      Swal.fire({
        title: 'ÄŸÅ¸â€â€ Yenilikler',
        html: html,
        confirmButtonText: 'Harika! ÄŸÅ¸â€˜Â',
        confirmButtonColor: '#00d4ff',
        background: '#0f172a',
        color: '#f8fafc',
        width: '460px'
      });
    });
  }

  const toggleLowEnd = document.getElementById('toggleLowEnd');
  const sidebarToggleLowEnd = document.getElementById('sidebarToggleLowEnd');
  
  const applyLowEnd = (isChecked) => {
    if (isChecked) {
      document.body.classList.add('lowend-mode');
      localStorage.setItem('mega_low_end', 'true');
    } else {
      document.body.classList.remove('lowend-mode');
      localStorage.removeItem('mega_low_end');
    }
    if (toggleLowEnd) toggleLowEnd.checked = isChecked;
    if (sidebarToggleLowEnd) sidebarToggleLowEnd.checked = isChecked;
  };

  const isLowEnd = document.body.classList.contains('lowend-mode') || localStorage.getItem('mega_low_end') === 'true';
  if (isLowEnd) {
    document.body.classList.add('lowend-mode');
    if (toggleLowEnd) toggleLowEnd.checked = true;
    if (sidebarToggleLowEnd) sidebarToggleLowEnd.checked = true;
  }

  if (toggleLowEnd) {
    toggleLowEnd.addEventListener('change', () => applyLowEnd(toggleLowEnd.checked));
  }
  if (sidebarToggleLowEnd) {
    sidebarToggleLowEnd.addEventListener('change', () => applyLowEnd(sidebarToggleLowEnd.checked));
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// Sesli GiriÃ…Å¸ (Web Speech API)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// Tema / Dark Mode
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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

  // KaydedilmiÃ…Å¸ temayÃ„Â± uygula
  const saved = localStorage.getItem('mega_theme');
  if (saved) {
    document.body.setAttribute('data-theme', saved);
    tbtns.forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-theme') === saved) b.classList.add('active');
    });
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// Onboarding Logic
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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
    const userNameEl = document.querySelector('.user-info h3');
    if(userNameEl) userNameEl.textContent = savedName;
    // Avatar da varsa gÃƒÂ¼ncelle
    const savedAvatar = localStorage.getItem('selectedAvatar') || 'ÄŸÅ¸Â§â€˜Ã¢â‚¬ÂÄŸÅ¸Ââ€œ';
    const avatarEl = document.querySelector('.user-avatar');
    if (avatarEl) avatarEl.textContent = savedAvatar;
    return;
  }
  
  // Otherwise, show onboarding
  if (overlay) overlay.style.display = 'flex';
  renderAvatarPicker();
  
  const finishOnboarding = (name) => {
    let historyStr = localStorage.getItem('mega_user_history') || '[]';
    // EÃ„ÂER BU YENÃ„Â° BÃ„Â°R BAÃ…ÂLANGIÃƒâ€¡ Ã„Â°SE, ESKÃ„Â° KULLANICININ KALINTI DATALARINI SIFIRLA!
    localStorage.clear();
    
    try {
        let historyArr = JSON.parse(historyStr);
        let found = false;
        if(historyArr.length > 0 && historyArr[historyArr.length-1].name === name) {
           found = true;
           historyArr[historyArr.length-1].date = new Date().toLocaleString('tr-TR');
        }
        if(!found) {
           historyArr.push({ name: name, date: new Date().toLocaleString('tr-TR') });
        }
        localStorage.setItem('mega_user_history', JSON.stringify(historyArr));
    } catch(e) {}

    const avatar = document.getElementById('selectedAvatar')?.value || 'ÄŸÅ¸â€˜Â¦';
    localStorage.setItem('mega_name', name);
    localStorage.setItem('selectedAvatar', avatar);
    localStorage.setItem('mega_xp', '0');
    localStorage.setItem('mega_level', '1');
    localStorage.setItem('bot_messages', '[]');
    
    // UygulamanÃ„Â±n tÃƒÂ¼m state ve UI'Ã„Â± temiz verilerle ayaÃ„Å¸a kaldÃ„Â±rmasÃ„Â± iÃƒÂ§in sayfayÃ„Â± tazele.
    window.location.reload();
  };
  
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const name = nameInput ? nameInput.value.trim() : 'Ãƒâ€“Ã„Å¸renci';
      finishOnboarding(name || 'Ãƒâ€“Ã„Å¸renci');
    });
  }
  
  if (btnDemo) {
    btnDemo.addEventListener('click', () => {
      finishOnboarding('Misafir');
    });
  }

  // Enter ile de baÃ…Å¸latabilsin
  if (nameInput) {
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = nameInput.value.trim() || 'Ãƒâ€“Ã„Å¸renci';
        finishOnboarding(name);
      }
    });
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// DOMINANCE MODE (PSÃ„Â°KOLOJÃ„Â°K BAÃ…ÂLANGIÃƒâ€¡)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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

  // Sinematik akÃ„Â±Ã…Å¸
  setTimeout(() => domText1.classList.add('show'), 1500); // 1.5 sn sonra
  setTimeout(() => domText2.classList.add('show'), 4000); // 2.5 sn daha
  setTimeout(() => {
     domText3.classList.add('show');
     btnStart.classList.remove('hidden');
     setTimeout(() => btnStart.classList.add('show'), 50); // fade in iÃƒÂ§in kÃ„Â±sa delay
  }, 6000);

  if (btnStart) {
    btnStart.addEventListener('click', () => {
        domPhase1.classList.add('hidden');
        domPhase2.classList.remove('hidden');

        // Daha HavalÃ„Â± (Cooler) Staggered Fade-in Efekti
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
        // Ekran karararak kalkar, ardÃ„Â±ndan asÃ„Â±l sistem aÃƒÂ§Ã„Â±lÃ„Â±r
        domOverlay.style.opacity = '0';
        setTimeout(() => {
            domOverlay.classList.add('hidden');
            initOnboarding(); // AsÃ„Â±l ATA CORE AI SihirbazÃ„Â±nÃ„Â± baÃ…Å¸lat
        }, 1000);
    });
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// Ã„Â°NTERAKTÃ„Â°F QUIZ MOTORU (Step-by-step)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function launchInteractiveQuiz(questions, meta) {
  const gameOverlay = document.getElementById('gameOverlay');
  const gameTitle = document.getElementById('gameTitle');
  const gameBody = document.getElementById('gameBody');
  if (!gameOverlay || !gameBody) return;

  gameOverlay.style.display = 'flex';
  if (gameTitle) gameTitle.textContent = `ÄŸÅ¸â€œÂ ${meta.topic || 'Quiz'}`;

  let currentQ = 0;
  let answers = []; // { qIdx, selected, correct, isCorrect }
  let answered = false;

  if (!questions || questions.length === 0) {
     gameBody.innerHTML = `
        <div style="text-align:center; padding:40px;">
           <h2 style="color:var(--err); margin-bottom:15px;">Ã¢Å¡Â Ã¯Â¸Â Soru YÃƒÂ¼klenemedi</h2>
           <p style="color:var(--sub); margin-bottom:20px;">Yapay zeka sorularÃ„Â± uygun formatta ÃƒÂ¼retemediÃ„Å¸i iÃƒÂ§in boÃ…Å¸ dÃƒÂ¶ndÃƒÂ¼. LÃƒÂ¼tfen tekrar deneyin.</p>
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

    // AI HATA Ãƒâ€“NLEYÃ„Â°CÃ„Â°: secenekler eksikse veya array olarak geldiyse toparla
    let sOpts = q.secenekler;
    if (!sOpts || typeof sOpts !== 'object') {
       // Tamamen uydurma Ã…Å¸Ã„Â±klar ÃƒÂ¼ret ki UI ÃƒÂ§ÃƒÂ¶kmesin (BoÃ…Å¸luk/DoÃ„Å¸ru-YanlÃ„Â±Ã…Å¸ hatasÃ„Â±)
       sOpts = { "A": "DoÃ„Å¸ru / Evet", "B": "YanlÃ„Â±Ã…Å¸ / HayÃ„Â±r" };
       q.secenekler = sOpts;
       if (!q.dogru_cevap) q.dogru_cevap = "A";
    } else if (Array.isArray(sOpts)) {
       // EÃ„Å¸er ["Elma", "Armut"] gibi liste dÃƒÂ¶ndÃƒÂ¼yse {"A": "Elma", "B": "Armut"} yap
       const newOpts = {};
       const letters = ['A','B','C','D','E'];
       sOpts.forEach((opt, idx) => {
          newOpts[letters[idx] || idx] = opt;
          // EÃ„Å¸er dogru_cevap "Elma" ise onu "A" yap
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
            ${currentQ < total - 1 ? 'Sonraki Soru Ã¢â€ â€™' : 'SonuÃƒÂ§larÃ„Â± GÃƒÂ¶r ÄŸÅ¸Ââ€ '}
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
          // YANLIÃ…Â CEVAP DURUMU (V15 Ãƒâ€“Ã„Å¸reten Test)
          opt.classList.add('disabled', 'wrong');
          q.failedOnce = true; // Eksik tespiti iÃƒÂ§in iÃ…Å¸aretle
          
          const fb = document.getElementById('iqFeedback');
          if (fb) {
            fb.innerHTML = `
              <div class="iq-feedback wrong-fb" style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span>Ã¢ÂÅ’ YanlÃ„Â±Ã…Å¸! Ama PES ETMEK YOK, tekrar dene! ÄŸÅ¸â€™Âª</span>
                  <button id="btnHint" style="background:var(--acc); color:#fff; border:none; border-radius:6px; padding:6px 12px; cursor:pointer; font-weight:bold;">ÄŸÅ¸â€™Â¡ Ã„Â°pucu Al</button>
                </div>
                <div id="hintBox" style="display:none; font-size:0.9em; background:rgba(139,92,246,0.15); padding:10px; border-radius:8px; border-left:4px solid #8b5cf6;"></div>
              </div>`;
            
            document.getElementById('btnHint').addEventListener('click', async () => {
              const hbox = document.getElementById('hintBox');
              hbox.style.display = 'block';
              hbox.innerHTML = '<i>ÄŸÅ¸Â§Â  Ã„Â°pucu dÃƒÂ¼Ã…Å¸ÃƒÂ¼nÃƒÂ¼lÃƒÂ¼yor...</i>';
              // HÃ„Â±zlÃ„Â± bir ipucu ÃƒÂ¼retmesi iÃƒÂ§in AI engine'e sor
              const hintPrompt = `Ãƒâ€“Ã„Å¸renci testi ÃƒÂ§ÃƒÂ¶zerken Ã…Å¸u soruyu yanlÃ„Â±Ã…Å¸ yaptÃ„Â±:\n"${q.soru}"\n\nDoÃ„Å¸ru cevap "${q.secenekler[correctKey]}". Ãƒâ€“Ã„Å¸renciye cevabÃ„Â± direkt VERMEDEN, 1-2 cÃƒÂ¼mlelik ÃƒÂ§ok kÃ„Â±sa ve yÃƒÂ¶nlendirici bir ipucu ver. Ã„Â°pucu ÃƒÂ¶Ã„Å¸retici olsun.`;
              try {
                const hintRes = await askAI(hintPrompt, "Sen bir ÃƒÂ¶Ã„Å¸retmensin, kÃ„Â±sa ipucu veriyorsun.");
                hbox.innerHTML = `ÄŸÅ¸Â§Â  <b>Ãƒâ€“Ã„Å¸retmeninin Ã„Â°pucusu:</b> ${hintRes}`;
              } catch(e) {
                hbox.innerHTML = `ÄŸÅ¸Â§Â  <b>Ã„Â°pucu:</b> Ã…ÂÃ„Â±klarÃ„Â± tekrar dikkatlice oku, cevabÃ„Â±n ÃƒÂ§ok uzaÃ„Å¸Ã„Â±nda deÃ„Å¸ilsin!`;
              }
            });
          }
        } else {
          // DOÃ„ÂRU CEVAP DURUMU
          answered = true;
          answers.push({
            qIdx: currentQ,
            selected,
            correct: correctKey,
            isCorrect: !q.failedOnce, // Ã„Â°lk seferde bilmediyse "tam doÃ„Å¸ru" saymÃ„Â±yoruz
            question: q.soru
          });

          gameBody.querySelectorAll('.iq-option').forEach(o => {
            const k = o.getAttribute('data-key');
            o.classList.add('disabled');
            if (k === selected) o.classList.add('correct');
          });

          const fb = document.getElementById('iqFeedback');
          if (fb) {
            const aciklama = q.aciklama ? `<div style="margin-top:8px;font-size:0.88em;background:rgba(34,197,94,0.12);padding:10px;border-radius:8px;border-left:4px solid #22c55e;"><b>ÄŸÅ¸â€œâ€“ AÃƒÂ§Ã„Â±klama:</b> ${q.aciklama}</div>` : '';
            fb.innerHTML = `<div class="iq-feedback correct-fb">Ã¢Å“â€¦ DoÃ„Å¸ru! Harika iÃ…Å¸ ÃƒÂ§Ã„Â±kardÃ„Â±n! ÄŸÅ¸Ââ€°${aciklama}</div>`;
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
    const correctCount = answers.filter(a => a.isCorrect).length; // YalnÃ„Â±zca ilk seferde bilinenler
    const wrongCount = total - correctCount;
    const pct = Math.round((correctCount / total) * 100);

    let emoji, title, subtitle, expLevel;
    if (pct >= 80) {
      emoji = 'ÄŸÅ¸Ââ€ '; title = 'MÃƒÂ¼thiÃ…Å¸ BaÃ…Å¸arÃ„Â±!'; subtitle = 'Konuyu ÃƒÂ§ok iyi ÃƒÂ¶Ã„Å¸renmiÃ…Å¸sin!'; expLevel = 'Ã„Â°leri';
    } else if (pct >= 60) {
      emoji = 'ÄŸÅ¸â€˜Â'; title = 'Ã„Â°yi Ã„Â°Ã…Å¸!'; subtitle = 'Biraz daha ÃƒÂ§alÃ„Â±Ã…Å¸arak mÃƒÂ¼kemmel olabilirsin.'; expLevel = 'Orta';
    } else if (pct >= 40) {
      emoji = 'ÄŸÅ¸â€™Âª'; title = 'Devam Et!'; subtitle = 'Konuyu tekrar gÃƒÂ¶zden geÃƒÂ§irmeni ÃƒÂ¶neririm.'; expLevel = 'Temel';
    } else {
      emoji = 'ÄŸÅ¸â€œÅ¡'; title = 'Daha Fazla Ãƒâ€¡alÃ„Â±Ã…Å¸malÃ„Â±sÃ„Â±n!'; subtitle = 'Sistemin sana ÃƒÂ¶zel konu anlatÃ„Â±mÃ„Â±nÃ„Â± kullanmalÃ„Â±sÃ„Â±n.'; expLevel = 'BaÃ…Å¸langÃ„Â±ÃƒÂ§';
    }

    // OyunlaÅŸtÄ±rma Ã–dÃ¼lÃ¼ DaÄŸÄ±tÄ±mÄ±
    if (correctCount > 0) {
      addXP(correctCount * 15);
      const qb = new QuestsBoard(document.body);
      qb.updateProgress('quiz_solve', correctCount);
    }


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
          %${pct} BAÃ…ÂARI <br>
          <span style="font-size:0.5em; font-weight:normal; display:block; margin-top:5px; opacity:0.9;">(${total} Soruda ${correctCount} DoÃ„Å¸ru)</span>
        </div>

        <div class="iq-detail-list" style="text-align:left; background:var(--bg); border:1px solid var(--border); padding:10px; border-radius:12px;">
          ${answers.map((a, i) => `
            <div class="iq-detail-item ${a.isCorrect ? 'correct-d' : 'wrong-d'}">
              <span class="iq-detail-icon">${a.isCorrect ? 'Ã¢Å“â€¦' : 'Ã¢ÂÅ’'}</span>
              <div class="iq-detail-text">
                <strong>Soru ${i + 1}:</strong> ${a.question}<br>
                <span style="font-size:.76rem; opacity:0.8;">Senin cevabÃ„Â±n: ${a.selected} ${a.isCorrect ? '' : 'Ã¢â€ â€™ DoÃ„Å¸rusu: ' + a.correct}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="iq-result-actions" style="margin-top:25px; display:flex; gap:10px; justify-content:center; flex-direction:column;">
          <!-- V17 SISTEM DONGUSÃƒÅ“ BUTONLARI -->
          <button class="iq-result-btn primary" id="iqAnalyzeBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #ec4899, #8b5cf6); color:white; border:none; border-bottom:3px solid #7c3aed;">
             Sadece YanlÃ„Â±Ã…Å¸ YaptÃ„Â±Ã„Å¸Ã„Â±m KonularÃ„Â± Anlat
          </button>
          
          <button class="iq-result-btn" id="iqNormalChatBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #3b82f6, #06b6d4); color:white; border:none; border-bottom:3px solid #0284c7; margin-top: 10px;">
             Normal Sohbete DÃƒÂ¶n
          </button>
          
          <div style="display:flex; gap:10px;">
             <button class="iq-result-btn secondary" id="iqHistoryBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold;flex:1;">ÄŸÅ¸â€œâ€¹ GeÃƒÂ§miÃ…Å¸</button>
             <button class="iq-result-btn secondary" id="iqCloseBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold;flex:1;">Ã¢Å“â€“ Kapat</button>
          </div>
          
          <button class="iq-result-btn primary" id="iqNewQuizBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #f59e0b, #ea580c); color:white; border:none; border-bottom:3px solid #c2410c; margin-top: 5px;">
             ÄŸÅ¸Å¡â‚¬ Yeni Test Ãƒâ€¡ÃƒÂ¶z
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

       // Hangi sorular yanlÃ„Â±Ã…Å¸ yapÃ„Â±ldÃ„Â± metnini ÃƒÂ§Ã„Â±kar
       const wrongAnswers = answers.filter(a => !a.isCorrect).map(a => a.question);
       let prompt = "";
       if (wrongAnswers.length === 0) {
          prompt = `SÃƒÂ¼per, tÃƒÂ¼m sorularÃ„Â± doÃ„Å¸ru yaptÃ„Â±m! LÃƒÂ¼tfen bana baÃ…Å¸arÃ„Â±mÃ„Â± pekiÃ…Å¸tirmek iÃƒÂ§in 1-2 farklÃ„Â± zor soru daha sor.`;
       } else {
          prompt = `Ben Ã…Å¸u konularda yanlÃ„Â±Ã…Å¸ yaptÃ„Â±m: \n${wrongAnswers.join(' \n')}\nLÃƒÂ¼tfen bildiÃ„Å¸im yerleri atla ve SADECE yanlÃ„Â±Ã…Å¸ yaptÃ„Â±Ã„Å¸Ã„Â±m bu spesifik detaylar ÃƒÂ¼zerinde bana "Neden YanlÃ„Â±Ã…Å¸ DÃƒÂ¼Ã…Å¸ÃƒÂ¼ndÃƒÂ¼Ã„Å¸ÃƒÂ¼mÃƒÂ¼" gÃƒÂ¶steren bir mini 5 dakikalÃ„Â±k tekrar planÃ„Â± oluÃ…Å¸tur.`;
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
      if (botName) botName.textContent = 'ÄŸÅ¸Â¤â€“ Ata Sohbet - Normal';
      const input = document.getElementById('userInput');
      if (input) {
         input.value = "Testi bitirdim, normal sohbete dÃƒÂ¶ndÃƒÂ¼m.";
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
      if (gameTitle) gameTitle.textContent = 'ÄŸÅ¸â€œâ€¹ SÃ„Â±navlarÃ„Â±m';
      renderExamHistory();
    });
  }

  renderQuestion();
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// SINAV GEÃƒâ€¡MÃ„Â°Ã…ÂÃ„Â° Ã¢â‚¬â€ LocalStorage KayÃ„Â±t/Okuma
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function saveQuizResult(result) {
  // Speed mode check
  if (window.activeSpeedMode && result && result.correct > 0) {
     window.speedScore += result.correct;
     const sc = document.getElementById('speedScoreNum');
     if(sc) sc.innerText = window.speedScore;
  }
  
  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
  history.unshift(result); // En yeni en baÃ…Å¸ta
  // Maksimum 50 kayÃ„Â±t tut
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

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// VELÃ„Â° / Ãƒâ€“Ã„ÂRETMEN RAPORLAMA PANELÃ„Â°
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function renderReportPanel() {
  const overlay = document.getElementById('reportOverlay');
  if (!overlay) return;

  const history = getQuizHistory();
  
  // ÃƒÅ“st Panel Verileri
  document.getElementById('repTotalXp').textContent = state.xp;
  document.getElementById('repLevelTitle').textContent = `Lv.${state.level}`;
  document.getElementById('repStreak').textContent = `${StorageManager.get(StorageManager.keys.STREAK_DAYS) || 0} ÄŸÅ¸â€Â¥`;
  document.getElementById('repTotalQ').textContent = history.length;

  // Ders BazlÃ„Â± Hesaplama (Reduce)
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
      repSubjectGrid.innerHTML = '<div style="color:var(--sub); font-size:0.9rem;">HenÃƒÂ¼z ÃƒÂ§ÃƒÂ¶zÃƒÂ¼lmÃƒÂ¼Ã…Å¸ test bulunmuyor.</div>';
  } else {
      for (const [subj, data] of Object.entries(stats)) {
         let accuracy = Math.round((data.correct / data.total) * 100) || 0;
         
         if (accuracy < worstAccuracy && data.exams >= 1) {
             worstAccuracy = accuracy;
             worstSubject = subj;
         }

         // Renk algosu
         let color = '#22c55e'; // yeÃ…Å¸il
         if (accuracy < 50) color = '#ef4444'; // kÃ„Â±rmÃ„Â±zÃ„Â±
         else if (accuracy < 75) color = '#fbbf24'; // sarÃ„Â±

         repSubjectGrid.innerHTML += `
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:15px; display:flex; flex-direction:column; gap:8px;">
               <div style="font-weight:700; color:var(--txt); font-size:1.1rem;">${subj}</div>
               <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--sub);">
                  <span>${data.exams} SÃ„Â±nav</span>
                  <span style="color:${color}; font-weight:800;">%${accuracy} BaÃ…Å¸arÃ„Â±</span>
               </div>
               <div style="width:100%; height:8px; background:rgba(0,0,0,0.3); border-radius:4px; overflow:hidden;">
                  <div style="height:100%; width:${accuracy}%; background:${color}; border-radius:4px;"></div>
               </div>
               <div style="font-size:0.8rem; color:var(--sub); display:flex; justify-content:space-between;">
                  <span>Ã¢Å“â€¦ ${data.correct} D</span>
                  <span>Ã¢ÂÅ’ ${data.wrong} Y</span>
               </div>
            </div>
         `;
      }
  }

  // RÃƒÂ¶ntgen (AI Advice)
  const repAiAdvice = document.getElementById('repAiAdvice');
  if (worstSubject) {
      repAiAdvice.innerHTML = `Ãƒâ€“Ã„Å¸renci ÃƒÂ¶zellikle <strong>${worstSubject}</strong> alanÃ„Â±nda <strong>%${worstAccuracy}</strong> gibi dÃƒÂ¼Ã…Å¸ÃƒÂ¼k bir baÃ…Å¸arÃ„Â± yÃƒÂ¼zdesine sahip. Ata Ãƒâ€“Ã„Å¸retmen sisteminin yÃƒÂ¶nlendirmelerine uyarak bu derse aÃ„Å¸Ã„Â±rlÃ„Â±k verilmesi ve quiz dÃƒÂ¶ngÃƒÂ¼lerinde ${worstSubject} telafi testlerinin seÃƒÂ§ilmesi Ã…Å¸iddetle tavsiye edilir.`;
  } else {
      repAiAdvice.innerHTML = "Ãƒâ€“Ã„Å¸renci henÃƒÂ¼z yeterli sÃ„Â±nava girmediÃ„Å¸i iÃƒÂ§in kapsamlÃ„Â± bir zafiyet tespiti yapÃ„Â±lamadÃ„Â±.";
  }

  // GÃƒÂ¶ster
  overlay.style.display = 'flex';
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// SINAVLARIM Ã¢â‚¬â€ GeÃƒÂ§miÃ…Å¸ SÃ„Â±nav SonuÃƒÂ§larÃ„Â± UI
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â

function renderExamHistory() {
  const gameBody = document.getElementById('gameBody');
  if (!gameBody) return;

  const history = getQuizHistory();

  if (history.length === 0) {
    gameBody.innerHTML = `
      <div class="iq-history">
        <div class="iq-history-title">ÄŸÅ¸â€œâ€¹ SÃ„Â±navlarÃ„Â±m</div>
        <div class="iq-history-empty">
          <div class="iq-history-empty-icon">ÄŸÅ¸â€œÂ</div>
          <div class="iq-history-empty-text">HenÃƒÂ¼z hiÃƒÂ§ sÃ„Â±nav sonucunuz yok.<br>Quiz ÃƒÂ§ÃƒÂ¶zerek buraya kayÃ„Â±t ekleyin!</div>
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
      <div class="iq-history-title">ÄŸÅ¸â€œâ€¹ SÃ„Â±navlarÃ„Â±m <span style="font-size:.72rem;color:var(--sub);font-weight:400;">(${totalExams} sÃ„Â±nav)</span></div>

      <div class="iq-history-summary">
        <div class="iq-history-stat">
          <div class="iq-history-stat-val">${totalExams}</div>
          <div class="iq-history-stat-lbl">Toplam SÃ„Â±nav</div>
        </div>
        <div class="iq-history-stat">
          <div class="iq-history-stat-val">%${avgPct}</div>
          <div class="iq-history-stat-lbl">Ort. BaÃ…Å¸arÃ„Â±</div>
        </div>
        <div class="iq-history-stat">
          <div class="iq-history-stat-val">${totalCorrect}</div>
          <div class="iq-history-stat-lbl">Toplam DoÃ„Å¸ru</div>
        </div>
      </div>

      <div class="iq-history-list">
        ${history.map((r, i) => {
          const scoreClass = r.pct >= 70 ? 'high' : r.pct >= 40 ? 'mid' : 'low';
          const dateStr = new Date(r.date).toLocaleDateString('tr-TR', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });
          const label = r.grade ? `${r.grade}. SÃ„Â±nÃ„Â±f ${r.subject}` : (r.subject || 'Quiz');
          return `
            <div class="iq-history-card" data-idx="${i}">
              <div class="iq-history-score ${scoreClass}">%${r.pct}</div>
              <div class="iq-history-info">
                <div class="iq-history-subject">${label}</div>
                <div class="iq-history-meta">
                  <span>ÄŸÅ¸â€œâ€“ ${r.topic || '-'}</span>
                  <span>Ã¢Å“â€¦ ${r.correct}/${r.total}</span>
                  <span>ÄŸÅ¸â€œâ€¦ ${dateStr}</span>
                </div>
              </div>
              <button class="iq-history-delete" data-del="${i}" title="Sil">ÄŸÅ¸â€”â€˜</button>
            </div>
          `;
        }).join('')}
      </div>

      <div style="text-align:center;margin-top:16px;">
        <button class="iq-history-clear" id="iqClearAll">ÄŸÅ¸â€”â€˜ TÃƒÂ¼m GeÃƒÂ§miÃ…Å¸i Temizle</button>
      </div>
    </div>
  `;

  addBackButton(gameBody);

  // Delete individual
  gameBody.querySelectorAll('.iq-history-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-del'));
      if (confirm('Bu sÃ„Â±nav kaydÃ„Â±nÃ„Â± silmek istediÃ„Å¸inize emin misiniz?')) {
        deleteQuizResult(idx);
        renderExamHistory();
      }
    });
  });

  // Clear all
  const clearBtn = document.getElementById('iqClearAll');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('TÃƒÂ¼m sÃ„Â±nav geÃƒÂ§miÃ…Å¸iniz silinecektir. Emin misiniz?')) {
        clearQuizHistory();
        renderExamHistory();
      }
    });
  }
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// HIZ MODU (60s SPEED QUIZ)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
window.startSpeedMode = function() {
  window.activeSpeedMode = true;
  window.speedScore = 0;
  window.speedTime = 60;
  
  if (typeof window._handleSendMessage === 'function') { 
      window._handleSendMessage("KÃ„Â±sa ve ÃƒÂ§ok net 4 Ã…Å¸Ã„Â±klÃ„Â± sorular sor. Sadece sorularÃ„Â± ver. HÃ„Â±z moduna (60 saniye) baÃ…Å¸ladÃ„Â±k!"); 
  }
  
  const existing = document.getElementById('speedTimerOverlay');
  if(existing) existing.remove();
  
  const timerHtml = `
    <div id="speedTimerOverlay" style="position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.95); border:2px solid #eab308; border-radius:30px; padding:15px 30px; z-index:999999; box-shadow:0 10px 30px rgba(234,179,8,0.3); display:flex; gap:20px; align-items:center;">
       <div style="font-size:2rem; font-weight:900; color:#eab308;" id="speedTimeNum">Ã¢ÂÂ±Ã¯Â¸Â 60</div>
       <div style="width:2px; height:30px; background:var(--bdr);"></div>
       <div style="font-size:1.5rem; font-weight:bold; color:var(--txt);">Skor: <span id="speedScoreNum" style="color:#22c55e;">0</span></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', timerHtml);
  
  window.speedInterval = setInterval(() => {
     window.speedTime--;
     const tb = document.getElementById('speedTimeNum');
     if(tb) {
         tb.innerText = "Ã¢ÂÂ±Ã¯Â¸Â " + window.speedTime;
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
      <h1 style="color:#eab308; font-size:4rem; margin-bottom:10px; animation:bounceIn 0.5s;">SÃƒÅ“RE BÃ„Â°TTÃ„Â°! Ã¢ÂÂ±Ã¯Â¸Â</h1>
      <div style="background:var(--bg2); padding:30px; border-radius:20px; text-align:center; border:2px solid var(--acc); min-width:300px;">
         <div style="font-size:1.5rem; color:var(--sub); margin-bottom:10px;">Toplam DoÃ„Å¸ru</div>
         <div style="font-size:4rem; font-weight:900; color:#22c55e;">${window.speedScore}</div>
         <div style="margin-top:20px; color:var(--acc); font-weight:bold;">+${bonusXp} XP KazanÃ„Â±ldÃ„Â±!</div>
      </div>
      <button class="onboard-btn ext-style-2" style="margin-top:20px;" onclick="this.parentElement.remove()">Kapat</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', finishHtml);
  if(window.triggerConfetti) window.triggerConfetti();
  
  const event = new CustomEvent('mega_xp_updated');
  document.dispatchEvent(event);
};

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// SINAV TÃ„Â°PÃ„Â° SEÃƒâ€¡Ã„Â°M MENÃƒÅ“SÃƒÅ“ (Global)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
window._openExamTypeMenu = function() {
  let existing = document.getElementById('examTypeOverlay');
  if (existing) { existing.style.display = 'flex'; existing.style.opacity = '1'; existing.style.pointerEvents = 'auto'; return; }
  const overlay = document.createElement('div');
  overlay.id = 'examTypeOverlay';
  overlay.className = 'exam-type-overlay';
  overlay.innerHTML = `
    <div class="exam-type-modal">
      <div class="exam-type-header">
        <h2>ÄŸÅ¸â€œÂ SÃ„Â±nav Yap Ã¢â‚¬â€ Soru Tipi SeÃƒÂ§</h2>
        <button class="exam-type-close" id="btnCloseExamType">Ã¢Å“â€¢</button>
      </div>
      <div class="exam-type-desc">OluÃ…Å¸turmak istediÃ„Å¸in soru tipini seÃƒÂ§:</div>
      <div class="exam-type-section">
        <div class="exam-type-section-title">ÄŸÅ¸â€œâ€¹ Soru FormatlarÃ„Â±</div>
        <div class="exam-type-grid">
          <button class="exam-type-btn" data-prompt="Ãƒâ€¡oktan seÃƒÂ§meli (A-B-C-D) test sorularÃ„Â± oluÃ…Å¸tur. Her sorunun 4 Ã…Å¸Ã„Â±kkÃ„Â± ve doÃ„Å¸ru cevabÃ„Â± olsun."><span class="etb-icon">ÄŸÅ¸â€Ëœ</span><span class="etb-text">Ãƒâ€¡oktan SeÃƒÂ§meli</span></button>
          <button class="exam-type-btn" data-prompt="BoÃ…Å¸luk doldurmalÃ„Â± sorular ÃƒÂ¼ret. CÃƒÂ¼mlelerde ÃƒÂ¶nemli kavramlarÃ„Â± boÃ…Å¸luk bÃ„Â±rak, ÃƒÂ¶Ã„Å¸renci doÃ„Å¸ru kelimeyi yazsÃ„Â±n."><span class="etb-icon">ÄŸÅ¸â€œÂ</span><span class="etb-text">BoÃ…Å¸luk Doldurma</span></button>
          <button class="exam-type-btn" data-prompt="DoÃ„Å¸ru-YanlÃ„Â±Ã…Å¸ sorularÃ„Â± hazÃ„Â±rla. Her ifadenin doÃ„Å¸ru mu yanlÃ„Â±Ã…Å¸ mÃ„Â± olduÃ„Å¸unu belirt ve aÃƒÂ§Ã„Â±klamasÃ„Â±nÃ„Â± yap."><span class="etb-icon">Ã¢Å“â€¦</span><span class="etb-text">DoÃ„Å¸ru / YanlÃ„Â±Ã…Å¸</span></button>
          <button class="exam-type-btn" data-prompt="AÃƒÂ§Ã„Â±k uÃƒÂ§lu sorular sor. Ãƒâ€“Ã„Å¸rencinin kendi cÃƒÂ¼mleleriyle cevaplayacaÃ„Å¸Ã„Â±, dÃƒÂ¼Ã…Å¸ÃƒÂ¼ndÃƒÂ¼ren ve yorumlama gerektiren sorular hazÃ„Â±rla."><span class="etb-icon">ÄŸÅ¸â€™Â­</span><span class="etb-text">AÃƒÂ§Ã„Â±k UÃƒÂ§lu</span></button>
          <button class="exam-type-btn" data-prompt="EÃ…Å¸leÃ…Å¸tirme sorularÃ„Â± ÃƒÂ¼ret. Bir sÃƒÂ¼tunda kavramlar, diÃ„Å¸er sÃƒÂ¼tunda tanÃ„Â±mlar olsun, ÃƒÂ¶Ã„Å¸renci eÃ…Å¸leÃ…Å¸tirsin."><span class="etb-icon">ÄŸÅ¸â€â€”</span><span class="etb-text">EÃ…Å¸leÃ…Å¸tirme</span></button>
          <button class="exam-type-btn" data-prompt="KÃ„Â±sa cevaplÃ„Â± sorular hazÃ„Â±rla. Ãƒâ€“Ã„Å¸rencinin 1-2 kelime veya kÃ„Â±sa bir cÃƒÂ¼mle ile cevaplayacaÃ„Å¸Ã„Â± sorular olsun."><span class="etb-icon">Ã¢Å“ÂÃ¯Â¸Â</span><span class="etb-text">KÃ„Â±sa CevaplÃ„Â±</span></button>
          <button class="exam-type-btn" data-prompt="Klasik (yazÃ„Â±lÃ„Â± sÃ„Â±nav) sorularÃ„Â± oluÃ…Å¸tur. Paragraf cevap gerektiren, bilgi seviyesini ÃƒÂ¶lÃƒÂ§en detaylÃ„Â± sorular hazÃ„Â±rla."><span class="etb-icon">ÄŸÅ¸â€œâ€</span><span class="etb-text">Klasik Soru</span></button>
        </div>
      </div>
      <div class="exam-type-section">
        <div class="exam-type-section-title">ÄŸÅ¸ÂÂ¯ SÃ„Â±nava HazÃ„Â±rlÃ„Â±k</div>
        <div class="exam-type-grid">
          <button class="exam-type-btn prep" data-prompt="TÃƒÂ¼rkiye YÃƒÂ¼zyÃ„Â±lÃ„Â± Maarif Modeli mÃƒÂ¼fredatÃ„Â±na uygun, kazanÃ„Â±m odaklÃ„Â± sorular hazÃ„Â±rla. ÃƒÅ“st dÃƒÂ¼zey dÃƒÂ¼Ã…Å¸ÃƒÂ¼nme becerileri ÃƒÂ¶lÃƒÂ§en sorular olsun."><span class="etb-icon">ÄŸÅ¸ÂÂ«</span><span class="etb-text">Maarif Modeli</span></button>
          <button class="exam-type-btn prep" data-prompt="LGS tarzÃ„Â± sorular oluÃ…Å¸tur. Paragraf tabanlÃ„Â±, muhakeme ve yorum gerektiren, ÃƒÂ§oktan seÃƒÂ§meli 4 Ã…Å¸Ã„Â±klÃ„Â± sorular hazÃ„Â±rla."><span class="etb-icon">ÄŸÅ¸Ââ€œ</span><span class="etb-text">LGS HazÃ„Â±rlÃ„Â±k</span></button>
          <button class="exam-type-btn prep" data-prompt="YKS/Ãƒâ€“SS tarzÃ„Â± ÃƒÂ¼niversite sÃ„Â±navÃ„Â± sorularÃ„Â± oluÃ…Å¸tur. Analitik dÃƒÂ¼Ã…Å¸ÃƒÂ¼nme ve problem ÃƒÂ§ÃƒÂ¶zme ÃƒÂ¶lÃƒÂ§en sorular hazÃ„Â±rla."><span class="etb-icon">ÄŸÅ¸Ââ€ </span><span class="etb-text">YKS/Ãƒâ€“SS HazÃ„Â±rlÃ„Â±k</span></button>
        </div>
      </div>
      <div class="exam-type-section">
        <div class="exam-type-section-title">Ã¢ÂÂ±Ã¯Â¸Â HÃ„Â±zlÃ„Â± ve SÃ„Â±nÃ„Â±rlÃ„Â±</div>
        <div class="exam-type-grid">
          <button class="exam-type-btn" style="border-color:#eab308; background:rgba(234,179,8,0.1);" data-prompt="/speedquiz" id="btnSpeedQuiz"><span class="etb-icon">Ã¢Å¡Â¡</span><span class="etb-text">HÃ„Â±z Modu (60s)</span></button>
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
         // HIZ MODU BAÃ…ÂLAT
         if (typeof window.startSpeedMode === 'function') {
            window.startSpeedMode();
         } else {
            if (typeof window._handleSendMessage === 'function') { window._handleSendMessage("Bana arka arkaya hÃ„Â±zlÃ„Â± cevaplayabileceÃ„Å¸im ÃƒÂ§oktan seÃƒÂ§meli karÃ„Â±Ã…Å¸Ã„Â±k sorular sor. HÃ„Â±z modu baÃ…Å¸ladÃ„Â±!"); }
         }
      } else {
         if (typeof window._handleSendMessage === 'function') { window._handleSendMessage(prompt); }
      }
    });
  });
  requestAnimationFrame(() => { overlay.style.display = 'flex'; requestAnimationFrame(() => { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto'; }); });
};

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// V17 SÃ„Â°STEM MÃ„Â°MARÃ„Â°SÃ„Â° (AÃ…ÂAMALI ONBOARDING)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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
  
  // EÃ„Å¸er bu oturumda zaten gÃƒÂ¶sterildiyse bir daha gÃƒÂ¶sterme (Ana sayfa logosuna tÃ„Â±klandÃ„Â±Ã„Å¸Ã„Â±nda sÃƒÂ¼rekli ÃƒÂ§Ã„Â±kmasÃ„Â±nÃ„Â± engeller)
  const isMemOverlayShownBefore = sessionStorage.getItem('memOverlayShown');

  if (latestFailedSubject && memOverlay && !isMemOverlayShownBefore) {
     sessionStorage.setItem('memOverlayShown', 'true');
     s1.classList.add('hidden');
     memOverlay.classList.remove('hidden');
     const uName = localStorage.getItem('mega_name') || "Ã…Âampiyon";
     const memNameSpan = document.getElementById('memUserName');
     const memSubjSpan = document.getElementById('memSubjectName');
     if (memNameSpan) memNameSpan.textContent = uName;
     if (memSubjSpan) memSubjSpan.textContent = latestFailedSubject;

     // Evet, EksiÃ„Å¸imi Kapat
     document.getElementById('btnMemYes')?.addEventListener('click', () => {
         memOverlay.classList.add('hidden');
         document.body.classList.remove('ui-locked');
         const gradeStr = (latestFailedGrade === 'lise' || latestFailedGrade === 'genel') ? "Lise" : `${latestFailedGrade}. SÃ„Â±nÃ„Â±f`;
         
         // ZayÃ„Â±f konu hafÃ„Â±zasÃ„Â±ndan quiz gÃƒÂ¶nderilirken sistemi o derse odakla (Hata vermemesi iÃƒÂ§in)
         if(typeof studySelections !== 'undefined') {
            studySelections.grade = latestFailedGrade;
            studySelections.subject = latestFailedSubject;
            studySelections.topic = 'Eksik Telafisi';
         }

         const input = document.getElementById('userInput');
         input.value = `Selam! DÃƒÂ¼nkÃƒÂ¼ denememde ${gradeStr} ${latestFailedSubject} dersinde bazÃ„Â± eksiklerim olduÃ„Å¸unu fark ettim. LÃƒÂ¼tfen bana DOÃ„ÂRUDAN TEST YAPMA. Ãƒâ€“nce bana bu konudaki eksiklerimi kapatacak ÃƒÂ¶nemli pÃƒÂ¼f noktalarÃ„Â±nÃ„Â±, taktikleri ve konu ÃƒÂ¶zetini anlat. AnlatÃ„Â±mÃ„Â±nÃ„Â± mutlaka geÃƒÂ§miÃ…Å¸ yÃ„Â±llarda ÃƒÂ§Ã„Â±kmÃ„Â±Ã…Å¸ LGS veya YKS (Ãƒâ€“SS) benzeri ÃƒÂ§Ã„Â±kmÃ„Â±Ã…Å¸ ÃƒÂ¶rnek sorular ve bunlarÃ„Â±n tek tek ÃƒÂ§ÃƒÂ¶zÃƒÂ¼mÃƒÂ¼ ile destekle ki hafÃ„Â±zama kazÃ„Â±nsÃ„Â±n.`;
         document.getElementById('btnSendMessage').click();
     });

     // HayÃ„Â±r, Yeni Konu SeÃƒÂ§
     document.getElementById('btnMemNo')?.addEventListener('click', () => {
         memOverlay.classList.add('hidden');
         s1.classList.remove('hidden');
     });
  }

  // AdÃ„Â±m 1 -> 2
  btn1.addEventListener('click', () => {
    s1.classList.add('hidden');
    s2.classList.remove('hidden');
  });

  // AdÃ„Â±m 2 (SÃ„Â±nÃ„Â±f) -> Enable btn2
  gradeSel.addEventListener('change', () => {
    if (gradeSel.value) btn2.disabled = false;
  });

  // AdÃ„Â±m 2 -> 3
  btn2.addEventListener('click', () => {
    s2.classList.add('hidden');
    s3.classList.remove('hidden');
    
    // SÃ„Â±nÃ„Â±f seÃƒÂ§imine gÃƒÂ¶re ZayÃ„Â±f Ders dropdownunu doldur (AdÃ„Â±m 4 iÃƒÂ§in hazÃ„Â±rlÃ„Â±k)
    const g = gradeSel.value;
    weakSubjSel.innerHTML = '<option value="" disabled selected>ZorlandÃ„Â±Ã„Å¸Ã„Â±n Dersi SeÃƒÂ§</option>';
    let subjects = [];
    if(g && curriculumData[g]) {
       subjects = Object.keys(curriculumData[g]);
    } else if (g === 'lise' || g === 'genel') {
       subjects = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Edebiyat", "Tarih", "CoÃ„Å¸rafya", "Din KÃƒÂ¼ltÃƒÂ¼rÃƒÂ¼ ve Ahlak Bilgisi", "Ã„Â°ngilizce", "Felsefe", "Beden EÃ„Å¸itimi ve Spor", "BiliÃ…Å¸im Teknolojileri ve YazÃ„Â±lÃ„Â±m", "GÃƒÂ¶rsel Sanatlar", "T.C. Ã„Â°nkÃ„Â±lap Tarihi ve AtatÃƒÂ¼rkÃƒÂ§ÃƒÂ¼lÃƒÂ¼k"];
    } else {
       subjects = ["Matematik", "Fen Bilimleri", "TÃƒÂ¼rkÃƒÂ§e"]; // Fallback
    }
    
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      weakSubjSel.appendChild(opt);
    });
  });

  // AdÃ„Â±m 3 (Hedef) -> Enable btn3
  goalSel.addEventListener('change', () => {
    if (goalSel.value) btn3.disabled = false;
  });

  // AdÃ„Â±m 3 -> 4
  btn3.addEventListener('click', () => {
    s3.classList.add('hidden');
    s4.classList.remove('hidden');
  });

  // AdÃ„Â±m 4 (Ders) -> Enable btn4
  weakSubjSel.addEventListener('change', () => {
    if (weakSubjSel.value) btn4.disabled = false;
  });

  // AdÃ„Â±m 4 -> 5 (Sistemi Kur)
  btn4.addEventListener('click', () => {
    s4.classList.add('hidden');
    s5.classList.remove('hidden');
    
    const g = gradeSel.value;
    const gradeStr = (g === 'lise' || g === 'genel') ? "Lise" : `${g}. SÃ„Â±nÃ„Â±f`;
    const target = goalSel.options[goalSel.selectedIndex].text;
    const weakS = weakSubjSel.value;
    
    chosenSubjText.textContent = `${gradeStr} ${weakS} (${target})`;

    // Global state kaydedici (Merkezi AI belleÃ„Å¸ine iÃ…Å¸lendi)
    studySelections.grade = g;
    studySelections.subject = weakS;
    studySelections.topic = 'Genel';
    studySelections.goal = target;
    window.studySelections = studySelections; // Her ihtimale karÃ…Å¸Ã„Â± global yansÃ„Â±ma
  });

  // AdÃ„Â±m 5 -> Analizi BaÃ…Å¸lat
  btnFinal.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.classList.remove('ui-locked');
    const g = studySelections.grade;
    const s = studySelections.subject;
    const target = studySelections.goal;
    const gradeStr = (g === 'lise' || g === 'genel') ? "Lise" : `${g}. SÃ„Â±nÃ„Â±f`;

    const input = document.getElementById('userInput');
    input.value = `Merhaba! Ben ${gradeStr} ÃƒÂ¶Ã„Å¸rencisiyim. Hedefim: ${target}. LÃƒÂ¼tfen bana ${s} dersinin mÃƒÂ¼fredatÃ„Â±ndaki ana konularÃ„Â± listele ve ardÃ„Â±ndan beklemeden VAKÃ„Â°T KAYBETMEDEN Ã„Â°LK konuyu (ÃƒÂ§ok uzun olmayacak Ã…Å¸ekilde, sÃ„Â±kmadan) anlatmaya baÃ…Å¸la. AnlatÃ„Â±mdan sonra ben 'devam et' dersem bir sonraki konuya geÃƒÂ§ersin. Ã„Â°stersem daha sonra sana 'test yap' diyebilirim ama Ã…Å¸u an test Ã„Â°STEMÃ„Â°YORUM, lÃƒÂ¼tfen bana konuyu ÃƒÂ¶Ã„Å¸ret.`;
    document.getElementById('btnSendMessage').click();
  });
}

// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// UYGULAMA BAÃ…ÂLATICI (BOOTSTRAPPER)
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
document.addEventListener('DOMContentLoaded', async () => {
  // 1. IndexedDB BaÃ…Å¸lat BaÃ„Å¸lantÃ„Â± Kurulumu
  try {
     await initDB();
     console.log("IndexedDB BaÃ…Å¸arÃ„Â±yla BaÃ…Å¸latÃ„Â±ldÃ„Â±.");

   } catch(e) {
     console.error("DB BaÃ…Å¸latma hatasÃ„Â±", e);
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
  
  // Sidebar bileÃ…Å¸enlerini render et
  renderTicker();
  renderBadges();
  renderDailyQuests();
  renderDailyFact();

  const sidebarLowEnd = document.getElementById('sidebarToggleLowEnd');
  if (sidebarLowEnd) {
     const isLowEnd = localStorage.getItem('mega_low_end') === 'true';
     sidebarLowEnd.checked = isLowEnd;
     if(isLowEnd) document.body.classList.add('lowend-mode');
     
     sidebarLowEnd.addEventListener('change', (e) => {
        if (e.target.checked) {
           document.body.classList.add('lowend-mode');
           localStorage.setItem('mega_low_end', 'true');
        } else {
           document.body.classList.remove('lowend-mode');
           localStorage.setItem('mega_low_end', 'false');
        }
     });
  }

  // YÃƒÂ¶nlendirici (Welcome) Dashboard Ekleme 
  setTimeout(() => {
     const chatbox = document.getElementById('chatbox');
     const savedNm = localStorage.getItem('mega_name');
     // Chatbox boÃ…Å¸sa veya sadece gizli typing-indicator varsa dashboard'u gÃƒÂ¶ster!
     const messageElements = chatbox ? chatbox.querySelectorAll('.msg-bot, .msg-user') : [];
     if (savedNm && chatbox && messageElements.length === 0) {
        const userName = savedNm || 'Ãƒâ€“Ã„Å¸renci';
        const dHtml = `
          <div class="welcome-dash-v2">
            <!-- Modern Accent BaÃ…Å¸lÃ„Â±k -->
            <h2 class="dash-hero-title" style="background: linear-gradient(135deg, var(--acc), var(--acc2)); -webkit-background-clip: text; color: transparent; font-weight: 800; letter-spacing: -0.5px;">
              BugÃƒÂ¼n ne ÃƒÂ¶Ã„Å¸reneceksin?
            </h2>
            
            <!-- GeniÃ…Å¸ Arama Ãƒâ€¡ubuÃ„Å¸u -->
            <div class="dash-search-wrapper" style="width: 100%; max-width: 600px; margin: 0 auto;">
              <div class="dash-search-box" style="display: flex; align-items: center; background: rgba(255,255,255,0.06); border: 2px solid var(--bdr); border-radius: 99px; padding: 4px 6px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
                <span class="dash-search-icon" style="margin-left: 12px; color: var(--sub);"><i class="fa-solid fa-magnifying-glass"></i></span>
                <input type="text" id="dashSearchInput" class="dash-search-input" placeholder="Ãƒâ€“rn: Ã„Â°ngilizce zamanlar, HÃƒÂ¼crenin yapÃ„Â±sÃ„Â±..." autocomplete="off" style="flex: 1; min-width: 0; background: transparent; border: none; outline: none; color: var(--txt); padding: 12px; font-size: 1rem; opacity: 0.85;">
                <button class="dash-search-btn" id="dashSearchBtn" title="Ara" style="background: linear-gradient(135deg, var(--acc), var(--acc2)); border: none; height: 42px; width: 42px; border-radius: 50%; color: #fff; cursor: pointer; transition: 0.2s;"><i class="fa-solid fa-arrow-up"></i></button>
              </div>
            <!-- Dashboard Alt KÃ„Â±smÃ„Â±: Grid Layout (Sol: 4 Kart, SaÃ„Å¸: PDR Merkezi) -->
            <div style="display: flex; gap: 20px; margin-top: 24px; width: 100%; align-items: stretch; flex-wrap: wrap;">
               <!-- SOL BÃƒâ€“LÃƒÅ“M: Ana Kartlar -->
               <div style="flex: 1; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; align-content: flex-start;">
                  <!-- Kart 1: Konu Ãƒâ€¡alÃ„Â±Ã…Å¸ -->
                  <div class="dash-dev-card card-pink" style="position:relative;" onclick="document.getElementById('btnOpenStudyWizard')?.click()">
                    <i class="fa-solid fa-book-open"></i>
                    <h3>Konu Ãƒâ€¡alÃ„Â±Ã…Å¸</h3>
                    <p>Yapay zeka ile adÃ„Â±m adÃ„Â±m ÃƒÂ¶Ã„Å¸ren</p>
                  </div>
                  
                  <!-- Kart 2: Test Ãƒâ€¡ÃƒÂ¶z -->
                  <div class="dash-dev-card card-cyan" style="position:relative;" onclick="document.getElementById('btnOpenQuizWizard')?.click()">
                    <i class="fa-solid fa-crosshairs"></i>
                    <h3>Test SihirbazÃ„Â±</h3>
                    <p>SÃ„Â±nav dÃƒÂ¼zeyinde anlÃ„Â±k quizler</p>
                  </div>
                  
                  <!-- Kart 3: SÃƒÂ¶zlÃƒÂ¼ SÃ„Â±nav -->
                  <div class="dash-dev-card card-blue" style="position:relative;" onclick="document.getElementById('btnOpenVoiceExam')?.click()">
                    <i class="fa-solid fa-microphone-lines"></i>
                    <h3>SÃƒÂ¶zlÃƒÂ¼ SÃ„Â±nav</h3>
                    <p>Diksiyon ve mikrofon ile test</p>
                  </div>
                  
                  <!-- Kart 4: Normal Sohbet -->
                  <div class="dash-dev-card card-orange" style="position:relative;" onclick="document.querySelector('.chip[data-qcmd=\\'/normal\\']')?.click()">
                    <i class="fa-solid fa-comment-dots"></i>
                    <h3>Sohbet OdasÃ„Â±</h3>
                    <p>Ãƒâ€“zgÃƒÂ¼rce sorularÃ„Â±nÃ„Â± sor</p>
                  </div>
               </div>
               
               <!-- SAÃ„Â BÃƒâ€“LÃƒÅ“M: Dikey Rehberlik (PDR) Merkezi -->
               <div class="pdr-vertical-panel">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                     <i class="fa-solid fa-compass" style="color: var(--acc); font-size: 1.4rem;"></i>
                     <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #e2e8f0;">Rehberlik Merkezi</h3>
                  </div>
                  <p style="font-size: 0.8rem; color: var(--sub); margin-bottom: 12px; margin-top: 0;">LGS, YKS ve Motivasyon AraÃƒÂ§larÃ„Â±</p>
                  
                  <div class="pdr-vertical-card" onclick="document.querySelector('.chip[data-qcmd=\\'/motivasyon\\']')?.click()">
                     <div class="pdr-vertical-icon" style="color: #f59e0b;"><i class="fa-solid fa-fire"></i></div>
                     <div>
                        <div style="font-weight: 700; font-size: 0.9rem;">Motivasyon</div>
                        <div style="font-size: 0.75rem; color: var(--sub);">GÃƒÂ¼nÃƒÂ¼n sÃƒÂ¶zÃƒÂ¼ ve tavsiyeler</div>
                     </div>
                  </div>
                  
                  <div class="pdr-vertical-card" onclick="document.querySelector('.chip[data-qcmd=\\'/program\\']')?.click()">
                     <div class="pdr-vertical-icon" style="color: #10b981;"><i class="fa-solid fa-calendar-check"></i></div>
                     <div>
                        <div style="font-weight: 700; font-size: 0.9rem;">Ãƒâ€¡alÃ„Â±Ã…Å¸ma ProgramÃ„Â±</div>
                        <div style="font-size: 0.75rem; color: var(--sub);">KiÃ…Å¸isel program oluÃ…Å¸tur</div>
                     </div>
                  </div>
                  
                  <div class="pdr-vertical-card" onclick="document.querySelector('.chip[data-qcmd=\\'/stres\\']')?.click()">
                     <div class="pdr-vertical-icon" style="color: #6366f1;"><i class="fa-solid fa-brain"></i></div>
                     <div>
                        <div style="font-weight: 700; font-size: 0.9rem;">Stres YÃƒÂ¶netimi</div>
                        <div style="font-size: 0.75rem; color: var(--sub);">Nefes ve odaklanma</div>
                     </div>
                  </div>
                  
                  <div class="pdr-vertical-card" onclick="document.querySelector('.chip[data-qcmd=\\'/lgs\\']')?.click()">
                     <div class="pdr-vertical-icon" style="color: #ec4899;"><i class="fa-solid fa-graduation-cap"></i></div>
                     <div>
                        <div style="font-weight: 700; font-size: 0.9rem;">LGS & Meslek</div>
                        <div style="font-size: 0.75rem; color: var(--sub);">SÃ„Â±nav taktikleri ve hedefler</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        `;
        appendMessage('bot', dHtml);

        // Arama ÃƒÂ§ubuÃ„Å¸u event listener
        setTimeout(() => {
          const searchInput = document.getElementById('dashSearchInput');
          // Info butonlarÃ„Â±nÃ„Â± kartlara ekle
          const cardInfoMap = [
            { sel: '.card-pink', id: 'konu' },
            { sel: '.card-cyan', id: 'test' },
            { sel: '.card-blue', id: 'sozlu' },
            { sel: '.card-orange', id: 'sohbet' }
          ];
          cardInfoMap.forEach(({ sel, id }) => {
            const card = document.querySelector(sel);
            if (card && !card.querySelector('.card-info-btn')) {
              const btn = document.createElement('button');
              btn.className = 'card-info-btn';
              btn.textContent = '?';
              btn.title = 'Bu ne iÃ…Å¸e yarar?';
              btn.setAttribute('aria-label', 'Bilgi');
              btn.onclick = (e) => { e.stopPropagation(); showCardInfo(id); };
              card.appendChild(btn);
            }
          });
          const searchBtn = document.getElementById('dashSearchBtn');
          if (searchInput && searchBtn) {
            const doSearch = () => {
              const q = searchInput.value.trim();
              if (!q) return;
              // Dashboard'u kaldÃ„Â±r
              const dashEl = document.querySelector('.welcome-dash-v2');
              if (dashEl) dashEl.closest('.chat-message')?.remove();
              // Ders modunda arama yap
              handleSendMessage(q + ' konusunu detaylÃ„Â±ca ders anlat');
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
  
  // Desktop Sidebar Toggle Logic (Unified Ã¢â‚¬â€ uses closeMobileSidebar from above)
  const btnMenu = document.getElementById('btnMobileMenu');
  const sidebarEl = document.querySelector('.sidebar');
  if(sidebarEl && btnMenu) {
     // Desktop: sadece sidebar-collapsed class toggle
     // Mobile: openMobileSidebar/closeMobileSidebar zaten yukarÃ„Â±da baÃ„Å¸lÃ„Â±
     // Bu handler sadece desktop iÃƒÂ§in ÃƒÂ§alÃ„Â±Ã…Å¸Ã„Â±r
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
         closeBtn.innerHTML = 'Ã¢â€”â‚¬';
         closeBtn.style.cssText = 'float:right; background:none; border:none; color:var(--sub); cursor:pointer; font-size:1rem; outline:none;';
         closeBtn.title = 'Paneli Gizle';
         sbHeader.appendChild(closeBtn);
         
         closeBtn.addEventListener('click', () => {
             document.body.classList.add('sidebar-collapsed');
             btnMenu.style.display = 'block'; 
         });
     }
  }

  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // CÃ„Â°HAZ MODU SEÃƒâ€¡Ã„Â°CÃ„Â° (Telefon / Uygulama / Web)
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const deviceSelector = document.getElementById('deviceModeSelector');
  if (deviceSelector) {
    // KayÃ„Â±tlÃ„Â± seÃƒÂ§imi yÃƒÂ¼kle
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
    // Body class'larÃ„Â±nÃ„Â± temizle
    document.body.classList.remove('device-phone', 'device-app', 'device-web');
    if (mode === 'phone') document.body.classList.add('device-phone');
    else if (mode === 'app') document.body.classList.add('device-app');
    // web = varsayÃ„Â±lan, ek class gerekmez

    // Buton active durumlarÃ„Â±nÃ„Â± gÃƒÂ¼ncelle
    const selector = document.getElementById('deviceModeSelector');
    if (selector) {
      selector.querySelectorAll('.device-mode-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-device') === mode);
      });
    }
  }

  // VAY BE REÃƒâ€¡ETESÃ„Â° ENTEGRASYONLARI
  setupVayBeFeatures();
  
  // GÃƒÂ¼ncel Yenilikler Popup'Ã„Â± (Sadece bir kez gÃƒÂ¶sterilir ve 3.5 sn sonra kapanÃ„Â±r)
  const updateChangelogOverlay = document.getElementById('updateChangelogOverlay');
  if (updateChangelogOverlay && !localStorage.getItem('changelog_v18_seen')) {
    updateChangelogOverlay.style.display = 'flex';
    localStorage.setItem('changelog_v18_seen', 'true');
    window.updateChangelogTimer = setTimeout(() => {
      updateChangelogOverlay.style.display = 'none';
    }, 3500);
  }
  
  // --- LOGO HOME BUTTON (Ana Sayfaya DÃƒÂ¶n) ---
  const btnLogoHome = document.getElementById('btnLogoHome');
  if (btnLogoHome) {
     btnLogoHome.addEventListener('click', () => {
        // Overlay'leri kapat
        document.querySelectorAll('.game-overlay, .onboard-overlay, .modal-overlay, .cmd-overlay').forEach(el => {
           el.style.display = 'none';
        });
        
        // SÃ„Â±nav / Ders modlarÃ„Â±nÃ„Â± sÃ„Â±fÃ„Â±rla
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
        
        // ÃƒÅ“st panel baÃ…Å¸lÃ„Â±Ã„Å¸Ã„Â±nÃ„Â± dÃƒÂ¼zelt 
        const botName = document.getElementById('botName');
        if (botName) botName.textContent = 'ÄŸÅ¸ÂÂ« Ata Sohbet Ã¢â‚¬â€ Normal';
        
        // Mobildeyse sidebar kapansÃ„Â±n
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar && sidebar.classList.contains('active')) {
           sidebar.classList.remove('active');
           if (backdrop) backdrop.classList.remove('active');
        }

        // location reload ÃƒÂ§alÃ„Â±Ã…Å¸mÃ„Â±yorsa URL'ye yÃƒÂ¶nlendir
        window.location.href = window.location.pathname;
     });
  }
  
  // BaÃ…Å¸langÃ„Â±ÃƒÂ§ mesajÃ„Â± iptal edildi (SeÃƒÂ§im DuvarÃ„Â± otomatik olarak tetikliyor)
});

// VAY BE REÃƒâ€¡ETESÃ„Â° Ãƒâ€“ZELLÃ„Â°K KURULUMU
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

  // 2. Dinamik KarÃ…Å¸Ã„Â±lama Saati
  const lblTimeGreeting = document.getElementById('lblDynamicTimeGreeting');
  if (lblTimeGreeting) {
    const hour = new Date().getHours();
    let greeting = 'Ã„Â°yi geceler, ';
    if (hour >= 6 && hour < 12) greeting = 'GÃƒÂ¼naydÃ„Â±n, ';
    else if (hour >= 12 && hour < 18) greeting = 'Ã„Â°yi gÃƒÂ¼nler, ';
    else if (hour >= 18 && hour < 22) greeting = 'Ã„Â°yi akÃ…Å¸amlar, ';
    lblTimeGreeting.innerHTML = `<span style="color:var(--acc); font-weight:800; margin-right:4px;">${greeting}</span>`;
  }

  // 3. Tema DeÃ„Å¸iÃ…Å¸tirici (Ay / GÃƒÂ¼neÃ…Å¸)
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
           btnThemeToggle.textContent = 'Ã¢Ëœâ‚¬Ã¯Â¸Â';
       } else {
           body.setAttribute('data-theme', 'default');
           document.documentElement.style.setProperty('--bg', '#020617');
           document.documentElement.style.setProperty('--bg2', '#0f172a');
           document.documentElement.style.setProperty('--txt', '#f8fafc');
           document.documentElement.style.setProperty('--bdr', '#1e293b');
           document.documentElement.style.setProperty('--sub', '#94a3b8');
           btnThemeToggle.textContent = 'ÄŸÅ¸Å’â„¢';
       }
    });
  }

  // 4. Feedback Balonu
  const btnFeedback = document.getElementById('btnFeedbackBubble');
  if (btnFeedback) {
     btnFeedback.addEventListener('click', () => {
        const userInput = document.getElementById('userInput');
        if (userInput) {
           userInput.value = "Sisteme Ã…Å¸u ÃƒÂ¶zelliÃ„Å¸i eklerseniz ÃƒÂ§ok iyi olur: ";
           userInput.focus();
           
           const chatbox = document.getElementById('chatbox');
           document.getElementById('quickShortcuts').style.display = 'none';
        }
     });
  }

  // 5. AkÃ„Â±llÃ„Â± Arama & Mesaj KÃ„Â±sayollarÃ„Â± Yok Etme
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
      console.log('ServiceWorker baÃ…Å¸arÃ„Â±lÃ„Â±: ', reg.scope);
    }).catch(err => {
      console.log('ServiceWorker hata: ', err);
    });
  });
}

// === RIPPLE EFFECT (Click Animasyonu) ===
document.addEventListener('mousedown', function(e) {
  const target = e.target.closest('button, .dash-dev-card, .v18-btn');
  if (!target) return;
  
  const circle = document.createElement('span');
  const diameter = Math.max(target.clientWidth, target.clientHeight);
  const radius = diameter / 2;
  const rect = target.getBoundingClientRect();
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top = `${e.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');
  
  if(getComputedStyle(target).position === 'static') {
    target.style.position = 'relative'; 
  }
  target.style.overflow = 'hidden';
  
  const rippleElements = target.getElementsByClassName('ripple');
  for (let r of rippleElements) { r.remove(); }
  
  target.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
});

// === LAYOUT TOGGLES (V20 Collapsible) ===
const btnToggleLeft = document.getElementById('btnToggleLeft');
const btnToggleRight = document.getElementById('btnToggleRight');
const sidebar = document.querySelector('.sidebar');
const rightSidebar = document.querySelector('.right-sidebar');

if (btnToggleLeft && sidebar) {
  btnToggleLeft.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const icon = btnToggleLeft.querySelector('i');
    if(sidebar.classList.contains('collapsed')) {
      icon.className = "fa-solid fa-bars";
    } else {
      icon.className = "fa-solid fa-bars-staggered";
    }
  });
}

// Duplicate listener removed to prevent collision with mobile right sidebar logic


// =====================================================
// KART BÃ„Â°LGÃ„Â° POPUP
// =====================================================
function showCardInfo(cardId) {
  const infos = {
    konu:   { title: 'ÄŸÅ¸â€œÅ¡ Konu Ãƒâ€¡alÃ„Â±Ã…Å¸', icon: 'ÄŸÅ¸â€œÅ¡', color: '#f472b6',
               text: 'Yapay zeka ile adÃ„Â±m adÃ„Â±m ders anlat! SÃ„Â±nÃ„Â±f seviyene ve dersine gÃƒÂ¶re ÃƒÂ¶zelleÃ…Å¸tirilmiÃ…Å¸ ders anlatÃ„Â±mÃ„Â± alÃ„Â±rsÃ„Â±n. Matematik, Fen, TÃƒÂ¼rkÃƒÂ§e, Sosyal Ã¢â‚¬â€ tÃƒÂ¼m konularda detaylÃ„Â± aÃƒÂ§Ã„Â±klama ve ÃƒÂ¶rnek ÃƒÂ§ÃƒÂ¶zÃƒÂ¼mler.',
               tip: 'ÄŸÅ¸â€™Â¡ "7. sÃ„Â±nÃ„Â±f matematik / kesirler" yazarak baÃ…Å¸la!' },
    test:   { title: 'ÄŸÅ¸ÂÂ¯ Test SihirbazÃ„Â±', icon: 'ÄŸÅ¸ÂÂ¯', color: '#38bdf8',
               text: 'SÃ„Â±nÃ„Â±f ve konuna gÃƒÂ¶re yapay zeka tarafÃ„Â±ndan ÃƒÂ¼retilen ÃƒÂ¶zel sorular ÃƒÂ§ÃƒÂ¶z! LGS, Maarif ve ÃƒÂ§eÃ…Å¸itli soru formatlarÃ„Â± (ÃƒÂ§oktan seÃƒÂ§meli, doÃ„Å¸ru-yanlÃ„Â±Ã…Å¸, boÃ…Å¸luk doldurama) arasÃ„Â±ndan seÃƒÂ§. Her sorunun ayrÃ„Â±ntÃ„Â±lÃ„Â± ÃƒÂ§ÃƒÂ¶zÃƒÂ¼mÃƒÂ¼ sunulur.',
               tip: 'ÄŸÅ¸â€™Â¡ Soru formatÃ„Â±nÃ„Â± ve zorluk seviyesini kendin belirleyebilirsin!' },
    sozlu:  { title: 'ÄŸÅ¸ÂÂ¤ SÃƒÂ¶zlÃƒÂ¼ SÃ„Â±nav', icon: 'ÄŸÅ¸ÂÂ¤', color: '#818cf8',
               text: 'Yapay zeka sana sÃƒÂ¶zlÃƒÂ¼ sÃ„Â±nav sorularÃ„Â± sorar, sen de sesli veya yazÃ„Â±lÃ„Â± olarak cevaplÃ„Â±yorsun. Her cevabÃ„Â±nÃ„Â± deÃ„Å¸erlendirir, puan verir ve 5 soruluk sinavin sonunda genel performansÃ„Â±nÃ„Â± ÃƒÂ¶zetler.',
               tip: 'ÄŸÅ¸â€™Â¡ 5 soru sorulur Ã¢â€ â€™ otomatik deÃ„Å¸erlendirme yapÃ„Â±lÃ„Â±r!' },
    sohbet: { title: 'ÄŸÅ¸â€™Â¬ Sohbet OdasÃ„Â±', icon: 'ÄŸÅ¸â€™Â¬', color: '#fb923c',
               text: 'Herhangi bir konuda ÃƒÂ¶zgÃƒÂ¼rce sorularÃ„Â±nÃ„Â± sor! Ders dÃ„Â±Ã…Å¸Ã„Â±nda genel kÃƒÂ¼ltÃƒÂ¼r, gÃƒÂ¼ncel konular veya aklÃ„Â±na takÃ„Â±lan her Ã…Å¸eyi sorabilirsin. Yapay zeka anlaÃ…Å¸Ã„Â±lÃ„Â±r, samimi bir dille yanÃ„Â±t verir.',
               tip: 'ÄŸÅ¸â€™Â¡ Her tÃƒÂ¼rlÃƒÂ¼ soruyu sorabilirsin, sÃ„Â±nÃ„Â±r yok!' }
  };
  const info = infos[cardId] || infos.sohbet;
  if (typeof Swal === 'undefined') { alert(info.title + '\n\n' + info.text); return; }
  Swal.fire({
    title: info.title,
    html: '<p style="text-align:left;line-height:1.75;color:#cbd5e1;font-size:.93rem;margin-bottom:12px;">' + info.text + '</p>' +
          '<div style="font-size:.85rem;color:' + info.color + ';background:rgba(255,255,255,.04);padding:9px 13px;border-radius:9px;border-left:3px solid ' + info.color + ';text-align:left;">' + info.tip + '</div>',
    confirmButtonText: 'Hemen BaÃ…Å¸la!',
    confirmButtonColor: info.color,
    background: '#0f172a',
    color: '#f8fafc',
    icon: 'info',
    iconColor: info.color
  });
}

// Tema toggle setupVayBeFeatures() icinde yonetiliyor.


// Bildirim handler DOMContentLoaded icinde tanimlanmistir.


  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  // VERÃ„Â° YEDEKLEME VE GERÃ„Â° YÃƒÅ“KLEME 
  // Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
  const btnExportData = document.getElementById('btnExportData');
  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      document.body.classList.remove('sidebar-collapsed');
      
      const backupData = {
        v11XP: localStorage.getItem('v11XP'),
        v11LevelIndex: localStorage.getItem('v11LevelIndex'),
        ataProgress: localStorage.getItem('ataProgress'),
        ataLastQType: localStorage.getItem('ataLastQType'),
        ataLastSubCategory: localStorage.getItem('ataLastSubCategory'),
        theme: localStorage.getItem('theme'),
        keyboardBestScore: localStorage.getItem('keyboardBestScore')
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const anchorNode = document.createElement('a');
      anchorNode.setAttribute("href", dataStr);
      anchorNode.setAttribute("download", "AtaMentor_Gelisim_Yedek.json");
      document.body.appendChild(anchorNode);
      anchorNode.click();
      anchorNode.remove();
      
      if(typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Yedekleme BaÃ…Å¸arÃ„Â±lÃ„Â±!',
          text: 'XP, BaÃ…Å¸arÃ„Â±lar ve Ã„Â°lerleme verileriniz "AtaMentor_Gelisim_Yedek.json" olarak indirildi.',
          icon: 'success',
          confirmButtonColor: '#00d4ff',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  const btnImportData = document.getElementById('btnImportData');
  if (btnImportData) {
    btnImportData.addEventListener('click', () => {
      document.body.classList.remove('sidebar-collapsed');
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
          try {
            const content = JSON.parse(readerEvent.target.result);
            let restored = 0;
            
            if(content.v11XP !== undefined && content.v11XP !== null) { localStorage.setItem('v11XP', content.v11XP); restored++; }
            if(content.v11LevelIndex !== undefined && content.v11LevelIndex !== null) { localStorage.setItem('v11LevelIndex', content.v11LevelIndex); restored++; }
            if(content.ataProgress) { localStorage.setItem('ataProgress', content.ataProgress); restored++; }
            if(content.ataLastQType) localStorage.setItem('ataLastQType', content.ataLastQType);
            if(content.ataLastSubCategory) localStorage.setItem('ataLastSubCategory', content.ataLastSubCategory);
            if(content.theme) document.documentElement.setAttribute('data-theme', content.theme);
            if(content.keyboardBestScore) localStorage.setItem('keyboardBestScore', content.keyboardBestScore);
            
            if(typeof Swal !== 'undefined' && restored > 0) {
              Swal.fire({
                title: 'Harika! ÄŸÅ¸Å¡â‚¬',
                text: "Eski verileriniz baÃ…Å¸arÃ„Â±yla yÃƒÂ¼klendi! Etkili olmasÃ„Â± iÃƒÂ§in sayfa yenileniyor...",
                icon: 'success',
                confirmButtonColor: '#00d4ff',
                background: '#0f172a',
                color: '#f8fafc'
              }).then(() => window.location.reload());
            } else {
               throw new Error("BoÃ…Å¸ Dosya");
            }
          } catch(err) {
            console.error(err);
            if(typeof Swal !== 'undefined') {
              Swal.fire('Hata!', 'GeÃƒÂ§ersiz veya bozuk yedek dosyasÃ„Â± yÃƒÂ¼klemeye ÃƒÂ§alÃ„Â±Ã…Å¸tÃ„Â±nÃ„Â±z.', 'error');
            }
          }
        }
      }
      input.click();
    });
  }











