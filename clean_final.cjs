const fs = require('fs');

function cleanFile(file) {
  let txt = fs.readFileSync(file, 'utf8');
  let orig = txt;
  
  // Clean all instances of "ğÅ¸" followed by any non-whitespace garbage, replacing with 🟢 (for online) or 🔥 (if it's Motivasyon)
  txt = txt.replace(/ğÅ¸[^<]*Motivasyon/g, '🔥 Motivasyon');
  txt = txt.replace(/ğÅ¸[^\s<]*/g, '🟢');
  
  // Clean Ã¢Å¡â„¢️ and similar completely corrupted emojis in app.js
  txt = txt.replace(/Ã¢Å¡â„¢️/g, '⚔️');
  txt = txt.replace(/Ã¢ÂÂ¸️/g, '⏸️');
  txt = txt.replace(/Ã¢ÂÂ¹️/g, '⏹️');
  txt = txt.replace(/Ã¢ÂÂ¹/g, '⏹️');
  txt = txt.replace(/Ã¢â‚¬â„¢/g, "'");
  txt = txt.replace(/Ã¢â‚¬Â/g, "‍");
  
  // In duelArena, we might still have hex issues if they weren't caught
  // We already ran the hex script so it should be fine.
  
  if (orig !== txt) {
     fs.writeFileSync(file, txt, 'utf8');
     console.log('Cleaned up text in', file);
  }
}

['src/app.js', 'src/features/duelArena.js', 'index.html'].forEach(cleanFile);
