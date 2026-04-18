/**
 * ui.js
 * Bu dosya projenin ayrılmaz bir parçasıdır ve modüler özellik sağlar.
 */
// src/ui.js
// Uygulamanın Kullanıcı Arayüzü (DOM Modifikasyon) Katmanı

/**
 * ui.js
 * Bu dosya projenin ayrilmaz bir parcasidir.
 */
import DOMPurify from 'dompurify';

let _chatContainer;
let _botStatus;

// DOM yüklendiğinde cache'lenecek öğeler
export function initUI() {
  _chatContainer = document.getElementById('chatbox');
  _botStatus = document.getElementById('botStatus');
}

/**
 * Mesajı ekrana çizer
 * @param {string} role "user" veya "bot"
 * @param {string} html Mesaj içeriği (HTML destekli)
 */
export function appendMessage(role, html) {
  if (!_chatContainer) return;
  
  const div = document.createElement('div');
  div.className = 'chat-message ' + role;
  
  // DOMPurify Güvenlik Filtresi (UI etkileşimlerini bozmamak için özel özelliklere izin veriyoruz)
  const cleanHtml = DOMPurify.sanitize(html, { 
    ADD_ATTR: ['onclick', 'data-text', 'data-action', 'data-qcmd', 'data-theme', 'data-t', 'target', 'data-sinif', 'data-tur'] 
  });
  div.innerHTML = cleanHtml;
  
  _chatContainer.appendChild(div);

  // Kullanıcı mesajıysa her zaman en alta in
  if (role === 'user') {
    scrollToBottom();
  } else {
    // Bot mesajıysa, mesajın okunabilirliğini korumak için mesajın başladığı yere hizalanır.
    setTimeout(() => {
      // Mesaj kutusunun yüksekliğini ölçelim
      if (div.offsetHeight > _chatContainer.offsetHeight * 0.6) {
         div.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
         scrollToBottom();
      }
    }, 50);
  }
}

/**
 * Typewriter animasyonuyla mesajı kelime kelime yazar
 * — Bekleme hissi sıfırlanır, cevap anında geliyormuş gibi görünür
 * @param {string} html Final HTML içerik
 * @param {Function} onDone Animasyon bitince çağrılır (opsiyonel)
 * @returns {HTMLElement} Oluşturulan mesaj elementi
 */
export function streamMessage(html, onDone) {
  if (!_chatContainer) return null;

  const div = document.createElement('div');
  div.className = 'chat-message bot';
  _chatContainer.appendChild(div);
  scrollToBottom();

  // HTML'i DOMPurify ile temizle
  const cleanHtml = DOMPurify.sanitize(html, {
    ADD_ATTR: ['onclick', 'data-text', 'data-action', 'data-qcmd', 'data-theme', 'data-t', 'target']
  });

  // Düz metni çıkar (kelime kelime animasyon için)
  const tmp = document.createElement('div');
  tmp.innerHTML = cleanHtml;
  const plainText = tmp.textContent || tmp.innerText || '';

  // Kısa metinleri direkt göster (70 kelimeden az)
  const words = plainText.split(' ');
  if (words.length < 70) {
    div.innerHTML = cleanHtml;
    scrollToBottom();
    if (onDone) onDone(div);
    return div;
  }

  // Uzun metinleri kelime kelime yaz
  let i = 0;
  const speed = 18; // ms per word — hızlı ama okunabilir

  // Uzun mesaj: mesajın başlangıcına kaydır (üst kısmı görsün kullanıcı)
  setTimeout(() => {
    div.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);

  const interval = setInterval(() => {
    div.textContent = words.slice(0, i + 1).join(' ');
    i++;
    // Son batch'te tam HTML'i koy
    if (i >= words.length) {
      clearInterval(interval);
      div.innerHTML = cleanHtml;
      // Bitince mesajın başına kaydır (kullanıcı baştan okusun)
      setTimeout(() => {
        div.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      if (onDone) onDone(div);
    }
  }, speed);

  return div;
}


/**
 * Otomatik scroll
 */
export function scrollToBottom() {
  if (!_chatContainer) return;
  _chatContainer.scrollTop = _chatContainer.scrollHeight;
}

/**
 * Botun yazıyor... animasyonunu gösterir/gizler
 * @param {boolean} show 
 */
export function toggleTypingIndicator(show) {
  if (show) {
    _botStatus.textContent = '🟢 Yazıyor...';
    _botStatus.style.color = '#4ade80';
    document.getElementById('typing').style.display = 'flex';
    scrollToBottom();
  } else {
    _botStatus.textContent = '🟢 Çevrimiçi';
    document.getElementById('typing').style.display = 'none';
  }
}

/**
 * Hata mesajı baloncuğu çıkartır
 * @param {string} msg Hata mesajı metni
 */
export function showError(msg) {
  appendMessage('bot', `<div class="bot-msg-wrap"><span class="error-text">⚠️ <b>Hata:</b> ${msg}</span><br><button class="retry-btn" onclick="retryLastMessage()">Yeniden Dene</button></div>`);
}

/**
 * Üst bardaki bot statüsünü günceller
 */
export function updateBotStatus(text, color) {
  if (_botStatus) {
    _botStatus.textContent = text;
    _botStatus.style.color = color || 'inherit';
  }
}
