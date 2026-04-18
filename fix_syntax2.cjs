const fs = require('fs');
let txt = fs.readFileSync('src/app.js', 'utf8');

txt = txt.replace("if (statusEl && streak > 0 && !statusEl.textContent.includes('🟢 {", "if (statusEl && streak > 0 && !statusEl.textContent.includes('🔥')) {");
txt = txt.replace("if (!existing.includes('🟢 {", "if (!existing.includes('🔥')) {");
txt = txt.replace("🟢 x${streak}", "🔥 x${streak}");

fs.writeFileSync('src/app.js', txt, 'utf8');
