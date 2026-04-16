const fs = require('fs');

async function testIt() {
  const code = fs.readFileSync('src/utils/aiParser.js', 'utf8');
  // Just test raw JSON parse of the problematic string
  const json = '[{"soru": "Bugün ..... doğum günü partisine gideceğiz. cümlesinde", "secenekler": { "A": "mert\'in", "B": "Mert\'in"}}]';
  
  try {
    const p = JSON.parse(json);
    console.log("Standard JSON.parse SUCCESS");
  } catch(e) {
    console.log("Standard JSON.parse FAILED:", e.message);
  }
}

testIt();
