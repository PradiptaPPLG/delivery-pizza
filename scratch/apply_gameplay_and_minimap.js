// scratch/apply_gameplay_and_minimap.js
const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log("Applying gameplay, spawn coordinates, and minimap overhaul...");

// 1. Update gameState maxTime & timer
html = html.replace(
    /timeRemaining: 120,\s*\/\/\s*2 menit = 120 detik\s*maxTime: 120,/g,
    'timeRemaining: 85,      // 85 detik (1m 25s) untuk rute cepat ekspedisi!\n            maxTime: 85,'
);

// 2. Update initial carPhysics spawn coordinates
html = html.replace(
    /const carPhysics = \{\s*x: 0,\s*z: -80,\s*angle: Math\.PI,/g,
    'const carPhysics = {\n            x: -410,\n            z: 0,\n            angle: Math.PI / 2, // Menghadap ke Timur (+X ke arah jalan raya/jembatan), membelakangi garasi pabrik!'
);

// 3. Update spawnCarAtFactory
html = html.replace(
    /function spawnCarAtFactory\(\) \{\s*carPhysics\.x = 0;\s*carPhysics\.z = -80;\s*carPhysics\.angle = Math\.PI;/g,
    'function spawnCarAtFactory() {\n            carPhysics.x = -410;\n            carPhysics.z = 0;\n            carPhysics.angle = Math.PI / 2;'
);

// 4. Overhaul drawMinimap function
const newDrawMinimap = `
        const mCtx = minimapCanvas.getContext('2d');

        function drawMinimap() {
            const W = minimapCanvas.width;
            const H = minimapCanvas.height;
            mCtx.clearRect(0, 0, W, H);

            // Autumn Landscape Background
            mCtx.fillStyle = '#22140d';
            mCtx.fillRect(0, 0, W, H);

            // Coordinate mapper: World X in [-520, 520], World Z in [-240, 240]
            const mapX = (wx) => ((wx + 520) / 1040) * W;
            const mapZ = (wz) => ((wz + 240) / 480) * H;

            // 1. Draw River (Sungai) & Wooden Bridge
            mCtx.fillStyle = '#1e608a';
            mCtx.fillRect(mapX(-244), 0, mapX(-216) - mapX(-244), H);

            mCtx.fillStyle = '#78431f';
            mCtx.fillRect(mapX(-255), mapZ(35 - 8), mapX(-205) - mapX(-255), mapZ(35 + 8) - mapZ(35 - 8));

            // 2. Draw Mountain & Tunnel Area
            mCtx.fillStyle = '#473f38';
            mCtx.beginPath();
            mCtx.arc(mapX(-65), mapZ(-20), 14, 0, Math.PI * 2);
            mCtx.fill();

            mCtx.fillStyle = '#1e1b18';
            mCtx.fillRect(mapX(-95), mapZ(-20 - 4), mapX(-35) - mapX(-95), 8);

            // Tebing 2 Bluff
            mCtx.fillStyle = '#473f38';
            mCtx.beginPath();
            mCtx.arc(mapX(10), mapZ(12), 7, 0, Math.PI * 2);
            mCtx.fill();

            // 3. Draw Railroad Track (Rel Kereta Api)
            mCtx.strokeStyle = '#94a3b8';
            mCtx.lineWidth = 1.5;
            mCtx.beginPath();
            mCtx.moveTo(mapX(110), 0);
            mCtx.lineTo(mapX(110), H);
            mCtx.stroke();

            // 4. Draw Cornfield (Ladang Jagung)
            const cx1 = mapX(145);
            const cz1 = mapZ(-145);
            const cx2 = mapX(295);
            const cz2 = mapZ(5);
            mCtx.fillStyle = '#4d7c0f';
            mCtx.fillRect(cx1, cz1, cx2 - cx1, cz2 - cz1);
            mCtx.strokeStyle = '#ca8a04';
            mCtx.lineWidth = 1;
            mCtx.strokeRect(cx1, cz1, cx2 - cx1, cz2 - cz1);

            mCtx.fillStyle = '#fef08a';
            mCtx.font = 'bold 7px Inter, sans-serif';
            mCtx.textAlign = 'center';
            mCtx.fillText('JAGUNG', (cx1 + cx2) / 2, (cz1 + cz2) / 2);

            // 5. Draw Highway Route
            mCtx.strokeStyle = '#64748b';
            mCtx.lineWidth = 3.5;
            mCtx.beginPath();
            highwayPoints.forEach((pt, idx) => {
                const px = mapX(pt[0]);
                const pz = mapZ(pt[1]);
                if (idx === 0) mCtx.moveTo(px, pz);
                else mCtx.lineTo(px, pz);
            });
            mCtx.stroke();

            // 6. Draw Residential District Grid (Perumahan)
            mCtx.strokeStyle = '#64748b';
            mCtx.lineWidth = 2.5;
            colRoadX.forEach(rx => {
                mCtx.beginPath();
                mCtx.moveTo(mapX(rx), mapZ(-70));
                mCtx.lineTo(mapX(rx), mapZ(85));
                mCtx.stroke();
            });
            crossRoadZ.forEach(rz => {
                mCtx.beginPath();
                mCtx.moveTo(mapX(330), mapZ(rz));
                mCtx.lineTo(mapX(485), mapZ(rz));
                mCtx.stroke();
            });

            // Draw Factory Building & Pickup Ring
            mCtx.fillStyle = '#b45309';
            mCtx.fillRect(mapX(-485), mapZ(-18), mapX(-450) - mapX(-485), mapZ(18) - mapZ(-18));
            mCtx.strokeStyle = '#facc15';
            mCtx.lineWidth = 1.2;
            mCtx.strokeRect(mapX(-485), mapZ(-18), mapX(-450) - mapX(-485), mapZ(18) - mapZ(-18));

            mCtx.fillStyle = '#fde68a';
            mCtx.font = 'bold 7px Inter, sans-serif';
            mCtx.textAlign = 'center';
            mCtx.fillText('PABRIK', mapX(-468), mapZ(3));

            if (!gameState.hasPackage) {
                mCtx.fillStyle = '#22c55e';
                mCtx.beginPath();
                mCtx.arc(mapX(-448), mapZ(0), 4.5, 0, Math.PI * 2);
                mCtx.fill();
            }

            // Draw 9 Houses (A1..C3)
            Object.values(houses).forEach(h => {
                const hx = mapX(h.housePos.x);
                const hz = mapZ(h.housePos.z);
                const isTarget = gameState.hasPackage && gameState.targetHouse === h.code;

                mCtx.fillStyle = isTarget ? '#38bdf8' : '#e2d7ca';
                mCtx.fillRect(hx - 5, hz - 4, 10, 8);

                if (isTarget) {
                    mCtx.strokeStyle = '#ffffff';
                    mCtx.lineWidth = 2;
                    mCtx.strokeRect(hx - 7, hz - 6, 14, 12);
                }

                mCtx.fillStyle = isTarget ? '#082f49' : '#1f2937';
                mCtx.font = 'bold 6px Inter, sans-serif';
                mCtx.textAlign = 'center';
                mCtx.textBaseline = 'middle';
                mCtx.fillText(h.code, hx, hz);
            });

            // Draw Player Car Arrow
            const px = mapX(carPhysics.x);
            const pz = mapZ(carPhysics.z);
            mCtx.save();
            mCtx.translate(px, pz);
            mCtx.rotate(-carPhysics.angle);
            mCtx.fillStyle = '#ef4444';
            mCtx.strokeStyle = '#ffffff';
            mCtx.lineWidth = 1.5;
            mCtx.beginPath();
            mCtx.moveTo(0, -7);
            mCtx.lineTo(5, 6);
            mCtx.lineTo(0, 3.5);
            mCtx.lineTo(-5, 6);
            mCtx.closePath();
            mCtx.fill();
            mCtx.stroke();
            mCtx.restore();
        }`;

// Replace drawMinimap block
const dmStart = 'const mCtx = minimapCanvas.getContext(\'2d\');';
const dmEnd = '/********************************************************************\n         * 12. MAIN GAME LOOP';

const dmIdx1 = html.indexOf(dmStart);
const dmIdx2 = html.indexOf(dmEnd);

if (dmIdx1 !== -1 && dmIdx2 !== -1) {
    html = html.slice(0, dmIdx1) + newDrawMinimap.trim() + '\n\n        ' + html.slice(dmIdx2);
    console.log("drawMinimap replaced successfully!");
} else {
    console.error("Could not find drawMinimap bounds!", dmIdx1, dmIdx2);
}

// 5. Add landmark animations and GPS updates to updateGame(dt)
const gpsUpdateCode = `
            // Animate Windmill Rotor
            if (typeof wmRotor !== 'undefined' && wmRotor) {
                wmRotor.rotation.z += dt * 1.6;
            }

            // Animate Railroad Level Crossing Alternating Red Flashers
            if (typeof railroadFlasherLamps !== 'undefined' && railroadFlasherLamps.length > 0) {
                const flashPhase = Math.floor(now * 0.003) % 2;
                railroadFlasherLamps.forEach((lamp, idx) => {
                    lamp.material.color.setHex((idx % 2 === flashPhase) ? 0xef4444 : 0x330000);
                });
            }

            // Animate Flowing River Water
            if (typeof waterTex !== 'undefined' && waterTex) {
                waterTex.offset.y += dt * 0.035;
            }

            // Dynamic GPS Navigation Banner Updates
            const gpsTargetName = document.getElementById('gps-target-name');
            const gpsDistance = document.getElementById('gps-distance');
            const gpsIcon = document.getElementById('gps-icon');

            if (gpsTargetName && gpsDistance) {
                let targetX = pickupZonePos.x;
                let targetZ = pickupZonePos.z;
                let tName = 'Pabrik Pizza';

                if (gameState.hasPackage && gameState.targetHouse && houses[gameState.targetHouse]) {
                    targetX = houses[gameState.targetHouse].dropOffPos.x;
                    targetZ = houses[gameState.targetHouse].dropOffPos.z;
                    tName = 'Rumah ' + gameState.targetHouse;
                }

                const distToTarget = Math.hypot(targetX - carPhysics.x, targetZ - carPhysics.z);
                gpsTargetName.textContent = tName;
                gpsDistance.textContent = Math.round(distToTarget) + ' m';

                const dx = targetX - carPhysics.x;
                const dz = targetZ - carPhysics.z;
                const angleToTarget = Math.atan2(dx, dz);
                let relAngle = angleToTarget - carPhysics.angle;
                if (gpsIcon) {
                    gpsIcon.style.transform = 'rotate(' + Math.round(relAngle * (180 / Math.PI)) + 'deg)';
                }
            }
`;

html = html.replace(
    /drawMinimap\(\);/g,
    gpsUpdateCode + '\n            drawMinimap();'
);

// 6. Update window.onload initial camera position
html = html.replace(
    /camera\.position\.set\(0, 5\.5, -68\);\s*camera\.lookAt\(0, 1\.8, -80\);/g,
    'camera.position.set(-425, 5.5, 0);\n            camera.lookAt(-410, 1.8, 0);'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Gameplay, spawn, and minimap updated! Final length:", html.length);
