const fs = require('fs');
const path = require('path');

const suspiciousPrefixes = ['ğ', 'Ã', 'Ä', 'Å', 'â', 'ï'];
const normalTurkish = /[a-z A-Z0-9.,!?(){}\[\]'\"ıiöoüuçcşs-]/i;

const results = [];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.html') || fullPath.endsWith('.css')) {
      const text = fs.readFileSync(fullPath, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        let hasMojibake = false;
        let match = "";
        
        for (let j = 0; j < line.length; j++) {
           const char = line[j];
           if (['Ã', 'Ä', 'Å', 'â', 'ï'].includes(char)) {
               hasMojibake = true;
               match = line.substring(Math.max(0, j-10), Math.min(line.length, j+20));
               break;
           }
           if (char === 'ğ') {
               const nextChar = line[j+1];
               if (nextChar && !normalTurkish.test(nextChar) && nextChar !== ' ' && nextChar !== '\r' && nextChar !== '\n') {
                   hasMojibake = true;
                   match = line.substring(Math.max(0, j-10), Math.min(line.length, j+20));
                   break;
               }
           }
        }
        
        if (hasMojibake) {
           results.push({ file: fullPath, lineNum: i + 1, match });
        }
      });
    }
  }
}

searchDir('src');
if (fs.existsSync('index.html')) {
   const text = fs.readFileSync('index.html', 'utf8');
   text.split('\n').forEach((line, i) => {
      let hasMojibake = false;
      let match = "";
      for (let j = 0; j < line.length; j++) {
           const char = line[j];
           if (['Ã', 'Ä', 'Å', 'â', 'ï'].includes(char)) {
               hasMojibake = true;
               match = line.substring(Math.max(0, j-10), Math.min(line.length, j+20));
               break;
           }
           if (char === 'ğ') {
               const nextChar = line[j+1];
               if (nextChar && !normalTurkish.test(nextChar) && nextChar !== ' ' && nextChar !== '\r' && nextChar !== '\n') {
                   hasMojibake = true;
                   match = line.substring(Math.max(0, j-10), Math.min(line.length, j+20));
                   break;
               }
           }
      }
      if(hasMojibake) results.push({ file: 'index.html', lineNum: i + 1, match });
   });
}

console.log(JSON.stringify(results, null, 2));
