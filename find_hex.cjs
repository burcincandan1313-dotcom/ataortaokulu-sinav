const fs = require('fs');

function findBad(f) {
  let txt = fs.readFileSync(f, 'utf8');
  let regex = /[a-zA-Z]*[ÄÅâÂ][\x00-\x7F]*/g;
  let matches = txt.match(regex);
  if (matches) {
    let unique = [...new Set(matches.map(m => m.trim().substring(0, 20)))];
    console.log(f, unique.map(u => ({ text: u, hex: Buffer.from(u).toString('hex') })));
  }
}

findBad('src/features/duelArena.js');
findBad('src/app.js');
