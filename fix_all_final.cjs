const fs = require('fs');

function fixMojibake(file) {
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, 'utf8');
  let orig = text;
  
  const reps = [
    ['ÄŸÅ¸â€ Â¥', '🔥'],
    ['ÄŸÅ¸Å¸Â¢', '🟢'],
    ['Ã¢â€ â€™', '→'],
    ['Ã¢â‚¬â„¢', "'"],
    ['ÃŸ_Å€DÃ¥¥', '🔥'],
    ['ÃŸ_Å€D', '🔥'],
    ['Ã¢Å¡â„¢️', '⚔️'],
    ['Ã¢Â Â¸️', '⏸️'],
    ['Ã¢Â Â¹️', '⏹️'],
    ['Ã¢Â Â¹', '⏹️'],
    ["Ata Ortaokulu'a", "Ata Ortaokulu'na"]
  ];
  
  for (const [bad, good] of reps) {
    text = text.split(bad).join(good);
  }
  
  if (text !== orig) {
    fs.writeFileSync(file, text, 'utf8');
    console.log('Fixed', file);
  }
}

['src/app.js', 'src/features/duelArena.js', 'index.html'].forEach(fixMojibake);
