const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// Fix broken UTF-8 encoded symbols
// â–¼ = ▼ (U+25BC BLACK DOWN-POINTING SMALL TRIANGLE)
// â–² = ▲ (up triangle)
// The content property has wrong encoding

// Replace broken arrow character with proper CSS content
css = css.replace(
  '.sb-summary::after {\n  content: "\u00e2\u0096\u00bc"; font-size: 0.8rem; color: var(--sub); transition: transform 0.3s ease;\n}',
  '.sb-summary::after {\n  content: "\\276F"; font-size: 0.75rem; color: var(--sub); transition: transform 0.3s ease;\n}'
);

// Also try CRLF variant
css = css.replace(
  '.sb-summary::after {\r\n  content: "\u00e2\u0096\u00bc"; font-size: 0.8rem; color: var(--sub); transition: transform 0.3s ease;\r\n}',
  '.sb-summary::after {\r\n  content: "\\276F"; font-size: 0.75rem; color: var(--sub); transition: transform 0.3s ease;\r\n}'
);

// Check if fixed
if (css.includes('\u00e2\u0096\u00bc')) {
  // Still broken - do a broad replace
  css = css.replace(/content: "â–¼"/g, 'content: "\\276F"');
  css = css.replace(/content: "â–²"/g, 'content: "\\276F"');
  console.log('Broad replace applied');
}

// Also fix any other broken unicode
// â€™ = ' (apostrophe)
// â€œ = " (left quote)
// â€ = " (right quote)

// Check what's there now
const idx = css.indexOf('sb-summary::after');
console.log('After fix:', css.substring(idx, idx+120));

// Write as UTF-8 explicitly - Node writes UTF-8 by default
fs.writeFileSync('src/style.css', css, { encoding: 'utf8' });
console.log('style.css saved');

// Also fix the rotation for open state  
const openIdx = css.indexOf('.sb-accordion[open] .sb-summary::after');
if (openIdx > -1) {
  console.log('Open state:', css.substring(openIdx, openIdx+100));
}
