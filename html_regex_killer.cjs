const fs = require('fs');

let f = 'src/features/duelArena.js';
if (fs.existsSync(f)) {
  let text = fs.readFileSync(f, 'utf8');
  let origText = text;

  // Replace the user avatar 
  text = text.replace(/<div style="font-size: 2rem;">[^<]+<\/div>\s*<div style="font-weight: bold; color: var\(--acc\);">Sen<\/div>/g, '<div style="font-size: 2rem;">🧑‍🎓</div>\n            <div style="font-weight: bold; color: var(--acc);">Sen</div>');

  // Replace the timer
  text = text.replace(/<div id="duelTimerBox"[^>]*>[^<]+<\/div>/g, '<div id="duelTimerBox" style="text-align: center; font-size: 2rem; font-weight: bold; font-family: monospace; color: #eab308; margin-bottom: 20px;">⏱️ ${this.maxTime}</div>');

  if (text !== origText) {
    fs.writeFileSync(f, text, 'utf8');
    console.log('Fixed duelArena.js with foolproof regex!');
  } else {
    console.log('No changes needed in duelArena.js or regex failed.');
  }
}

let appF = 'src/app.js';
if (fs.existsSync(appF)) {
  let text = fs.readFileSync(appF, 'utf8');
  let origText = text;
  
  // Let's aggressively fix the navbar stuff
  text = text.replace(/[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Ata Sohbet/g, '🧑‍🎓 Ata Sohbet');
  text = text.replace(/[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Öneri:/g, '💡 Öneri:');
  
  // Fix the "x2" streak logic which had the 🔥 emoji
  text = text.replace(/x\$\{streak\}<\/span>/g, 'x${streak}</span>').replace(/[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*x\$\{streak\}/g, '🔥 x${streak}');

  if (text !== origText) {
    fs.writeFileSync(appF, text, 'utf8');
    console.log('Fixed app.js with foolproof regex!');
  }
}
