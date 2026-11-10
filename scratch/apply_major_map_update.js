// scratch/apply_major_map_update.js
// Comprehensive script to update index.html with the new expansive map matching refrensi-denah.jpeg
const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log("Original index.html length:", html.length);

// 1. Update Camera Far & Fog in Scene Setup
html = html.replace(
    /const camera = new THREE\.PerspectiveCamera\(60, window\.innerWidth \/ window\.innerHeight, 0\.2, 700\);/g,
    'const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 1600);'
);

html = html.replace(
    /scene\.fog = new THREE\.FogExp2\(0xe2925e, 0\.0023\);/g,
    'scene.fog = new THREE.FogExp2(0xe2925e, 0.0011);'
);

html = html.replace(
    /const skyGeo = new THREE\.SphereGeometry\(520, 32, 24\);/g,
    'const skyGeo = new THREE.SphereGeometry(1100, 32, 24);'
);

// 2. Update Minimap Canvas size and Title in HTML
html = html.replace(
    /<span class="text-\[11px\] font-bold text-amber-300 uppercase tracking-wider">Peta Kota \(3x3\)<\/span>/g,
    '<span class="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Peta Pengiriman (Pabrik → Perumahan)</span>'
);

html = html.replace(
    /<canvas id="minimap-canvas" width="165" height="185" class="rounded-xl border border-white\/15 bg-\[#1b120c\]"><\/canvas>/g,
    '<canvas id="minimap-canvas" width="220" height="115" class="rounded-xl border border-white/15 bg-[#140e0a]"></canvas>'
);

// 3. Add Floating GPS Indicator in HUD right under timer container / dropoff box
const gpsBannerHTML = `
                <!-- Floating GPS Navigation Indicator -->
                <div id="gps-banner" class="mt-1 flex items-center justify-center gap-2 select-none">
                    <div class="hud-glass px-3 py-1 rounded-full flex items-center gap-2 border border-white/20 shadow-md">
                        <span id="gps-icon" class="text-sm inline-block transform transition-transform duration-100">🧭</span>
                        <span id="gps-target-name" class="font-extrabold text-white text-xs">Pabrik Pizza</span>
                        <span class="text-white/40">•</span>
                        <span id="gps-distance" class="font-bold text-amber-300 text-xs">0 m</span>
                    </div>
                </div>`;

if (!html.includes('id="gps-banner"')) {
    html = html.replace(
        /(<\/div>\s*<\/div>\s*<\/div>\s*<!-- Right: Testing Tools)/,
        gpsBannerHTML + '\n$1'
    );
}

// 4. Update initial timer display from 02:00 to 01:25
html = html.replace(
    /<span id="timer-display" class="font-display text-base font-black text-white tracking-widest px-1\.5 py-0\.5 drop-shadow-\[0_2px_4px_rgba\(0,0,0,1\)\]">02:00<\/span>/g,
    '<span id="timer-display" class="font-display text-base font-black text-white tracking-widest px-1.5 py-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">01:25</span>'
);

console.log("HUD and Scene settings updated. Now replacing textures and world geometry...");

fs.writeFileSync('index.html', html, 'utf8');
console.log("Step 1 done. Length:", html.length);
