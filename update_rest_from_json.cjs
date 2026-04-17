const fs = require('fs');
const path = require('path');

const file = './src/curriculum.js';
const updatesFile = './updates.json';

let content = fs.readFileSync(file, 'utf8');
const updates = JSON.parse(fs.readFileSync(updatesFile, 'utf8'));

// Handle different newline formats properly
let newline = '\n';
if (content.includes('\r\n')) {
  newline = '\r\n';
}
let lines = content.split(newline);

let currentGrade = 0;

for (let i = 0; i < lines.length; i++) {
  let gradeMatch = lines[i].match(/^\s*(\d+):\s*\{/);
  if (gradeMatch) {
    currentGrade = parseInt(gradeMatch[1]);
    continue;
  }
  
  if (currentGrade > 0) {
    for (let subject in updates) {
      if (lines[i].includes("'" + subject + "':")) {
        if (updates[subject] && updates[subject][currentGrade]) {
          lines[i] = "    '" + subject + "': " + updates[subject][currentGrade] + ",";
        }
      }
    }
  }
}

fs.writeFileSync(file, lines.join(newline), 'utf8');
console.log("Curriculum updated successfully!");
