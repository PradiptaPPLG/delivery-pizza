// scratch/build_world_refrensi_complete.js
const fs = require('fs');

console.log("Reading index.html...");
let html = fs.readFileSync('c:/Projects/delivery-pizza/index.html', 'utf8');

// 1. Ensure DoubleSide on road materials
html = html.replace(
    /const woodBridgeMat = new THREE\.MeshStandardMaterial\(\{[\s\S]*?roughness:\s*0\.72,\s*metalness:\s*0\.08\s*\}\);/,
    `const woodBridgeMat = new THREE.MeshStandardMaterial({
            map: createWoodPlankTexture(3, 1),
            roughness: 0.72,
            metalness: 0.08,
            side: THREE.DoubleSide
        });`
);

html = html.replace(
    /const rockCliffMat = new THREE\.MeshStandardMaterial\(\{[\s\S]*?flatShading:\s*true\s*\}\);/,
    `const rockCliffMat = new THREE.MeshStandardMaterial({
            map: createRockCliffTexture(4, 4),
            roughness: 0.90,
            metalness: 0.06,
            flatShading: true,
            side: THREE.DoubleSide
        });`
);

html = html.replace(
    /const asphaltMat = new THREE\.MeshStandardMaterial\(\{[\s\S]*?roughness:\s*0\.52,\s*metalness:\s*0\.14\s*\}\);/,
    `const asphaltMat = new THREE.MeshStandardMaterial({
            map: createAsphaltTexture(8, 8),
            roughness: 0.52,
            metalness: 0.14,
            side: THREE.DoubleSide
        });`
);
console.log("✓ Materials updated to DoubleSide");

// 2. Fix world boundaries in updateGame
const oldBoundaryRegex = /if\s*\(targetPos\.x\s*<\s*-164\s*\+\s*carRadius\)\s*\{[\s\S]*?targetPos\.z\s*=\s*154\s*-\s*carRadius;\s*if\s*\(carPhysics\.vz\s*>\s*0\)\s*carPhysics\.vz\s*=\s*0;\s*\}/;

const newBoundaryCode = `if (targetPos.x < -620 + carRadius) {
                    targetPos.x = -620 + carRadius;
                    if (carPhysics.vx < 0) carPhysics.vx = 0;
                } else if (targetPos.x > 620 - carRadius) {
                    targetPos.x = 620 - carRadius;
                    if (carPhysics.vx > 0) carPhysics.vx = 0;
                }

                if (targetPos.z < -310 + carRadius) {
                    targetPos.z = -310 + carRadius;
                    if (carPhysics.vz < 0) carPhysics.vz = 0;
                } else if (targetPos.z > 310 - carRadius) {
                    targetPos.z = 310 - carRadius;
                    if (carPhysics.vz > 0) carPhysics.vz = 0;
                }`;

if (!oldBoundaryRegex.test(html)) {
    console.error("ERROR: oldBoundaryRegex did not match!");
    process.exit(1);
}
html = html.replace(oldBoundaryRegex, newBoundaryCode);
console.log("✓ World boundary clamp updated to [-620, 620] and [-310, 310]");

// 3. Fix carPhysics initial spawn and spawnCarAtFactory
html = html.replace(
    /const carPhysics = \{[\s\S]*?pickupCooldown:\s*0\s*\};/,
    `const carPhysics = {
            x: -410,  // On forecourt asphalt, facing East down the road, factory right behind!
            z: 0,
            angle: -Math.PI / 2, // Facing East (+X toward road, away from factory!)
            speed: 0,
            vx: 0,
            vz: 0,
            lateralVelocity: 0,
            angularVelocity: 0,
            driftIntensity: 0,
            smokeTimer: 0,
            maxForwardSpeed: 38,
            maxReverseSpeed: -22,
            accel: 30,
            reverseAccel: 26,
            activeBrakeDecel: 68,
            friction: 11,
            brakeForce: 55,
            steerAngle: 0,
            wheelSpin: 0,
            pickupCooldown: 0
        };`
);
console.log("✓ carPhysics initialized at x=-410, z=0, angle=-Math.PI/2");

html = html.replace(
    /function spawnCarAtFactory\(\)\s*\{[\s\S]*?showToast\('[\s\S]*?'info'\);\s*\}/,
    `function spawnCarAtFactory() {
            carPhysics.x = -410;
            carPhysics.z = 0;
            carPhysics.angle = -Math.PI / 2; // Facing East (toward road)
            carPhysics.speed = 0;
            carPhysics.vx = 0;
            carPhysics.vz = 0;
            carPhysics.lateralVelocity = 0;
            carPhysics.angularVelocity = 0;
            carPhysics.driftIntensity = 0;
            carPhysics.steerAngle = 0;

            gameState.dropoffProgress = 0;
            gameState.isInsideDropoff = false;
            const dropBoxEl = document.getElementById('dropoff-progress-box');
            if (dropBoxEl) dropBoxEl.classList.add('hidden');
            if (typeof targetProgressFill !== 'undefined' && targetProgressFill) targetProgressFill.scale.set(0.001, 0.001, 0.001);

            showToast('🚚 Posisi Mobil Direset', 'Mundur (S) ke belakang menuju garasi pabrik untuk mengambil paket.', 'info');
        }`
);
console.log("✓ spawnCarAtFactory updated");

// 4. Fix initial camera in window.onload
html = html.replace(
    /camera\.position\.set\(-426,\s*5\.2,\s*0\);\s*camera\.lookAt\(-410,\s*1\.8,\s*0\);/,
    `camera.position.set(-425, 4.8, 0);\n            camera.lookAt(-410, 1.55, 0);`
);
console.log("✓ window.onload initial camera updated");

// 5. Update the entire WORLD GEOMETRY & LANDMARKS (Section 5)
const envStartMarker = "// ====================================================================\n        // A) PABRIK (PIZZA FACTORY DEPOT)";
const envEndMarker = "// Falling leaves particles";

const startIndex = html.indexOf(envStartMarker);
const endIndex = html.indexOf(envEndMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("ERROR: Could not find env start or end markers!", { startIndex, endIndex });
    process.exit(1);
}

const newWorldSection = `// ====================================================================
        // A) PABRIK (PIZZA FACTORY DEPOT) - FAR WEST (X = -460, Z = 0)
        // ====================================================================
        const factoryGroup = new THREE.Group();
        factoryGroup.position.set(-460, 0, 0);
        factoryGroup.rotation.y = Math.PI / 2; // Facing East (+X towards road!)
        scene.add(factoryGroup);

        // Factory Courtyard & Forecourt (Wide asphalt parking area)
        const factoryLot = new THREE.Mesh(new THREE.BoxGeometry(100, 0.14, 55), asphaltMat);
        factoryLot.position.set(-415, 0.07, 0);
        factoryLot.receiveShadow = true;
        scene.add(factoryLot);

        // White parking stripes
        for (let i = -2; i <= 2; i++) {
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(3.6, 0.16, 0.28),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            stripe.position.set(-435, 0.09, i * 4.6);
            scene.add(stripe);
        }

        // Main Factory Depot Building Body
        const mainDepot = new THREE.Mesh(new THREE.BoxGeometry(36, 17, 26), factoryBrickMat);
        mainDepot.position.set(0, 8.5, -6);
        mainDepot.castShadow = true;
        factoryGroup.add(mainDepot);
        addBoxCollider(-466, 0, 30, 42); // factory building collider (world space)

        // Open Loading Garage Bay Header
        const bayHeader = new THREE.Mesh(new THREE.BoxGeometry(24, 3.2, 1.5), factoryBrickMat);
        bayHeader.position.set(0, 15.0, 7);
        factoryGroup.add(bayHeader);

        const bayRollDoor = new THREE.Mesh(new THREE.BoxGeometry(24, 3.6, 0.8), garageDoorMat);
        bayRollDoor.position.set(0, 11.6, 7.2);
        factoryGroup.add(bayRollDoor);

        // Interior Bay Floor
        const bayFloor = new THREE.Mesh(
            new THREE.BoxGeometry(28, 0.2, 22),
            new THREE.MeshLambertMaterial({ color: 0xc86432 })
        );
        bayFloor.position.set(0, 0.12, -2);
        factoryGroup.add(bayFloor);

        // Twin Industrial Smokestacks
        [-7, 7].forEach(sx => {
            const chimney = new THREE.Mesh(
                new THREE.CylinderGeometry(2.0, 2.6, 20, 12),
                new THREE.MeshLambertMaterial({ color: 0x6e5544 })
            );
            chimney.position.set(sx, 25, -10);
            factoryGroup.add(chimney);
        });

        // Bright Illuminated Factory Billboard Sign
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512; signCanvas.height = 128;
        const sctx = signCanvas.getContext('2d');
        sctx.fillStyle = '#b91c1c'; sctx.fillRect(0, 0, 512, 128);
        sctx.strokeStyle = '#facc15'; sctx.lineWidth = 10; sctx.strokeRect(5, 5, 502, 118);
        sctx.fillStyle = '#ffffff'; sctx.font = 'bold 36px Fredoka, sans-serif';
        sctx.textAlign = 'center'; sctx.fillText('🍕 PABRIK PIZZA DEPOT', 256, 52);
        sctx.fillStyle = '#fde047'; sctx.font = 'bold 22px Inter, sans-serif';
        sctx.fillText('TITIK AWAL • PUSAT DISTRIBUSI', 256, 95);
        const depotSignMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) });
        const depotSign = new THREE.Mesh(new THREE.BoxGeometry(20, 5.0, 0.5), depotSignMat);
        depotSign.position.set(0, 18.2, 7.4);
        factoryGroup.add(depotSign);

        // Factory Pickup Pad (Player reverses into this pad to load pizza!)
        const pickupZonePos = new THREE.Vector3(-448, 0.2, 0);
        const pickupPadGroup = new THREE.Group();
        pickupPadGroup.position.copy(pickupZonePos);
        scene.add(pickupPadGroup);

        const padBorder = new THREE.Mesh(
            new THREE.RingGeometry(3.8, 4.6, 32),
            new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
        );
        padBorder.rotation.x = -Math.PI / 2;
        pickupPadGroup.add(padBorder);

        const padInner = new THREE.Mesh(
            new THREE.CircleGeometry(3.8, 32),
            new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
        );
        padInner.rotation.x = -Math.PI / 2;
        pickupPadGroup.add(padInner);

        // Warm Factory Light
        const factoryLight = new THREE.PointLight(0xff9922, 2.2, 50);
        factoryLight.position.set(0, 12, 2);
        factoryGroup.add(factoryLight);

        // ====================================================================
        // B) SMOOTH SPLINE HIGHWAY (Continuous Curving Asphalt Ribbon)
        // Exact Layout Matching refrensi-denah.jpeg:
        // Pabrik -> Tikungan Jembatan -> Sungai -> Tebing 1 -> Terowongan -> Tebing 2 -> Rel Kereta -> Ladang Jagung -> Perumahan
        // ====================================================================
        const highwayPoints = [
            [-420, 0],    // 0: Spawn di depan pabrik (menghadap ke Timur)
            [-370, 0],    // 1: Jalan lurus keluar area pabrik
            [-320, 10],   // 2: Tikungan lembut ke arah tenggara (sungai)
            [-270, 36],   // 3: Masuk ke jembatan kayu
            [-238, 52],   // 4: Di atas jembatan kayu (melintasi sungai di X=-238)
            [-205, 62],   // 5: Keluar dari jembatan kayu
            [-170, 48],   // 6: Melewati Tebing 1, belok tajam ke arah terowongan (timur laut)
            [-140, 20],   // 7: Menuju mulut terowongan
            [-120, -15],  // 8: Mulut Terowongan Barat Daya (Portal Masuk)
            [-100, -55],  // 9: Mulut Terowongan Timur Laut (Portal Keluar)
            [-75, -80],   // 10: Melingkari Tebing 2 ke arah timur
            [-30, -88],   // 11: Puncak kelokan atas
            [25, -68],    // 12: Menurun ke arah tenggara
            [70, -25],    // 13: Meluruskan ke arah rel kereta
            [110, 16],    // 14: Perlintasan Rel Kereta Api (Rel di X=110)
            [160, 22],    // 15: Melewati sisi selatan Ladang Jagung
            [220, 22],    // 16: Tengah Ladang Jagung (sisi selatan)
            [280, 16],    // 17: Ujung timur Ladang Jagung
            [315, 8],     // 18: Mendekati perumahan
            [345, 0]      // 19: Masuk ke gerbang distrik perumahan (Avenue 1)
        ];

        // Create Smooth 3D Spline
        const spline3D = new THREE.CatmullRomCurve3(
            highwayPoints.map(p => new THREE.Vector3(p[0], 0.28, p[1])),
            false,
            'catmullrom',
            0.5
        );

        // Generate Continuous Road Ribbon Mesh
        const roadSubdivs = 320;
        const roadWidth = 14.5;
        const roadPositions = [];
        const roadUvs = [];
        const roadIndices = [];

        const dashPositions = [];
        const dashUvs = [];
        const dashIndices = [];

        const edgeLeftPositions = [];
        const edgeRightPositions = [];
        const edgeIndices = [];

        for (let i = 0; i <= roadSubdivs; i++) {
            const t = i / roadSubdivs;
            const pt = spline3D.getPoint(t);
            const tan = spline3D.getTangent(t);

            const normX = -tan.z;
            const normZ = tan.x;
            const normLen = Math.hypot(normX, normZ) || 1;
            const nx = normX / normLen;
            const nz = normZ / normLen;

            const lx = pt.x + nx * (roadWidth / 2);
            const lz = pt.z + nz * (roadWidth / 2);
            const rx = pt.x - nx * (roadWidth / 2);
            const rz = pt.z - nz * (roadWidth / 2);

            roadPositions.push(lx, pt.y, lz);
            roadPositions.push(rx, pt.y, rz);
            roadUvs.push(0, t * 50);
            roadUvs.push(1, t * 50);

            if (i < roadSubdivs) {
                const b = i * 2;
                roadIndices.push(b, b + 2, b + 1);
                roadIndices.push(b + 1, b + 2, b + 3);
            }

            // Dashed center line
            const cWidth = 0.38;
            dashPositions.push(pt.x + nx * cWidth, pt.y + 0.04, pt.z + nz * cWidth);
            dashPositions.push(pt.x - nx * cWidth, pt.y + 0.04, pt.z - nz * cWidth);
            dashUvs.push(0, t * 100);
            dashUvs.push(1, t * 100);
            if (i < roadSubdivs) {
                const b = i * 2;
                dashIndices.push(b, b + 2, b + 1);
                dashIndices.push(b + 1, b + 2, b + 3);
            }

            // Yellow edge lines
            const eWidth = 0.32;
            const eOffset = roadWidth / 2 - 0.5;
            edgeLeftPositions.push(pt.x + nx * (eOffset + eWidth), pt.y + 0.035, pt.z + nz * (eOffset + eWidth));
            edgeLeftPositions.push(pt.x + nx * (eOffset - eWidth), pt.y + 0.035, pt.z + nz * (eOffset - eWidth));
            edgeRightPositions.push(pt.x - nx * (eOffset - eWidth), pt.y + 0.035, pt.z - nz * (eOffset - eWidth));
            edgeRightPositions.push(pt.x - nx * (eOffset + eWidth), pt.y + 0.035, pt.z - nz * (eOffset + eWidth));

            if (i < roadSubdivs) {
                const b = i * 2;
                edgeIndices.push(b, b + 2, b + 1);
                edgeIndices.push(b + 1, b + 2, b + 3);
            }
        }

        const roadGeo = new THREE.BufferGeometry();
        roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
        roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
        roadGeo.setIndex(roadIndices);
        roadGeo.computeVertexNormals();

        const roadMesh = new THREE.Mesh(roadGeo, asphaltMat);
        roadMesh.receiveShadow = true;
        roadMesh.renderOrder = 1;
        scene.add(roadMesh);

        // Dashed Center Line
        const dashCanvas = document.createElement('canvas');
        dashCanvas.width = 64; dashCanvas.height = 128;
        const dctx = dashCanvas.getContext('2d');
        dctx.fillStyle = '#ffffff';
        dctx.fillRect(0, 0, 64, 72);
        dctx.clearRect(0, 72, 64, 56);
        const centerLineTex = new THREE.CanvasTexture(dashCanvas);
        centerLineTex.wrapS = THREE.RepeatWrapping; centerLineTex.wrapT = THREE.RepeatWrapping;
        centerLineTex.repeat.set(1, 48);

        const centerDashMat = new THREE.MeshBasicMaterial({
            map: centerLineTex,
            transparent: true,
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const dashGeo = new THREE.BufferGeometry();
        dashGeo.setAttribute('position', new THREE.Float32BufferAttribute(dashPositions, 3));
        dashGeo.setAttribute('uv', new THREE.Float32BufferAttribute(dashUvs, 2));
        dashGeo.setIndex(dashIndices);
        const centerDashMesh = new THREE.Mesh(dashGeo, centerDashMat);
        scene.add(centerDashMesh);

        // Yellow Edge Ribbons
        const yellowEdgeMat = new THREE.MeshBasicMaterial({ color: 0xffe066, side: THREE.DoubleSide });
        const leftEdgeGeo = new THREE.BufferGeometry();
        leftEdgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeLeftPositions, 3));
        leftEdgeGeo.setIndex(edgeIndices);
        scene.add(new THREE.Mesh(leftEdgeGeo, yellowEdgeMat));

        const rightEdgeGeo = new THREE.BufferGeometry();
        rightEdgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeRightPositions, 3));
        rightEdgeGeo.setIndex(edgeIndices);
        scene.add(new THREE.Mesh(rightEdgeGeo, yellowEdgeMat));

        // ====================================================================
        // C) SUNGAI (RIVER) & JEMBATAN KAYU (WOODEN BRIDGE)
        // Exact Layout: Sungai mengalir utara-selatan di X=-238, Jembatan miring di X=-238, Z=52
        // ====================================================================
        const riverGroup = new THREE.Group();
        scene.add(riverGroup);

        // Lowered Riverbed at Y = -2.5
        const riverBed = new THREE.Mesh(
            new THREE.PlaneGeometry(54, 700),
            new THREE.MeshStandardMaterial({ color: 0x1f2b30, roughness: 0.95 })
        );
        riverBed.position.set(-238, -2.5, 0);
        riverBed.rotation.x = -Math.PI / 2;
        riverGroup.add(riverBed);

        // Sloping West & East Riverbanks
        [-262, -214].forEach((bx, idx) => {
            const bankSlope = new THREE.Mesh(
                new THREE.BoxGeometry(8, 2.5, 700),
                new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 0.9 })
            );
            bankSlope.position.set(bx, -1.2, 0);
            bankSlope.rotation.z = idx === 0 ? -0.38 : 0.38;
            riverGroup.add(bankSlope);
        });

        // Water Mesh with shiny blue ripples at Y = -1.3
        const riverWater = new THREE.Mesh(new THREE.PlaneGeometry(46, 700), waterMat);
        riverWater.position.set(-238, -1.3, 0);
        riverWater.rotation.x = -Math.PI / 2;
        riverGroup.add(riverWater);

        // River Shore Rocks
        for (let i = 0; i < 45; i++) {
            const rock = new THREE.Mesh(
                new THREE.DodecahedronGeometry(1.2 + Math.random() * 1.8, 0),
                rockCliffMat
            );
            const side = Math.random() > 0.5 ? -255 : -221;
            rock.position.set(side + (Math.random() - 0.5) * 5, -1.2, -280 + i * 13);
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            riverGroup.add(rock);
        }

        // Wooden Bridge Structure - Spans river diagonally from [-270, 36] to [-205, 62]
        const bridgeGroup = new THREE.Group();
        bridgeGroup.position.set(-238, 0, 52);
        bridgeGroup.rotation.y = -Math.atan2(62 - 36, -205 - (-270)); // ~-0.38 rad
        scene.add(bridgeGroup);

        // Heavy Timber Plank Bridge Deck (70m length x 15.5m width at Y = 0.32)
        const bridgeDeck = new THREE.Mesh(
            new THREE.BoxGeometry(70, 0.55, 15.5),
            woodBridgeMat
        );
        bridgeDeck.position.set(0, 0.32, 0);
        bridgeDeck.receiveShadow = true;
        bridgeGroup.add(bridgeDeck);

        // Bridge Guardrails
        [-7.5, 7.5].forEach(sideZ => {
            const topRail = new THREE.Mesh(new THREE.BoxGeometry(70, 0.38, 0.48), woodBridgeMat);
            topRail.position.set(0, 1.9, sideZ);
            topRail.castShadow = true;
            bridgeGroup.add(topRail);

            const midRail = new THREE.Mesh(new THREE.BoxGeometry(70, 0.28, 0.38), woodBridgeMat);
            midRail.position.set(0, 1.1, sideZ);
            bridgeGroup.add(midRail);

            for (let px = -34; px <= 34; px += 4.5) {
                const post = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.2, 0.55), woodBridgeMat);
                post.position.set(px, 1.1, sideZ);
                post.castShadow = true;
                bridgeGroup.add(post);
            }
        });

        // Bridge Guardrail Colliders
        addBoxCollider(-238, 52 - 8.2, 68, 2.0);
        addBoxCollider(-238, 52 + 8.2, 68, 2.0);

        // Wooden Trestles into water
        [-28, -14, 0, 14, 28].forEach(tx => {
            for (let tz = -5; tz <= 5; tz += 5) {
                const trestle = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 16, 8), woodBridgeMat);
                trestle.position.set(tx, -6.5, tz);
                bridgeGroup.add(trestle);
            }
        });

        // 4 Warm Glowing Lanterns on Bridge Entry Posts
        [[-33, -7.5], [-33, 7.5], [33, -7.5], [33, 7.5]].forEach(([lx, lz]) => {
            const lantern = new THREE.Mesh(
                new THREE.BoxGeometry(0.75, 1.1, 0.75),
                new THREE.MeshBasicMaterial({ color: 0xffd580 })
            );
            lantern.position.set(lx, 2.4, lz);
            bridgeGroup.add(lantern);

            const pLight = new THREE.PointLight(0xffaa44, 1.5, 22);
            pLight.position.set(lx, 2.6, lz);
            bridgeGroup.add(pLight);
        });

        // ====================================================================
        // D) STRATIFIED CLIFFS (TEBING 1 & 2) & MOUNTAIN TUNNEL (TEROWONGAN)
        // Exact Layout:
        // - Tebing 1 di sisi selatan setelah jembatan (X=-175..-140, Z=70..95)
        // - Terowongan menembus gunung dari SW [-120, -15] ke NE [-100, -55]
        // - Tebing 2 di sisi timur pintu keluar terowongan (X=-65..-40, Z=-45..-35)
        // ====================================================================
        const cliffGroup = new THREE.Group();
        scene.add(cliffGroup);

        function createStratifiedCliff(cx, cy, cz, w, h, d, rotY = 0) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rockCliffMat);
            mesh.position.set(cx, cy, cz);
            mesh.rotation.y = rotY;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            cliffGroup.add(mesh);
            addBoxCollider(cx, cz, w + 1, d + 1);
            return mesh;
        }

        // TEBING 1: Tebing batu karang di sebelah kanan/selatan jalan setelah jembatan
        createStratifiedCliff(-180, 12, 85, 28, 24, 26, 0.15);
        createStratifiedCliff(-155, 14, 78, 26, 28, 24, -0.2);
        createStratifiedCliff(-135, 11, 62, 22, 22, 22, 0.3);
        createStratifiedCliff(-190, 10, 105, 30, 20, 24);

        // MOUNTAIN MASSIF & TUNNEL STRUCTURE
        // Tunnel extends from [-120, -15] to [-100, -55]
        const tunMidX = (-120 + -100) / 2; // -110
        const tunMidZ = (-15 + -55) / 2;   // -35
        const tunAngle = Math.atan2(-40, 20); // direction angle along road
        const tunLen = Math.hypot(20, -40);   // ~44.7m

        const tunnelGroup = new THREE.Group();
        tunnelGroup.position.set(tunMidX, 0, tunMidZ);
        tunnelGroup.rotation.y = -tunAngle + Math.PI / 2;
        scene.add(tunnelGroup);

        // Mountain Ridge Massif over the tunnel
        createStratifiedCliff(-112, 18, -35, 36, 36, 42, 0.2);
        createStratifiedCliff(-95, 16, -45, 32, 32, 38, -0.15);
        createStratifiedCliff(-125, 15, -25, 30, 30, 36, 0.1);
        createStratifiedCliff(-110, 24, -35, 42, 18, 40); // Mountain peak

        // Grand Stone Arch Portals at each end of the tunnel
        const halfLen = tunLen / 2;
        [-halfLen, halfLen].forEach((pz, pIdx) => {
            const portalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(24, 14, 3.8),
                rockCliffMat
            );
            portalFrame.position.set(0, 7.0, pz);
            portalFrame.castShadow = true;
            tunnelGroup.add(portalFrame);

            const archHeader = new THREE.Mesh(
                new THREE.BoxGeometry(16, 4.0, 4.4),
                factoryBrickMat
            );
            archHeader.position.set(0, 12.5, pz);
            tunnelGroup.add(archHeader);

            const keystone = new THREE.Mesh(
                new THREE.BoxGeometry(2.8, 2.5, 4.6),
                new THREE.MeshLambertMaterial({ color: 0xdfd3c3 })
            );
            keystone.position.set(0, 12.0, pz);
            tunnelGroup.add(keystone);

            // Wing walls
            const wingWallL = new THREE.Mesh(new THREE.BoxGeometry(10, 16, 3.2), rockCliffMat);
            wingWallL.position.set(-15, 8.0, pz);
            wingWallL.rotation.y = pIdx === 0 ? 0.35 : -0.35;
            tunnelGroup.add(wingWallL);

            const wingWallR = new THREE.Mesh(new THREE.BoxGeometry(10, 16, 3.2), rockCliffMat);
            wingWallR.position.set(15, 8.0, pz);
            wingWallR.rotation.y = pIdx === 0 ? -0.35 : 0.35;
            tunnelGroup.add(wingWallR);
        });

        // Arched Stone Ceiling Vault along length of tunnel
        const tunnelVault = new THREE.Mesh(
            new THREE.CylinderGeometry(8.5, 8.5, tunLen + 4, 24, 1, true, 0, Math.PI),
            rockCliffMat
        );
        tunnelVault.rotation.x = Math.PI / 2;
        tunnelVault.rotation.y = Math.PI / 2;
        tunnelVault.position.set(0, 4.2, 0);
        tunnelGroup.add(tunnelVault);

        // Warm Sodium Tunnel Lamps
        [-14, 0, 14].forEach(lz => {
            const lampFixture = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.45, 1.2),
                new THREE.MeshBasicMaterial({ color: 0xffaa22 })
            );
            lampFixture.position.set(0, 7.8, lz);
            tunnelGroup.add(lampFixture);

            const tLight = new THREE.PointLight(0xff9911, 2.5, 28);
            tLight.position.set(0, 7.2, lz);
            tunnelGroup.add(tLight);
        });

        // Tunnel Wall Colliders (prevent driving off into mountain walls)
        addBoxCollider(tunMidX - 7.5, tunMidZ, 4, tunLen);
        addBoxCollider(tunMidX + 7.5, tunMidZ, 4, tunLen);

        // TEBING 2: Tebing batu karang di sebelah timur pintu keluar terowongan
        createStratifiedCliff(-65, 14, -50, 26, 28, 24, 0.25);
        createStratifiedCliff(-45, 12, -40, 24, 24, 22, -0.2);
        createStratifiedCliff(-30, 10, -30, 20, 20, 20, 0.1);

        // Red/White Chevron Curve Signs (>>>) along arch curve around Tebing 2
        for (let i = 0; i < 5; i++) {
            const signGroup = new THREE.Group();
            signGroup.position.set(-60 + i * 22, 0, -96 + i * 8);
            signGroup.rotation.y = -Math.PI / 6;
            scene.add(signGroup);

            const sPost = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 2.4, 0.2),
                new THREE.MeshLambertMaterial({ color: 0x475569 })
            );
            sPost.position.y = 1.2;
            signGroup.add(sPost);

            const sBoard = new THREE.Mesh(
                new THREE.BoxGeometry(1.6, 1.2, 0.15),
                new THREE.MeshBasicMaterial({ color: 0xef4444 })
            );
            sBoard.position.y = 2.2;
            signGroup.add(sBoard);
        }

        // ====================================================================
        // E) REL KERETA API (RAILROAD TRACKS LEVEL CROSSING - at X=110, Z=16)
        // ====================================================================
        const railGroup = new THREE.Group();
        railGroup.position.set(110, 0, 0);
        scene.add(railGroup);

        // Gravel Ballast Embankment
        const ballastMesh = new THREE.Mesh(
            new THREE.BoxGeometry(5.4, 0.18, 650),
            new THREE.MeshStandardMaterial({ color: 0x3e3832, roughness: 0.95 })
        );
        ballastMesh.position.set(0, 0.08, 0);
        ballastMesh.receiveShadow = true;
        railGroup.add(ballastMesh);

        // Wooden Ties
        const tieGeo = new THREE.BoxGeometry(4.4, 0.22, 0.55);
        for (let rz = -300; rz <= 300; rz += 2.0) {
            if (rz > 6 && rz < 26) continue; // Crossing clear for road
            const tie = new THREE.Mesh(tieGeo, woodBridgeMat);
            tie.position.set(0, 0.14, rz);
            railGroup.add(tie);
        }

        // Twin Shiny Steel Rails
        const railMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.88, roughness: 0.22 });
        [-1.35, 1.35].forEach(rx => {
            const steelRail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 650), railMat);
            steelRail.position.set(rx, 0.28, 0);
            railGroup.add(steelRail);
        });

        // Flush Timber Crossing Planks at Z = 16
        const crossingPlank = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.16, 17.0), woodBridgeMat);
        crossingPlank.position.set(0, 0.12, 16);
        crossingPlank.receiveShadow = true;
        railGroup.add(crossingPlank);

        // Crossing Warning Signal Masts with Flashing Red Lamps
        const railroadFlasherLamps = [];
        [-9.5, 9.5].forEach((sigZ, sIdx) => {
            const sigGroup = new THREE.Group();
            sigGroup.position.set(sIdx === 0 ? -3.8 : 3.8, 0, 16 + sigZ);
            railGroup.add(sigGroup);

            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6.0, 8), new THREE.MeshLambertMaterial({ color: 0xeeeeee }));
            pole.position.y = 3.0;
            sigGroup.add(pole);

            const xMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const x1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.1), xMat);
            x1.position.set(0, 5.2, 0);
            x1.rotation.z = Math.PI / 4;
            sigGroup.add(x1);

            const x2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.1), xMat);
            x2.position.set(0, 5.2, 0);
            x2.rotation.z = -Math.PI / 4;
            sigGroup.add(x2);

            [-0.7, 0.7].forEach(lx => {
                const redLamp = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
                redLamp.position.set(lx, 4.2, 0);
                sigGroup.add(redLamp);
                railroadFlasherLamps.push(redLamp);
            });
        });

        // Parked Vintage Freight Locomotive on North Rail Spur (X = 110, Z = -115)
        const trainGroup = new THREE.Group();
        trainGroup.position.set(110, 0, -115);
        scene.add(trainGroup);

        const locoBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.2, 16), new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 }));
        locoBody.position.set(0, 3.2, 0);
        trainGroup.add(locoBody);
        addBoxCollider(110, -115, 4.4, 18);

        const locoCab = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.2, 6), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }));
        locoCab.position.set(0, 6.2, -4);
        trainGroup.add(locoCab);

        // ====================================================================
        // F) LADANG JAGUNG (CORNFIELD) - NORTH OF ROAD (X = 135..315, Z = -135..5)
        // ====================================================================
        const farmGroup = new THREE.Group();
        farmGroup.position.set(225, 0, -65);
        scene.add(farmGroup);

        // Fertile Dark Soil Field Base
        const soilMat = new THREE.MeshStandardMaterial({
            color: 0x3d2716,
            roughness: 0.94,
            metalness: 0.05
        });
        const cornSoil = new THREE.Mesh(new THREE.BoxGeometry(160, 0.16, 130), soilMat);
        cornSoil.position.set(0, 0.08, 0);
        cornSoil.receiveShadow = true;
        farmGroup.add(cornSoil);

        // Big Roadside Farm Billboard Sign: "🌽 LADANG JAGUNG"
        const farmSignCanvas = document.createElement('canvas');
        farmSignCanvas.width = 512; farmSignCanvas.height = 128;
        const fsctx = farmSignCanvas.getContext('2d');
        fsctx.fillStyle = '#15803d'; fsctx.fillRect(0, 0, 512, 128);
        fsctx.strokeStyle = '#eab308'; fsctx.lineWidth = 10; fsctx.strokeRect(5, 5, 502, 118);
        fsctx.fillStyle = '#ffffff'; fsctx.font = 'bold 38px Fredoka, sans-serif';
        fsctx.textAlign = 'center'; fsctx.fillText('🌽 LADANG JAGUNG', 256, 52);
        fsctx.fillStyle = '#fef08a'; fsctx.font = 'bold 22px Inter, sans-serif';
        fsctx.fillText('PERKEBUNAN SUBUR HARVEST', 256, 95);

        const farmSignMesh = new THREE.Mesh(
            new THREE.BoxGeometry(14, 4.2, 0.5),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(farmSignCanvas) })
        );
        farmSignMesh.position.set(0, 3.6, 68);
        farmGroup.add(farmSignMesh);

        // Rustic Wooden Fence along perimeter
        const fenceMat = new THREE.MeshLambertMaterial({ color: 0x7c4f2d });
        for (let fx = -78; fx <= 78; fx += 6.5) {
            const fPost = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.8, 0.35), fenceMat);
            fPost.position.set(fx, 0.9, 66);
            farmGroup.add(fPost);
        }
        const sRail1 = new THREE.Mesh(new THREE.BoxGeometry(158, 0.18, 0.2), fenceMat);
        sRail1.position.set(0, 1.4, 66);
        farmGroup.add(sRail1);
        const sRail2 = new THREE.Mesh(new THREE.BoxGeometry(158, 0.18, 0.2), fenceMat);
        sRail2.position.set(0, 0.7, 66);
        farmGroup.add(sRail2);
        addBoxCollider(225, -65 + 66, 160, 1.5);

        // Dense Rows of 3D Corn Stalks with Leaves and Bright Yellow Corn Cobs!
        const cornTex = createCornTexture();
        const cornCobMat = new THREE.MeshBasicMaterial({ map: cornTex });
        const cornLeafMat = new THREE.MeshLambertMaterial({ color: 0x4d7c0f });
        const stalkGeo = new THREE.CylinderGeometry(0.12, 0.18, 3.8, 5);
        const cobGeo = new THREE.CylinderGeometry(0.16, 0.22, 1.2, 6);

        for (let rowX = -70; rowX <= 70; rowX += 5.5) {
            for (let rowZ = -58; rowZ <= 58; rowZ += 4.8) {
                const stalk = new THREE.Mesh(stalkGeo, cornLeafMat);
                stalk.position.set(rowX + (Math.random() - 0.5) * 0.8, 1.9, rowZ + (Math.random() - 0.5) * 0.8);
                stalk.rotation.y = Math.random() * Math.PI;
                stalk.castShadow = true;
                farmGroup.add(stalk);

                const cob = new THREE.Mesh(cobGeo, cornCobMat);
                cob.position.set(0.25, 0.2, 0);
                cob.rotation.z = 0.45;
                stalk.add(cob);

                [-1, 1].forEach(ldir => {
                    const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.35), cornLeafMat);
                    leaf.position.set(ldir * 0.55, 0.6, 0);
                    leaf.rotation.z = -ldir * 0.55;
                    stalk.add(leaf);
                });
            }
        }

        // Classic Red Farm Barn
        const barn = new THREE.Mesh(new THREE.BoxGeometry(18, 12, 24), new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.75 }));
        barn.position.set(55, 6.0, -40);
        barn.castShadow = true;
        farmGroup.add(barn);
        addBoxCollider(225 + 55, -65 - 40, 20, 26);

        const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 6, 4), darkRoofBrickMat);
        barnRoof.position.set(55, 15.0, -40);
        barnRoof.rotation.y = Math.PI / 4;
        farmGroup.add(barnRoof);

        // Windmill with Spinning Blades (wmRotor)
        const windmillGroup = new THREE.Group();
        windmillGroup.position.set(-58, 0, -40);
        farmGroup.add(windmillGroup);

        const wmTower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, 18, 8), woodBridgeMat);
        wmTower.position.y = 9.0;
        wmTower.castShadow = true;
        windmillGroup.add(wmTower);

        const wmHub = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 10), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        wmHub.position.set(0, 17.5, 1.4);
        windmillGroup.add(wmHub);

        const wmRotor = new THREE.Group();
        wmRotor.position.set(0, 17.5, 1.8);
        windmillGroup.add(wmRotor);

        for (let b = 0; b < 4; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 11, 0.12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
            blade.position.y = 5.5;
            const bArm = new THREE.Group();
            bArm.rotation.z = b * (Math.PI / 2);
            bArm.add(blade);
            wmRotor.add(bArm);
        }

        // ====================================================================
        // G) PERUMAHAN (RESIDENTIAL 3x3 DISTRICT OF HOUSES A1..C3)
        // ====================================================================
        const colRoadX = [345, 405, 465];
        const rowZCoords = [-45, 10, 65];

        function createRoadBox(x, z, w, d) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), asphaltMat);
            mesh.position.set(x, 0.08, z);
            mesh.receiveShadow = true;
            mesh.renderOrder = 1;
            scene.add(mesh);
        }

        colRoadX.forEach(rx => {
            createRoadBox(rx, 10, 14.5, 145);
        });

        const crossRoadZ = [-45, 10, 65];
        crossRoadZ.forEach(rz => {
            createRoadBox(405, rz, 150, 14.5);
        });

        const houses = {};
        const houseCodes = [
            { code: 'A1', col: 0, row: 0 },
            { code: 'A2', col: 1, row: 0 },
            { code: 'A3', col: 2, row: 0 },
            { code: 'B1', col: 0, row: 1 },
            { code: 'B2', col: 1, row: 1 },
            { code: 'B3', col: 2, row: 1 },
            { code: 'C1', col: 0, row: 2 },
            { code: 'C2', col: 1, row: 2 },
            { code: 'C3', col: 2, row: 2 }
        ];

        function createRobloxHouse(code, roadX, zPos, index) {
            const houseGroup = new THREE.Group();
            const houseX = roadX - 20;
            houseGroup.position.set(houseX, 0, zPos);
            scene.add(houseGroup);

            const foundation = new THREE.Mesh(new THREE.BoxGeometry(16, 1.1, 14), new THREE.MeshLambertMaterial({ color: 0xc7bdb1 }));
            foundation.position.set(0, 0.55, 0);
            houseGroup.add(foundation);

            const wallColors = [0xd66a42, 0xd49b4b, 0x5a8fa8, 0x769f68, 0xb8627d, 0x826ab4];
            const wallMat = new THREE.MeshLambertMaterial({ color: wallColors[index % wallColors.length] });
            const walls = new THREE.Mesh(new THREE.BoxGeometry(14.5, 7.5, 12.5), wallMat);
            walls.position.set(0, 4.8, 0);
            walls.castShadow = true;
            houseGroup.add(walls);

            addBoxCollider(houseX - 1.2, zPos, 15.5, 14.2);

            const roofColors = [0x501b1b, 0x223547, 0x2a3e2b, 0x42291a];
            const roofMat = new THREE.MeshLambertMaterial({ color: roofColors[index % roofColors.length] });
            const roof = new THREE.Mesh(new THREE.ConeGeometry(12.5, 5.0, 4), roofMat);
            roof.position.set(0, 11.0, 0);
            roof.rotation.y = Math.PI / 4;
            roof.castShadow = true;
            houseGroup.add(roof);

            // Front door facing East towards the street
            const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 2.0), new THREE.MeshLambertMaterial({ color: 0x3d2716 }));
            door.position.set(7.35, 2.8, 0);
            houseGroup.add(door);

            // Windows
            [-3.2, 3.2].forEach(wz => {
                const win = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.0, 2.2), new THREE.MeshBasicMaterial({ color: 0x93c5fd }));
                win.position.set(7.32, 5.2, wz);
                houseGroup.add(win);
            });

            // Delivery Drop-Off Zone Pad
            const dropX = roadX - 8.5;
            const dropZ = zPos;
            const dropoffGroup = new THREE.Group();
            dropoffGroup.position.set(dropX, 0.16, dropZ);
            scene.add(dropoffGroup);

            const dropRing = new THREE.Mesh(
                new THREE.RingGeometry(3.2, 3.8, 32),
                new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
            );
            dropRing.rotation.x = -Math.PI / 2;
            dropoffGroup.add(dropRing);

            const dropFill = new THREE.Mesh(
                new THREE.CircleGeometry(3.2, 32),
                new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.32, side: THREE.DoubleSide })
            );
            dropFill.rotation.x = -Math.PI / 2;
            dropoffGroup.add(dropFill);

            // House Code Sign
            const hSignCanvas = document.createElement('canvas');
            hSignCanvas.width = 128; hSignCanvas.height = 128;
            const hctx = hSignCanvas.getContext('2d');
            hctx.fillStyle = '#0f172a'; hctx.fillRect(0, 0, 128, 128);
            hctx.strokeStyle = '#38bdf8'; hctx.lineWidth = 8; hctx.strokeRect(4, 4, 120, 120);
            hctx.fillStyle = '#ffffff'; hctx.font = 'bold 64px Fredoka, sans-serif';
            hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
            hctx.fillText(code, 64, 64);

            const hSignMesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 1.8, 1.8),
                new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hSignCanvas) })
            );
            hSignMesh.position.set(7.35, 5.2, 0);
            houseGroup.add(hSignMesh);

            const dropOffWorldPos = new THREE.Vector3(dropX, 0.18, dropZ);

            houses[code] = {
                code,
                position: dropOffWorldPos,
                dropOffPos: dropOffWorldPos,
                housePos: new THREE.Vector3(houseX, 0, zPos),
                group: houseGroup,
                dropRing,
                dropFill
            };
        }

        houseCodes.forEach((h, idx) => {
            const rx = colRoadX[h.col];
            const rz = rowZCoords[h.row];
            createRobloxHouse(h.code, rx, rz, idx);
        });

        // 3D Target Marker Beacon & Delivery Ring
        const targetMarkerGroup = new THREE.Group();
        targetMarkerGroup.visible = false;
        scene.add(targetMarkerGroup);

        const targetRingOuter = new THREE.Mesh(
            new THREE.RingGeometry(3.8, 4.6, 32),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
        );
        targetRingOuter.rotation.x = -Math.PI / 2;
        targetMarkerGroup.add(targetRingOuter);

        const targetRingInner = new THREE.Mesh(
            new THREE.CircleGeometry(3.8, 32),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
        );
        targetRingInner.rotation.x = -Math.PI / 2;
        targetMarkerGroup.add(targetRingInner);

        // 3D Expanding Progress Ring (10 seconds delay fill)
        const targetProgressFill = new THREE.Mesh(
            new THREE.CircleGeometry(3.78, 32),
            new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.70,
                side: THREE.DoubleSide
            })
        );
        targetProgressFill.rotation.x = -Math.PI / 2;
        targetProgressFill.position.y = 0.04;
        targetProgressFill.scale.set(0.001, 0.001, 0.001);
        targetMarkerGroup.add(targetProgressFill);

        // Sky Beacon Beam
        const beaconBeam = new THREE.Mesh(
            new THREE.CylinderGeometry(0.65, 1.8, 120, 16, 1, true),
            new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        beaconBeam.position.y = 60;
        targetMarkerGroup.add(beaconBeam);

        // ====================================================================
        // H) HIGHWAY STREETLIGHTS (Every 45m along spline highway)
        // ====================================================================
        const streetLights = [];
        for (let i = 8; i < roadSubdivs - 8; i += 18) {
            const t = i / roadSubdivs;
            const pt = spline3D.getPoint(t);
            const tan = spline3D.getTangent(t);

            const normX = -tan.z;
            const normZ = tan.x;
            const nLen = Math.hypot(normX, normZ) || 1;
            const nx = normX / nLen;
            const nz = normZ / nLen;

            // Don't place streetlights inside tunnel or over bridge deck
            if (pt.x > -125 && pt.x < -95 && pt.z < -10 && pt.z > -60) continue;
            if (Math.abs(pt.x - (-238)) < 30) continue;

            const poleSide = (i % 36 === 0) ? 1 : -1;
            const poleOffset = (roadWidth / 2) + 2.2;
            const poleX = pt.x + nx * poleOffset * poleSide;
            const poleZ = pt.z + nz * poleOffset * poleSide;

            const lightGroup = new THREE.Group();
            lightGroup.position.set(poleX, 0, poleZ);
            scene.add(lightGroup);

            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.18, 0.24, 7.5, 8),
                new THREE.MeshLambertMaterial({ color: 0x475569 })
            );
            pole.position.y = 3.75;
            pole.castShadow = true;
            lightGroup.add(pole);

            const lampHead = new THREE.Mesh(
                new THREE.BoxGeometry(0.85, 0.35, 1.2),
                new THREE.MeshBasicMaterial({ color: 0xffe88a })
            );
            lampHead.position.set(0, 7.4, 0);
            lightGroup.add(lampHead);

            const sLight = new THREE.PointLight(0xffdd66, 1.2, 28);
            sLight.position.set(0, 7.0, 0);
            lightGroup.add(sLight);
            streetLights.push(sLight);
        }

        // ====================================================================
        // I) TREES & NATURE: Lush Pine Trees and Autumn Oaks
        // ====================================================================
        const barkTex = createBarkTexture();
        const trunkMat = new THREE.MeshStandardMaterial({ map: barkTex, roughness: 0.85, metalness: 0.05 });
        const autumnCrownMaterials = [
            new THREE.MeshStandardMaterial({ map: createFoliageLeafTexture('#d4621a', '#f5822e', '#943808'), roughness: 0.68, flatShading: true }),
            new THREE.MeshStandardMaterial({ map: createFoliageLeafTexture('#d4902a', '#f5b342', '#9e6314'), roughness: 0.68, flatShading: true }),
            new THREE.MeshStandardMaterial({ map: createFoliageLeafTexture('#b54b1e', '#d66832', '#822f0d'), roughness: 0.68, flatShading: true }),
            new THREE.MeshStandardMaterial({ map: createFoliageLeafTexture('#366b28', '#528d3d', '#1f4714'), roughness: 0.68, flatShading: true })
        ];

        function createAutumnTree(x, z, scale = 1, addCollision = true) {
            const tree = new THREE.Group();
            tree.position.set(x, 0, z);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * scale, 0.72 * scale, 5.2 * scale, 7), trunkMat);
            trunk.position.y = 2.6 * scale;
            trunk.castShadow = true;
            tree.add(trunk);

            const primaryMat = autumnCrownMaterials[Math.floor(Math.random() * autumnCrownMaterials.length)];
            const secondaryMat = autumnCrownMaterials[Math.floor(Math.random() * autumnCrownMaterials.length)];

            const mainCrown = new THREE.Mesh(new THREE.IcosahedronGeometry(3.3 * scale, 1), primaryMat);
            mainCrown.position.set(0, 6.6 * scale, 0);
            mainCrown.rotation.set(Math.random(), Math.random(), Math.random());
            mainCrown.castShadow = true;
            tree.add(mainCrown);

            const topCrown = new THREE.Mesh(new THREE.IcosahedronGeometry(2.3 * scale, 1), secondaryMat);
            topCrown.position.set(0, 8.8 * scale, 0);
            topCrown.rotation.set(Math.random(), Math.random(), Math.random());
            topCrown.castShadow = true;
            tree.add(topCrown);

            scene.add(tree);
            if (addCollision) {
                addBoxCollider(x, z, 1.4 * scale, 1.4 * scale);
            }
            return tree;
        }

        function isSpotClearForTree(x, z) {
            // Clear area around factory and forecourt
            if (x < -360 && Math.abs(z) < 38) return false;
            // Clear river canyon at X=-238
            if (Math.abs(x - (-238)) < 32) return false;
            // Clear Tebing 1 & tunnel zone
            if (x > -190 && x < -80 && z > -70 && z < 100) return false;
            // Clear Tebing 2 & arch curve
            if (x > -80 && x < 40 && z > -105 && z < -40) return false;
            // Clear railroad zone
            if (Math.abs(x - 110) < 16) return false;
            // Clear cornfield zone
            if (x > 130 && x < 320 && z > -140 && z < 10) return false;
            // Clear residential zone
            if (x > 325 && x < 500 && z > -80 && z < 95) return false;

            // Distance to highway segments
            for (let i = 0; i < highwayPoints.length - 1; i++) {
                const p1 = highwayPoints[i];
                const p2 = highwayPoints[i+1];
                const dx = p2[0] - p1[0];
                const dz = p2[1] - p1[1];
                const len2 = dx * dx + dz * dz;
                let t = ((x - p1[0]) * dx + (z - p1[1]) * dz) / len2;
                t = Math.max(0, Math.min(1, t));
                const closeX = p1[0] + t * dx;
                const closeZ = p1[1] + t * dz;
                if (Math.hypot(x - closeX, z - closeZ) < 18.0) return false;
            }
            return true;
        }

        // Roadside Tree Spawns
        const treeSpawns = [
            // West area background trees
            [-500, -55], [-480, 55], [-450, -60], [-430, 65], [-400, -50],
            // Factory north/south flanks
            [-370, -48], [-350, -52], [-330, -58], [-310, -52],
            [-370, 58], [-350, 62], [-330, 65], [-310, 60],
            // River flanks
            [-270, -82], [-270, -58], [-270, 92], [-270, 125],
            [-205, -82], [-205, -58], [-205, 92], [-205, 125],
            // South road edge near cornfield
            [160, 50], [190, 52], [220, 50], [250, 48], [280, 42],
            // Residential outskirts
            [320, -95], [370, -95], [420, -95], [470, -95],
            [320, 105], [370, 105], [420, 105], [470, 105],
            [510, -50], [510, 0], [510, 50]
        ];

        treeSpawns.forEach(([tx, tz]) => {
            if (isSpotClearForTree(tx, tz)) {
                createAutumnTree(tx, tz, 0.9 + Math.random() * 0.45, true);
            }
        });

        for (let i = 0; i < 90; i++) {
            const rx = -500 + Math.random() * 1000;
            const rz = -230 + Math.random() * 460;
            if (isSpotClearForTree(rx, rz)) {
                createAutumnTree(rx, rz, 1.0 + Math.random() * 0.5, true);
            }
        }

        `;

html = html.substring(0, startIndex) + newWorldSection + html.substring(endIndex);
console.log("✓ World section replaced successfully");

// 6. Overhaul drawMinimap function
const minimapStartMarker = "const mCtx = minimapCanvas.getContext('2d');";
const minimapEndMarker = "function animate(now) {";

const mStartIndex = html.indexOf(minimapStartMarker);
const mEndIndex = html.indexOf(minimapEndMarker);

if (mStartIndex === -1 || mEndIndex === -1) {
    console.error("ERROR: Could not find minimap start or end markers!", { mStartIndex, mEndIndex });
    process.exit(1);
}

const newMinimapCode = `const mCtx = minimapCanvas.getContext('2d');

        function drawMinimap() {
            const W = minimapCanvas.width;
            const H = minimapCanvas.height;
            mCtx.clearRect(0, 0, W, H);

            // Autumn Landscape Background
            mCtx.fillStyle = '#22140d';
            mCtx.fillRect(0, 0, W, H);

            // Coordinate mapper: World X in [-500, 500], World Z in [-180, 180]
            const mapX = (wx) => ((wx + 500) / 1000) * W;
            const mapZ = (wz) => ((wz + 180) / 360) * H;

            // 1. Draw River (Sungai) & Wooden Bridge
            mCtx.fillStyle = '#1e608a';
            mCtx.fillRect(mapX(-244), 0, mapX(-216) - mapX(-244), H);

            // Wooden Bridge at X=-238, Z=52
            mCtx.fillStyle = '#78431f';
            mCtx.save();
            mCtx.translate(mapX(-238), mapZ(52));
            mCtx.rotate(-0.38);
            mCtx.fillRect(-mapX(-205) + mapX(-238), -4, (mapX(-205) - mapX(-270)), 8);
            mCtx.restore();

            // 2. Draw Tebing 1
            mCtx.fillStyle = '#473f38';
            mCtx.beginPath();
            mCtx.arc(mapX(-165), mapZ(80), 10, 0, Math.PI * 2);
            mCtx.fill();

            // 3. Draw Mountain & Tunnel Area (SW to NE)
            mCtx.fillStyle = '#473f38';
            mCtx.beginPath();
            mCtx.arc(mapX(-110), mapZ(-35), 14, 0, Math.PI * 2);
            mCtx.fill();

            mCtx.fillStyle = '#1e1b18';
            mCtx.beginPath();
            mCtx.arc(mapX(-110), mapZ(-35), 5, 0, Math.PI * 2);
            mCtx.fill();

            // Tebing 2 Bluff
            mCtx.fillStyle = '#473f38';
            mCtx.beginPath();
            mCtx.arc(mapX(-50), mapZ(-45), 8, 0, Math.PI * 2);
            mCtx.fill();

            // 4. Draw Railroad Track (Rel Kereta Api)
            mCtx.strokeStyle = '#94a3b8';
            mCtx.lineWidth = 1.5;
            mCtx.beginPath();
            mCtx.moveTo(mapX(110), 0);
            mCtx.lineTo(mapX(110), H);
            mCtx.stroke();

            // 5. Draw Cornfield (Ladang Jagung)
            const cx1 = mapX(135);
            const cz1 = mapZ(-135);
            const cx2 = mapX(315);
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

            // 6. Draw Highway Route
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

            // 7. Draw Residential District Grid (Perumahan)
            mCtx.strokeStyle = '#64748b';
            mCtx.lineWidth = 2.5;
            colRoadX.forEach(rx => {
                mCtx.beginPath();
                mCtx.moveTo(mapX(rx), mapZ(-60));
                mCtx.lineTo(mapX(rx), mapZ(80));
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
            mCtx.fillRect(mapX(-475), mapZ(-15), mapX(-445) - mapX(-475), mapZ(15) - mapZ(-15));
            mCtx.strokeStyle = '#facc15';
            mCtx.lineWidth = 1.2;
            mCtx.beginPath();
            mCtx.arc(mapX(-448), mapZ(0), 4.5, 0, Math.PI * 2);
            mCtx.stroke();

            // Draw Houses
            Object.values(houses).forEach(h => {
                const hx = mapX(h.position.x);
                const hz = mapZ(h.position.z);
                const isTarget = gameState.hasPackage && gameState.targetHouse === h.code;

                mCtx.fillStyle = isTarget ? '#38bdf8' : '#713f12';
                mCtx.fillRect(hx - 3, hz - 3, 6, 6);

                if (isTarget) {
                    mCtx.strokeStyle = '#ffffff';
                    mCtx.lineWidth = 1.5;
                    mCtx.strokeRect(hx - 4.5, hz - 4.5, 9, 9);
                }

                mCtx.fillStyle = isTarget ? '#ffffff' : '#fde047';
                mCtx.font = 'bold 6.5px Fredoka, sans-serif';
                mCtx.textAlign = 'center';
                mCtx.fillText(h.code, hx, hz + 2.5);
            });

            // Draw Player Car Cursor
            const px = mapX(carPhysics.x);
            const pz = mapZ(carPhysics.z);

            mCtx.save();
            mCtx.translate(px, pz);
            mCtx.rotate(-carPhysics.angle - Math.PI / 2);
            mCtx.fillStyle = '#ef4444';
            mCtx.strokeStyle = '#ffffff';
            mCtx.lineWidth = 1.5;
            mCtx.beginPath();
            mCtx.moveTo(0, -6);
            mCtx.lineTo(4, 5);
            mCtx.lineTo(0, 3);
            mCtx.lineTo(-4, 5);
            mCtx.closePath();
            mCtx.fill();
            mCtx.stroke();
            mCtx.restore();
        }

        `;

html = html.substring(0, mStartIndex) + newMinimapCode + html.substring(mEndIndex);
console.log("✓ Minimap updated successfully");

fs.writeFileSync('c:/Projects/delivery-pizza/index.html', html, 'utf8');
console.log("🎉 Successfully updated index.html with complete world matching refrensi-denah.jpeg!");
