const fs = require('fs');
let app = fs.readFileSync('src/app.js', 'utf8');

const target = "confirmButtonText: 'Harika! 👍',Å¸â€˜Â ',";
const replacement = "confirmButtonText: 'Harika! 👍',";

if(app.includes(target)) {
    app = app.replace(target, replacement);
    fs.writeFileSync('src/app.js', app, 'utf8');
    console.log('Fixed syntax error EXACTLY.');
} else {
    // maybe it was replaced without comma?
    const target2 = "confirmButtonText: 'Harika! 👍'Å¸â€˜Â ',";
    if(app.includes(target2)) {
        app = app.replace(target2, replacement);
        fs.writeFileSync('src/app.js', app, 'utf8');
        console.log('Fixed syntax error EXACTLY 2.');
    } else {
        console.log('Target not found. Let me look at line 2363.');
        const lines = app.split('\n');
        console.log(lines[2362]);
    }
}
