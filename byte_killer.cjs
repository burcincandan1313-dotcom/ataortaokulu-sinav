const fs = require('fs');

const files = ['src/app.js', 'src/features/duelArena.js'];

// Let's create an exhaustive mapping based on what dump_leftovers found
const replacements = [
  ['ğÅ¸Å’Â  Dünya', '🌍 Dünya'],
  ['ğÅ¸ÂŽÂ® Oyun', '🎮 Oyun'],
  ['ğÅ¸â€ Â¥', '🔥'],
  ['ğÅ¸Â â€ ', '🏆'],
  ['ğÅ¸ÂŽâ€“️', '🎯'],
  ['ğÅ¸â€ â€™', '➡️'],
  ['ğÅ¸Â â„¢', '🐙'],
  ['ğÅ¸Â Â ', '🐝'],
  ['ğÅ¸Â¦â€¢', '🦕'],
  ['ğÅ¸â€˜Â¨Ã¢â‚¬Â 🎓', '👨‍🎓'],
  ['ğÅ¸ÂŽÂ¨', '🎨'],
  ['ğÅ¸Â â€¦', '🍅'],
  ['ğÅ¸ÂŽâ€°', '🎉'],
  ['ğÅ¸â€ Â´', '🔴'],
  ['ğÅ¸ÂŽÂ¯', '🎯'],
  ['ğÅ¸Â Â½️', '🍽️'],
  ['ğÅ¸Â Â«', '🏫'],
  ['ğÅ¸Â¥â€¡', '🥇'],
  ['ğÅ¸Â¥Ë†', '🥈'],
  ['ğÅ¸Â¥â€°', '🥉'],
  ['ğÅ¸â€ Â¹', '🔺'],
  ['ğÅ¸Â â€¢', '🐶'],
  ['ğÅ¸â€˜Â¨Ã¢â‚¬Â 🍳', '👨‍🍳'],
  ['ğÅ¸â€¢Âµ️', '🕸️'],
  ['ğÅ¸ÂŽÂ²', '🎲'],
  ['ğÅ¸â€œÅ ', '📊'],
  ['ğÅ¸â€œÂ ', '📝'],
  ['ğÅ¸â€™Â¾', '💾'],
  ['ğÅ¸â€ Å ', '🔊'],
  ['ğÅ¸â€ â€¡', '🔉'],
  ['ğÅ¸Å’Â¡️', '🌡️'],
  ['ğÅ¸ÂŽÂ­', '🎬'],
  ['ğÅ¸â€œâ€ž', '📄'],
  ['ğÅ¸ÂŽÂ¤', '🎤'],
  ['ğÅ¸â€ â€ ', '🆕'],
  ['ğÅ¸â€˜Â ', '👏'],
  ['ğŸ †', '🏆'],
  ['ğŸ¤ ', '🤝']
];

files.forEach(f => {
  let buf = fs.readFileSync(f);
  
  replacements.forEach(([badStr, goodStr]) => {
    const badBuf = Buffer.from(badStr, 'utf8');
    const goodBuf = Buffer.from(goodStr, 'utf8');
    
    let index;
    while ((index = buf.indexOf(badBuf)) !== -1) {
      const before = buf.subarray(0, index);
      const after = buf.subarray(index + badBuf.length);
      buf = Buffer.concat([before, goodBuf, after]);
    }
  });

  // Also catch generic ğÅ¸ followed by junk and remove it if it wasn't matched
  // But wait, it's safer to just write the buffer now.
  fs.writeFileSync(f, buf);
  console.log('Processed', f);
});
