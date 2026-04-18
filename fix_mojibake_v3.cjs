const fs = require('fs');

const files = [
  'index.html',
  'src/app.js',
  'src/style.css',
  'src/features/duelArena.js',
  'src/features/characterProfile.js',
  'src/state.js'
];

const map = {
  'ÄŸÅ¸â€ â€ ': '🔔',
  'ÄŸÅ¸â€˜Â ': '👍',
  'Ã…Âžimdi': 'Şimdi',
  'ÄŸÅ¸ÂŽâ€°': '🎉',
  'ÄŸÅ¸â€™Âª': '💪',
  'ÄŸÅ¸Â â€¢': '🎙️',
  'Ata OrtaokuluÃ¢â€ â€™a': "Ata Ortaokulu'na",
  'Ata OrtaokuluÃ¢â‚¬â„¢a': "Ata Ortaokulu'na",
  "Ata Ortaokulu\\'a": "Ata Ortaokulu'na",
  "Ata OrtaokuluÃ¢â‚¬â„¢": "Ata Ortaokulu'nun", // Handle general case if it's there
  'ÄŸÅ¸Â\x8Eâ€œ': '🎓',
  'Ã¯Â¸Â\x8F': '️',
  'Ã¢Å¡Â': '⚡',
  'Ã¢â€': '→',
  'Ã‚Â·': '·',
  'Ã…Â\x9E': 'Ş'
};

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let text = fs.readFileSync(f, 'utf8');
  let orig = text;
  
  for (let [bad, good] of Object.entries(map)) {
    text = text.split(bad).join(good);
  }
  
  if (text !== orig) {
    fs.writeFileSync(f, text, 'utf8');
    console.log('Fixed additional mojibake in', f);
  }
});
