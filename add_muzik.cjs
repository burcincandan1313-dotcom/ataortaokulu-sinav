const fs = require('fs');
let content = fs.readFileSync('./src/curriculum.js', 'utf8');

const muzikte = `    'Müzik': ["1. Ünite: Müziksel Algı ve Bilgilenme - Temel ritim ve ezgi kavramlarının tanınması, ses ayırt etme çalışmaları.", "2. Ünite: Müziksel Tasarım - Ritim eşliği çalışmaları, basit ezgi oluşturma, yaratıcı dans ve hareket.", "3. Ünite: Müzik Kültürü - Çocuk şarkıları, geleneksel Türk müziği örnekleri, şarkılar, türküler ve marşlar.", "4. Ünite: Müziksel Söyleme ve Çalma - Şarkı söyleme teknikleri, nefes açma, müzikli dramatizasyon ve öyküler."],`;

for(let i=1; i<=8; i++) {
    const regex = new RegExp('(' + i + ': \\{[\\s\\S]*?)(Görsel Sanatlar|Beden Eğitimi|Oyun ve Fiziki Etkinlikler|Bilişim Teknolojileri|Din Kültürü|İngilizce)', 'm');
    content = content.replace(regex, '$1' + muzikte + '\n    \'$2');
}

fs.writeFileSync('./src/curriculum.js', content, 'utf8');
console.log('Müzik eklendi.');
