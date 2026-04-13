const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const scriptTag = [
  '<script>',
  '/* Fix typewriter text clipping: add typing-done class after each animation ends */',
  '(function() {',
  '  var lines = [',
  '    { id: "twLine1", delay: 0 },',
  '    { id: "twLine2", delay: 2500 },',
  '    { id: "twLine3", delay: 5000 },',
  '    { id: "twLine4", delay: 7500 }',
  '  ];',
  '  var animDuration = 2500;',
  '  lines.forEach(function(item) {',
  '    setTimeout(function() {',
  '      var el = document.getElementById(item.id);',
  '      if (el) el.classList.add("typing-done");',
  '    }, item.delay + animDuration + 150);',
  '  });',
  '})();',
  '</script>'
].join('\n');

const target = '</body></html>';

if (html.includes(target)) {
  // Remove any previously added version of this script to avoid duplicates
  const prevStart = html.indexOf('/* Fix typewriter text clipping:');
  if (prevStart !== -1) {
    const openTag = html.lastIndexOf('<script>', prevStart);
    const closeTag = html.indexOf('</script>', prevStart) + '</script>'.length;
    if (openTag !== -1 && closeTag !== -1) {
      html = html.slice(0, openTag) + html.slice(closeTag);
      console.log('Removed previous version');
    }
  }
  html = html.replace(target, scriptTag + '\n' + target);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('SUCCESS: typewriter fix script added to index.html');
} else {
  console.log('FAIL: </body></html> not found');
}
