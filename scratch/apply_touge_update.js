const fs = require('fs');

console.log('--- Applying Touge Mountain Drift Extension ---');

let html = fs.readFileSync('index.html', 'utf8');

// Backup original index.html before update
fs.writeFileSync('index.html.bak_before_touge', html);
console.log('Backup saved to index.html.bak_before_touge');

// 1. Hook for inserting Touge Module after Residential District
const resHook = `        houseCodes.forEach((h, idx) => {
            const rx = colRoadX[h.col];
            const rz = rowZCoords[h.row];
            createRobloxHouse(h.code, rx, rz, idx);
        });`;

if (!html.includes(resHook)) {
    console.error('ERROR: Could not find resHook in index.html!');
    process.exit(1);
}

const tougeModuleCode = `
        // ====================================================================
        // J) JALUR DRIFT TOUGE JEPANG (JAPANESE MOUNTAIN TOUGE PASS & GARASI PUNCAK)
        // Lanjutan jalan dari Perumahan Cross-Street 2 (X=730) menanjak ke puncak gunung (Y=82)
        // ====================================================================
        const tougeGroup = new THREE.Group();
        scene.add(tougeGroup);

        const tougePoints = [
            [730, 0.28, 15],       // 0: Sambungan dari ujung timur Cross-Street 2 Perumahan
            [770, 0.50, 15],       // 1: Jalan penghubung lurus keluar perumahan menuju kaki bukit
            [800, 3.50, 15],       // 2: Memasuki kaki bukit, mulai tanjakan halus
            [805, 9.0, 50],        // 3: Menikung ke utara memasuki lereng dasar (Tier 1)
            [810, 16.0, 95],       // 4: Tanjakan lereng bawah menuju Hairpin 1
            [825, 23.0, 140],      // 5: Masuk zona belokan Hairpin 1
            [855, 28.0, 165],      // 6: PUNCAK TIKUNGAN HAIRPIN 1 (Garis Merah Putih!)
            [885, 33.0, 140],      // 7: Keluar Hairpin 1 menuju Tier 2
            [885, 39.0, 90],       // 8: Tanjakan lereng tengah Tier 2
            [880, 45.0, 30],       // 9: Lurus menanjak ke arah selatan
            [890, 51.0, -20],      // 10: Masuk zona belokan Hairpin 2
            [920, 56.0, -50],      // 11: PUNCAK TIKUNGAN HAIRPIN 2 (Garis Merah Putih!)
            [955, 60.0, -20],      // 12: Keluar Hairpin 2 menuju Tier 3
            [965, 65.0, 35],       // 13: Lereng tinggi Tier 3 melintasi tebing
            [975, 70.0, 95],       // 14: Tanjakan atas Tier 3
            [995, 74.0, 140],      // 15: Masuk zona belokan Hairpin 3
            [1030, 77.0, 160],     // 16: PUNCAK TIKUNGAN HAIRPIN 3 (Garis Merah Putih!)
            [1065, 79.5, 130],     // 17: Keluar Hairpin 3 menyapu lereng atas
            [1085, 81.0, 80],      // 18: Belokan S menjelang puncak
            [1130, 82.0, 40],      // 19: Memasuki dataran tinggi Puncak Gunung
            [1200, 82.0, 30],      // 20: Halaman Garasi Puncak & Area Parkir Pandang (Viewpoint)
            [1250, 82.0, 30]       // 21: Di dalam Garasi Puncak (Touge Summit Garage)
        ];

        const tougeSpline3D = new THREE.CatmullRomCurve3(
            tougePoints.map(p => new THREE.Vector3(p[0], p[1], p[2])),
            false,
            'catmullrom',
            0.5
        );

        // Pre-sampling 320 titik kurva untuk kalkulasi ketinggian fisika mobil super cepat (O(1))
        const tougeSamples = [];
        const numTougeSamples = 320;
        for (let s = 0; s <= numTougeSamples; s++) {
            const u = s / numTougeSamples;
            const pt = tougeSpline3D.getPoint(u);
            tougeSamples.push({ x: pt.x, y: pt.y, z: pt.z, u });
        }
        window.tougeSplineSamples = tougeSamples;

        // 1. Pita 3D Aspal Jalan Touge (16 meter lebar lega untuk drifting luas & leluasa!)
        const tougeRoadWidth = 16.0;
        const tougeRoadPositions = [];
        const tougeRoadUvs = [];
        const tougeRoadIndices = [];

        const tDashPositions = [];
        const tDashIndices = [];

        const tEdgePositions = [];
        const tEdgeIndices = [];

        const tSubdivs = 360;
        const tougeLen = tougeSpline3D.getLength();

        for (let i = 0; i <= tSubdivs; i++) {
            const t = i / tSubdivs;
            const pt = tougeSpline3D.getPoint(t);
            let tan = tougeSpline3D.getTangent(t);
            if (tan.lengthSq() < 0.001) tan = new THREE.Vector3(1, 0, 0);
            tan.normalize();

            let nx = -tan.z;
            let nz = tan.x;
            const nLen = Math.hypot(nx, nz) || 1;
            nx /= nLen;
            nz /= nLen;

            const halfW = tougeRoadWidth / 2;
            const lx = pt.x + nx * halfW;
            const lz = pt.z + nz * halfW;
            const rx = pt.x - nx * halfW;
            const rz = pt.z - nz * halfW;

            tougeRoadPositions.push(lx, pt.y, lz);
            tougeRoadPositions.push(rx, pt.y, rz);

            const uvY = t * tougeLen * 0.12;
            tougeRoadUvs.push(0, uvY, 1, uvY);

            if (i < tSubdivs) {
                const b = i * 2;
                tougeRoadIndices.push(b, b + 2, b + 1);
                tougeRoadIndices.push(b + 1, b + 2, b + 3);
            }

            // Garis tepi putih solid (0.35m)
            const edgeW = 0.35;
            const eIdx = i * 4;
            tEdgePositions.push(
                lx, pt.y + 0.035, lz,
                lx - nx * edgeW, pt.y + 0.035, lz - nz * edgeW
            );
            tEdgePositions.push(
                rx + nx * edgeW, pt.y + 0.035, rz + nz * edgeW,
                rx, pt.y + 0.035, rz
            );

            if (i < tSubdivs) {
                tEdgeIndices.push(eIdx, eIdx + 4, eIdx + 1);
                tEdgeIndices.push(eIdx + 1, eIdx + 4, eIdx + 5);
                tEdgeIndices.push(eIdx + 2, eIdx + 6, eIdx + 3);
                tEdgeIndices.push(eIdx + 3, eIdx + 6, eIdx + 7);
            }
        }

        // Garis tengah putus-putus
        const tDashLen = 4.5;
        const tGapLen = 5.5;
        const tCycle = tDashLen + tGapLen;
        const tNumCycles = Math.floor(tougeLen / tCycle);

        for (let d = 0; d < tNumCycles; d++) {
            const startDist = d * tCycle + 1.5;
            const endDist = startDist + tDashLen;
            if (endDist > tougeLen - 3.0) break;

            const baseIdx = tDashPositions.length / 3;
            for (let s = 0; s <= 3; s++) {
                const u = (startDist + (s / 3) * tDashLen) / tougeLen;
                const pt = tougeSpline3D.getPointAt(u);
                const tan = tougeSpline3D.getTangentAt(u).normalize();
                let dnx = -tan.z;
                let dnz = tan.x;
                const dl = Math.hypot(dnx, dnz) || 1;
                dnx /= dl;
                dnz /= dl;

                tDashPositions.push(
                    pt.x + dnx * 0.24, pt.y + 0.04, pt.z + dnz * 0.24,
                    pt.x - dnx * 0.24, pt.y + 0.04, pt.z - dnz * 0.24
                );
            }

            for (let s = 0; s < 3; s++) {
                const b = baseIdx + s * 2;
                tDashIndices.push(b, b + 2, b + 1);
                tDashIndices.push(b + 1, b + 2, b + 3);
            }
        }

        const tougeRoadGeo = new THREE.BufferGeometry();
        tougeRoadGeo.setAttribute('position', new THREE.Float32BufferAttribute(tougeRoadPositions, 3));
        tougeRoadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(tougeRoadUvs, 2));
        tougeRoadGeo.setIndex(tougeRoadIndices);
        tougeRoadGeo.computeVertexNormals();

        const tougeRoadMesh = new THREE.Mesh(tougeRoadGeo, asphaltMat);
        tougeRoadMesh.receiveShadow = true;
        tougeRoadMesh.renderOrder = 1;
        tougeGroup.add(tougeRoadMesh);

        const whiteMarkingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

        const tDashGeo = new THREE.BufferGeometry();
        tDashGeo.setAttribute('position', new THREE.Float32BufferAttribute(tDashPositions, 3));
        tDashGeo.setIndex(tDashIndices);
        tDashGeo.computeVertexNormals();
        const tDashMesh = new THREE.Mesh(tDashGeo, whiteMarkingMat);
        tDashMesh.renderOrder = 2;
        tougeGroup.add(tDashMesh);

        const tEdgeGeo = new THREE.BufferGeometry();
        tEdgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(tEdgePositions, 3));
        tEdgeGeo.setIndex(tEdgeIndices);
        tEdgeGeo.computeVertexNormals();
        const tEdgeMesh = new THREE.Mesh(tEdgeGeo, whiteMarkingMat);
        tEdgeMesh.renderOrder = 2;
        tougeGroup.add(tEdgeMesh);

        // 2. Marka Garis Merah Putih di Belokan Touge (Iconic Japanese Touge Friction Striping)
        function createTougeStripesTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');

            const barWidth = 32;
            const numBars = canvas.width / barWidth;
            for (let i = 0; i < numBars; i++) {
                ctx.fillStyle = (i % 2 === 0) ? '#dc2626' : '#ffffff';
                ctx.fillRect(i * barWidth, 0, barWidth, 128);
            }
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            for (let i = 0; i <= numBars; i++) {
                ctx.fillRect(i * barWidth - 1, 0, 2, 128);
            }

            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            return tex;
        }

        const tougeStripesTex = createTougeStripesTexture();
        const tougeStripesMat = new THREE.MeshStandardMaterial({
            map: tougeStripesTex,
            roughness: 0.75,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        // Pasang garis merah putih di tiap belokan Hairpin Touge
        const hairpinZones = [
            { startU: 0.22, endU: 0.36, outerSide: 1 },  // Hairpin 1 (North Apex)
            { startU: 0.44, endU: 0.58, outerSide: -1 }, // Hairpin 2 (South Apex)
            { startU: 0.67, endU: 0.80, outerSide: 1 },  // Hairpin 3 (North Apex)
            { startU: 0.81, endU: 0.90, outerSide: -1 }  // Hairpin 4 (Summit Curve)
        ];

        hairpinZones.forEach(hz => {
            const stripeSteps = 28;
            const sPositions = [];
            const sUvs = [];
            const sIndices = [];
            const stripeW = 3.2; // Lebar zona garis merah putih 3.2 meter

            for (let j = 0; j <= stripeSteps; j++) {
                const u = hz.startU + (j / stripeSteps) * (hz.endU - hz.startU);
                const pt = tougeSpline3D.getPointAt(u);
                const tan = tougeSpline3D.getTangentAt(u).normalize();
                let nx = -tan.z;
                let nz = tan.x;
                const l = Math.hypot(nx, nz) || 1;
                nx /= l; nz /= l;

                const halfW = tougeRoadWidth / 2;
                const edgeX = pt.x + nx * halfW * hz.outerSide;
                const edgeZ = pt.z + nz * halfW * hz.outerSide;
                const innerX = pt.x + nx * (halfW - stripeW) * hz.outerSide;
                const innerZ = pt.z + nz * (halfW - stripeW) * hz.outerSide;

                sPositions.push(edgeX, pt.y + 0.045, edgeZ);
                sPositions.push(innerX, pt.y + 0.045, innerZ);

                const uvX = j * 1.8;
                sUvs.push(uvX, 0, uvX, 1);

                if (j < stripeSteps) {
                    const b = j * 2;
                    sIndices.push(b, b + 2, b + 1);
                    sIndices.push(b + 1, b + 2, b + 3);
                }
            }

            const sGeo = new THREE.BufferGeometry();
            sGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPositions, 3));
            sGeo.setAttribute('uv', new THREE.Float32BufferAttribute(sUvs, 2));
            sGeo.setIndex(sIndices);
            sGeo.computeVertexNormals();

            const sMesh = new THREE.Mesh(sGeo, tougeStripesMat);
            sMesh.receiveShadow = true;
            sMesh.renderOrder = 3;
            tougeGroup.add(sMesh);
        });

        // 3. Pagar Pembatas Jurang Besi (Touge Armco W-Beam Guardrails)
        const guardrailSteelMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.85,
            roughness: 0.35
        });
        const postSteelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.5 });
        const reflectorRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

        hairpinZones.forEach(hz => {
            const steps = 20;
            for (let j = 0; j < steps; j++) {
                const u1 = hz.startU + (j / steps) * (hz.endU - hz.startU);
                const u2 = hz.startU + ((j + 1) / steps) * (hz.endU - hz.startU);
                const pt1 = tougeSpline3D.getPointAt(u1);
                const pt2 = tougeSpline3D.getPointAt(u2);
                const tan1 = tougeSpline3D.getTangentAt(u1).normalize();
                const tan2 = tougeSpline3D.getTangentAt(u2).normalize();

                const halfW = tougeRoadWidth / 2 + 0.65;
                const gx1 = pt1.x + (-tan1.z) * halfW * hz.outerSide;
                const gz1 = pt1.z + (tan1.x) * halfW * hz.outerSide;
                const gy1 = pt1.y + 0.65;

                const gx2 = pt2.x + (-tan2.z) * halfW * hz.outerSide;
                const gz2 = pt2.z + (tan2.x) * halfW * hz.outerSide;
                const gy2 = pt2.y + 0.65;

                const segLen = Math.hypot(gx2 - gx1, gy2 - gy1, gz2 - gz1);
                const midX = (gx1 + gx2) / 2;
                const midY = (gy1 + gy2) / 2;
                const midZ = (gz1 + gz2) / 2;

                const railBeam = new THREE.Mesh(
                    new THREE.BoxGeometry(segLen, 0.44, 0.16),
                    guardrailSteelMat
                );
                railBeam.position.set(midX, midY, midZ);
                railBeam.lookAt(gx2, gy2, gz2);
                railBeam.rotateY(Math.PI / 2);
                railBeam.castShadow = true;
                tougeGroup.add(railBeam);

                const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.4, 0.18), postSteelMat);
                post.position.set(gx1, gy1 - 0.25, gz1);
                post.castShadow = true;
                tougeGroup.add(post);

                const ref = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.22), reflectorRedMat);
                ref.position.set(gx1, gy1 + 0.45, gz1);
                tougeGroup.add(ref);

                addSegmentCollider(gx1, gz1, gx2, gz2, 1.2);
            }
        });

        // 4. Bodi Gunung 3D Masif & Tebing Batu Karang (Mount Touge 3D Massif)
        const alpineGrassMat = new THREE.MeshStandardMaterial({
            color: 0x1e3a24,
            roughness: 0.92,
            metalness: 0.04
        });

        // Perpanjangan lantai pulau ke arah timur
        const mountainBaseGeo = new THREE.PlaneGeometry(650, 700);
        const mountainBase = new THREE.Mesh(mountainBaseGeo, eastGroundMat);
        mountainBase.rotation.x = -Math.PI / 2;
        mountainBase.position.set(1125, 0, 0);
        mountainBase.receiveShadow = true;
        tougeGroup.add(mountainBase);

        // Tebing-tebing batu besar pembentuk lereng gunung bertingkat
        createStratifiedCliff(850, 14, 155, 48, 28, 42, 0.15);
        createStratifiedCliff(845, 24, 160, 42, 34, 38, -0.1);
        createStratifiedCliff(895, 28, 110, 36, 42, 54, 0.05);

        createStratifiedCliff(915, 38, -45, 52, 46, 44, -0.2);
        createStratifiedCliff(910, 48, -40, 44, 48, 38, 0.12);
        createStratifiedCliff(940, 52, 10, 38, 54, 48, -0.08);

        createStratifiedCliff(1015, 58, 155, 56, 58, 48, 0.18);
        createStratifiedCliff(1020, 68, 150, 48, 62, 40, -0.15);
        createStratifiedCliff(1045, 72, 110, 42, 68, 52, 0.05);

        // Puncak Utama Gunung di belakang Garasi
        createStratifiedCliff(1280, 88, 30, 48, 36, 68, 0.0);
        createStratifiedCliff(1320, 94, 35, 54, 44, 76, 0.1);
        createStratifiedCliff(1300, 102, 10, 38, 48, 44, -0.12);

        // Lereng Kerucut Hijau Gunung
        const slopeGeo1 = new THREE.ConeGeometry(55, 65, 8);
        const slope1 = new THREE.Mesh(slopeGeo1, alpineGrassMat);
        slope1.position.set(855, 28, 165);
        slope1.scale.set(1.4, 1.0, 1.2);
        slope1.receiveShadow = true;
        tougeGroup.add(slope1);

        const slopeGeo2 = new THREE.ConeGeometry(65, 85, 8);
        const slope2 = new THREE.Mesh(slopeGeo2, alpineGrassMat);
        slope2.position.set(920, 42, -50);
        slope2.scale.set(1.5, 1.0, 1.3);
        slope2.receiveShadow = true;
        tougeGroup.add(slope2);

        const slopeGeo3 = new THREE.ConeGeometry(75, 95, 8);
        const slope3 = new THREE.Mesh(slopeGeo3, alpineGrassMat);
        slope3.position.set(1030, 55, 160);
        slope3.scale.set(1.5, 1.0, 1.4);
        slope3.receiveShadow = true;
        tougeGroup.add(slope3);

        const slopeGeo4 = new THREE.ConeGeometry(95, 110, 10);
        const slope4 = new THREE.Mesh(slopeGeo4, alpineGrassMat);
        slope4.position.set(1280, 65, 30);
        slope4.scale.set(1.6, 1.0, 1.5);
        slope4.receiveShadow = true;
        tougeGroup.add(slope4);

        // 5. Pohon Cemara / Pinus Pegunungan Jepang (Japanese Alpine Pines)
        const pineCrownMat1 = new THREE.MeshStandardMaterial({ color: 0x143d26, roughness: 0.8, flatShading: true });
        const pineCrownMat2 = new THREE.MeshStandardMaterial({ color: 0x1b4d32, roughness: 0.8, flatShading: true });
        const pineTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 });

        function createAlpinePineTree(px, py, pz, pScale = 1.0) {
            const pTree = new THREE.Group();
            pTree.position.set(px, py, pz);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * pScale, 0.55 * pScale, 3.8 * pScale, 6), pineTrunkMat);
            trunk.position.y = 1.9 * pScale;
            trunk.castShadow = true;
            pTree.add(trunk);

            [
                { y: 3.5, r: 2.8, h: 4.2, mat: pineCrownMat1 },
                { y: 5.6, r: 2.2, h: 3.6, mat: pineCrownMat2 },
                { y: 7.4, r: 1.5, h: 3.0, mat: pineCrownMat1 }
            ].forEach(tier => {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r * pScale, tier.h * pScale, 7), tier.mat);
                cone.position.y = tier.y * pScale;
                cone.castShadow = true;
                pTree.add(cone);
            });

            tougeGroup.add(pTree);
            cullableTrees.push({ group: pTree, x: px, z: pz });
            return pTree;
        }

        const pineCoords = [
            [790, 2, 35], [780, 1, 60], [795, 6, 80], [785, 8, 120], [805, 12, 135],
            [830, 18, 175], [860, 24, 185], [875, 26, 180], [840, 22, 155], [860, 20, 130],
            [845, 26, 115], [850, 30, 85], [855, 34, 55], [860, 38, 25], [865, 42, -5],
            [895, 46, -45], [915, 52, -65], [935, 54, -70], [950, 56, -55], [935, 52, -35],
            [925, 56, 10], [930, 60, 45], [935, 64, 75], [940, 68, 105], [950, 70, 130],
            [990, 72, 175], [1020, 76, 185], [1045, 76, 175], [1060, 77, 155], [1020, 73, 140],
            [1085, 78, 110], [1105, 79, 65], [1125, 80, 20], [1145, 81, -5],
            [1180, 82, 10], [1190, 82, 55], [1210, 82, 60], [1235, 82, 55], [1265, 82, 50],
            [1275, 82, 15], [1255, 82, 5], [1220, 82, 5], [1195, 82, 15]
        ];

        pineCoords.forEach(c => {
            createAlpinePineTree(c[0], c[1], c[2], 0.9 + Math.random() * 0.4);
            createAlpinePineTree(c[0] + (Math.random() - 0.5) * 8, c[1] + (Math.random() - 0.5) * 2, c[2] + (Math.random() - 0.5) * 8, 0.7 + Math.random() * 0.5);
        });

        // 6. Rantai Lampu Jalan Malam Touge (Touge Amber Streetlights)
        for (let i = 8; i < tSubdivs - 6; i += 14) {
            const u = i / tSubdivs;
            const pt = tougeSpline3D.getPointAt(u);
            const tan = tougeSpline3D.getTangentAt(u).normalize();
            let nx = -tan.z;
            let nz = tan.x;
            const l = Math.hypot(nx, nz) || 1;
            nx /= l; nz /= l;

            const poleOffset = (tougeRoadWidth / 2) + 1.8;
            const poleX = pt.x + nx * poleOffset;
            const poleY = pt.y;
            const poleZ = pt.z + nz * poleOffset;

            const tLightGroup = new THREE.Group();
            tLightGroup.position.set(poleX, poleY, poleZ);
            tougeGroup.add(tLightGroup);

            const tPole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.22, 7.8, 8),
                new THREE.MeshLambertMaterial({ color: 0x334155 })
            );
            tPole.position.y = 3.9;
            tPole.castShadow = true;
            tLightGroup.add(tPole);

            const tLamp = new THREE.Mesh(
                new THREE.BoxGeometry(0.85, 0.35, 1.2),
                new THREE.MeshBasicMaterial({ color: 0xffdf78 })
            );
            tLamp.position.set(0, 7.6, 0);
            tLightGroup.add(tLamp);

            cullablePoles.push({ group: tLightGroup, x: poleX, z: poleZ });
        }

        // ====================================================================
        // 7. GARASI PUNCAK TOUGE (TOUGE SUMMIT DRIFT GARAGE & SCENIC OVERLOOK)
        // Terletak di puncak bukit X = 1200..1270, Z = 15..50, Y = 82.0
        // ====================================================================
        const garageGroup = new THREE.Group();
        garageGroup.position.set(1240, 82.0, 30);
        tougeGroup.add(garageGroup);

        // Pelataran Aspal Parkir Puncak
        const summitPad = new THREE.Mesh(
            new THREE.BoxGeometry(75, 0.30, 56),
            asphaltMat
        );
        summitPad.position.set(-15, 0.15, 0);
        summitPad.receiveShadow = true;
        garageGroup.add(summitPad);

        // Garis parkir kuning
        const markMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        [-18, -12, -6, 0, 6].forEach(pz => {
            const pLine = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.04, 0.25), markMat);
            pLine.position.set(-28, 0.32, pz);
            garageGroup.add(pLine);
        });

        // Pagar Pengaman Gardu Pandang (Scenic Viewpoint Railing)
        const viewRailingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
        const viewRail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.1, 48), viewRailingMat);
        viewRail.position.set(-51, 0.55, 0);
        viewRail.castShadow = true;
        garageGroup.add(viewRail);
        addSegmentCollider(1240 - 51, 30 - 24, 1240 - 51, 30 + 24, 1.2);

        // Teropong Pandang Wisata
        [-12, 12].forEach(bz => {
            const binoBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.24, 1.4, 8), postSteelMat);
            binoBase.position.set(-50.2, 0.7, bz);
            garageGroup.add(binoBase);
            const binoHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.45), new THREE.MeshLambertMaterial({ color: 0x1e293b }));
            binoHead.position.set(-50.2, 1.45, bz);
            garageGroup.add(binoHead);
        });

        // Gedung Garasi Tuning Drift
        const gWallMat = new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.85, metalness: 0.2 });
        const gRoofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.7, metalness: 0.1 });

        const garageBody = new THREE.Mesh(new THREE.BoxGeometry(18, 8.5, 26), gWallMat);
        garageBody.position.set(10, 4.25, 0);
        garageBody.castShadow = true;
        garageBody.receiveShadow = true;
        garageGroup.add(garageBody);
        addBoxCollider(1240 + 10, 30, 19, 27);

        const gRoofShape = new THREE.Shape();
        gRoofShape.moveTo(-10.5, 0);
        gRoofShape.lineTo(10.5, 0);
        gRoofShape.lineTo(0, 3.8);
        gRoofShape.closePath();
        const gRoofGeo = new THREE.ExtrudeGeometry(gRoofShape, { depth: 27.5, bevelEnabled: false });
        gRoofGeo.center();
        const gRoofMesh = new THREE.Mesh(gRoofGeo, gRoofMat);
        gRoofMesh.rotation.y = Math.PI / 2;
        gRoofMesh.position.set(10, 10.4, 0);
        gRoofMesh.castShadow = true;
        garageGroup.add(gRoofMesh);

        // Pintu Masuk Garasi Terbuka (Open Drive-in Bay)
        const bayHoleMat = new THREE.MeshBasicMaterial({ color: 0x111317 });
        const bayHole = new THREE.Mesh(new THREE.PlaneGeometry(12, 5.8), bayHoleMat);
        bayHole.position.set(0.95, 2.9, 0);
        bayHole.rotation.y = -Math.PI / 2;
        garageGroup.add(bayHole);

        const shutterMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.4 });
        const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.4, 12.2), shutterMat);
        shutter.position.set(1.0, 5.1, 0);
        garageGroup.add(shutter);

        // Detail Bengkel: Ban Drift & Drum Oli
        const tireMat = new THREE.MeshLambertMaterial({ color: 0x111214 });
        for (let tz = -3.5; tz <= 3.5; tz += 1.8) {
            const tireStack = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.6, 12), tireMat);
            tireStack.position.set(12, 0.8, tz);
            garageGroup.add(tireStack);
        }

        const drumMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.6, roughness: 0.4 });
        [-4.5, -3.2].forEach(dx => {
            const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 12), drumMat);
            drum.position.set(6, 0.7, dx - 7);
            garageGroup.add(drum);
        });

        // Plang Neon di Atas Garasi
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512; signCanvas.height = 128;
        const sctx = signCanvas.getContext('2d');
        sctx.fillStyle = '#0f172a'; sctx.fillRect(0, 0, 512, 128);
        sctx.strokeStyle = '#dc2626'; sctx.lineWidth = 8; sctx.strokeRect(4, 4, 504, 120);
        sctx.fillStyle = '#ef4444'; sctx.font = '900 48px sans-serif';
        sctx.textAlign = 'center'; sctx.fillText('峠 GARASI PUNCAK', 256, 56);
        sctx.fillStyle = '#f8fafc'; sctx.font = 'bold 24px Inter, sans-serif';
        sctx.fillText('MOUNT TOUGE DRIFT OUTPOST', 256, 98);

        const neonSign = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 3.2, 13.5),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) })
        );
        neonSign.position.set(1.2, 8.8, 0);
        neonSign.rotation.y = -Math.PI / 2;
        garageGroup.add(neonSign);

        // Mesin Minuman Otomatis Jepang
        const vendMatBlue = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
        const vendMatRed = new THREE.MeshBasicMaterial({ color: 0xb91c1c });
        const vendGlassMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });

        const vend1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 1.6), vendMatBlue);
        vend1.position.set(1.6, 1.25, -8.5);
        garageGroup.add(vend1);
        const vGlass1 = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), vendGlassMat);
        vGlass1.position.set(0.95, 1.5, -8.5);
        vGlass1.rotation.y = -Math.PI / 2;
        garageGroup.add(vGlass1);

        const vend2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.5, 1.6), vendMatRed);
        vend2.position.set(1.6, 1.25, -10.5);
        garageGroup.add(vend2);
        const vGlass2 = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), vendGlassMat);
        vGlass2.position.set(0.95, 1.5, -10.5);
        vGlass2.rotation.y = -Math.PI / 2;
        garageGroup.add(vGlass2);

        // Pompa Bensin
        const pumpIsland = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.35, 10), new THREE.MeshLambertMaterial({ color: 0x64748b }));
        pumpIsland.position.set(-18, 0.18, 14);
        garageGroup.add(pumpIsland);

        const pumpCanopy = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.6, 14), gRoofMat);
        pumpCanopy.position.set(-18, 6.2, 14);
        garageGroup.add(pumpCanopy);

        [-4, 4].forEach(pz => {
            const pPole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6.0, 8), postSteelMat);
            pPole.position.set(-18, 3.0, 14 + pz);
            garageGroup.add(pPole);

            const pumpDisp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 1.6), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5, roughness: 0.4 }));
            pumpDisp.position.set(-18, 1.4, 14 + pz * 0.45);
            garageGroup.add(pumpDisp);
        });

        // Lampu Sorot Garasi
        const garageLight = new THREE.PointLight(0xfff1cf, 1.2, 45);
        garageLight.position.set(-8, 7.5, 0);
        garageGroup.add(garageLight);
`;

html = html.replace(resHook, resHook + '\n' + tougeModuleCode);
console.log('1. Touge 3D Module inserted successfully.');

// 2. Update isSpotClearForTree so trees don't spawn on touge
const treeClearHook = `if (x > 340 && x < 740 && z > -75 && z < 175) return false;`;
const newTreeClear = `if (x > 340 && x < 740 && z > -75 && z < 175) return false;\n            // Clear Touge mountain pass road corridor\n            if (x >= 730 && x <= 1350) return false;`;
if (html.includes(treeClearHook)) {
    html = html.replace(treeClearHook, newTreeClear);
    console.log('2. Tree clearance updated for Touge corridor.');
}

// 3. Update getTerrainHeightWithBumps to handle Touge mountain & summit plateau
const terrainHook = `            // 4. Residential Zone Roads & Curbs (Perumahan)`;
const tougeTerrainCode = `            // 4.5. Jalur Touge Gunung & Garasi Puncak (Touge Mountain Pass & Summit Garage)
            if (wx >= 725) {
                // Dataran Tinggi Garasi Puncak (Plateau di Y=82.0)
                if (wx >= 1180 && wx <= 1285 && wz >= 0 && wz <= 60) {
                    return { height: 82.0, bump: 0, isRail: false, isBridge: false };
                }

                if (typeof window.tougeSplineSamples !== 'undefined' && window.tougeSplineSamples.length > 0) {
                    let minTSq = 99999;
                    let closestTY = 0.28;
                    const samples = window.tougeSplineSamples;
                    for (let s = 0; s < samples.length; s++) {
                        const smp = samples[s];
                        const dx = wx - smp.x;
                        const dz = wz - smp.z;
                        const distSq = dx * dx + dz * dz;
                        if (distSq < minTSq) {
                            minTSq = distSq;
                            closestTY = smp.y;
                        }
                    }

                    // Lebar jalan 16m (halfW = 8.0m + 1.2m bahu = 9.2m -> distSq <= 85)
                    if (minTSq <= 85) {
                        return { height: closestTY, bump: 0, isRail: false, isBridge: false };
                    } else if (minTSq <= 180) {
                        const factor = (180 - minTSq) / (180 - 85);
                        return { height: closestTY * factor, bump: 0, isRail: false, isBridge: false };
                    }
                }
            }

            // 4. Residential Zone Roads & Curbs (Perumahan)`;

if (html.includes(terrainHook)) {
    html = html.replace(terrainHook, tougeTerrainCode);
    console.log('3. Terrain height physics updated for Touge elevation.');
}

// 4. Update Minimap in drawMinimap()
const minimapOldCoord = `const mapX = (wx) => ((wx + 480) / 1250) * W;
            const mapZ = (wz) => ((wz + 180) / 360) * H;`;
const minimapNewCoord = `const mapX = (wx) => ((wx + 480) / 1800) * W;
            const mapZ = (wz) => ((wz + 180) / 380) * H;`;

if (html.includes(minimapOldCoord)) {
    html = html.replace(minimapOldCoord, minimapNewCoord);
    console.log('4. Minimap coordinate scaling expanded for Touge mountain.');
}

// Insert Touge mountain drawing in Minimap right after residential drawing
const minimapResEnd = `            crossRoadZ.forEach(rz => {
                mCtx.beginPath();
                mCtx.moveTo(mapX(355), mapZ(rz));
                mCtx.lineTo(mapX(730), mapZ(rz));
                mCtx.stroke();
            });`;

const minimapTougeDraw = `            crossRoadZ.forEach(rz => {
                mCtx.beginPath();
                mCtx.moveTo(mapX(355), mapZ(rz));
                mCtx.lineTo(mapX(730), mapZ(rz));
                mCtx.stroke();
            });

            // 8. Draw Mount Touge Massif & Serpentine Drift Road on Minimap
            // Shaded Mountain Contour
            mCtx.fillStyle = '#1c2e1f';
            mCtx.beginPath();
            mCtx.moveTo(mapX(760), mapZ(180));
            mCtx.lineTo(mapX(850), mapZ(220));
            mCtx.lineTo(mapX(1100), mapZ(210));
            mCtx.lineTo(mapX(1320), mapZ(120));
            mCtx.lineTo(mapX(1320), mapZ(-70));
            mCtx.lineTo(mapX(1080), mapZ(-90));
            mCtx.lineTo(mapX(880), mapZ(-80));
            mCtx.lineTo(mapX(760), mapZ(-20));
            mCtx.closePath();
            mCtx.fill();
            mCtx.strokeStyle = '#2d5a34';
            mCtx.lineWidth = 1;
            mCtx.stroke();

            // Serpentine Touge Drift Road (Winding Hairpins)
            if (typeof tougePoints !== 'undefined') {
                mCtx.strokeStyle = '#94a3b8';
                mCtx.lineWidth = 2.8;
                mCtx.beginPath();
                tougePoints.forEach((pt, idx) => {
                    const px = mapX(pt[0]);
                    const pz = mapZ(pt[2]);
                    if (idx === 0) mCtx.moveTo(px, pz);
                    else mCtx.lineTo(px, pz);
                });
                mCtx.stroke();

                // Red/White Hairpin Accents on Minimap
                [6, 11, 16].forEach(hIdx => {
                    const hPt = tougePoints[hIdx];
                    mCtx.strokeStyle = '#dc2626';
                    mCtx.lineWidth = 4.2;
                    mCtx.beginPath();
                    mCtx.arc(mapX(hPt[0]), mapZ(hPt[2]), 3.2, 0, Math.PI * 2);
                    mCtx.stroke();
                });

                // Summit Garage (GARASI PUNCAK) Icon
                const gPt = tougePoints[tougePoints.length - 1];
                const gx = mapX(gPt[0] - 10);
                const gz = mapZ(gPt[2]);
                mCtx.fillStyle = '#dc2626';
                mCtx.fillRect(gx - 4, gz - 4, 8, 8);
                mCtx.strokeStyle = '#facc15';
                mCtx.lineWidth = 1.2;
                mCtx.strokeRect(gx - 4, gz - 4, 8, 8);

                mCtx.fillStyle = '#fef08a';
                mCtx.font = 'bold 6px Inter, sans-serif';
                mCtx.textAlign = 'center';
                mCtx.fillText('GARASI', gx, gz - 6);
            }`;

if (html.includes(minimapResEnd)) {
    html = html.replace(minimapResEnd, minimapTougeDraw);
    console.log('5. Minimap Touge drawing integrated.');
}

// 5. Summit Arrival Toast trigger in updateGame
const arrivalHook = `if (gameState.hasPackage && gameState.timeRemaining <= 0) {
                    triggerDeliveryTimeout();
                }`;

const arrivalWithTouge = `if (gameState.hasPackage && gameState.timeRemaining <= 0) {
                    triggerDeliveryTimeout();
                }

                // Cek jika pemain berhasil mencapai Garasi Puncak Touge di atas bukit!
                if (!gameState.tougeSummitReached && carPhysics.x >= 1195 && (carPhysics.currentY || 0) >= 78.0) {
                    gameState.tougeSummitReached = true;
                    showToast('🏔️ PUNCAK TOUGE TERCAPAI!', 'Selamat! Kamu berhasil menaklukkan jalur drift Touge sampai ke Garasi Puncak!', 'success');
                    sound.playGoalTrophy();
                }`;

if (html.includes(arrivalHook)) {
    html = html.replace(arrivalHook, arrivalWithTouge);
    console.log('6. Summit arrival toast trigger added.');
}

// Save modified html
fs.writeFileSync('index.html', html);
console.log('index.html updated successfully with Touge System!');
