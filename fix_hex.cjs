const fs = require('fs');
const path = require('path');

const hexMap = {
  // LOBİSİ
  '4c4f42c4b053c4b0': Buffer.from('LOBİSİ', 'utf8').toString('hex'),
  // SAVAŞA BAŞLA
  '53415641c385c29e41204241c385c29e4c4121': Buffer.from('SAVAŞA BAŞLA!', 'utf8').toString('hex'),
  // Ayarlarını
  '417961726c6172c384c2b16ec384c2b1': Buffer.from('Ayarlarını', 'utf8').toString('hex'),
  // savaşa
  '73617661c385c5b861': Buffer.from('savaşa', 'utf8').toString('hex'),
  // hazırlan
  '68617ac384c2b1726c616e': Buffer.from('hazırlan', 'utf8').toString('hex'),
  // Sayısı
  '536179c384c2b173c384c2b1': Buffer.from('Sayısı', 'utf8').toString('hex'),
  // Başına
  '4261c385c5b8c384c2b16e61': Buffer.from('Başına', 'utf8').toString('hex'),
  // Hızlı
  '48c384c2b17ac692c384c2b1': Buffer.from('Hızlı', 'utf8').toString('hex'),
  // ⚔️ (corrupted)
  'e29a94efb88fc28f': Buffer.from('⚔️', 'utf8').toString('hex')
};

function fixHex(f) {
  if (!fs.existsSync(f)) return;
  const buf = fs.readFileSync(f);
  let hex = buf.toString('hex');
  let origHex = hex;
  
  for (const [bad, good] of Object.entries(hexMap)) {
    hex = hex.split(bad).join(good);
  }
  
  if (hex !== origHex) {
    fs.writeFileSync(f, Buffer.from(hex, 'hex'));
    console.log('Fixed hex in', f);
  }
}

const files = [
  'src/features/duelArena.js',
  'src/app.js',
  'index.html',
  'src/style.css'
];

files.forEach(fixHex);
