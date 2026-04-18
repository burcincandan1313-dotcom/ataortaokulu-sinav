const fs = require('fs');

const files = [
  'src/app.js',
  'src/style.css',
  'src/features/duelArena.js',
  'src/features/characterProfile.js',
  'src/state.js'
];

// Complex dictionary of mojibake and their decoded values
const map = {
  'ÄŸÅ¸â€ Â¥': '🔥',
  'Ã¢â€¢Â\x90': '═',
  'Ã¢â€¢Â': '═',
  'Ã¢Å“â€¢': '✖',
  'Ã¢Å“â€¦': '✅',
  'Ã¢Å“Â Ã¯Â¸Â ': '✍️',
  'Ã¢Â Â±Ã¯Â¸Â ': '⏱️',
  'Ã¢Å¡Â¡': '⚡',
  'Ã…Âž': 'Ş',
  'Ã„Âž': 'Ğ',
  'Ã¢â€”â‚¬': '◀',
  'Ã¢Ëœâ‚¬Ã¯Â¸Â ': '☀️',
  'Ã¢Ëœâ‚¬Ã¯Â¸Â\x8F': '☀️',
  'Ã¢â€ â€™': '→',
  'Ã¢â‚¬â„¢a': "'a",
  'Ã¢â‚¬â„¢': "'",
  'Ã¢â‚¬Â¢': '•',
  'Ã¢â€“Â¶Ã¯Â¸Â ': '▶️',
  'Ã¢Â\x8FÂ¹Ã¯Â¸Â ': '⏹️',
  'Ã¢Â\x8FÂ¸Ã¯Â¸Â ': '⏸️',
  'Ã¢Å¡â„¢Ã¯Â¸Â ': '⚙️',
  'Ã„Â\x9Eİ': 'Ğİ',
  'Ã¢Â\x8FÂ³': '⏳',
  'Ã¢Â\x9DÅ’': '❌',
  'Ã¢Å“â€“': '✨',
  'Ã¢â€\x9Dâ‚¬': '─',
  'Ã…Â\x9Eı': 'Şı',
  'Ã…Â\x9Eİ': 'Şİ',
  'Ã„Â\x9E': 'Ğ',
  'Ã¢Â­Â\x90': '⭐',
  'Ata OrtaokuluÃ¢â‚¬â„¢a': "Ata Ortaokulu'na", // Just in case it's specifically this
  "Ata Ortaokulu\\'a": "Ata Ortaokulu'na",
  "Ata Ortaokulu\\'nun": "Ata Ortaokulu'nun",
  'ÃŸ_Å€DÃ¥¥': '🔥', // From screenshot
  'ÄŸÅ¸Â\x8Eâ€œ': '🎓',
  'ÄŸÅ¸â€˜Â©': '👩',
  'ÄŸÅ¸Â§â€™': '🧑',
  'ÄŸÅ¸Â§â€˜': '🧓',
  'ÄŸÅ¸â€™Â»': '💻',
  'ÄŸÅ¸Â¦Â¸': '🦸',
  'Ã¢â„¢â‚¬Ã¯Â¸Â\x8F': '♀️',
  'ÄŸÅ¸Â§â„¢': '🧙',
  'ÄŸÅ¸â€\x9DÂ¬': '🔬',
  'ÄŸÅ¸Â\x8DÂ³': '🍳',
  'Ã¢Â\x8FÂ±Ã¯Â¸Â\x8F': '⏱️',
  'Ã¢Å“Â\x8FÃ¯Â¸Â\x8F': '✍️'
};

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let text = fs.readFileSync(f, 'utf8');
  let orig = text;
  
  // Custom manual replacements for common double encodings
  for (let [bad, good] of Object.entries(map)) {
    text = text.split(bad).join(good);
  }
  
  if (text !== orig) {
    fs.writeFileSync(f, text, 'utf8');
    console.log('Fixed additional mojibake in', f);
  }
});
