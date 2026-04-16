const fs = require('fs');

async function testIt() {
  const { extractAndFixQuizJson } = await import('./src/utils/aiParser.js');
  // Just test raw JSON parse of the problematic string
  const json = '[{"soru": "Bugün ..... doğum günü partisine gideceğiz. cümlesinde", "secenekler": { "A": "mert\'in", "B": "Mert\'in" }   ';
  
  try {
    const p = extractAndFixQuizJson(json);
    console.log("extract SUCCESS", p);
  } catch(e) {
    console.log("extract FAILED:", e.message);
  }
}

testIt();
