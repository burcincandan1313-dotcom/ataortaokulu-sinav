const fs = require('fs');

async function testIt() {
  const { extractAndFixQuizJson } = await import('./src/utils/aiParser.js');
  // Complete JSON but with unescaped double quotes inside value
  const json = '[\n{\n"soru": "Bugün ..... ",\n"secenekler": { "A": "mert", "B": "Mert" },\n"dogru_cevap": "B",\n"aciklama": "Özel isimler "büyük" yazılır."\n}\n]';
  
  try {
    const p = extractAndFixQuizJson(json);
    console.log("extract SUCCESS", p);
  } catch(e) {
    console.log("extract FAILED:", e.message);
  }
}

testIt();
