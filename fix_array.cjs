const fs = require('fs');
let app = fs.readFileSync('src/app.js', 'utf8');

const lines = app.split('\n');
lines[2362] = "        confirmButtonText: 'Harika! 👍',";
app = lines.join('\n');

fs.writeFileSync('src/app.js', app, 'utf8');
console.log('Fixed syntax error EXACTLY via array index.');
