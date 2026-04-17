const fs=require('fs'); 
let content = fs.readFileSync('./src/curriculum.js', 'utf8'); 
content = content.replace(/'    'Müzik'/g, "'Müzik'"); 
fs.writeFileSync('./src/curriculum.js', content, 'utf8'); 
console.log('Syntax error fixed.');
