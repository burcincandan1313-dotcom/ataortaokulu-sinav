const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');

  // Change 1: Add opacity and pointer-events to the target details block
  // Target string:
  //        <!-- 2. Oyun & Etkinlik -->
  //        <details class="sb-accordion">
  //          <summary class="sb-summary">🎮 Oyun & Etkinlik</summary>

  const targetStr1 = '<summary class="sb-summary">🎮 Oyun & Etkinlik</summary>';
  const replaceStr1 = '<summary class="sb-summary">🎮 Oyun & Etkinlik (Kilitli 🔒)</summary>';
  
  if (html.includes(targetStr1)) {
    html = html.replace(targetStr1, replaceStr1);
    
    // Also add disabled styles to the details tag containing it
    const detailsRegex = /<!-- 2\. Oyun & Etkinlik -->\s*<details class="sb-accordion">/g;
    if (detailsRegex.test(html)) {
      html = html.replace(detailsRegex, '<!-- 2. Oyun & Etkinlik -->\n       <details class="sb-accordion" style="opacity: 0.5; filter: grayscale(100%); pointer-events: none;" title="Bu alan eğitim modunda devre dışıdır.">');
    }
    
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fixed: Disabled Oyun & Etkinlik accordion.');
  } else {
    console.log('Could not find the target string in index.html');
  }

} catch(e) {
  console.error(e);
}
