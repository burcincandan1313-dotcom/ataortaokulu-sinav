const fs = require('fs');
const files = ['src/app.js', 'src/features/duelArena.js', 'src/features/testWizard.js', 'index.html', 'src/style.css', 'src/curriculum.js'];

const allMatches = new Set();
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const strings = content.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g);
    if (strings) {
      strings.forEach(s => {
         // Find ANY string containing the typical mojibake characters
         if (s.match(/[ğÄÅÃâÂ]/) && s.match(/[\x80-\xFF]/)) {
             // Let's clean the quotes
             const clean = s.substring(1, s.length - 1);
             // We only care if it looks like broken UTF-8, e.g. multi-character gibberish
             if (clean.includes('ğŸ') || clean.includes('ğÅ') || clean.includes('â€') || clean.includes('Ã¢') || clean.includes('â±') || clean.includes('ÅŸ') || clean.includes('Ä±') || clean.includes('Ä°') || clean.includes('Ã§') || clean.includes('Ã¶') || clean.includes('Ã¼') || clean.includes('ÄŸ') || clean.includes('Â')) {
                 allMatches.add(clean);
             }
         }
      });
    }
  }
});

const sorted = [...allMatches].sort();
fs.writeFileSync('mojibakes.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Found', sorted.length, 'mojibake strings. Saved to mojibakes.json');
