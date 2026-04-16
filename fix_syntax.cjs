const fs = require('fs');
let content = fs.readFileSync('src/app.js', 'utf8');

// Find and fix the broken else-if section
const oralIdx = content.indexOf('Sozlu sinav modu aktif');
const section = content.substring(oralIdx, oralIdx + 600);
console.log('Section around oral:', section);

// Replace the broken section - find the exact string
const broken1 = "} else if (lw.startsWith('/quiz')) {\r\n       // /quiz komutu \u2192 direkt quiz intent (AI parse'a gerek yok)\r\n       intentData = { intent: 'quiz', grade: studySelections.grade, subject: studySelections.subject || 'Genel', topic: studySelections.topic || msg, difficulty: 'medium' };\r\n     }    } else if (isDersRequest) {";

const fixed1 = "} else if (lw.startsWith('/quiz')) {\r\n       // /quiz komutu \u2192 direkt quiz intent (AI parse'a gerek yok)\r\n       intentData = { intent: 'quiz', grade: studySelections.grade, subject: studySelections.subject || 'Genel', topic: studySelections.topic || msg, difficulty: 'medium' };\r\n     } else if (isDersRequest) {";

if (content.includes(broken1)) {
  content = content.replace(broken1, fixed1);
  console.log('Fixed!');
} else {
  // Try with different whitespace
  const startMarker = "difficulty: 'medium' };\r\n     }";
  const endMarker = "} else if (isDersRequest)";
  
  const startIdx = content.indexOf(startMarker, oralIdx);
  const endIdx = content.indexOf(endMarker, oralIdx);
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const between = content.substring(startIdx + startMarker.length, endIdx);
    console.log('Between start and end:', JSON.stringify(between));
    // Replace the between content with nothing (just whitespace)
    content = content.substring(0, startIdx + startMarker.length) + '\r\n     ' + content.substring(endIdx);
    console.log('Fixed via index replacement');
  } else {
    console.log('Could not find pattern. startIdx:', startIdx, 'endIdx:', endIdx);
  }
}

fs.writeFileSync('src/app.js', content, 'utf8');
