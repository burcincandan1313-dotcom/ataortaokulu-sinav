const fs = require('fs');

let content = fs.readFileSync('src/app.js', 'utf8');

const correctBlock = `       const konular = ['Uzayda yaşam', 'Dinozorlar', 'İnsan beyni', 'Yapay zeka', 'Denizaltı volkanları', 'Antik Mısır', 'DNA', 'Kara delikler', 'Robotlar', "Atatürk'ün çocukluğu", 'Mucitler', 'Matematik tarihi', "Dünya'nın katmanları", 'Mikroplar', 'Gökkuşağı nasıl oluşur', "İstanbul'un fethi", 'Hayvan iletişimi', 'Volkanlar', 'Gezegenler', 'Fotosintez'];
       const secilen = konular[Math.floor(Math.random() * konular.length)];
       const response = await askAI('Bana ' + secilen + ' hakkında ilginç ve eğitici bilgiler ver.', 'Sen bir eğitim asistanısın. Rastgele seçilen konu hakkında kısa, ilginç ve eğlenceli bilgiler ver. Emoji kullan. 2-3 paragraftan fazla olmasın.');
       addMessage('bot', response);
       toggleTypingIndicator(false);
       appendMessage('bot', formatMessage('bot', \`🎲 <b>Rastgele Konu: \${secilen}</b><br><br>\${response}\`));
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

  // ==== 2. YÜKLENİYOR & AI ROUTER SÜRECİ ====
  if (lw.startsWith('/ders')) {
     currentMode = 'ders';
  }

  setIsLoading(true);
  toggleTypingIndicator(true);
  updateBotStatus('🟢 Düşünüyor...', '#4ade80');
  
  try {
     // A. MASTER AI ROUTER
     const routerSystemPrompt = \`SEN = ATA Mentor (Akıllı Eğitim Asistanı)

ROLÜN:
Sen öğrencilere, gençlere ve kendini geliştirmek isteyen herkese yardım eden samimi, dostane ve inanılmaz bilgili bir eğitim mentorüsün.
Kötü, acımasız veya "robot" gibi davranmazsın. Tam tersine, karşıdakiyle arkadaş gibi, cesaretlendirici ve açıklayıcı konuşursun.

AMAÇ:
Kullanıcının sorduğu soruları çözmek, derslerinde ona yardım etmek, bilmediği şeyleri öğretmek ve ona normal bir sohbette eşlik etmek.

---

🔒 ANA KURALLAR:
* "Merhaba", "Nasılsın", "Selam" diyen birine GÜZELCE ve SICAK BİR ŞEKİLDE karşılık ver. (Sorguya çekme).
* Konuyu ANLAŞILIR ve NET açıkla. Öğrenci bir şey soruyorsa "Bilal'e anlatır gibi" ama zekice anlat.
* Eğer kullanıcı sadece sohbet ediyorsa, sen de onunla normal bir insan gibi, empati kurarak sohbet et.
* Kullanıcıyı asla azarlama, baskı kurma, "işkence çektirme".
* Her zaman yapıcı ve motive edici ol!

---

💡 ÖĞRETİM STİLİ:
Maddeler halinde, okunması kolay, emoji destekli ve akıcı metinler üret.
Sıkıcı ve uzun paragraf bloklarından kaçın.

SON MESAJ STİLİ:
Dostça, yardımsever ve aydınlatıcı.
Her zaman sonuna 'Başka merak ettiğin bir şey var mı?' veya benzeri destekleyici bir soru ekleyebilirsin.
\`; // PROMPT BİTER
`;

// regex ile yanlış parçayı düzelt
content = content.replace(/const konular = \['Uzayda.*?(?=Kullanıcıyı analiz eder)/s, correctBlock);

fs.writeFileSync('src/app.js', content, 'utf8');
console.log('App.js is fixed.');
