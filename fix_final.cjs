const fs = require('fs');
let txt = fs.readFileSync('src/features/duelArena.js', 'utf8');
txt = txt.replace(/ğŸ’€/g, '💀');
txt = txt.replace(/MAÄžLUBİYET/g, 'MAĞLUBİYET');
txt = txt.replace(/Åžıkları/g, 'Şıkları');
txt = txt.replace(/ğŸ†/g, '🏆');
txt = txt.replace(/âš”ï¸/g, '⚔️');
fs.writeFileSync('src/features/duelArena.js', txt, 'utf8');
console.log('Fixed');
