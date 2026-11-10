const fs = require('fs');

let html = fs.readFileSync('c:/Projects/delivery-pizza/index.html', 'utf8');

// ============================================================================
// 1. ADD addSegmentCollider TO COLLIDER SYSTEM
// ============================================================================
const oldColliderFunc = `        function addBoxCollider(cx, cz, width, depth) {
            colliders.push({
                minX: cx - width / 2,
                maxX: cx + width / 2,
                minZ: cz - depth / 2,
                maxZ: cz + depth / 2
            });
        }`;

const newColliderFunc = `        function addBoxCollider(cx, cz, width, depth) {
            colliders.push({
                type: 'box',
                minX: cx - width / 2,
                maxX: cx + width / 2,
                minZ: cz - depth / 2,
                maxZ: cz + depth / 2
            });
        }

        function addSegmentCollider(x1, z1, x2, z2, thickness = 0.5) {
            colliders.push({
                type: 'segment',
                x1, z1, x2, z2,
                thickness
            });
        }`;

if (!html.includes(oldColliderFunc)) {
    console.error("oldColliderFunc not found!");
    process.exit(1);
}
html = html.replace(oldColliderFunc, newColliderFunc);

// ============================================================================
// 2. ADD resolveCircleSegmentCollision AND UPDATE COLLISION LOOP
// ============================================================================
const oldResolveFunc = `        function resolveCircleBoxCollision(pos, radius, box) {`;

const newResolveFunc = `        function resolveCircleSegmentCollision(pos, radius, seg) {
            const ax = seg.x1, az = seg.z1;
            const bx = seg.x2, bz = seg.z2;
            const dx = bx - ax, dz = bz - az;
            const lenSq = dx * dx + dz * dz;
            if (lenSq < 0.0001) return null;
            let t = ((pos.x - ax) * dx + (pos.z - az) * dz) / lenSq;
            t = Math.max(0, Math.min(1, t));
            const closestX = ax + t * dx;
            const closestZ = az + t * dz;
            const diffX = pos.x - closestX;
            const diffZ = pos.z - closestZ;
            const distSq = diffX * diffX + diffZ * diffZ;
            const effRadius = radius + (seg.thickness || 0.4);
            if (distSq >= effRadius * effRadius) return null;
            const dist = Math.sqrt(distSq);
            let nx = 0, nz = 0, overlap = 0;
            if (dist > 0.0001) {
                nx = diffX / dist;
                nz = diffZ / dist;
                overlap = effRadius - dist;
            } else {
                nx = -dz / Math.sqrt(lenSq);
                nz = dx / Math.sqrt(lenSq);
                overlap = effRadius;
            }
            pos.x += nx * overlap;
            pos.z += nz * overlap;
            return { nx, nz, overlap };
        }

        function resolveCircleBoxCollision(pos, radius, box) {`;

if (!html.includes(oldResolveFunc)) {
    console.error("oldResolveFunc not found!");
    process.exit(1);
}
html = html.replace(oldResolveFunc, newResolveFunc);

const oldCollisionLoop = `                // 2. Box Colliders (Houses, Factory Walls, Parked Cars, Trees)
                for (let i = 0; i < colliders.length; i++) {
                    const hit = resolveCircleBoxCollision(targetPos, carRadius, colliders[i]);
                    if (hit) {
                        hadCollision = true;
                        colNormalX += hit.nx;
                        colNormalZ += hit.nz;
                    }
                }`;

const newCollisionLoop = `                // 2. Colliders (Box & Oriented Segments for Bridge, Tunnel, Cliffs, Houses)
                for (let i = 0; i < colliders.length; i++) {
                    const col = colliders[i];
                    const hit = (col.type === 'segment' || col.x1 !== undefined)
                        ? resolveCircleSegmentCollision(targetPos, carRadius, col)
                        : resolveCircleBoxCollision(targetPos, carRadius, col);
                    if (hit) {
                        hadCollision = true;
                        colNormalX += hit.nx;
                        colNormalZ += hit.nz;
                    }
                }`;

if (!html.includes(oldCollisionLoop)) {
    console.error("oldCollisionLoop not found!");
    process.exit(1);
}
html = html.replace(oldCollisionLoop, newCollisionLoop);

// ============================================================================
// 3. UPDATE HIGHWAY SPLINE POINTS (STRAIGHT THROUGH TUNNEL & AROUND TEBING 2)
// ============================================================================
const oldHighwayPoints = `            [-205, 62],   // 5: Keluar dari jembatan kayu
            [-170, 48],   // 6: Melewati Tebing 1, belok tajam ke arah terowongan (timur laut)
            [-140, 20],   // 7: Menuju mulut terowongan
            [-120, -15],  // 8: Mulut Terowongan Barat Daya (Portal Masuk)
            [-100, -55],  // 9: Mulut Terowongan Timur Laut (Portal Keluar)
            [-75, -80],   // 10: Melingkari Tebing 2 ke arah timur
            [-30, -88],   // 11: Puncak kelokan atas
            [25, -68],    // 12: Menurun ke arah tenggara`;

const newHighwayPoints = `            [-205, 62],   // 5: Keluar dari jembatan kayu
            [-170, 48],   // 6: Melewati Tebing 1, mengarah ke terowongan
            [-135, 15],   // 7: Menuju mulut terowongan (vektor lurus sempurna ke portal)
            [-120, -15],  // 8: Mulut Terowongan Barat Daya (Portal Masuk)
            [-100, -55],  // 9: Mulut Terowongan Timur Laut (Portal Keluar)
            [-70, -82],   // 10: Melingkari Tebing 2 ke arah timur
            [-25, -88],   // 11: Puncak kelokan atas
            [25, -68],    // 12: Menurun ke arah tenggara`;

if (!html.includes(oldHighwayPoints)) {
    console.error("oldHighwayPoints not found!");
    process.exit(1);
}
html = html.replace(oldHighwayPoints, newHighwayPoints);

// ============================================================================
// 4. FIX ROAD DASHED CENTERLINE (CRISP RECTANGULAR STRIPS WITH 5M CLEAR GAPS)
// ============================================================================
// Find the road mesh building section
const oldRoadLoopStart = `            // Dashed center line
            const cWidth = 0.38;
            dashPositions.push(pt.x + nx * cWidth, pt.y + 0.04, pt.z + nz * cWidth);
            dashPositions.push(pt.x - nx * cWidth, pt.y + 0.04, pt.z - nz * cWidth);
            dashUvs.push(0, t * 100);
            dashUvs.push(1, t * 100);
            if (i < roadSubdivs) {
                const b = i * 2;
                dashIndices.push(b, b + 2, b + 1);
                dashIndices.push(b + 1, b + 2, b + 3);
            }`;

const newRoadLoopStart = `            // (Centerline generated procedurally below with authentic dashed gaps)`;

if (!html.includes(oldRoadLoopStart)) {
    console.error("oldRoadLoopStart not found!");
    process.exit(1);
}
html = html.replace(oldRoadLoopStart, newRoadLoopStart);

const oldDashMeshCreation = `        // Dashed Center Line
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
        scene.add(centerDashMesh);`;

const newDashMeshCreation = `        // ====================================================================
        // REALISTIC CRISP HIGHWAY DASHED CENTERLINE (Marka Jalan Berjeda Jelas)
        // Standar jalan raya: 4.0m garis putih tebal, 5.2m jeda aspal bersih!
        // ====================================================================
        const totalRoadLen = spline3D.getLength();
        const dashLen = 4.0;   // 4.0 meter marka putih
        const gapLen = 5.2;    // 5.2 meter jeda aspal kosong (sangat jelas jedanya!)
        const cycleLen = dashLen + gapLen; // 9.2m siklus
        const numDashCycles = Math.floor(totalRoadLen / cycleLen);

        const realDashPositions = [];
        const realDashIndices = [];
        const dashHalfWidth = 0.22; // Lebar total marka = 44 cm (standar presisi)

        for (let d = 0; d < numDashCycles; d++) {
            const startDist = d * cycleLen + 1.2;
            const endDist = startDist + dashLen;
            if (endDist > totalRoadLen) break;

            const subSegments = 3;
            const baseIndex = realDashPositions.length / 3;

            for (let s = 0; s <= subSegments; s++) {
                const curDist = startDist + (s / subSegments) * dashLen;
                const u = Math.min(1, Math.max(0, curDist / totalRoadLen));
                const pt = spline3D.getPointAt(u);
                const tan = spline3D.getTangentAt(u);

                const normX = -tan.z;
                const normZ = tan.x;
                const normLen = Math.hypot(normX, normZ) || 1;
                const nx = normX / normLen;
                const nz = normZ / normLen;

                realDashPositions.push(
                    pt.x + nx * dashHalfWidth, pt.y + 0.045, pt.z + nz * dashHalfWidth,
                    pt.x - nx * dashHalfWidth, pt.y + 0.045, pt.z - nz * dashHalfWidth
                );
            }

            for (let s = 0; s < subSegments; s++) {
                const b = baseIndex + s * 2;
                realDashIndices.push(b, b + 2, b + 1);
                realDashIndices.push(b + 1, b + 2, b + 3);
            }
        }

        const cleanDashGeo = new THREE.BufferGeometry();
        cleanDashGeo.setAttribute('position', new THREE.Float32BufferAttribute(realDashPositions, 3));
        cleanDashGeo.setIndex(realDashIndices);
        cleanDashGeo.computeVertexNormals();

        const cleanDashMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const centerDashMesh = new THREE.Mesh(cleanDashGeo, cleanDashMat);
        centerDashMesh.renderOrder = 2;
        scene.add(centerDashMesh);`;

if (!html.includes(oldDashMeshCreation)) {
    console.error("oldDashMeshCreation not found!");
    process.exit(1);
}
html = html.replace(oldDashMeshCreation, newDashMeshCreation);

// ============================================================================
// 5. ADD BRIDGE GUARDRAIL COLLIDERS (TIDAK AKAN TEMBUS JATUH KE SUNGAI)
// ============================================================================
const oldBridgeComment = `        // Bridge Guardrail Visuals (no axis-aligned box colliders to prevent clipping diagonal traffic)`;
const newBridgeColliders = `        // Bridge Guardrail Segment Colliders (Pagar jembatan solid anti-tembus)
        // Bridge centerline spans [-270, 36] to [-205, 62], half-width 7.0m
        addSegmentCollider(-272.6, 42.5, -207.6, 68.5, 0.6); // Pagar sisi Utara/Kiri
        addSegmentCollider(-267.4, 29.5, -202.4, 55.5, 0.6); // Pagar sisi Selatan/Kanan`;

if (!html.includes(oldBridgeComment)) {
    console.error("oldBridgeComment not found!");
    process.exit(1);
}
html = html.replace(oldBridgeComment, newBridgeColliders);

// ============================================================================
// 6. FIX MOUNTAIN TUNNEL & ADD SOLID TUNNEL/CLIFF COLLIDERS
// ============================================================================
const oldTunnelSection = `        // MOUNTAIN MASSIF & TUNNEL STRUCTURE (refrensi-denah.jpeg)
        // Tunnel extends from SW [-120, -15] to NE [-100, -55]
        const tunMidX = (-120 + -100) / 2; // -110
        const tunMidZ = (-15 + -55) / 2;   // -35
        const tunAngle = Math.atan2(-40, 20); // direction along road
        const tunLen = Math.hypot(20, -40);   // ~44.7m

        const tunnelGroup = new THREE.Group();
        tunnelGroup.position.set(tunMidX, 0, tunMidZ);
        // Align local Z with the road vector (dx=20, dz=-40)
        tunnelGroup.rotation.y = Math.atan2(20, -40);
        scene.add(tunnelGroup);

        // Mountain Ridge Massif OVER & BESIDE the tunnel (leaves vehicle corridor X in [-8, 8], Y < 12 completely open)
        // Left mountain flank (local X = -24)
        const mFlankL1 = new THREE.Mesh(new THREE.BoxGeometry(22, 28, tunLen + 20), rockCliffMat);
        mFlankL1.position.set(-20, 13, 0);
        tunnelGroup.add(mFlankL1);

        const mFlankL2 = new THREE.Mesh(new THREE.DodecahedronGeometry(18, 1), rockCliffMat);
        mFlankL2.position.set(-25, 20, 0);
        tunnelGroup.add(mFlankL2);

        // Right mountain flank (local X = +24)
        const mFlankR1 = new THREE.Mesh(new THREE.BoxGeometry(22, 28, tunLen + 20), rockCliffMat);
        mFlankR1.position.set(20, 13, 0);
        tunnelGroup.add(mFlankR1);

        const mFlankR2 = new THREE.Mesh(new THREE.DodecahedronGeometry(18, 1), rockCliffMat);
        mFlankR2.position.set(25, 20, 0);
        tunnelGroup.add(mFlankR2);

        // Mountain Peak Massif directly ABOVE tunnel ceiling (Y >= 14, clear of cars)
        const mPeak = new THREE.Mesh(new THREE.BoxGeometry(42, 16, tunLen + 10), rockCliffMat);
        mPeak.position.set(0, 21, 0);
        tunnelGroup.add(mPeak);

        const mPeakTop = new THREE.Mesh(new THREE.DodecahedronGeometry(14, 1), rockCliffMat);
        mPeakTop.position.set(0, 28, 0);
        tunnelGroup.add(mPeakTop);

        // Continuous Tunnel Side Retaining Walls (Along Length at X = +/- 8.5)
        const tunSideWallMat = new THREE.MeshStandardMaterial({ color: 0x4a433e, roughness: 0.92 });
        [-8.6, 8.6].forEach(wx => {
            const sideWall = new THREE.Mesh(new THREE.BoxGeometry(1.6, 11, tunLen + 8), tunSideWallMat);
            sideWall.position.set(wx, 5.5, 0);
            tunnelGroup.add(sideWall);
        });

        // Tunnel Ceiling Slab at Y = 11.2 (Clear height = 10.5m)
        const tunCeiling = new THREE.Mesh(
            new THREE.BoxGeometry(18.5, 2.0, tunLen + 8),
            new THREE.MeshStandardMaterial({ color: 0x38332e, roughness: 0.95 })
        );
        tunCeiling.position.set(0, 11.2, 0);
        tunnelGroup.add(tunCeiling);

        // Arched Stone Vault inner lining
        const vaultGeo = new THREE.CylinderGeometry(8.5, 8.5, tunLen + 6, 24, 1, true, 0, Math.PI);
        const vaultMat = new THREE.MeshStandardMaterial({ color: 0x423b36, roughness: 0.9, side: THREE.BackSide });
        const vaultMesh = new THREE.Mesh(vaultGeo, vaultMat);
        vaultMesh.position.set(0, 4.5, 0);
        vaultMesh.rotation.x = Math.PI / 2;
        vaultMesh.rotation.z = Math.PI / 2;
        tunnelGroup.add(vaultMesh);

        // Grand Brick & Stone Arch Portals at each end of the tunnel (Entry & Exit)
        const halfLen = tunLen / 2;
        [-halfLen, halfLen].forEach((pz, pIdx) => {
            const portalGroup = new THREE.Group();
            portalGroup.position.set(0, 0, pz);
            tunnelGroup.add(portalGroup);

            // Left Portal Pillar (X = -9.5)
            const pillarL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 12, 4.0), rockCliffMat);
            pillarL.position.set(-9.8, 6.0, 0);
            pillarL.castShadow = true;
            portalGroup.add(pillarL);

            // Right Portal Pillar (X = +9.5)
            const pillarR = new THREE.Mesh(new THREE.BoxGeometry(3.6, 12, 4.0), rockCliffMat);
            pillarR.position.set(9.8, 6.0, 0);
            pillarR.castShadow = true;
            portalGroup.add(pillarR);

            // Arch Lintel / Header across the top (Y = 12.5..15.5)
            const archHeader = new THREE.Mesh(new THREE.BoxGeometry(23.2, 3.6, 4.4), factoryBrickMat);
            archHeader.position.set(0, 13.0, 0);
            archHeader.castShadow = true;
            portalGroup.add(archHeader);

            // White/Cream Keystone
            const keystone = new THREE.Mesh(
                new THREE.BoxGeometry(3.0, 3.2, 4.8),
                new THREE.MeshLambertMaterial({ color: 0xdfd3c3 })
            );
            keystone.position.set(0, 12.8, 0);
            portalGroup.add(keystone);

            // Green Mossy/Vegetation Crest on Portal Crown (Matches refrensi-denah.jpeg!)
            const mossCrown = new THREE.Mesh(
                new THREE.BoxGeometry(24, 1.4, 5.0),
                new THREE.MeshLambertMaterial({ color: 0x3d6e35 })
            );
            mossCrown.position.set(0, 15.2, 0);
            portalGroup.add(mossCrown);

            // Flared Stone Wing Walls
            const wingWallL = new THREE.Mesh(new THREE.BoxGeometry(7, 13, 3.2), rockCliffMat);
            wingWallL.position.set(-14.8, 6.5, 0);
            wingWallL.rotation.y = pIdx === 0 ? 0.4 : -0.4;
            portalGroup.add(wingWallL);

            const wingWallR = new THREE.Mesh(new THREE.BoxGeometry(7, 13, 3.2), rockCliffMat);
            wingWallR.position.set(14.8, 6.5, 0);
            wingWallR.rotation.y = pIdx === 0 ? -0.4 : 0.4;
            portalGroup.add(wingWallR);
        });

        // Warm Sodium Tunnel Lamps (Down-facing lighting for atmospheric drive)
        [-16, -8, 0, 8, 16].forEach(lz => {
            const fixture = new THREE.Mesh(
                new THREE.BoxGeometry(0.9, 0.4, 1.2),
                new THREE.MeshBasicMaterial({ color: 0xffaa22 })
            );
            fixture.position.set(0, 10.2, lz);
            tunnelGroup.add(fixture);

            const tLight = new THREE.PointLight(0xff9911, 2.2, 24);
            tLight.position.set(0, 9.6, lz);
            tunnelGroup.add(tLight);
        });`;

const newTunnelSection = `        // MOUNTAIN MASSIF & TUNNEL STRUCTURE (refrensi-denah.jpeg)
        // Tunnel extends from SW [-120, -15] to NE [-100, -55]
        // Road is 100% straight through tunnel along vector (dx=20, dz=-40), len=44.72m
        const tunMidX = (-120 + -100) / 2; // -110
        const tunMidZ = (-15 + -55) / 2;   // -35
        const tunLen = Math.hypot(20, -40);   // ~44.72m
        const halfLen = tunLen / 2;           // ~22.36m

        const tunnelGroup = new THREE.Group();
        tunnelGroup.position.set(tunMidX, 0, tunMidZ);
        // Align local Z with the road vector (dx=20, dz=-40)
        tunnelGroup.rotation.y = Math.atan2(20, -40);
        scene.add(tunnelGroup);

        // Mountain Ridge Massif OVER & BESIDE the tunnel (leaves 21m wide corridor completely open!)
        // Left mountain flank (local X <= -11.5)
        const mFlankL1 = new THREE.Mesh(new THREE.BoxGeometry(24, 28, tunLen + 16), rockCliffMat);
        mFlankL1.position.set(-23.5, 13, 0);
        tunnelGroup.add(mFlankL1);

        const mFlankL2 = new THREE.Mesh(new THREE.DodecahedronGeometry(18, 1), rockCliffMat);
        mFlankL2.position.set(-27, 20, 0);
        tunnelGroup.add(mFlankL2);

        // Right mountain flank (local X >= +11.5)
        const mFlankR1 = new THREE.Mesh(new THREE.BoxGeometry(24, 28, tunLen + 16), rockCliffMat);
        mFlankR1.position.set(23.5, 13, 0);
        tunnelGroup.add(mFlankR1);

        const mFlankR2 = new THREE.Mesh(new THREE.DodecahedronGeometry(18, 1), rockCliffMat);
        mFlankR2.position.set(27, 20, 0);
        tunnelGroup.add(mFlankR2);

        // Mountain Peak Massif directly ABOVE tunnel ceiling (Y >= 14, high above all vehicles)
        const mPeak = new THREE.Mesh(new THREE.BoxGeometry(46, 16, tunLen + 12), rockCliffMat);
        mPeak.position.set(0, 21, 0);
        tunnelGroup.add(mPeak);

        const mPeakTop = new THREE.Mesh(new THREE.DodecahedronGeometry(15, 1), rockCliffMat);
        mPeakTop.position.set(0, 29, 0);
        tunnelGroup.add(mPeakTop);

        // Continuous Tunnel Side Retaining Walls (Along Length at X = +/- 10.5, clear corridor width = 20m)
        const tunSideWallMat = new THREE.MeshStandardMaterial({ color: 0x4a433e, roughness: 0.92 });
        [-10.5, 10.5].forEach(wx => {
            const sideWall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 12, tunLen + 1.0), tunSideWallMat);
            sideWall.position.set(wx, 5.8, 0);
            tunnelGroup.add(sideWall);
        });

        // Tunnel Ceiling Slab at Y = 11.5 (Clear height = 11.0m, zero obstructions!)
        const tunCeiling = new THREE.Mesh(
            new THREE.BoxGeometry(23.0, 2.0, tunLen + 1.0),
            new THREE.MeshStandardMaterial({ color: 0x38332e, roughness: 0.95 })
        );
        tunCeiling.position.set(0, 11.8, 0);
        tunnelGroup.add(tunCeiling);

        // Grand Brick & Stone Arch Portals at each end of the tunnel (Entry & Exit)
        [-halfLen, halfLen].forEach((pz, pIdx) => {
            const portalGroup = new THREE.Group();
            portalGroup.position.set(0, 0, pz);
            tunnelGroup.add(portalGroup);

            // Left Portal Pillar (X = -11.5, leaves full 20m central opening)
            const pillarL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 12, 3.6), rockCliffMat);
            pillarL.position.set(-11.8, 6.0, 0);
            pillarL.castShadow = true;
            portalGroup.add(pillarL);

            // Right Portal Pillar (X = +11.5)
            const pillarR = new THREE.Mesh(new THREE.BoxGeometry(3.6, 12, 3.6), rockCliffMat);
            pillarR.position.set(11.8, 6.0, 0);
            pillarR.castShadow = true;
            portalGroup.add(pillarR);

            // Arch Lintel / Header across the top (Y = 12.2..15.4, spans clear of vehicle path)
            const archHeader = new THREE.Mesh(new THREE.BoxGeometry(27.2, 3.2, 4.0), factoryBrickMat);
            archHeader.position.set(0, 13.0, 0);
            archHeader.castShadow = true;
            portalGroup.add(archHeader);

            // White/Cream Keystone
            const keystone = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 3.2, 4.4),
                new THREE.MeshLambertMaterial({ color: 0xdfd3c3 })
            );
            keystone.position.set(0, 12.8, 0);
            portalGroup.add(keystone);

            // Green Mossy/Vegetation Crest on Portal Crown (Matches refrensi-denah.jpeg!)
            const mossCrown = new THREE.Mesh(
                new THREE.BoxGeometry(28, 1.4, 4.6),
                new THREE.MeshLambertMaterial({ color: 0x3d6e35 })
            );
            mossCrown.position.set(0, 15.0, 0);
            portalGroup.add(mossCrown);

            // Flared Stone Wing Walls
            const wingWallL = new THREE.Mesh(new THREE.BoxGeometry(8, 13, 3.0), rockCliffMat);
            wingWallL.position.set(-17.2, 6.5, 0);
            wingWallL.rotation.y = pIdx === 0 ? 0.45 : -0.45;
            portalGroup.add(wingWallL);

            const wingWallR = new THREE.Mesh(new THREE.BoxGeometry(8, 13, 3.0), rockCliffMat);
            wingWallR.position.set(17.2, 6.5, 0);
            wingWallR.rotation.y = pIdx === 0 ? -0.45 : 0.45;
            portalGroup.add(wingWallR);
        });

        // Warm Sodium Tunnel Lamps (Down-facing lighting for atmospheric drive)
        [-15, -7.5, 0, 7.5, 15].forEach(lz => {
            const fixture = new THREE.Mesh(
                new THREE.BoxGeometry(0.9, 0.4, 1.2),
                new THREE.MeshBasicMaterial({ color: 0xffaa22 })
            );
            fixture.position.set(0, 10.8, lz);
            tunnelGroup.add(fixture);

            const tLight = new THREE.PointLight(0xff9911, 2.2, 24);
            tLight.position.set(0, 10.2, lz);
            tunnelGroup.add(tLight);
        });

        // ====================================================================
        // SOLID ANTI-TEMBUS COLLIDERS (TEROWONGAN & TEBING 1 & TEBING 2)
        // ====================================================================
        // 1. Dinding Sisi Terowongan (Mobil tidak bisa menembus dinding batu terowongan)
        // Tangent unit: (0.4472, -0.8944), Normal unit: (0.8944, 0.4472)
        // Dinding Kiri (X_normal = +9.8m)
        addSegmentCollider(-120 + 0.8944 * 9.8, -15 + 0.4472 * 9.8, -100 + 0.8944 * 9.8, -55 + 0.4472 * 9.8, 0.8);
        // Dinding Kanan (X_normal = -9.8m)
        addSegmentCollider(-120 - 0.8944 * 9.8, -15 - 0.4472 * 9.8, -100 - 0.8944 * 9.8, -55 - 0.4472 * 9.8, 0.8);

        // 2. Barikade Tebing 1 (Tebing batu karang selatan setelah jembatan, anti-tembus)
        addSegmentCollider(-195, 78, -165, 64, 2.0);
        addSegmentCollider(-165, 64, -135, 52, 2.0);
        addSegmentCollider(-135, 52, -125, 40, 2.0);

        // 3. Barikade Tebing 2 (Tebing batu karang timur di dalam kelokan S, anti-tembus)
        addSegmentCollider(-80, -66, -55, -38, 2.0);
        addSegmentCollider(-55, -38, -25, -24, 2.0);`;

if (!html.includes(oldTunnelSection)) {
    console.error("oldTunnelSection not found!");
    process.exit(1);
}
html = html.replace(oldTunnelSection, newTunnelSection);

fs.writeFileSync('c:/Projects/delivery-pizza/index.html', html, 'utf8');
console.log("Successfully applied all fixes for tunnel obstruction, solid colliders, and crisp dashed road markings!");
