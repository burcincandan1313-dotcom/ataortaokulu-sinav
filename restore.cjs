const fs = require('fs');

try {
    let raw = fs.readFileSync('index_temp.html', 'utf8');
    
    // Remove all <script> blocks (including the massive inline chunk)
    raw = raw.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove all <style> blocks
    raw = raw.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Fix missing head/body structure that might be warped
    // Let's just output the whole thing and then add the links back by string manipulation
    
    // Find </head> and insert CSS / JS
    raw = raw.replace('</head>', '\n<link rel="stylesheet" href="/src/style.css">\n<script type="module" src="/src/app.js"></script>\n</head>');
    
    fs.writeFileSync('restored.html', raw);
    console.log('Restored to restored.html');
} catch(e) {
    console.error(e);
}
