import fs from 'fs';
let content = fs.readFileSync('src/features/duelArena.js', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/features/duelArena.js', content, 'utf8');
