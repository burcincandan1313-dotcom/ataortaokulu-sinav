const fs = require('fs');

const files = [
  'src/app.js',
  'src/features/duelArena.js',
  'src/features/testWizard.js',
  'src/curriculum.js',
  'index.html',
  'src/api.js'
];

const map = {
  // Screenshot 1: Duel Arena
  'ğŸ¥·': '🥷',
  'ğŸ§´â€‍ğŸ¤“': '🧑‍🎓',
  'â±ï¸': '⏱️',
  
  // Screenshot 2: Test Wizard
  'ğŸ§™â€â™‚ï¸': '🧙‍♂️',
  'ğŸ“â€œâ€¹': '📋',
  'ğŸ“â€œâ€°': '📝',
  'ğŸ§‚Â²': '🧩',
  '→ Â': '→',
  
  // Screenshot 3: Navbar
  'ğŸ¤“â€â™«': '🧑‍🎓',
  'ğŸ”¥': '🔥',
  
  // Screenshot 4: Recommendations
  'ğŸ’¡': '💡',
  
  // Others from mojibakes.json that are crucial
  'ğÅ¸Â§Â ': '🧠',
  'ğÅ¸Å’Â ': '🌍',
  'ğÅ¸ÂŽÂ®': '🎮',
  'ğÅ¸â€œâ€¹': '📋',
  'ğÅ¸Â â€¢': '🐶',
  'ğÅ¸ÂŽÂ¨': '🎨',
  'ğÅ¸â€œâ€¦': '📅',
  'ğÅ¸â€”â€˜️': '🗑️',
  'ğÅ¸Â â€¦': '🍅',
  'ğÅ¸â€ Â¥': '🔥',
  'Ã¢Â Â¸️': '⏸️',
  'Ã¢Â Â¹️': '⏹️',
  'ğÅ¸â€˜Â¨Ã¢â‚¬Â 🎓': '👨‍🎓',
  '👩Ã¢â‚¬Â 🎓': '👩‍🎓',
  'ğÅ¸â€œÂ ': '📝',
  'ğÅ¸â€“Â¼️': '🖼️',
  'ğÅ¸ÂŽâ€°': '🎉',
  'ğÅ¸â€™Â¬': '💬',
  'ğÅ¸Â â€ ': '🏆',
  'ğÅ¸Å¸Â¡': '🟡',
  'ğÅ¸â€ â€™': '➡️',
  'ğÅ¸ÂŽÂ¯': '🎯',
  'ğÅ¸ÂŽÂ²': '🎲',
  'ğÅ¸Â Â«': '🏫',
  'ğÅ¸Â§Â­': '👩‍💼',
  'ğÅ¸Â§Â®': '🧮',
  'ğÅ¸Â§Ëœ': '🧘',
  'ğÅ¸Å¡Âª': '🚪',
  'ğÅ¸Å’Å¸': '🌟',
  'ğÅ¸ËœÂ´': '😴',
  'ğÅ¸â€ Â´': '🔴',
  'ğÅ¸â€œÅ“': '📜',
  'ğÅ¸â€œâ€ž': '📄',
  'ğÅ¸â€œâ€“': '📚',
  'ğÅ¸â€˜Â¥': '👥',
  'ğÅ¸â€˜Â¦': '👦',
  'ğÅ¸â€˜Â§': '👧',
  
  // Fallbacks for broken Turkish characters missed previously
  'Ã§': 'ç',
  'Ã‡': 'Ç',
  'Ä±': 'ı',
  'Ä°': 'İ',
  'Ã¶': 'ö',
  'Ã–': 'Ö',
  'ÅŸ': 'ş',
  'Åž': 'Ş',
  'Ã¼': 'ü',
  'Ãœ': 'Ü',
  'ÄŸ': 'ğ',
  'Äž': 'Ğ',
  
  // Extra fallbacks
  'ğŸ †': '🏆',
  'ğŸ¤ ': '🤝',
  'ğŸ’€': '💀'
};

let totalReplacements = 0;

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let text = fs.readFileSync(f, 'utf8');
  let origText = text;
  
  // Replace all keys
  for (const [bad, good] of Object.entries(map)) {
    text = text.split(bad).join(good);
  }
  
  if (text !== origText) {
    fs.writeFileSync(f, text, 'utf8');
    totalReplacements++;
    console.log('Cleaned', f);
  }
});

console.log('Total files cleaned:', totalReplacements);
