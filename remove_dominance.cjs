const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Remove entire dominanceOverlay block
html = html.replace(/<!-- SYSTEM MODE: DOMINANCE -->[\s\S]*?<\/div>\s*\n/m, '\n');

// Also neutralize any remaining dom-overlay divs
html = html.replace(/<div id="dominanceOverlay"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m, '');

// Also remove the JS that triggers it from app.js
fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ Dominance overlay removed from index.html');
