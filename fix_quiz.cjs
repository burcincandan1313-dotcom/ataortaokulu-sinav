const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf-8');

const target = 'Sadece ve sadece saf JSON g\\u00f6nder!';
const targetAlt = 'Sadece ve sadece saf JSON g\u00f6nder!';

let updated = content.replace(target, ' 4. VIZYON: Geçmiş yıllarda çıkmış LGS ve YKS (ÖSS) sorularına benzer, muhakeme gücünü ölçen soruları tercih et.\\n  Sadece JSON gönder!');
if (updated === content) {
    updated = content.replace(targetAlt, ' 4. VIZYON: Geçmiş yıllarda çıkmış LGS ve YKS (ÖSS) sorularına benzer, muhakeme gücünü ölçen soruları tercih et.\\n  Sadece JSON gönder!');
}

if (updated === content) { // Maybe just replace the whole '3. CRITICAL:' block
    updated = content.replace(/3\. CRITICAL: Metinlerin i.inde asla ger.ek alt sat.r boşluğu(.*?)saf JSON g.nder!/ms, 
      "3. CRITICAL: Metinlerin icinde asla gercek alt satir boslugu kullanma.\\n  4. VİZYON: Tüm sorular kesinlikle çıkmış LGS veya YKS (ÖSS) sorularına benzer yapıda, mantık ve muhakeme tarzı yeni nesil sorular olmalıdır.\\n  Sadece ve sadece saf JSON dondur!");
}

fs.writeFileSync('src/app.js', updated, 'utf-8');
console.log(updated === content ? "Failed to replace" : "Successfully replaced");
