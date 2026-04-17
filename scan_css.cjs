const fs = require('fs');
const content = fs.readFileSync('src/style.css', 'utf8');

// Find content: properties
const matches = content.match(/content:\s*"[^"]+"/g);
if (matches) {
  console.log('Content properties found:');
  matches.forEach(m => console.log(' ', m));
}

// Check for mojibake patterns
const patterns = ['Ã©', 'Ã¶', 'Ã¼'];
patterns.forEach(p => {
  if (content.includes(p)) console.log('BROKEN:', p);
});
console.log('Scan done');
