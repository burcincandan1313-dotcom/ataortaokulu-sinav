const fs = require('fs');
const files = ['src/app.js', 'src/features/duelArena.js', 'src/features/testWizard.js'];

const allMatches = new Set();
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const strings = content.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g);
    if (strings) {
      strings.forEach(s => {
         if (s.includes('ğŸ') || s.includes('ğÅ') || s.includes('â€') || s.includes('Ã¢') || s.includes('â±ï¸')) {
             allMatches.add(s);
         }
      });
    }
  }
});
console.log(JSON.stringify([...allMatches].slice(0, 50), null, 2));
