const fs = require('fs');
let c = fs.readFileSync('src/app.js', 'utf8');
const m1 = c.indexOf('// UYGULAMA BAŞLATMA (INIT)');
if(m1 !== -1) {
   const start = c.lastIndexOf('// ══', m1);
   const m2 = c.indexOf("document.addEventListener('DOMContentLoaded', init);", m1);
   if (m2 !== -1) {
      // 50 characters is length of "document.addEventListener..." string 
      const lengthOfStr = "document.addEventListener('DOMContentLoaded', init);".length;
      c = c.substring(0, start) + c.substring(m2 + lengthOfStr);
      fs.writeFileSync('src/app.js', c);
      console.log('Fixed double init');
   } else {
      console.log('m2 not found');
   }
} else {
   console.log('m1 not found');
}
