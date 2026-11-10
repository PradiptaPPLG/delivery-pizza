// scratch/build_world_content.js
// Prepares and integrates the complete world geometry, landmarks, minimap, and GPS updates.
const fs = require('fs');

const code = `
        /********************************************************************
         * 4. PROCEDURAL TEXTURES FOR EXTENDED WORLD
         ********************************************************************/
        function createWoodPlankTexture(repeatX = 1, repeatY = 1) {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#5c3a21'; ctx.fillRect(0, 0, 256, 256);
            const planks = 8; const h = 256 / planks;
            for (let i = 0; i < planks; i++) {
                const y = i * h;
                ctx.fillStyle = i % 2 === 0 ? '#6a4326' : '#52321a';
                ctx.fillRect(0, y, 256, h - 2);
                ctx.fillStyle = 'rgba(35, 18, 8, 0.35)';
                for (let j = 0; j < 14; j++) {
                    ctx.fillRect(Math.random() * 256, y + Math.random() * (h - 4), 25 + Math.random() * 75, 1.5);
                }
                ctx.fillStyle = '#1e1107';
                ctx.beginPath(); ctx.arc(14, y + h / 2, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(242, y + h / 2, 2.5, 0, Math.PI * 2); ctx.fill();
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(repeatX, repeatY);
            return tex;
        }

        function createRockCliffTexture(repeatX = 4, repeatY = 4) {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#5a524a'; ctx.fillRect(0, 0, 256, 256);
            const strata = ['#4c453e', '#665d54', '#3d3731', '#73695f', '#443e37', '#584f45'];
            for (let y = 0; y < 256; y += 4) {
                ctx.fillStyle = strata[Math.floor(Math.random() * strata.length)];
                ctx.fillRect(0, y, 256, 4);
            }
            for (let i = 0; i < 700; i++) {
                ctx.fillStyle = strata[i % strata.length];
                ctx.fillRect(Math.random() * 256, Math.random() * 256, 3 + Math.random() * 8, 2 + Math.random() * 3);
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(repeatX, repeatY);
            return tex;
        }

        function createWaterTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 256, 256);
            grad.addColorStop(0, '#1c5a7d');
            grad.addColorStop(0.5, '#28749e');
            grad.addColorStop(1.0, '#164866');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 256, 256);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 45; i++) {
                ctx.beginPath();
                const x = Math.random() * 256; const y = Math.random() * 256;
                ctx.arc(x, y, 8 + Math.random() * 28, 0, Math.PI * 0.85);
                ctx.stroke();
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(4, 36);
            return tex;
        }

        function createCornTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#497c27'; ctx.fillRect(0, 0, 128, 256);
            ctx.fillStyle = '#eab308'; ctx.fillRect(36, 60, 56, 120);
            ctx.fillStyle = '#ca8a04';
            for (let y = 64; y < 176; y += 8) ctx.fillRect(36, y, 56, 2);
            for (let x = 40; x < 90; x += 8) ctx.fillRect(x, 60, 2, 120);
            ctx.fillStyle = '#3f6212';
            ctx.beginPath(); ctx.moveTo(36, 180); ctx.lineTo(22, 95); ctx.lineTo(36, 115); ctx.fill();
            ctx.beginPath(); ctx.moveTo(92, 180); ctx.lineTo(106, 95); ctx.lineTo(92, 115); ctx.fill();
            const tex = new THREE.CanvasTexture(canvas);
            return tex;
        }

        /********************************************************************
         * 5. WORLD GEOMETRY & EXPANSIVE LANDMARKS (refrensi-denah.jpeg)
         ********************************************************************/
        const colliders = [];

        function addBoxCollider(cx, cz, width, depth) {
            colliders.push({
                minX: cx - width / 2,
                maxX: cx + width / 2,
                minZ: cz - depth / 2,
                maxZ: cz + depth / 2
            });
        }

        // 1. BOUNDARY PERIMETER COLLIDERS (Guarantees zero void fall!)
        addBoxCollider(0, -310, 1400, 30);
        addBoxCollider(0, 310, 1400, 30);
        addBoxCollider(-620, 0, 30, 700);
        addBoxCollider(620, 0, 30, 700);

        // Huge Solid Autumn Ground Plane
        const groundTex = createAutumnGroundTexture(96, 48);
        const groundGeo = new THREE.PlaneGeometry(1300, 680);
        const groundMat = new THREE.MeshStandardMaterial({
            map: groundTex,
            roughness: 0.88,
            metalness: 0.05
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Materials for World
        const factoryBrickMat = new THREE.MeshStandardMaterial({
            map: createBrickTexture('#8b4730', ['#9e4f36', '#863f28', '#ad5d42', '#753622'], '#bba693', 6, 3),
            roughness: 0.78,
            metalness: 0.05
        });
        const darkRoofBrickMat = new THREE.MeshStandardMaterial({
            map: createBrickTexture('#2b2d2f', ['#282a2c', '#343739', '#1f2122'], '#595959', 8, 2),
            roughness: 0.65,
            metalness: 0.15
        });
        const houseCreamBrickMat = new THREE.MeshStandardMaterial({
            map: createBrickTexture('#dfd3c3', ['#e5dacb', '#d8cbb8', '#eee4d7', '#cfbda8'], '#b5a899', 5, 3),
            roughness: 0.75,
            metalness: 0.05
        });
        const garageDoorMat = new THREE.MeshStandardMaterial({
            map: createGarageDoorTexture(),
            roughness: 0.4,
            metalness: 0.25
        });
        const woodBridgeMat = new THREE.MeshStandardMaterial({
            map: createWoodPlankTexture(3, 1),
            roughness: 0.72,
            metalness: 0.08
        });
        const rockCliffMat = new THREE.MeshStandardMaterial({
            map: createRockCliffTexture(4, 4),
            roughness: 0.92,
            metalness: 0.04,
            flatShading: true
        });
        const asphaltMat = new THREE.MeshStandardMaterial({
            map: createAsphaltTexture(8, 8),
            roughness: 0.52,
            metalness: 0.14
        });
        const waterTex = createWaterTexture();
        const waterMat = new THREE.MeshStandardMaterial({
            map: waterTex,
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.82,
            roughness: 0.12,
            metalness: 0.45
        });
        const dashGeo = new THREE.BoxGeometry(0.35, 0.16, 2.8);
        const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });

        // Helper to construct seamless highway segments connecting waypoints
        function createHighwaySegment(x1, z1, x2, z2, width = 15.0) {
            const dx = x2 - x1;
            const dz = z2 - z1;
            const len = Math.hypot(dx, dz);
            const angle = Math.atan2(dx, dz);
            const cx = (x1 + x2) / 2;
            const cz = (z1 + z2) / 2;

            const roadMesh = new THREE.Mesh(
                new THREE.BoxGeometry(width, 0.14, len + 0.9),
                asphaltMat
            );
            roadMesh.position.set(cx, 0.07, cz);
            roadMesh.rotation.y = angle;
            roadMesh.receiveShadow = true;
            scene.add(roadMesh);

            const dashCount = Math.max(1, Math.floor(len / 6.2));
            for (let i = 0; i < dashCount; i++) {
                const t = (i + 0.5) / dashCount;
                const px = x1 + dx * t;
                const pz = z1 + dz * t;
                const dash = new THREE.Mesh(dashGeo, dashMat);
                dash.position.set(px, 0.15, pz);
                dash.rotation.y = angle;
                scene.add(dash);
            }

            const edgeOffset = width / 2 - 0.45;
            [-edgeOffset, edgeOffset].forEach(side => {
                const edge = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.15, len + 0.9),
                    edgeMat
                );
                edge.position.set(cx + Math.cos(angle) * side, 0.15, cz - Math.sin(angle) * side);
                edge.rotation.y = angle;
                scene.add(edge);
            });

            return roadMesh;
        }

        function createRoadBox(x, z, w, d) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), asphaltMat);
            mesh.position.set(x, 0.07, z);
            mesh.receiveShadow = true;
            scene.add(mesh);
            return mesh;
        }

        // ====================================================================
        // A) PABRIK (PIZZA FACTORY DEPOT) - FAR WEST (X ~ -430, Z ~ 0)
        // ====================================================================
        const factoryGroup = new THREE.Group();
        factoryGroup.position.set(-470, 0, 0);
        factoryGroup.rotation.y = Math.PI / 2; // Facing East (+X towards highway!)
        scene.add(factoryGroup);

        // Factory Courtyard & Front Parking Lot
        createRoadBox(-410, 0, 78, 50);

        // White parking stripes
        for (let i = -2; i <= 2; i++) {
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 0.16, 0.25),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            stripe.position.set(-426, 0.09, i * 4.4);
            scene.add(stripe);
        }

        // Warehouse Building Body
        const mainDepot = new THREE.Mesh(new THREE.BoxGeometry(34, 16, 24), factoryBrickMat);
        mainDepot.position.set(0, 8, -6);
        mainDepot.castShadow = true;
        factoryGroup.add(mainDepot);
        addBoxCollider(-476, 0, 26, 36);

        // Raised Corrugated Garage Bay
        const bayHeader = new THREE.Mesh(new THREE.BoxGeometry(24, 3.2, 1.5), factoryBrickMat);
        bayHeader.position.set(0, 14.4, 6);
        factoryGroup.add(bayHeader);

        const bayRollDoor = new THREE.Mesh(new THREE.BoxGeometry(24, 3.6, 0.8), garageDoorMat);
        bayRollDoor.position.set(0, 11.2, 6.2);
        factoryGroup.add(bayRollDoor);

        // Interior Loading Bay Floor
        const bayFloor = new THREE.Mesh(
            new THREE.BoxGeometry(28, 0.2, 20),
            new THREE.MeshLambertMaterial({ color: 0xc86432 })
        );
        bayFloor.position.set(0, 0.12, -2);
        factoryGroup.add(bayFloor);

        // Roof Trim & Twin Industrial Smokestacks
        const factoryRoof = new THREE.Mesh(new THREE.BoxGeometry(35.5, 2.2, 25.5), darkRoofBrickMat);
        factoryRoof.position.set(0, 17, -6);
        factoryGroup.add(factoryRoof);

        [-6, 6].forEach(sx => {
            const chimney = new THREE.Mesh(
                new THREE.CylinderGeometry(1.9, 2.4, 18, 12),
                new THREE.MeshLambertMaterial({ color: 0x6e5544 })
            );
            chimney.position.set(sx, 24, -10);
            factoryGroup.add(chimney);
        });

        // Warm Interior Depot Bay Light
        const bayPointLight = new THREE.PointLight(0xff9d47, 1.8, 45);
        bayPointLight.position.set(0, 11, 0);
        factoryGroup.add(bayPointLight);

        // Factory Depot Banner Plaque
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512; signCanvas.height = 128;
        const sctx = signCanvas.getContext('2d');
        sctx.fillStyle = '#b91c1c'; sctx.fillRect(0, 0, 512, 128);
        sctx.strokeStyle = '#facc15'; sctx.lineWidth = 8; sctx.strokeRect(4, 4, 504, 120);
        sctx.fillStyle = '#ffffff'; sctx.font = 'bold 36px Fredoka, sans-serif';
        sctx.textAlign = 'center'; sctx.fillText('🏭 PABRIK PIZZA DEPOT', 256, 55);
        sctx.fillStyle = '#fde047'; sctx.font = 'bold 22px Inter, sans-serif';
        sctx.fillText('PUSAT DISTRIBUSI & PICKUP', 256, 95);
        const depotSignMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) });
        const depotSign = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 0.4), depotSignMat);
        depotSign.position.set(0, 17.5, 6.4);
        factoryGroup.add(depotSign);

        // Factory Pickup Pad (Player reverses into this pad to load pizza!)
        const pickupZonePos = new THREE.Vector3(-448, 0.2, 0);
        const pickupPadGroup = new THREE.Group();
        pickupPadGroup.position.copy(pickupZonePos);
        scene.add(pickupPadGroup);

        const padBorder = new THREE.Mesh(
            new THREE.RingGeometry(3.8, 4.5, 32),
            new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
        );
        padBorder.rotation.x = -Math.PI / 2;
        pickupPadGroup.add(padBorder);

        const padInner = new THREE.Mesh(
            new THREE.CircleGeometry(3.8, 32),
            new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.32, side: THREE.DoubleSide })
        );
        padInner.rotation.x = -Math.PI / 2;
        pickupPadGroup.add(padInner);

        // ====================================================================
        // B) HIGHWAY NETWORK (Connecting Factory -> Bridge -> Tunnel -> Rel -> Cornfield -> Houses)
        // ====================================================================
        const highwayPoints = [
            [-410, 0],   // Factory parking
            [-350, 0],   // Factory straight
            [-295, 15],  // Approach curve
            [-255, 35],  // West bridge start
            [-205, 35],  // East bridge end (Wooden Bridge)
            [-165, 25],  // Post-bridge bend
            [-125, 0],   // Pre-tunnel bend
            [-95, -20],  // West Tunnel portal
            [-35, -20],  // East Tunnel portal (Tunnel)
            [-5, -15],   // Post-tunnel exit
            [30, 5],     // S-curve around Tebing 2
            [75, 25],    // Straightening towards railway
            [110, 25],   // Railroad Crossing
            [160, 25],   // Along Cornfield South edge
            [230, 20],   // Along Cornfield South edge
            [295, 10],   // Approaching residential district
            [345, 10]    // Connecting to Residential Avenue 1
        ];

        for (let i = 0; i < highwayPoints.length - 1; i++) {
            // Bridge segment is wooden (handled separately below), all others are asphalt highway
            if (i === 3) continue;
            createHighwaySegment(
                highwayPoints[i][0], highwayPoints[i][1],
                highwayPoints[i+1][0], highwayPoints[i+1][1],
                15.0
            );
        }

        // ====================================================================
        // C) SUNGAI (RIVER) & JEMBATAN KAYU (WOODEN BRIDGE)
        // ====================================================================
        // River Trench (X = -230, North to South from Z = -280 to +280)
        const riverBedMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(36, 560),
            new THREE.MeshStandardMaterial({ color: 0x1f2d33, roughness: 0.9 })
        );
        riverBedMesh.position.set(-230, -0.65, 0);
        riverBedMesh.rotation.x = -Math.PI / 2;
        scene.add(riverBedMesh);

        // River Water Mesh
        const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 560), waterMat);
        waterMesh.position.set(-230, -0.32, 0);
        waterMesh.rotation.x = -Math.PI / 2;
        scene.add(waterMesh);

        // Wooden Bridge Structure (X from -255 to -205 at Z = 35)
        const bridgeGroup = new THREE.Group();
        bridgeGroup.position.set(-230, 0, 35);
        scene.add(bridgeGroup);

        // Heavy Timber Plank Bridge Deck (50m length x 16m width)
        const bridgeDeck = new THREE.Mesh(
            new THREE.BoxGeometry(50, 0.45, 16),
            woodBridgeMat
        );
        bridgeDeck.position.set(0, 0.22, 0);
        bridgeDeck.receiveShadow = true;
        bridgeGroup.add(bridgeDeck);

        // Bridge Wooden Side Guardrails (Posts + Beams)
        [-7.5, 7.5].forEach(sideZ => {
            // Horizontal Top Rail Beam
            const railBeam = new THREE.Mesh(
                new THREE.BoxGeometry(50, 0.35, 0.45),
                woodBridgeMat
            );
            railBeam.position.set(0, 1.8, sideZ);
            railBeam.castShadow = true;
            bridgeGroup.add(railBeam);

            // Mid Rail Beam
            const midRail = new THREE.Mesh(
                new THREE.BoxGeometry(50, 0.25, 0.35),
                woodBridgeMat
            );
            midRail.position.set(0, 1.0, sideZ);
            bridgeGroup.add(midRail);

            // Vertical Posts every 4 meters
            for (let px = -24; px <= 24; px += 4.8) {
                const post = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 2.0, 0.5),
                    woodBridgeMat
                );
                post.position.set(px, 1.0, sideZ);
                post.castShadow = true;
                bridgeGroup.add(post);
            }
        });

        // Bridge Guardrail Colliders (Keeps car safely on bridge deck!)
        addBoxCollider(-230, 35 - 7.6, 52, 1.6);
        addBoxCollider(-230, 35 + 7.6, 52, 1.6);

        // Heavy Log Support Trestles underneath in water
        [-14, 0, 14].forEach(tx => {
            for (let tz = -5; tz <= 5; tz += 5) {
                const log = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.7, 0.9, 12, 8),
                    woodBridgeMat
                );
                log.position.set(tx, -4.5, tz);
                bridgeGroup.add(log);
            }
        });

        // 4 Warm Glowing Lanterns on Bridge Entry Posts
        [[-24, -7.5], [-24, 7.5], [24, -7.5], [24, 7.5]].forEach(([lx, lz]) => {
            const lantern = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 1.0, 0.7),
                new THREE.MeshBasicMaterial({ color: 0xffd580 })
            );
            lantern.position.set(lx, 2.4, lz);
            bridgeGroup.add(lantern);

            const pLight = new THREE.PointLight(0xffaa44, 1.2, 18);
            pLight.position.set(lx, 2.6, lz);
            bridgeGroup.add(pLight);
        });

        // ====================================================================
        // D) TEBING 1, MOUNTAIN RIDGE & TEROWONGAN (MOUNTAIN TUNNEL)
        // ====================================================================
        // Mountain Ridge Geometry (Over the tunnel from X = -115 to -20, Z = -80 to 25)
        const mountainGroup = new THREE.Group();
        scene.add(mountainGroup);

        const rockMat = rockCliffMat;
        const mountainGeo = new THREE.DodecahedronGeometry(22, 1);

        // Scattered rocky crag boulders forming the mountain ridge
        const rockPeaks = [
            [-100, 16, -55, 1.3], [-70, 22, -60, 1.6], [-40, 18, -55, 1.4],
            [-95, 18, 5, 1.2], [-65, 24, 10, 1.5], [-35, 18, 5, 1.2],
            [-65, 26, -20, 1.7], // Central peak directly over tunnel
            [-110, 12, -20, 1.2], [-25, 14, -20, 1.1]
        ];

        rockPeaks.forEach(([rx, ry, rz, scale]) => {
            const mMesh = new THREE.Mesh(mountainGeo, rockMat);
            mMesh.position.set(rx, ry, rz);
            mMesh.scale.set(scale * 1.3, scale, scale * 1.2);
            mMesh.rotation.set(Math.random(), Math.random(), Math.random());
            mMesh.castShadow = true;
            mMesh.receiveShadow = true;
            mountainGroup.add(mMesh);
        });

        // Tunnel Bore Structure (Length = 60m from X = -95 to X = -35 at Z = -20)
        const tunnelGroup = new THREE.Group();
        tunnelGroup.position.set(-65, 0, -20);
        scene.add(tunnelGroup);

        // Tunnel Arched Stone Ceiling Vault
        const tunnelCeil = new THREE.Mesh(
            new THREE.CylinderGeometry(8.5, 8.5, 60, 24, 1, true, 0, Math.PI),
            rockCliffMat
        );
        tunnelCeil.rotation.z = Math.PI / 2;
        tunnelCeil.position.set(0, 4.2, 0);
        tunnelGroup.add(tunnelCeil);

        // Entrance Portals (West Portal at X = -95, East Portal at X = -35)
        [-30, 30].forEach(px => {
            const portalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.5, 12, 22),
                rockCliffMat
            );
            portalFrame.position.set(px, 6.0, 0);
            portalFrame.castShadow = true;
            tunnelGroup.add(portalFrame);

            // Decorative Arch Keystone Header
            const archTop = new THREE.Mesh(
                new THREE.BoxGeometry(4.0, 3.2, 16),
                factoryBrickMat
            );
            archTop.position.set(px, 11.2, 0);
            tunnelGroup.add(archTop);
        });

        // Tunnel Interior Amber Sodium Lights
        [-20, -7, 7, 20].forEach(lx => {
            const lampMesh = new THREE.Mesh(
                new THREE.BoxGeometry(1.2, 0.4, 0.8),
                new THREE.MeshBasicMaterial({ color: 0xffaa22 })
            );
            lampMesh.position.set(lx, 7.8, 0);
            tunnelGroup.add(lampMesh);

            const tLight = new THREE.PointLight(0xff9911, 2.2, 24);
            tLight.position.set(lx, 7.2, 0);
            tunnelGroup.add(tLight);
        });

        // Tunnel Wall Colliders (Guarantees car stays safely inside the tunnel road!)
        addBoxCollider(-65, -20 - 8.2, 64, 2.0);
        addBoxCollider(-65, -20 + 8.2, 64, 2.0);

        // TEBING 2: Massive Post-Tunnel Rocky Bluff (Forces road into S-curve)
        const tebing2Mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(14, 1), rockCliffMat);
        tebing2Mesh.position.set(10, 8.5, 12);
        tebing2Mesh.scale.set(1.4, 1.1, 1.3);
        tebing2Mesh.castShadow = true;
        scene.add(tebing2Mesh);
        addBoxCollider(10, 12, 26, 22);

        // Red/White Chevron Curve Signs (>>>) around Tebing 2
        for (let i = 0; i < 4; i++) {
            const signGroup = new THREE.Group();
            signGroup.position.set(-8 + i * 11, 0, -1 + i * 6);
            signGroup.rotation.y = -Math.PI / 4;
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
        // E) REL KERETA API (RAILROAD TRACKS LEVEL CROSSING)
        // ====================================================================
        // Track running North-South at X = 110 (Z from -280 to +280)
        const railGroup = new THREE.Group();
        railGroup.position.set(110, 0, 0);
        scene.add(railGroup);

        // Ballast Gravel Track Bed
        const ballastMesh = new THREE.Mesh(
            new THREE.BoxGeometry(5.2, 0.18, 560),
            new THREE.MeshStandardMaterial({ color: 0x3e3832, roughness: 0.95 })
        );
        ballastMesh.position.set(0, 0.08, 0);
        ballastMesh.receiveShadow = true;
        railGroup.add(ballastMesh);

        // Wooden Crossties (Sleepers every 1.8m)
        const tieGeo = new THREE.BoxGeometry(4.4, 0.22, 0.55);
        for (let rz = -270; rz <= 270; rz += 2.0) {
            // Leave road crossing clear for flush boards
            if (rz > 16 && rz < 34) continue;
            const tie = new THREE.Mesh(tieGeo, woodBridgeMat);
            tie.position.set(0, 0.14, rz);
            railGroup.add(tie);
        }

        // Twin Continuous Steel Rails (Silver Metallic)
        const railMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.88,
            roughness: 0.22
        });
        [-1.35, 1.35].forEach(rx => {
            const steelRail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 560), railMat);
            steelRail.position.set(rx, 0.28, 0);
            railGroup.add(steelRail);
        });

        // Road Crossing Flush Timber Boards (at Z = 25 where road crosses)
        const crossingPlank = new THREE.Mesh(
            new THREE.BoxGeometry(5.4, 0.16, 16.0),
            woodBridgeMat
        );
        crossingPlank.position.set(0, 0.12, 25);
        crossingPlank.receiveShadow = true;
        railGroup.add(crossingPlank);

        // Railroad Crossing Signal Masts (Warning Crossbucks + Flashing Red Lights)
        const railroadFlasherLamps = [];
        [-9.5, 9.5].forEach((sigZ, sIdx) => {
            const sigGroup = new THREE.Group();
            sigGroup.position.set(sIdx === 0 ? -3.8 : 3.8, 0, 25 + sigZ);
            railGroup.add(sigGroup);

            // Striped Mast Pole
            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.2, 0.2, 6.0, 8),
                new THREE.MeshLambertMaterial({ color: 0xeeeeee })
            );
            pole.position.y = 3.0;
            sigGroup.add(pole);

            // Crossbuck Sign (X)
            const xMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const x1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.1), xMat);
            x1.position.set(0, 5.2, 0);
            x1.rotation.z = Math.PI / 4;
            sigGroup.add(x1);

            const x2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.1), xMat);
            x2.position.set(0, 5.2, 0);
            x2.rotation.z = -Math.PI / 4;
            sigGroup.add(x2);

            // Twin Red Warning Lamps
            [-0.7, 0.7].forEach(lx => {
                const redLamp = new THREE.Mesh(
                    new THREE.SphereGeometry(0.35, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xef4444 })
                );
                redLamp.position.set(lx, 4.2, 0);
                sigGroup.add(redLamp);
                railroadFlasherLamps.push(redLamp);
            });
        });

        // Scenic Vintage Train Locomotive Parked on North Rail Spur (at X = 110, Z = -110)
        const trainGroup = new THREE.Group();
        trainGroup.position.set(110, 0, -110);
        scene.add(trainGroup);

        const locoBody = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 5.2, 16),
            new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 })
        );
        locoBody.position.set(0, 3.2, 0);
        trainGroup.add(locoBody);
        addBoxCollider(110, -110, 4.4, 18);

        // Locomotive Cab & Smokestack
        const locoCab = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 3.2, 6),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 })
        );
        locoCab.position.set(0, 6.2, -4);
        trainGroup.add(locoCab);

        const locoStack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.7, 2.5, 8),
            new THREE.MeshLambertMaterial({ color: 0x1e293b })
        );
        locoStack.position.set(0, 6.8, 5);
        trainGroup.add(locoStack);

        // ====================================================================
        // F) LADANG JAGUNG (CORNFIELD) - NORTH OF ROAD (X = 145..295, Z = -145..5)
        // ====================================================================
        const farmGroup = new THREE.Group();
        farmGroup.position.set(220, 0, -70);
        scene.add(farmGroup);

        // Plowed Agricultural Soil Patch (150m width x 150m depth)
        const soilMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(150, 150),
            new THREE.MeshStandardMaterial({ color: 0x422a18, roughness: 0.95 })
        );
        soilMesh.position.set(0, 0.05, 0);
        soilMesh.rotation.x = -Math.PI / 2;
        soilMesh.receiveShadow = true;
        farmGroup.add(soilMesh);

        // Perimeter Ranch Post-and-Rail Wooden Fence
        const fenceMat = woodBridgeMat;
        // South Fence along Road
        for (let fx = -74; fx <= 74; fx += 5.0) {
            const fPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), fenceMat);
            fPost.position.set(fx, 0.9, 74);
            farmGroup.add(fPost);
        }
        const sRail1 = new THREE.Mesh(new THREE.BoxGeometry(150, 0.18, 0.2), fenceMat);
        sRail1.position.set(0, 1.4, 74);
        farmGroup.add(sRail1);
        const sRail2 = new THREE.Mesh(new THREE.BoxGeometry(150, 0.18, 0.2), fenceMat);
        sRail2.position.set(0, 0.7, 74);
        farmGroup.add(sRail2);
        addBoxCollider(220, -70 + 74, 152, 1.5);

        // Dense Rows of 3D Corn Stalks with Leaves and Bright Yellow Corn Cobs!
        const cornTex = createCornTexture();
        const cornCobMat = new THREE.MeshBasicMaterial({ map: cornTex });
        const cornLeafMat = new THREE.MeshLambertMaterial({ color: 0x4d7c0f });
        const stalkGeo = new THREE.CylinderGeometry(0.12, 0.18, 3.8, 5);
        const cobGeo = new THREE.CylinderGeometry(0.16, 0.22, 1.2, 6);

        // Instantiate corn stalks across crop rows
        for (let rowX = -65; rowX <= 65; rowX += 5.2) {
            for (let rowZ = -65; rowZ <= 65; rowZ += 4.5) {
                const stalk = new THREE.Mesh(stalkGeo, cornLeafMat);
                stalk.position.set(rowX + (Math.random() - 0.5) * 0.8, 1.9, rowZ + (Math.random() - 0.5) * 0.8);
                stalk.rotation.y = Math.random() * Math.PI;
                stalk.castShadow = true;
                farmGroup.add(stalk);

                // Golden Corn Cob protruding from stalk
                const cob = new THREE.Mesh(cobGeo, cornCobMat);
                cob.position.set(0.25, 0.2, 0);
                cob.rotation.z = 0.45;
                stalk.add(cob);

                // Angled Leaves
                [-1, 1].forEach(ldir => {
                    const leaf = new THREE.Mesh(
                        new THREE.BoxGeometry(1.2, 0.08, 0.35),
                        cornLeafMat
                    );
                    leaf.position.set(ldir * 0.55, 0.6, 0);
                    leaf.rotation.z = -ldir * 0.55;
                    stalk.add(leaf);
                });
            }
        }

        // Classic Red Farm Barn
        const barn = new THREE.Mesh(
            new THREE.BoxGeometry(18, 12, 24),
            new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.75 })
        );
        barn.position.set(50, 6.0, -45);
        barn.castShadow = true;
        farmGroup.add(barn);
        addBoxCollider(220 + 50, -70 - 45, 20, 26);

        const barnRoof = new THREE.Mesh(
            new THREE.ConeGeometry(15, 6, 4),
            darkRoofBrickMat
        );
        barnRoof.position.set(50, 15.0, -45);
        barnRoof.rotation.y = Math.PI / 4;
        farmGroup.add(barnRoof);

        // Windmill with Spinning Blades
        const windmillGroup = new THREE.Group();
        windmillGroup.position.set(-52, 0, -45);
        farmGroup.add(windmillGroup);

        const wmTower = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 2.6, 18, 8),
            woodBridgeMat
        );
        wmTower.position.y = 9.0;
        wmTower.castShadow = true;
        windmillGroup.add(wmTower);

        const wmRotor = new THREE.Group();
        wmRotor.position.set(0, 17.5, 1.6);
        windmillGroup.add(wmRotor);

        for (let b = 0; b < 4; b++) {
            const blade = new THREE.Mesh(
                new THREE.BoxGeometry(0.45, 6.5, 0.12),
                new THREE.MeshBasicMaterial({ color: 0xf1f5f9 })
            );
            blade.position.y = 3.25;
            blade.rotation.z = (b * Math.PI) / 2;
            wmRotor.add(blade);
        }

        // ====================================================================
        // G) PERUMAHAN (RESIDENTIAL 3x3 DISTRICT OF HOUSES A1..C3)
        // ====================================================================
        const colRoadX = [345, 405, 465];
        const rowZCoords = [-45, 10, 65];

        // 3 Vertical Avenues for the Housing District
        colRoadX.forEach(rx => {
            createRoadBox(rx, 10, 14, 160);
        });

        // 4 Connecting Cross-Streets
        const crossRoadZ = [-70, -20, 35, 85];
        crossRoadZ.forEach(rz => {
            createRoadBox(405, rz, 148, 14);
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

            // Foundation Base
            const foundation = new THREE.Mesh(
                new THREE.BoxGeometry(16, 1.1, 14),
                new THREE.MeshLambertMaterial({ color: 0xc7bdb1 })
            );
            foundation.position.set(0, 0.55, 0);
            foundation.receiveShadow = true;
            houseGroup.add(foundation);

            // House Body
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(12.5, 6.8, 13.6),
                houseCreamBrickMat
            );
            body.position.set(-1.6, 4.5, 0);
            body.castShadow = true;
            body.receiveShadow = true;
            houseGroup.add(body);
            addBoxCollider(houseX - 1.2, zPos, 15.5, 14.2);

            // Pitched Gable Roof
            const roofShape = new THREE.Shape();
            roofShape.moveTo(-8.2, 0);
            roofShape.lineTo(8.2, 0);
            roofShape.lineTo(0, 4.4);
            roofShape.closePath();

            const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 14.2, bevelEnabled: false });
            roofGeo.center();
            const roofMesh = new THREE.Mesh(roofGeo, darkRoofBrickMat);
            roofMesh.rotation.y = Math.PI / 2;
            roofMesh.position.set(0, 10.1, 0);
            roofMesh.castShadow = true;
            houseGroup.add(roofMesh);

            // Porch Pillars
            const pillarMat = new THREE.MeshLambertMaterial({ color: 0x26282a });
            [-6.4, 6.4].forEach(pz => {
                const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.8, 0.45), pillarMat);
                pillar.position.set(7.6, 4.5, pz);
                pillar.castShadow = true;
                houseGroup.add(pillar);
            });

            // Door & Knob
            const door = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 4.5, 2.4),
                new THREE.MeshLambertMaterial({ color: 0x5c3a21 })
            );
            door.position.set(4.65, 3.35, 0);
            houseGroup.add(door);

            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
            knob.position.set(4.85, 3.1, 0.75);
            houseGroup.add(knob);

            // Glowing Windows
            const winMat = new THREE.MeshStandardMaterial({
                color: 0xffb36b,
                emissive: 0xd97736,
                emissiveIntensity: 0.55,
                roughness: 0.12,
                metalness: 0.6
            });
            [-6.85, 6.85].forEach(wz => {
                const win = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.5, 0.15), winMat);
                win.position.set(-1.6, 4.8, wz);
                houseGroup.add(win);
            });

            // Porch Light
            const porchLight = new THREE.PointLight(0xffb76b, 0.65, 18);
            porchLight.position.set(6.2, 6.8, 0);
            houseGroup.add(porchLight);

            // Concrete Footpath to Road
            const pathMesh = new THREE.Mesh(
                new THREE.BoxGeometry(6.5, 0.16, 2.4),
                new THREE.MeshLambertMaterial({ color: 0xb0a79e })
            );
            pathMesh.position.set(10.6, 0.08, 0);
            pathMesh.receiveShadow = true;
            houseGroup.add(pathMesh);

            // Mailbox with House Code Plaque
            const mailboxGroup = new THREE.Group();
            mailboxGroup.position.set(11.8, 0, -2.5);
            houseGroup.add(mailboxGroup);

            const post = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.6, 0.35), new THREE.MeshLambertMaterial({ color: 0x6b3e23 }));
            post.position.y = 1.3;
            mailboxGroup.add(post);

            const boxBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 0.75), new THREE.MeshLambertMaterial({ color: 0xf5ebe1 }));
            boxBody.position.set(0.15, 2.4, 0);
            mailboxGroup.add(boxBody);

            const codeTex = createHouseCodeTexture(code);
            const signMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.9, 1.65), new THREE.MeshBasicMaterial({ map: codeTex }));
            signMesh.position.set(0.15, 3.25, 0);
            mailboxGroup.add(signMesh);

            const bigSignSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: codeTex, transparent: true }));
            bigSignSprite.position.set(11.8, 6.2, -2.5);
            bigSignSprite.scale.set(4.5, 2.25, 1);
            houseGroup.add(bigSignSprite);

            // Delivery Drop-off Point in Front of Mailbox on Road
            const dropOffWorldPos = new THREE.Vector3(roadX - 2.5, 0.18, zPos - 1.2);

            houses[code] = {
                code,
                group: houseGroup,
                dropOffPos: dropOffWorldPos,
                housePos: new THREE.Vector3(houseX, 0, zPos)
            };
        }

        houseCodes.forEach((h, idx) => {
            createRobloxHouse(h.code, colRoadX[h.col], rowZCoords[h.row], idx);
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
        // H) ROADSIDE TREES & ENVIRONMENT (FILLING ALL EMPTY WHITE SPACES)
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

            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.42 * scale, 0.72 * scale, 5.2 * scale, 7),
                trunkMat
            );
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

            const topCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.35 * scale, 1), secondaryMat);
            topCrown.position.set(0.2 * scale, 8.5 * scale, -0.2 * scale);
            topCrown.castShadow = true;
            tree.add(topCrown);

            scene.add(tree);
            if (addCollision) {
                addBoxCollider(x, z, 1.4 * scale, 1.4 * scale);
            }
        }

        // Helper to keep roads, water, tunnel, and houses clear of trees
        function isSpotClearForTree(x, z) {
            // Keep Factory clear
            if (x < -360 && Math.abs(z) < 40) return false;
            // Keep River clear
            if (Math.abs(x - (-230)) < 22) return false;
            // Keep Tunnel & Tebing clear
            if (x > -105 && x < -25 && Math.abs(z - (-20)) < 16) return false;
            if (Math.hypot(x - 10, z - 12) < 20) return false;
            // Keep Railroad clear
            if (Math.abs(x - 110) < 14) return false;
            // Keep Cornfield interior clear
            if (x > 145 && x < 295 && z > -145 && z < 5) return false;
            // Keep Residential streets & houses clear
            if (x > 310 && x < 490 && z > -80 && z < 90) return false;
            // Keep highway corridor clear
            for (let i = 0; i < highwayPoints.length - 1; i++) {
                const px = (highwayPoints[i][0] + highwayPoints[i+1][0]) / 2;
                const pz = (highwayPoints[i][1] + highwayPoints[i+1][1]) / 2;
                if (Math.hypot(x - px, z - pz) < 14.0) return false;
            }
            return true;
        }

        // Populate hundreds of trees along the entire route and roadside empty spaces
        const treeSpawns = [
            // Roadside Factory to Bridge
            [-390, -28], [-370, 26], [-350, -32], [-330, 28], [-310, -25], [-290, 42],
            // Riverbank forest
            [-255, -80], [-255, -40], [-255, 90], [-255, 140],
            [-205, -80], [-205, -40], [-205, 90], [-205, 140],
            // Mountain approach
            [-185, 45], [-165, -25], [-145, 38], [-130, -35],
            // North & South Mountain ridges
            [-95, -75], [-75, -85], [-55, -80], [-35, -75],
            [-95, 45], [-75, 55], [-55, 50], [-35, 45],
            // Post-tunnel roadside
            [15, -35], [35, -25], [55, 38], [75, 48],
            // Along Railroad buffer
            [90, -80], [90, -40], [90, 80], [90, 130],
            [130, -80], [130, -40], [130, 80], [130, 130],
            // South of Highway opposite cornfield
            [160, 45], [190, 48], [220, 46], [250, 44], [280, 38],
            // Residential perimeter
            [320, -90], [370, -90], [420, -90], [470, -90],
            [320, 105], [370, 105], [420, 105], [470, 105],
            [510, -50], [510, 0], [510, 50]
        ];

        treeSpawns.forEach(([tx, tz]) => {
            if (isSpotClearForTree(tx, tz)) {
                createAutumnTree(tx, tz, 0.9 + Math.random() * 0.45, true);
            }
        });

        // Additional scattered forest belt filling empty spaces
        for (let i = 0; i < 90; i++) {
            const rx = -500 + Math.random() * 1000;
            const rz = -230 + Math.random() * 460;
            if (isSpotClearForTree(rx, rz)) {
                createAutumnTree(rx, rz, 1.0 + Math.random() * 0.5, true);
            }
        }

        // Falling leaves particle system
        const leafCount = 180;
        const leafGeo = new THREE.PlaneGeometry(0.48, 0.48);
        const leafGroup = new THREE.Group();
        scene.add(leafGroup);
        const leavesData = [];
        const leafColors = [0xd96b27, 0xe68a2e, 0xc23b22, 0xf59e0b, 0xb8531c];

        for (let i = 0; i < leafCount; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: leafColors[i % leafColors.length], side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(leafGeo, mat);
            mesh.position.set(
                -450 + Math.random() * 900,
                2 + Math.random() * 26,
                -200 + Math.random() * 400
            );
            leafGroup.add(mesh);
            leavesData.push({ mesh, speedY: 1.5 + Math.random() * 1.6, swayOffset: Math.random() * Math.PI * 2 });
        }
`;

console.log("Replacing world section in index.html...");
let html = fs.readFileSync('index.html', 'utf8');

const s4Tag = '/********************************************************************\n         * 4. WORLD GEOMETRY: GROUND, ROADS';
const s8Tag = '/********************************************************************\n         * 8. PLAYER VEHICLE: RED CONVERTIBLE CAR';

const idx4 = html.indexOf(s4Tag);
const idx8 = html.indexOf(s8Tag);

if (idx4 === -1 || idx8 === -1) {
    console.error("Could not find section markers!", idx4, idx8);
    process.exit(1);
}

const newHtml = html.slice(0, idx4) + code.trim() + '\n\n        ' + html.slice(idx8);
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log("World geometry replaced successfully! New length:", newHtml.length);
