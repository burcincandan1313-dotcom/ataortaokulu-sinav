const fs = require('fs');
let txt = fs.readFileSync('src/app.js', 'utf8');
txt = txt.replace(/b\.icon : '🟢<\/span>/g, "b.icon : '🔒'}</span>");
fs.writeFileSync('src/app.js', txt, 'utf8');
