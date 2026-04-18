const fs = require('fs');

let app = fs.readFileSync('src/app.js', 'utf8');

app = app.replace(/ğ.*?🎓/g, '👨‍🎓');
app = app.replace(/👩.*?🎓/g, '👩‍🎓');
app = app.replace(/🧓.*?💻/g, '🧓‍💻');
app = app.replace(/👩.*?💻/g, '👩‍💻');
app = app.replace(/🦸.*?♀️/g, '🦸‍♀️');
app = app.replace(/🧙.*?♀️/g, '🧙‍♀️');
app = app.replace(/🧓.*?🔬/g, '🧓‍🔬');
app = app.replace(/ğ.*?🍳/g, '👨‍🍳');
app = app.replace(/👩.*?🚀/g, '👩‍🚀');
app = app.replace(/🧓.*?🎓/g, '🧓‍🎓');

app = app.replace(/Ã.*?¸️ Duraklat/g, '⏸️ Duraklat');
app = app.replace(/Ã.*?¹️ Bitir/g, '⏹️ Bitir');
app = app.replace(/Ã.*?¸️ Duraklatıldı/g, '⏸️ Duraklatıldı');
app = app.replace(/Ã.*?¹️ Zamanlayıcı durduruldu\./g, '⏹️ Zamanlayıcı durduruldu.');
app = app.replace(/Ã.*?¹ Sinavi Bitir/g, '⏹️ Sinavi Bitir');

fs.writeFileSync('src/app.js', app, 'utf8');
console.log('Fixed app.js');

let css = fs.readFileSync('src/style.css', 'utf8');
css = css.replace(/BAÅžLIK/g, 'BAŞLIK');
css = css.replace(/DEÄžİÅžTİR/g, 'DEĞİŞTİR');
css = css.replace(/Aï¿½ILIï¿½/g, 'AÇILIŞ');
css = css.replace(/â• â• â• â• â• â• â•/g, '═══════');
css = css.replace(/â”€â”€/g, '──');
fs.writeFileSync('src/style.css', css, 'utf8');
console.log('Fixed style.css');
