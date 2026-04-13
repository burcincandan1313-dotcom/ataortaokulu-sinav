const fs = require('fs');

try {
  let content = fs.readFileSync('src/app.js', 'utf8');

  // 1. Add import
  if (!content.includes('renderVisualDictionaryMenu')) {
    content = content.replace(
      /import\s*\{\s*renderGameMenu\s*\}\s*from\s*['"]\.\/features\/games\.js['"];/,
      "import { renderGameMenu } from './features/games.js';\nimport { renderVisualDictionaryMenu } from './features/visualDictionary.js';"
    );
  }

  // 2. Add command logic
  const sozlukLogic = `
  // A3. GÖRSEL SÖZLÜK
  if (lw === '/sozluk' || lw === '/sözlük' || lw === 'sözlük' || lw === 'görsel sözlük') {
    const gameOverlay = document.getElementById('gameOverlay');
    if (gameOverlay) gameOverlay.style.display = 'flex';
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) gameTitle.textContent = '🌟 Görsel Sözlük';
    renderVisualDictionaryMenu(document.getElementById('gameBody'));
    addMessage('bot', 'Görsel Sözlük açıldı.');
    appendMessage('bot', formatMessage('bot', '🖼️ <b>Görsel İnteraktif Sözlük</b> paneli açıldı! Yukarıdan dilediğiniz konuyu seçebilirsiniz.'));
    return;
  }
`;
  if (!content.includes('A3. GÖRSEL SÖZLÜK')) {
    content = content.replace(
      /\/\/\s*B\.\s*OYUN/,
      sozlukLogic + "\n  // B. OYUN"
    );
  }

  // 3. Add to cmdList
  if (content.includes('const commands = [') && !content.includes('/sozluk')) {
    content = content.replace(
      /\{\s*cmd:\s*['"]\/sinavlarim['"]/,
      "{ cmd: '/sozluk', icon: '🖼️', desc: 'Görsel Sözlük' },\n      $&"
    );
  }

  fs.writeFileSync('src/app.js', content, 'utf8');
  console.log("src/app.js updated successfully via regex");
} catch(e) {
  console.error("Error updating files:", e);
}
