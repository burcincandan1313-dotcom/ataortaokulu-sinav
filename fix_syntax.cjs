const fs = require('fs');
let txt = fs.readFileSync('src/app.js', 'utf8');
txt = txt.replace(/{ icon: '🟢 name: 'Mega Beyin', earned: state\.xp > 0 },/g, "{ icon: '🧠', name: 'Mega Beyin', earned: state.xp > 0 },");
txt = txt.replace(/{ icon: '🟢 name: 'Sohbet Ustası', earned: state\.messages\.length >= 5 },/g, "{ icon: '💬', name: 'Sohbet Ustası', earned: state.messages.length >= 5 },");
txt = txt.replace(/{ icon: '🟢 name: '3 Günlük Seri', earned: streak >= 3 },/g, "{ icon: '🔥', name: '3 Günlük Seri', earned: streak >= 3 },");
txt = txt.replace(/{ icon: '🟢 name: '7 Günlük Seri', earned: streak >= 7 },/g, "{ icon: '🚀', name: '7 Günlük Seri', earned: streak >= 7 },");
txt = txt.replace(/{ icon: '🟢 name: 'Efsanevi', earned: state\.level >= 5 },/g, "{ icon: '👑', name: 'Efsanevi', earned: state.level >= 5 },");
fs.writeFileSync('src/app.js', txt, 'utf8');
