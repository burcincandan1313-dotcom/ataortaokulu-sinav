const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
const newLines = [
  ...lines.slice(0, 51),
  '    <link rel="stylesheet" href="./src/style.css" />',
  ...lines.slice(48932, 50539) // Drop the massive inline script and anything after 50539
];
fs.writeFileSync('index.html', newLines.join('\n'));
