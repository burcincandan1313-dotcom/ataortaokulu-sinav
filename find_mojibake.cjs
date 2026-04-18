const fs = require('fs');
const files = ['src/app.js', 'src/style.css', 'src/features/duelArena.js', 'src/features/characterProfile.js', 'src/state.js'];
let unique = new Set();
files.forEach(f => {
  if(!fs.existsSync(f)) return;
  const text = fs.readFileSync(f, 'utf8');
  // Match any sequence starting with Ã and continuing with non-ASCII or punctuation
  const regex = /Ã[^\s<a-zA-Z0-9]+/g;
  const matches = text.match(regex);
  if (matches) {
    matches.forEach(m => unique.add(m));
  }
});
console.log([...unique]);
