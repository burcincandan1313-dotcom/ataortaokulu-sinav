const fs = require('fs');

const files = [
  'src/app.js',
  'src/features/duelArena.js',
  'src/features/testWizard.js',
  'src/curriculum.js',
  'index.html',
  'src/api.js'
];

const exactMap = {
  // From duelArena.js
  'ğŸ§‘â€ ğŸŽ“': '🧑‍🎓',
  'â ±ï¸ ': '⏱️',
  'âœ–': '✖️',
  
  // From app.js
  'ğÅ¸â€ Â¥': '🔥',
  'ğÅ¸Å’Å¸': '🌟',
  'ğÅ¸ÂŽÂ®': '🎮',
  'ğÅ¸â€œâ€¹': '📋',
  'ğÅ¸Â â€¢': '🐶',
  'ğÅ¸ÂŽÂ¨': '🎨',
  'ğÅ¸â€œâ€¦': '📅',
  'ğÅ¸â€”â€˜️': '🗑️',
  'ğÅ¸Â â€¦': '🍅',
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
  'ğÅ¸ËœÂ´': '😴',
  'ğÅ¸â€ Â´': '🔴',
  'ğÅ¸â€œÅ“': '📜',
  'ğÅ¸â€œâ€ž': '📄',
  'ğÅ¸â€œâ€“': '📚',
  'ğÅ¸â€˜Â¥': '👥',
  'ğÅ¸â€˜Â¦': '👦',
  'ğÅ¸â€˜Â§': '👧',
  '→“Â¶️': '▶️',
  
  // Additional from screenshot 2 (Test Sihirbazi items inside app.js)
  'ğŸ§™â€ ♂️': '🧙‍♂️',
  'ğŸ“‹': '📋',
  'ğŸ“‰': '📝',
  'ğŸ§²': '🧩',
  
  // Actually look at the screenshot!
  // Test Sihirbazi -> 🧙‍♂️
  // Çoktan Seçmeli -> 📋
  // Boşluk Doldurma -> 📝
  // Karma Soru -> 🧩
};

let totalReplacements = 0;

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let text = fs.readFileSync(f, 'utf8');
  let origText = text;
  
  // Replace all keys
  for (const [bad, good] of Object.entries(exactMap)) {
    text = text.split(bad).join(good);
  }
  
  // For Test Wizard which is in app.js or html
  // We can just regex replace the specific strings with the emojis to be 100% sure!
  text = text.replace(/<div[^>]*>\s*[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Test Sihirbazı/g, '<div>🧙‍♂️ Test Sihirbazı');
  text = text.replace(/<button[^>]*>\s*[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Çoktan Seçmeli/g, '<button class="test-type-btn" data-type="mcq">📋 Çoktan Seçmeli');
  text = text.replace(/<button[^>]*>\s*[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Boşluk Doldurma/g, '<button class="test-type-btn" data-type="fill">📝 Boşluk Doldurma');
  text = text.replace(/<button[^>]*>\s*[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Karma Soru/g, '<button class="test-type-btn" data-type="mixed">🧩 Karma Soru');
  text = text.replace(/<button[^>]*>\s*[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Geri/g, '<button onclick="closeTestWizard()" class="tw-btn" style="background:var(--bg3);color:var(--text);"><i class="fa fa-arrow-left"></i> Geri');
  text = text.replace(/[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Ata Sohbet — /g, '🧑‍🎓 Ata Sohbet — ');
  text = text.replace(/[ğÃÂâÄÅ][\x80-\xFF\w\s]*\s*Öneri:/g, '💡 Öneri:');
  
  if (text !== origText) {
    fs.writeFileSync(f, text, 'utf8');
    totalReplacements++;
    console.log('Cleaned', f);
  }
});

console.log('Total files cleaned:', totalReplacements);
