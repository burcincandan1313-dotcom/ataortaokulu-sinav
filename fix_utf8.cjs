const fs = require('fs');
const files = [
  'index.html',
  'src/app.js',
  'src/style.css',
  'src/features/duelArena.js',
  'src/features/characterProfile.js',
  'src/features/quests.js',
  'src/features/skillTree.js',
  'src/state.js'
];

const map = {
  'ÃƒÂ¼': 'ü',
  'ÃƒÂ¶': 'ö',
  'Ã„Å¸': 'ğ',
  'ÃƒÂ§': 'ç',
  'Ã…Å¸': 'ş',
  'Ã„Â±': 'ı',
  'Ãƒâ€“': 'Ö',
  'Ã„Å¾': 'Ğ',
  'ÃƒÅ“': 'Ü',
  'Ãƒâ€¡': 'Ç',
  'Ã…Å¾': 'Ş',
  'Ã„Â°': 'İ',
  'Ã¢â‚¬â€': '—',
  'Ã¢â‚¬â„¢': "'",
  'ÄŸÅ¸Å¡â‚¬': '🚀',
  'ÄŸÅ¸ÂŽÂ¤': '🎤',
  'ÄŸÅ¸â€œÅ¡': '📚',
  'ÄŸÅ¸Å’â„¢': '🌙',
  'ÄŸÅ¸Â¤â€“': '🤖',
  'ÄŸÅ¸â€™Â¡': '💡',
  'ÄŸÅ¸ÂŽÂ¯': '🎯',
  'Ã¢Å’Â¨Ã¯Â¸Â': '⌨️',
  'BugÃ¼n': 'Bugün',
  'Ã¶ÃŸreneceksin': 'öğreneceksin',
  'Ã¶': 'ö',
  'Ã¼': 'ü',
  'Ã§': 'ç',
  'ÃŸ': 'ğ',
  'Ã±': 'ı',
  'Ã¾': 'ş',
  'Ã–': 'Ö',
  'Ãœ': 'Ü',
  'Ã‡': 'Ç',
  'Ãž': 'Ş',
  'Ã\x9F': 'ğ', // sometimes ÃŸ is encoded this way
  'EÃŸitim': 'Eğitim',
  'EÄŸitim': 'Eğitim',
  'AkÄ±llÄ±': 'Akıllı',
  'Ã§alÄ±ÅŸÄ±r': 'çalışır',
  'Ata Ortaokulu Sohbet Program - EYitim Odakl Akll Chatbot': 'Ata Ortaokulu Sohbet Programı - Eğitim Odaklı Akıllı Chatbot',
  'EYitim Odakl Akll Chatbot': 'Eğitim Odaklı Akıllı Chatbot',
  'baYmsz alYr': 'bağımsız çalışır',
  'GoVENLK NOTU (-Yretmen iin)': 'GÜVENLİK NOTU (Öğretmen için)'
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
    console.log('Fixed mojibake in', f);
  }
});
