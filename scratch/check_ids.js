const fs = require('fs');
const content = fs.readFileSync('c:/Projects/delivery-pizza/index.html', 'utf8');
const lines = content.split('\n');
const regex = /document\.getElementById\(['"]([^'"]+)['"]\)\.([a-zA-Z]+)/g;
lines.forEach((line, idx) => {
    let match;
    while ((match = regex.exec(line)) !== null) {
        console.log(`Line ${idx+1}: id='${match[1]}', prop='${match[2]}'`);
    }
});
