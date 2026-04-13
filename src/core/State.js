/**
 * State.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
export const Storage = {
  set(k, v) { localStorage.setItem(k, btoa(encodeURIComponent(JSON.stringify(v)))); },
  get(k, def) {
    const raw = localStorage.getItem(k);
    if (!raw) return def;
    try { return JSON.parse(decodeURIComponent(atob(raw))); } catch(e) { return def; }
  },
  remove(k) { localStorage.removeItem(k); }
};

export const AppState = {
  botState: 'NORMAL',
  proMode: 'NORMAL',
  currentMode: 'normal',
  currentChar: 'normal',
  isMicOn: false,
  isMatrixRunning: false,
  matrixRAF: null,
  isStreaming: false,
  streamStop: false,
  activeGame: null,
  gameInterval: null,
  gameRAF: null,
  modeState: {},
  cache: { weather: null, currency: null, lastUpdate: 0 }
};

// Memory system for tracking conversation
export const Memory = {
  shortTerm: [],    
  sessionTopics: [],
  longTerm: Storage.get('bot_longmem', []),

  addMessage(role, text) {
    this.shortTerm.push({ role, text, ts: Date.now() });
    if (this.shortTerm.length > 15) this.shortTerm.shift();
    if (this.shortTerm.length % 5 === 0) this.analyzeTopics();
  },

  analyzeTopics() {
    const recent = this.shortTerm.slice(-5).map(m => m.text.toLowerCase()).join(' ');
    const topicMap = {
      oyun: ['oyun','oyna','wordle','quiz','macera','xox'],
      bilim: ['bilim','deney','atom','kimya','fizik','biyoloji'],
      matematik: ['matematik','hesap','sayı','toplam','çarp','formül'],
      tarih: ['tarih','osmanlı','cumhuriyet','savaş','fetih'],
      teknoloji: ['bilgisay','robot','yapay zeka','kod','program'],
      sanat: ['resim','müzik','çiz','şiir','hikaye','yaz'],
      spor: ['futbol','basket','spor','maç','gol','koş'],
      doğa: ['hayvan','bitki','orman','deniz','uzay','gezegen']
    };
    for (const [topic, keywords] of Object.entries(topicMap)) {
      if (keywords.some(k => recent.includes(k)) && !this.sessionTopics.includes(topic)) {
        this.sessionTopics.push(topic);
        if (this.sessionTopics.length > 5) this.sessionTopics.shift();
      }
    }
  },

  remember(fact) {
    if (!this.longTerm.includes(fact)) {
      this.longTerm.push(fact);
      if (this.longTerm.length > 50) this.longTerm.shift();
      Storage.set('bot_longmem', this.longTerm);
    }
  },

  getContext() {
    return {
      recent: this.shortTerm.slice(-5).map(m => m.role + ': ' + m.text).join('\n'),
      topics: this.sessionTopics.join(', '),
      facts: this.longTerm.slice(-5).join('; ')
    };
  }
};
