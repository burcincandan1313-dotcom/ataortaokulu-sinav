/**
 * state.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/state.js
// Uygulamanın merkezi durum (state) ve depolama yönetimi

/**
 * state.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
export const StorageManager = {
  keys: {
    XP: 'mega_xp',
    LEVEL: 'mega_level',
    LOW_END: 'mega_low_end',
    THEME: 'mega_theme',
    NAME: 'mega_name',
    AVATAR: 'selectedAvatar',
    QUIZ_HISTORY: 'mega_quiz_history',
    NOTES: 'mega_notlar',
    AGENDA: 'bot_agenda',
    STREAK_DAYS: 'mega_streak_days',
    LAST_LOGIN: 'mega_last_login'
  },
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return localStorage.getItem(key) || defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    } catch (e) {
      console.warn('Storage Error:', e);
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clearAll() {
    Object.values(this.keys).forEach(k => localStorage.removeItem(k));
  }
};

export const state = {
  messages: [],
  isLoading: false,
  xp: 0,
  level: 1,
  streak: 0,
  theme: 'dark' // Veya local storage'dan okunan değer
};

// State Dinleyicileri (Reactivity mekanizması için basit bir pub/sub)
const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

function notify() {
  listeners.forEach(listener => listener(state));
}

export function setIsLoading(loading) {
  state.isLoading = loading;
  notify();
}

export function addMessage(role, content) {
  state.messages.push({ role, content, timestamp: new Date() });
  notify();
}

export function loadUserData() {
  const storedXP = StorageManager.get(StorageManager.keys.XP);
  const storedLevel = StorageManager.get(StorageManager.keys.LEVEL);
  if (storedXP) state.xp = parseInt(storedXP, 10);
  if (storedLevel) state.level = parseInt(storedLevel, 10);

  // STREAK HESAPLAMA (Günlük Seri)
  const lastLogin = StorageManager.get(StorageManager.keys.LAST_LOGIN);
  let streak = parseInt(StorageManager.get(StorageManager.keys.STREAK_DAYS) || 0, 10);
  const today = new Date().toDateString();

  if (lastLogin) {
     if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastLogin === yesterday.toDateString()) {
           streak += 1;
        } else {
           streak = 1; // Seri kırıldı, baştan
        }
        StorageManager.set(StorageManager.keys.LAST_LOGIN, today);
        StorageManager.set(StorageManager.keys.STREAK_DAYS, streak);
     }
  } else {
     // İlk giriş
     streak = 1;
     StorageManager.set(StorageManager.keys.LAST_LOGIN, today);
     StorageManager.set(StorageManager.keys.STREAK_DAYS, streak);
  }
  state.streak = streak;
  
  // Tema yükleme
  const lowEnd = StorageManager.get(StorageManager.keys.LOW_END);
  if (lowEnd === 'true') {
    document.body.classList.add('lowend-mode');
  }
}

export function saveUserData() {
  StorageManager.set(StorageManager.keys.XP, state.xp);
  StorageManager.set(StorageManager.keys.LEVEL, state.level);

  // Update Roster for local leaderboard
  const currentName = StorageManager.get(StorageManager.keys.NAME);
  if (currentName) {
    let roster = StorageManager.get('mega_class_roster') || [];
    const idx = roster.findIndex(r => r.name === currentName);
    if (idx !== -1) {
       roster[idx].xp = state.xp;
       roster[idx].level = state.level;
    } else {
       roster.push({ name: currentName, xp: state.xp, level: state.level, avatar: StorageManager.get(StorageManager.keys.AVATAR) || '🧑‍🎓' });
    }
    StorageManager.set('mega_class_roster', roster);
  }
}
