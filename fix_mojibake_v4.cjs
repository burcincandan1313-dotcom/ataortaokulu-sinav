const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const map = {
  'Ä±': 'ı',
  'Ä°': 'İ',
  'ÅŸ': 'ş',
  'Åž': 'Ş',
  'ÄŸ': 'ğ',
  'Äž': 'Ğ',
  'Ã§': 'ç',
  'Ã‡': 'Ç',
  'Ã¶': 'ö',
  'Ã–': 'Ö',
  'Ã¼': 'ü',
  'Ãœ': 'Ü',
  'ÂŠ”Ï¸': '⚔️',
  'âŠ”ï¸': '⚔️',
  'âš”ï¸': '⚔️',
  '⚔️ï¸': '⚔️' // Sometimes double-emoji artifact
};

const extensions = ['.js', '.html', '.css'];

function fixFile(f) {
  if (!extensions.includes(path.extname(f))) return;
  let text = fs.readFileSync(f, 'utf8');
  let orig = text;
  
  for (let [bad, good] of Object.entries(map)) {
    text = text.split(bad).join(good);
  }
  
  if (text !== orig) {
    fs.writeFileSync(f, text, 'utf8');
    console.log('Fixed:', f);
  }
}

walkDir('src', fixFile);
fixFile('index.html');
