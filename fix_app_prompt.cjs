const fs = require('fs');
let app = fs.readFileSync('src/app.js', 'utf8');
if (app.includes('Bu konuya odaklan.')) {
   app = app.replace('Bu konuya odaklan.', 'SADECE bu ders ve konuyla ilgili sorulara cevap ver! Eğitim dışı veya başka derslerle ilgili soruları kesinlikle "Şu anda " + studySelections.subject + " dersindeyiz, lütfen sadece bu dersle ilgili soru sor." diyerek reddet.');
   fs.writeFileSync('src/app.js', app, 'utf8');
   console.log('Fixed 4');
} else {
   console.log('Not found');
}
