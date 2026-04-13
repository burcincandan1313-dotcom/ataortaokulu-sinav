/**
 * src/features/modeSelector.js
 * Arayüzdeki mod seçici butonları ve sistemin genel mod durumunu yönetir.
 */
export const MODES = [
  { id: 'normal',   icon: '💬', label: 'Normal',     desc: 'Genel sohbet modu' },
  { id: 'ders',     icon: '📚', label: 'Ders',       desc: 'Eğitim ve ders anlatımı' },
  { id: 'quiz',     icon: '📊', label: 'Quiz',       desc: 'Soru-cevap testi' },
  { id: 'yaratici', icon: '🎨', label: 'Yaratıcı',   desc: 'Hikaye, şiir, resim' },
  { id: 'oyun',     icon: '🎮', label: 'Oyun',       desc: 'Eğitici oyunlar' },
];

export function renderModeSelector(callbacks) {
  const { currentMode, setCurrentMode, renderGameMenu, openStudyWizard, addMessage, appendMessage, formatMessage } = callbacks;
  
  const container = document.getElementById('modeSelector');
  if (!container) return;
  container.innerHTML = '';
  
  MODES.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'mode-btn' + (m.id === currentMode ? ' active' : '');
    btn.title = m.desc;
    btn.innerHTML = `${m.icon} ${m.label}`;
    
    btn.addEventListener('click', () => {
      // Oyun moduna geçtiyse oyun overlay'ı aç
      if (m.id === 'oyun') {
        const gameOverlay = document.getElementById('gameOverlay');
        if (gameOverlay) gameOverlay.style.display = 'flex';
        if (renderGameMenu) renderGameMenu();
        return;
      } 
      
      // Ders veya Quiz seçildiyse Eğitim Sihirbazını aç
      if (m.id === 'ders' || m.id === 'quiz') {
        if (openStudyWizard) openStudyWizard(m.id);
        return;
      }

      if (setCurrentMode) setCurrentMode(m.id);
      if (m.id !== 'quiz') window.activeQuizSession = false;
      
      // Aktif sınıfı güncelle
      container.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Header'ı güncelle
      const botName = document.getElementById('botName');
      if (botName) botName.textContent = `🏫 Ata Sohbet — ${m.label}`;

      const chatbox = document.getElementById('chatbox');
      if (chatbox && m.id !== 'normal') {
        addMessage('bot', `Sistem: ${m.label} moduna geçildi.`);
        let welcomeHtml = `🔄 <strong>${m.label} Modu Etkin!</strong><br><small>${m.desc}</small>`;
        
        // Yaratıcı moda özel interaktif butonlar ekle
        if (m.id === 'yaratici') {
           welcomeHtml += `<div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
             <button class="chip" style="font-size:0.85rem; padding:6px 12px; background:var(--acc); color:#fff; border-radius:12px;" onclick="const inp=document.getElementById('userInput'); inp.value='Bana fantastik bir hikaye yaz'; document.getElementById('btnSendMessage').click();">✍️ Hikaye Yaz</button>
             <button class="chip" style="font-size:0.85rem; padding:6px 12px; background:#10b981; color:#fff; border-radius:12px;" onclick="const inp=document.getElementById('userInput'); inp.value='Doğa hakkında kısa bir şiir yaz'; document.getElementById('btnSendMessage').click();">📜 Şiir Yaz</button>
             <button class="chip" style="font-size:0.85rem; padding:6px 12px; background:#f59e0b; color:#fff; border-radius:12px;" onclick="const inp=document.getElementById('userInput'); inp.value='Uçan bir araba resmi oluştur'; document.getElementById('btnSendMessage').click();">🖼️ Resim Oluştur</button>
           </div>`;
        }
        
        appendMessage('bot', formatMessage('bot', welcomeHtml));
        chatbox.scrollTop = chatbox.scrollHeight;
      }
    });
    container.appendChild(btn);
  });
}
