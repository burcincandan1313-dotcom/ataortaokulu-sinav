/**
 * src/features/tts.js
 * Uygulamanın metin okuma (Text-to-Speech) işlemlerini yöneten modülü.
 */
export function initTTS() {
  window.speakText = function(btn) {
    const text = decodeURIComponent(btn.getAttribute('data-text') || '');
    if (!text) return;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      btn.textContent = '🔊 Oku';
      return;
    }
    
    // HTML ve Markdown taglarını temizle
    const plainText = text.replace(/<[^>]+>/g, '').replace(/[*#_]+/g, '');
    
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    
    utterance.onstart = () => { btn.textContent = '⏹️ Durdur'; };
    utterance.onend = () => { btn.textContent = '🔊 Oku'; };
    utterance.onerror = () => { btn.textContent = '🔊 Oku'; };
    
    window.speechSynthesis.speak(utterance);
  }
}
