// src/ui.js
// Uygulamanın Kullanıcı Arayüzü (DOM Modifikasyon) Katmanı

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
  div.innerHTML = html;
  
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
