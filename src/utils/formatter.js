/**
 * src/utils/formatter.js
 * Metinleri Markdown'dan HTML formatına dönüştüren yardımca araçları barındırır.
 */
import { marked } from 'marked';

marked.setOptions({
  breaks: true, // enter tusunu br etiketi olarak algila
  gfm: true     // github flavored markdown
});

export function formatMessage(role, text) {
  if (role === 'user') {
    // Kullanıcıdan gelen metindeki olası HTML taglerini kaçışa zorla
    const safeText = text.replace(/<(?!br|strong|b|i|u|em|span|\/)/g, '&lt;');
    return `<div class="user-msg-wrap">${safeText}</div>`;
  } else {
    let content = text;
    // Quiz veya Oyun içi HTML UI değilse, normal makinalardan gelen cevabı Markdown olarak işle
    if (!text.includes('quiz-container') && !text.includes('id="img') && !text.includes('bot-msg-wrap') && !text.includes('wow-container')) {
      content = marked.parse(text);
    }
    
    // Yalnızca düz metin/anlatımlarda sesli buton ekle, oyun vb arayüzlerde ekleme
    let speakBtn = '';
    if (!text.includes('quiz-container') && !text.includes('id="img') && !text.includes('bot-msg-wrap') && !text.includes('wow-container')) {
        speakBtn = `<button class="tts-btn" onclick="window.speakText(this)" data-text="${encodeURIComponent(text.replace(/<[^>]+>/g, ''))}" title="Sesli Oku" style="margin-top:10px; padding:6px 12px; background:var(--bg2); color:var(--text-color); border:1px solid var(--bdr); border-radius:6px; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; gap:6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2); transition: all 0.2s ease;">🔊 Oku</button>`;
    }

    return `<div class="bot-msg-wrap markdown-body">${content}${speakBtn}</div>`;
  }
}
