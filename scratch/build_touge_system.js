const fs = require('fs');

console.log('Building Touge System Patch...');

// Read index.html
let html = fs.readFileSync('index.html', 'utf8');

// 1. Check where to insert the Touge module:
// We will insert right after the residential houses creation (after houseCodes.forEach).
const targetHook = `        houseCodes.forEach((h, idx) => {
            const rx = colRoadX[h.col];
            const rz = rowZCoords[h.row];
            createRobloxHouse(h.code, rx, rz, idx);
        });`;

if (!html.includes(targetHook)) {
    console.error('ERROR: Could not find targetHook in index.html!');
    process.exit(1);
}

console.log('Found targetHook in index.html.');
