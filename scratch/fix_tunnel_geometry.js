const fs = require('fs');

let html = fs.readFileSync('c:/Projects/delivery-pizza/index.html', 'utf8');

// 1. Remove bridge axis-aligned colliders that clip the diagonal bridge road
html = html.replace(
`        // Bridge Guardrail Colliders
        addBoxCollider(-238, 52 - 8.2, 68, 2.0);
        addBoxCollider(-238, 52 + 8.2, 68, 2.0);`,
`        // Bridge Guardrail Visuals (no axis-aligned box colliders to prevent clipping diagonal traffic)`
);

// 2. Replace Tunnel & Mountain Massif geometry with open arch portals and spacious corridor
const oldTunnelPattern = `        // MOUNTAIN MASSIF & TUNNEL STRUCTURE
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
        addBoxCollider(tunMidX + 7.5, tunMidZ, 4, tunLen);`;

const newTunnelCode = `        // MOUNTAIN MASSIF & TUNNEL STRUCTURE (refrensi-denah.jpeg)
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

if (!html.includes(oldTunnelPattern)) {
    console.error("Old tunnel pattern not found!");
    process.exit(1);
}

html = html.replace(oldTunnelPattern, newTunnelCode);
fs.writeFileSync('c:/Projects/delivery-pizza/index.html', html, 'utf8');
console.log("Successfully updated tunnel geometry and removed bridge clipping colliders!");
