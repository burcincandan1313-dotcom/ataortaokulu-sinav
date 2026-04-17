const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// Find and replace ALL broken encoded characters in CSS
// The issue is CSS file was saved in wrong encoding - â–¼ should be ▼
// But instead of trying to match the exact broken sequence, let's use regex on byte level

// Count broken chars
const brokenCount = (css.match(/â–¼/g) || []).length;
console.log('Found broken â–¼ occurrences:', brokenCount);

// Simple string replacement approach
// The â–¼ sequence in UTF-8 misread as latin-1 = the ▼ character (U+25BC)
// When Node reads UTF-8 file with latin-1 interpretation: â=0xC3 â€"=0x96 ¼=0xBC = 0xE2 0x96 0xBC = ▼

// So we need to find 'â–¼' (which is how ▼ appears when mis-encoded) and replace with CSS unicode escape
// The safe way: use Buffer to find the broken sequence

const buf = fs.readFileSync('src/style.css');
// The bytes for ▼ in UTF-8 are: 0xE2 0x96 0xBC
// But when the file is read as latin-1 they become the 3 unicode chars: â (0xC3A2), – (0xE2 80 93?), ▼

// Let's just use the hex sequence approach
// Replace the broken 3-byte sequence E2 96 BC (▼) with the CSS unicode escape \276F (❯) or \25BC (▼)

// Check what bytes are actually there
const sbSummaryIdx = buf.indexOf(Buffer.from('.sb-summary::after'));
const chunk = buf.slice(sbSummaryIdx, sbSummaryIdx + 80);
console.log('Bytes:', chunk.toString('hex'));
console.log('As UTF8:', chunk.toString('utf8'));

// The E2 96 BC sequence = ▼ in UTF-8
const broken = Buffer.from([0xE2, 0x96, 0xBC]);
const goodChar = Buffer.from('\\276F'); // CSS escape for ❯
// Or use the actual ▼ character
const goodCharDirect = Buffer.from('\u25BC', 'utf8'); // ▼ as UTF-8

// Replace in buffer
let result = buf.toString('hex');
const brokenHex = 'e296bc';
const goodHex = Buffer.from('\u25BC').toString('hex'); // e296bc again - that IS the right UTF-8
console.log('broken hex:', brokenHex, 'good hex:', goodHex);

// The real issue: the CSS content property has these bytes but they're
// being served with wrong charset. Let's just replace the content value with a CSS unicode escape

// Replace content: "▼" (however it's encoded) with content: "\25BC"
let cssStr = buf.toString('utf8');
cssStr = cssStr.replace(/content:\s*"[^"]*▼[^"]*"/g, 'content: "\\25BC"');
cssStr = cssStr.replace(/content:\s*"[^"]*â–¼[^"]*"/g, 'content: "\\25BC"');

// Also replace any other broken unicode in the file
// ▶ type characters
cssStr = cssStr.replace(/â–º/g, '\u25BA'); // ►
cssStr = cssStr.replace(/â–¸/g, '\u25B8'); // ▸
cssStr = cssStr.replace(/â€™/g, "'");       // '
cssStr = cssStr.replace(/â€œ/g, '"');       // "
cssStr = cssStr.replace(/â€/g, '"');        // "

console.log('After processing, checking sb-summary::after:');
const idx = cssStr.indexOf('.sb-summary::after');
console.log(cssStr.substring(idx, idx + 100));

fs.writeFileSync('src/style.css', cssStr, 'utf8');
console.log('Done');
