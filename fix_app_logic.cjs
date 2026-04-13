const fs = require('fs');

try {
  let appjs = fs.readFileSync('src/app.js', 'utf8');

  // Fix 1: 10 soruluk -> 5 soruluk
  if (appjs.includes('10 soruluk interaktif bir test')) {
    appjs = appjs.replace('10 soruluk interaktif bir test', '5 soruluk interaktif bir test');
    console.log('Fixed 1: 10 soruluk -> 5 soruluk');
  } else {
    console.log('Missed Fix 1');
  }

  // Fix 2: Insert Normal Sohbete Don button
  const htmlToInsertNormalBtn = 
`<button class="iq-result-btn primary" id="iqAnalyzeBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #ec4899, #8b5cf6); color:white; border:none; border-bottom:3px solid #7c3aed;">
             Sadece Yanlış Yaptığım Konuları Anlat
          </button>
          
          <button class="iq-result-btn" id="iqNormalChatBtn" style="padding:12px 20px;border-radius:12px;font-weight:bold; background:linear-gradient(90deg, #3b82f6, #06b6d4); color:white; border:none; border-bottom:3px solid #0284c7; margin-top: 10px;">
             Normal Sohbete Dön
          </button>`;
          
  const regexAnalyzeBtnRegex = /<button class=\"iq-result-btn primary\" id=\"iqAnalyzeBtn\"[^>]*>[\s\S]*?<\/button>/;
  if(regexAnalyzeBtnRegex.test(appjs)) {
     appjs = appjs.replace(regexAnalyzeBtnRegex, htmlToInsertNormalBtn);
     console.log('Fixed 2a: Inserted Normal Chat button in UI');
  } else {
     console.log('Missed Fix 2a');
  }

  // Fix 2b: Clear activeQuizSession on Analyze click
  const analyzeBtnEventStr = "document.getElementById('iqAnalyzeBtn')?.addEventListener('click', () => {\\n       const gameOverlay = document.getElementById('gameOverlay');\\n       if (gameOverlay) gameOverlay.style.display = 'none';";
  const analyzeBtnEventStrLF = "document.getElementById('iqAnalyzeBtn')?.addEventListener('click', () => {\n       const gameOverlay = document.getElementById('gameOverlay');\n       if (gameOverlay) gameOverlay.style.display = 'none';";
  const analyzeBtnEventStrCRLF = "document.getElementById('iqAnalyzeBtn')?.addEventListener('click', () => {\r\n       const gameOverlay = document.getElementById('gameOverlay');\r\n       if (gameOverlay) gameOverlay.style.display = 'none';";
  
  const analyzeBtnEventReplace = "document.getElementById('iqAnalyzeBtn')?.addEventListener('click', () => {\n       const gameOverlay = document.getElementById('gameOverlay');\n       if (gameOverlay) gameOverlay.style.display = 'none';\n\n       window.activeQuizSession = false;\n       currentMode = 'ders';";

  if (appjs.includes(analyzeBtnEventStrLF)) {
    appjs = appjs.replace(analyzeBtnEventStrLF, analyzeBtnEventReplace);
    console.log('Fixed 2b: Cleared activeQuizSession on Analyze click (LF)');
  } else if (appjs.includes(analyzeBtnEventStrCRLF)) {
    appjs = appjs.replace(analyzeBtnEventStrCRLF, analyzeBtnEventReplace);
    console.log('Fixed 2b: Cleared activeQuizSession on Analyze click (CRLF)');
  } else {
    // Regex fallback
    appjs = appjs.replace(/document\.getElementById\('iqAnalyzeBtn'\)\?\.addEventListener\('click', \(\) => \{\s*const gameOverlay = document\.getElementById\('gameOverlay'\);\s*if \(gameOverlay\) gameOverlay\.style\.display = 'none';/, analyzeBtnEventReplace);
    console.log('Fixed 2b Regex (Analyze Btn Session Clear)');
  }
  
  // Fix 2c: Add normal chat btn event
  const closeBtnEventStrRegex = /document\.getElementById\('iqCloseBtn'\)\?\.addEventListener\('click', \(\) => \{/g;
  
  const normalBtnEventStr = `    document.getElementById('iqNormalChatBtn')?.addEventListener('click', () => {
      const gameOverlay = document.getElementById('gameOverlay');
      if (gameOverlay) gameOverlay.style.display = 'none';
      window.activeQuizSession = false;
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
      window.activeQuizSession = false;`;

  if (closeBtnEventStrRegex.test(appjs)) {
     // replace the FIRST occurrence in renderResult, or just replace all because the other one is fine too
     appjs = appjs.replace(closeBtnEventStrRegex, normalBtnEventStr);
     console.log('Fixed 2c: Added normal chat event listener & cleared on close');
  } else {
     console.log('Missed Fix 2c');
  }

  // Fix 4: Ders Mode Discipline in Prompt
  const regexDersPrompt = /\[AKT.+F DERS BA.+LAMI\]:.*?Bu konuya odaklan\.\`;/s;
  if (regexDersPrompt.test(appjs)) {
     appjs = appjs.replace(regexDersPrompt, "[AKTİF DERS BAĞLAMI]: Öğrenci şu an ${studySelections.grade}. Sınıf \\\"${studySelections.subject}\\\" dersinin \\\"${studySelections.topic}\\\" konusunu çalışıyor. SADECE bu ders ve konuyla ilgili sorulara cevap ver! Diğer tüm konuları ve genel kültür sorularını kesinlikle 'Şu anda ${studySelections.subject} dersindeyiz, lütfen sadece bu dersle ilgili soru sor.' diyerek reddet.\`;");
     console.log('Fixed 4: Enforced ders mode discipline');
  } else {
     console.log('Missed Fix 4 (already patched or regex failed)');
     // let's try a simpler regex
     appjs = appjs.replace(/\[AKT(.+?)F DERS BA(.+?)LAMI\]:.*?\`;/s, "[AKTİF DERS BAĞLAMI]: Öğrenci şu an ${studySelections.grade}. Sınıf \\\"${studySelections.subject}\\\" dersinin \\\"${studySelections.topic}\\\" konusunu çalışıyor. SADECE bu ders ve konuyla ilgili sorulara cevap ver! Diğer tüm konuları ve genel kültür sorularını kesinlikle 'Şu anda ${studySelections.subject} dersindeyiz, lütfen sadece bu dersle ilgili soru sor.' diyerek reddet.\`;");
  }
  
  // Fix 5: Subject Interceptor
  const logoutFallbackStr = "// A. IKI? & SIFIRLAMA (Logout)";
  const logoutFallbackStr2 = "// A.";
  
  const interceptorCode = `  // ==== 0. SUBJECT WIZARD INTERCEPTOR ====
  const eduSubjects = ['matematik', 'türkçe', 'turkce', 'fen bilimleri', 'fen', 'sosyal bilgiler', 'sosyal', 'ingilizce', 'din kültürü', 'din', 'görsel sanatlar', 'bilişim', 'müzik', 'beden'];
  if (eduSubjects.some(sub => lw === sub || lw === sub + ' çalışmak istiyorum' || lw === sub + ' testi' || lw === sub + ' quiz')) {
     if (typeof openStudyWizard === 'function') {
        openStudyWizard();
        addMessage('bot', 'Dersi ' + msg + ' olarak seçtin.');
        appendMessage('bot', formatMessage('bot', '<b>Harika!</b> Çalışmak istediğin dersi anladım. Şimdi açılan menüden konunu seçebilirsin.'));
        return;
     }
  }\n\n  // A.`;

  if (appjs.includes("// A.")) {
    appjs = appjs.replace("// A.", interceptorCode);
    console.log('Fixed 5: Added wizard interceptor');
  }

  fs.writeFileSync('src/app.js', appjs, 'utf8');
  console.log('>>> APP.JS WRITE SUCCESS');

  // Fix HTML (10 soruda test edeyim -> 5 soruda test edeyim)
  let html = fs.readFileSync('index.html', 'utf8');
  if (html.includes('10 soruda test edeyim')) {
    html = html.replace(/10 soruda test edeyim/g, '5 soruda test edeyim');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('>>> INDEX.HTML WRITE SUCCESS (10 -> 5 soruda test edeyim)');
  }

} catch(e) {
  console.error(e);
}
