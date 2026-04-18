const fs = require('fs');
const files = ['src/app.js', 'src/features/duelArena.js'];

files.forEach(f => {
  const text = fs.readFileSync(f, 'utf8');
  const matches = text.match(/(["'`])(?:(?=(\\?))\2.)*?\1/g);
  if (matches) {
    matches.forEach(m => {
      if (m.includes('ğŸ') || m.includes('ğÅ')) {
        console.log(f, '->', m);
      }
    });
  }
});
