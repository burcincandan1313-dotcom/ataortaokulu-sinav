const fs = require('fs');

try {
  let app = fs.readFileSync('src/app.js', 'utf8');
  let style = fs.readFileSync('src/style.css', 'utf8');

  // ISSUE 1: Add ui-locked class when onboardingOverlay is shown
  
  // A. In initV17SystemWizard, add ui-locked explicitly because it's default opened.
  const initWizard = "function initV17SystemWizard() {\\n  const overlay = document.getElementById('onboardingOverlay');\\n  if (!overlay) return;";
  if (app.includes(initWizard)) {
      app = app.replace(initWizard, "function initV17SystemWizard() {\n  const overlay = document.getElementById('onboardingOverlay');\n  if (!overlay) return;\n  /* Kilit Modu (Sidebar) */\n  document.body.classList.add('ui-locked');");
      console.log('Fixed: Added ui-locked at initV17SystemWizard');
  } else {
      // Fallback
      app = app.replace("function initV17SystemWizard() {", "function initV17SystemWizard() {\n  document.body.classList.add('ui-locked');");
  }

  // B. Remove ui-locked everywhere overlay is closed
  app = app.replace(/overlay\.style\.display = 'none';/g, "overlay.style.display = 'none';\n    document.body.classList.remove('ui-locked');");
  app = app.replace(/overlay\.classList\.add\('hidden'\);/g, "overlay.classList.add('hidden');\n    document.body.classList.remove('ui-locked');");

  // ISSUE 2: Fix 2nd grade Hayat Bilgisi random fetch bug in memory overlay
  
  const memYesStr = "document.getElementById('btnMemYes')?.addEventListener('click', () => {\\n         overlay.style.display = 'none';\\n    document.body.classList.remove('ui-locked');\\n         const gradeStr = (latestFailedGrade === 'lise' || latestFailedGrade === 'genel') ? \"Lise\" : \\n`${latestFailedGrade}. Sınıf`;\\n         \\n         const input = document.getElementById('userInput');";
  
  const memYesStrLF = "document.getElementById('btnMemYes')?.addEventListener('click', () => {\n         overlay.style.display = 'none';\n    document.body.classList.remove('ui-locked');\n         const gradeStr = (latestFailedGrade === 'lise' || latestFailedGrade === 'genel') ? \"Lise\" : \n`${latestFailedGrade}. Sınıf`;\n         \n         const input = document.getElementById('userInput');";

  const replaceMemYesStr = `document.getElementById('btnMemYes')?.addEventListener('click', () => {
         overlay.style.display = 'none';
         document.body.classList.remove('ui-locked');
         const gradeStr = (latestFailedGrade === 'lise' || latestFailedGrade === 'genel') ? "Lise" : \`\${latestFailedGrade}. Sınıf\`;
         
         // Zayıf konu hafızasından quiz gönderilirken sistemi o derse odakla (Hata vermemesi için)
         if(typeof studySelections !== 'undefined') {
            studySelections.grade = latestFailedGrade;
            studySelections.subject = latestFailedSubject;
            studySelections.topic = 'Eksik Telafisi';
         }

         const input = document.getElementById('userInput');`;

  // Actually, I'll just use regex to target the btnMemYes block reliably due to multiline nuances.
  const regexMemYes = /document\.getElementById\('btnMemYes'\)\?\.addEventListener\('click', \(\) => \{\s*overlay\.style\.display = 'none';\s*document\.body\.classList\.remove\('ui-locked'\);\s*const gradeStr = \(latestFailedGrade === 'lise' \|\| latestFailedGrade === 'genel'\) \? \"Lise\" :[\s\S]*?\`;\s*const input = document\.getElementById\('userInput'\);/;

  if (regexMemYes.test(app)) {
     app = app.replace(regexMemYes, replaceMemYesStr);
     console.log('Fixed: Memory Yes button fixes studySelections bug');
  } else {
     console.log('Warn: btnMemYes regex failed. Applying fallback.');
     app = app.replace(/const input = document\.getElementById\('userInput'\);/, "if(typeof studySelections !== 'undefined') { studySelections.grade = latestFailedGrade; studySelections.subject = latestFailedSubject; studySelections.topic = 'Eksik Analizi'; }\n         const input = document.getElementById('userInput');");
  }

  // ISSUE 1 CSS: Inject UI Locked CSS into style.css
  if (!style.includes('.ui-locked .sidebar')) {
      style += `
/* ==================================
   UI LOCKED MODE (ONBOARDING)
   ================================== */
body.ui-locked .sidebar {
  position: relative;
}
body.ui-locked .sidebar::after {
  content: "Önce seni tanımama izin ver, testi çöz!";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #f1f5f9;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: not-allowed;
  border-radius: 16px;
  padding: 20px;
}
body.ui-locked .sidebar:hover::after {
  opacity: 1;
}

body.ui-locked #btnFeedbackBubble {
  pointer-events: none;
  opacity: 0.5;
}
`;
      console.log('Fixed: Added CSS for ui-locked to style.css');
  }

  fs.writeFileSync('src/app.js', app, 'utf8');
  fs.writeFileSync('src/style.css', style, 'utf8');

} catch(e) {
  console.error(e);
}
