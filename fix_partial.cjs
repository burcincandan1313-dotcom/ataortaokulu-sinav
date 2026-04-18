const fs = require('fs');

const f = 'src/app.js';
let text = fs.readFileSync(f, 'utf8');
let orig = text;

const map = {
  'ğÅ¸â€ Â¥': '🔥',
  'ğÅ¸Å¸Â¢': '🟢',
  'ğÅ¸Å¸Â ': '🟢',
  'ğÅ¸Å¸': '🟢',
  'Ã¢â€ â€™': '→',
  'Ã¢â‚¬â„¢': "'",
  'ÃŸ_Å€DÃ¥¥': '🔥',
  'ÃŸ_Å€D': '🔥'
};

for (const [bad, good] of Object.entries(map)) {
  text = text.split(bad).join(good);
}

// Cleanup any weird combinations around Motivasyon Koçu and Çevrimiçi
text = text.replace(/ğÅ¸[^\s<]*/g, '🟢'); // Generic fallback for any other corrupted emoji

if (text !== orig) {
  fs.writeFileSync(f, text, 'utf8');
  console.log('Fixed additional mojibake in src/app.js');
}

// Also check index.html for Ata Ortaokulu'a just in case it's there
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes("Ortaokulu\\'a")) {
   html = html.replace(/Ata Ortaokulu\\'a/g, "Ata Ortaokulu'na");
   fs.writeFileSync('index.html', html, 'utf8');
}
