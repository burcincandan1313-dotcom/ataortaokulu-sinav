const fs = require('fs');

const appFile = 'src/app.js';
let appText = fs.readFileSync(appFile, 'utf8');
let origApp = appText;

const replacements = [
  ['ÄŸÅ¸â€ Â¥', '🔥'],
  ['ÄŸÅ¸Å¸Â¢', '🟢'],
  ['Ã¢â€ â€™', '→'],
  ['Ã¢â‚¬â„¢', "'"],
  ['ÃŸ_Å€DÃ¥¥', '🔥'],
  ['ÃŸ_Å€D', '🔥'],
  ['Ã¢Å¡â„¢️', '⚔️'],
  ['Ã¢ÂÂ¸️', '⏸️'],
  ['Ã¢ÂÂ¹️', '⏹️'],
  ['Ã¢ÂÂ¹', '⏹️'],
  ['Ata Ortaokulu\\'a', "Ata Ortaokulu'na"]
];

for (const [bad, good] of replacements) {
  appText = appText.split(bad).join(good);
}

if (appText !== origApp) {
  fs.writeFileSync(appFile, appText, 'utf8');
  console.log('Fixed app.js safely');
}
