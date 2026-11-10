// scratch/generate_ultimate_map.js
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
            const strata = ['#4c453e', '#665d54', '#3d3731', '#73695f', '#443e37', '#584f45', '#38332c'];
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
            grad.addColorStop(0, '#19618a');
            grad.addColorStop(0.5, '#2582b3');
            grad.addColorStop(1.0, '#154e6f');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 256, 256);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 2.0;
            for (let i = 0; i < 50; i++) {
                ctx.beginPath();
                const x = Math.random() * 256; const y = Math.random() * 256;
                ctx.arc(x, y, 10 + Math.random() * 30, 0, Math.PI * 0.85);
                ctx.stroke();
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(3, 30);
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

        // BOUNDARY PERIMETER COLLIDERS (Guarantees zero void fall!)
        addBoxCollider(0, -320, 1500, 30);
        addBoxCollider(0, 320, 1500, 30);
        addBoxCollider(-640, 0, 30, 750);
        addBoxCollider(640, 0, 30, 750);

        // Huge Solid Autumn Ground Plane
        const groundTex = createAutumnGroundTexture(96, 48);
        const groundGeo = new THREE.PlaneGeometry(1320, 700);
        const groundMat = new THREE.MeshStandardMaterial({
            map: groundTex,
            roughness: 0.88,
            metalness: 0.05
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Materials
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
            roughness: 0.90,
            metalness: 0.06,
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
            opacity: 0.85,
            roughness: 0.10,
            metalness: 0.55
        });

        // ====================================================================
        // A) PABRIK (PIZZA FACTORY DEPOT) - FAR WEST (X = -440, Z = 0)
        // ====================================================================
        const factoryGroup = new THREE.Group();
        factoryGroup.position.set(-475, 0, 0);
        factoryGroup.rotation.y = Math.PI / 2; // Facing East (+X towards road!)
        scene.add(factoryGroup);

        // Factory Courtyard & Forecourt (Wide asphalt parking area)
        const factoryLot = new THREE.Mesh(new THREE.BoxGeometry(75, 0.14, 52), asphaltMat);
        factoryLot.position.set(-415, 0.07, 0);
        factoryLot.receiveShadow = true;
        scene.add(factoryLot);

        // White parking stripes
        for (let i = -2; i <= 2; i++) {
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(3.6, 0.16, 0.28),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            stripe.position.set(-430, 0.09, i * 4.6);
            scene.add(stripe);
        }

        // Main Factory Depot Building Body
        const mainDepot = new THREE.Mesh(new THREE.BoxGeometry(36, 17, 26), factoryBrickMat);
        mainDepot.position.set(0, 8.5, -6);
        mainDepot.castShadow = true;
        factoryGroup.add(mainDepot);
        addBoxCollider(-481, 0, 28, 38);

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
        // ====================================================================
        const highwayPoints = [
            [-420, 0],    // 0: Factory spawn forecourt
            [-360, 0],    // 1: Straight heading East
            [-315, 12],   // 2: Sweeping curve towards river bridge
            [-265, 30],   // 3: West wooden bridge entry
            [-210, 30],   // 4: East wooden bridge exit (Bridge spans -265 to -210 at Z = 30)
            [-165, 20],   // 5: Curve off bridge into rock canyon
            [-125, -5],   // 6: Canyon road leading to tunnel
            [-85, -25],   // 7: West mountain tunnel portal entry
            [-30, -25],   // 8: East mountain tunnel portal exit (Tunnel spans -85 to -30)
            [5, -15],     // 9: Winding out of tunnel
            [35, 10],     // 10: Sweeping S-curve around Tebing 2
            [75, 25],     // 11: Straightening towards railway
            [110, 25],    // 12: Railroad crossing (Railroad at X = 110)
            [160, 22],    // 13: Highway south of Cornfield
            [230, 16],    // 14: Highway south of Cornfield
            [290, 8],     // 15: Approaching residential entrance
            [345, 0]      // 16: Residential Avenue 1 connection
        ];

        // Create Smooth 3D Spline
        const spline3D = new THREE.CatmullRomCurve3(
            highwayPoints.map(p => new THREE.Vector3(p[0], 0.08, p[1])),
            false,
            'catmullrom',
            0.45
        );

        // Generate Continuous Road Ribbon Mesh (Zero box corners!)
        const roadSubdivs = 280;
        const roadWidth = 14.5;
        const roadPositions = [];
        const roadUvs = [];
        const roadIndices = [];

        // Center dash stripe positions
        const dashPositions = [];
        const dashUvs = [];
        const dashIndices = [];

        // Yellow edge lines
        const edgeLeftPositions = [];
        const edgeRightPositions = [];
        const edgeIndices = [];

        for (let i = 0; i <= roadSubdivs; i++) {
            const t = i / roadSubdivs;
            const pt = spline3D.getPoint(t);
            const tan = spline3D.getTangent(t);

            // Perpendicular lateral vector in XZ plane
            const normX = -tan.z;
            const normZ = tan.x;
            const normLen = Math.hypot(normX, normZ) || 1;
            const nx = normX / normLen;
            const nz = normZ / normLen;

            // Road surface vertices
            const lx = pt.x + nx * (roadWidth / 2);
            const lz = pt.z + nz * (roadWidth / 2);
            const rx = pt.x - nx * (roadWidth / 2);
            const rz = pt.z - nz * (roadWidth / 2);

            roadPositions.push(lx, pt.y, lz);
            roadPositions.push(rx, pt.y, rz);
            roadUvs.push(0, t * 45);
            roadUvs.push(1, t * 45);

            if (i < roadSubdivs) {
                const b = i * 2;
                roadIndices.push(b, b + 1, b + 2);
                roadIndices.push(b + 2, b + 1, b + 3);
            }

            // Dashed center line ribbon
            const cWidth = 0.38;
            dashPositions.push(pt.x + nx * cWidth, pt.y + 0.015, pt.z + nz * cWidth);
            dashPositions.push(pt.x - nx * cWidth, pt.y + 0.015, pt.z - nx * cWidth);
            dashUvs.push(0, t * 90);
            dashUvs.push(1, t * 90);
            if (i < roadSubdivs) {
                const b = i * 2;
                dashIndices.push(b, b + 1, b + 2);
                dashIndices.push(b + 2, b + 1, b + 3);
            }

            // Yellow edge stripes
            const eWidth = 0.28;
            const eOffset = roadWidth / 2 - 0.45;
            // Left edge
            edgeLeftPositions.push(pt.x + nx * (eOffset + eWidth), pt.y + 0.012, pt.z + nz * (eOffset + eWidth));
            edgeLeftPositions.push(pt.x + nx * (eOffset - eWidth), pt.y + 0.012, pt.z + nz * (eOffset - eWidth));
            // Right edge
            edgeRightPositions.push(pt.x - nx * (eOffset - eWidth), pt.y + 0.012, pt.z - nz * (eOffset - eWidth));
            edgeRightPositions.push(pt.x - nx * (eOffset + eWidth), pt.y + 0.012, pt.z - nz * (eOffset + eWidth));

            if (i < roadSubdivs) {
                const b = i * 2;
                edgeIndices.push(b, b + 1, b + 2);
                edgeIndices.push(b + 2, b + 1, b + 3);
            }
        }

        // Build Road Surface Mesh
        const roadGeo = new THREE.BufferGeometry();
        roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
        roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
        roadGeo.setIndex(roadIndices);
        roadGeo.computeVertexNormals();

        const roadMesh = new THREE.Mesh(roadGeo, asphaltMat);
        roadMesh.receiveShadow = true;
        scene.add(roadMesh);

        // Dashed Center Line (Procedural dashed canvas texture)
        const dashCanvas = document.createElement('canvas');
        dashCanvas.width = 64; dashCanvas.height = 128;
        const dctx = dashCanvas.getContext('2d');
        dctx.fillStyle = '#ffffff';
        dctx.fillRect(0, 0, 64, 72); // dash
        dctx.clearRect(0, 72, 64, 56); // gap
        const centerLineTex = new THREE.CanvasTexture(dashCanvas);
        centerLineTex.wrapS = THREE.RepeatWrapping; centerLineTex.wrapT = THREE.RepeatWrapping;
        centerLineTex.repeat.set(1, 48);

        const centerDashMat = new THREE.MeshBasicMaterial({
            map: centerLineTex,
            transparent: true,
            color: 0xffffff
        });
        const dashGeo = new THREE.BufferGeometry();
        dashGeo.setAttribute('position', new THREE.Float32BufferAttribute(dashPositions, 3));
        dashGeo.setAttribute('uv', new THREE.Float32BufferAttribute(dashUvs, 2));
        dashGeo.setIndex(dashIndices);
        const centerDashMesh = new THREE.Mesh(dashGeo, centerDashMat);
        scene.add(centerDashMesh);

        // Yellow Edge Ribbons
        const yellowEdgeMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
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
        // ====================================================================
        // River Trench (X = -238, North to South from Z = -300 to +300, width = 44m)
        const riverGroup = new THREE.Group();
        scene.add(riverGroup);

        // Lowered Riverbed at Y = -2.2
        const riverBed = new THREE.Mesh(
            new THREE.PlaneGeometry(44, 600),
            new THREE.MeshStandardMaterial({ color: 0x1f2b30, roughness: 0.95 })
        );
        riverBed.position.set(-238, -2.2, 0);
        riverBed.rotation.x = -Math.PI / 2;
        riverGroup.add(riverBed);

        // Sloping West & East Riverbanks
        [-260, -216].forEach((bx, idx) => {
            const bankSlope = new THREE.Mesh(
                new THREE.BoxGeometry(6, 2.2, 600),
                new THREE.MeshStandardMaterial({ color: 0x4a3b2c, roughness: 0.9 })
            );
            bankSlope.position.set(bx, -1.1, 0);
            bankSlope.rotation.z = idx === 0 ? -0.35 : 0.35;
            riverGroup.add(bankSlope);
        });

        // Water Mesh with shiny blue ripples at Y = -1.1
        const riverWater = new THREE.Mesh(new THREE.PlaneGeometry(40, 600), waterMat);
        riverWater.position.set(-238, -1.1, 0);
        riverWater.rotation.x = -Math.PI / 2;
        riverGroup.add(riverWater);

        // River Rocks & Boulders scattered along the water shore
        for (let i = 0; i < 40; i++) {
            const rock = new THREE.Mesh(
                new THREE.DodecahedronGeometry(1.2 + Math.random() * 1.8, 0),
                rockCliffMat
            );
            const side = Math.random() > 0.5 ? -254 : -222;
            rock.position.set(side + (Math.random() - 0.5) * 5, -1.2, -260 + i * 13.5);
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            riverGroup.add(rock);
        }

        // Wooden Bridge Structure (Elevated across river from X = -265 to X = -210 at Z = 30)
        const bridgeGroup = new THREE.Group();
        bridgeGroup.position.set(-238, 0, 30);
        scene.add(bridgeGroup);

        // Heavy Timber Plank Bridge Deck (55m length x 15m width at Y = 0.22)
        const bridgeDeck = new THREE.Mesh(
            new THREE.BoxGeometry(55, 0.45, 15),
            woodBridgeMat
        );
        bridgeDeck.position.set(0, 0.22, 0);
        bridgeDeck.receiveShadow = true;
        bridgeGroup.add(bridgeDeck);

        // Bridge Guardrails (North & South sides)
        [-7.2, 7.2].forEach(sideZ => {
            // Top Rail Beam
            const topRail = new THREE.Mesh(new THREE.BoxGeometry(55, 0.35, 0.45), woodBridgeMat);
            topRail.position.set(0, 1.8, sideZ);
            topRail.castShadow = true;
            bridgeGroup.add(topRail);

            // Mid Rail Beam
            const midRail = new THREE.Mesh(new THREE.BoxGeometry(55, 0.25, 0.35), woodBridgeMat);
            midRail.position.set(0, 1.0, sideZ);
            bridgeGroup.add(midRail);

            // Vertical Posts every 4.5m
            for (let px = -27; px <= 27; px += 4.5) {
                const post = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.0, 0.5), woodBridgeMat);
                post.position.set(px, 1.0, sideZ);
                post.castShadow = true;
                bridgeGroup.add(post);
            }
        });

        // Bridge Guardrail Colliders (Guarantees car stays safely on bridge!)
        addBoxCollider(-238, 30 - 7.3, 56, 1.5);
        addBoxCollider(-238, 30 + 7.3, 56, 1.5);

        // Heavy Timber Piling Trestles underneath extending down into water
        [-18, -6, 6, 18].forEach(tx => {
            for (let tz = -5; tz <= 5; tz += 5) {
                const trestle = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 14, 8), woodBridgeMat);
                trestle.position.set(tx, -5.5, tz);
                bridgeGroup.add(trestle);
            }
        });

        // 4 Warm Glowing Lanterns on Bridge Entry Posts
        [[-27, -7.2], [-27, 7.2], [27, -7.2], [27, 7.2]].forEach(([lx, lz]) => {
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
        // ====================================================================
        const cliffGroup = new THREE.Group();
        scene.add(cliffGroup);

        // Helper to create sheer stratified rock cliffs (layered blocks matching sketch)
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

        // TEBING 1: Canyon Walls flanking road approaching tunnel (X = -135 to -85)
        // North Canyon Wall
        createStratifiedCliff(-125, 11, -30, 24, 22, 18);
        createStratifiedCliff(-105, 14, -42, 28, 28, 22);
        // South Canyon Wall
        createStratifiedCliff(-135, 10, 16, 26, 20, 16);
        createStratifiedCliff(-110, 13, 14, 26, 26, 18);

        // MOUNTAIN MASSIF & TUNNEL STRUCTURE (From X = -85 to X = -30 at Z = -25)
        const tunnelGroup = new THREE.Group();
        tunnelGroup.position.set(-57.5, 0, -25);
        scene.add(tunnelGroup);

        // Mountain Ridge Massif over the tunnel
        createStratifiedCliff(-75, 16, -25, 30, 32, 34); // Center massif
        createStratifiedCliff(-42, 15, -25, 30, 30, 34); // East massif
        createStratifiedCliff(-58, 22, -25, 36, 18, 30); // High mountain ridge top

        // Grand Stone Arch Portals at Entrance (West X = -85) and Exit (East X = -30)
        [-27.5, 27.5].forEach((px, pIdx) => {
            const portalFrame = new THREE.Mesh(
                new THREE.BoxGeometry(3.6, 14, 24),
                rockCliffMat
            );
            portalFrame.position.set(px, 7.0, 0);
            portalFrame.castShadow = true;
            tunnelGroup.add(portalFrame);

            // Arched Header Stone with Keystone
            const archHeader = new THREE.Mesh(
                new THREE.BoxGeometry(4.2, 4.0, 16),
                factoryBrickMat
            );
            archHeader.position.set(px, 12.5, 0);
            tunnelGroup.add(archHeader);

            const keystone = new THREE.Mesh(
                new THREE.BoxGeometry(4.4, 2.5, 2.8),
                new THREE.MeshLambertMaterial({ color: 0xdfd3c3 })
            );
            keystone.position.set(px, 12.0, 0);
            tunnelGroup.add(keystone);

            // Portal Wing Walls flaring out into the cliffs
            const wingWallL = new THREE.Mesh(new THREE.BoxGeometry(3.0, 16, 8), rockCliffMat);
            wingWallL.position.set(px, 8.0, -14);
            wingWallL.rotation.y = pIdx === 0 ? 0.35 : -0.35;
            tunnelGroup.add(wingWallL);

            const wingWallR = new THREE.Mesh(new THREE.BoxGeometry(3.0, 16, 8), rockCliffMat);
            wingWallR.position.set(px, 8.0, 14);
            wingWallR.rotation.y = pIdx === 0 ? -0.35 : 0.35;
            tunnelGroup.add(wingWallR);
        });

        // Tunnel Arched Stone Ceiling Vault (Length = 55m)
        const tunnelVault = new THREE.Mesh(
            new THREE.CylinderGeometry(8.5, 8.5, 55, 24, 1, true, 0, Math.PI),
            rockCliffMat
        );
        tunnelVault.rotation.z = Math.PI / 2;
        tunnelVault.position.set(0, 4.2, 0);
        tunnelGroup.add(tunnelVault);

        // 4 Overhead Warm Amber Sodium Tunnel Lamps
        [-18, -6, 6, 18].forEach(lx => {
            const lampFixture = new THREE.Mesh(
                new THREE.BoxGeometry(1.2, 0.45, 0.8),
                new THREE.MeshBasicMaterial({ color: 0xffaa22 })
            );
            lampFixture.position.set(lx, 7.8, 0);
            tunnelGroup.add(lampFixture);

            const tLight = new THREE.PointLight(0xff9911, 2.4, 26);
            tLight.position.set(lx, 7.2, 0);
            tunnelGroup.add(tLight);
        });

        // Tunnel Solid Wall Colliders
        addBoxCollider(-57.5, -25 - 8.2, 58, 2.0);
        addBoxCollider(-57.5, -25 + 8.2, 58, 2.0);

        // TEBING 2: Massive Post-Tunnel Stratified Cliff Bluff (Forces road into S-curve)
        createStratifiedCliff(5, 12, 10, 26, 24, 22);
        createStratifiedCliff(24, 14, 18, 24, 28, 20);
        createStratifiedCliff(44, 10, 28, 20, 20, 18);

        // Red/White Chevron Curve Signs (>>>) along S-Curve around Tebing 2
        for (let i = 0; i < 4; i++) {
            const signGroup = new THREE.Group();
            signGroup.position.set(-5 + i * 12, 0, -3 + i * 6.5);
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
        const railGroup = new THREE.Group();
        railGroup.position.set(110, 0, 0);
        scene.add(railGroup);

        // Gravel Ballast Embankment
        const ballastMesh = new THREE.Mesh(
            new THREE.BoxGeometry(5.4, 0.18, 600),
            new THREE.MeshStandardMaterial({ color: 0x3e3832, roughness: 0.95 })
        );
        ballastMesh.position.set(0, 0.08, 0);
        ballastMesh.receiveShadow = true;
        railGroup.add(ballastMesh);

        // Wooden Ties (Sleepers every 1.8m)
        const tieGeo = new THREE.BoxGeometry(4.4, 0.22, 0.55);
        for (let rz = -280; rz <= 280; rz += 2.0) {
            if (rz > 16 && rz < 34) continue; // Leave crossing clear
            const tie = new THREE.Mesh(tieGeo, woodBridgeMat);
            tie.position.set(0, 0.14, rz);
            railGroup.add(tie);
        }

        // Twin Shiny Steel Rails
        const railMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.88, roughness: 0.22 });
        [-1.35, 1.35].forEach(rx => {
            const steelRail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 600), railMat);
            steelRail.position.set(rx, 0.28, 0);
            railGroup.add(steelRail);
        });

        // Flush Timber Crossing Planks at Z = 25
        const crossingPlank = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.16, 16.0), woodBridgeMat);
        crossingPlank.position.set(0, 0.12, 25);
        crossingPlank.receiveShadow = true;
        railGroup.add(crossingPlank);

        // Crossing Warning Signal Masts with Flashing Red Lamps
        const railroadFlasherLamps = [];
        [-9.5, 9.5].forEach((sigZ, sIdx) => {
            const sigGroup = new THREE.Group();
            sigGroup.position.set(sIdx === 0 ? -3.8 : 3.8, 0, 25 + sigZ);
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

        // Parked Vintage Freight Locomotive on North Rail Spur (X = 110, Z = -110)
        const trainGroup = new THREE.Group();
        trainGroup.position.set(110, 0, -110);
        scene.add(trainGroup);

        const locoBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.2, 16), new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 }));
        locoBody.position.set(0, 3.2, 0);
        trainGroup.add(locoBody);
        addBoxCollider(110, -110, 4.4, 18);

        const locoCab = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.2, 6), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }));
        locoCab.position.set(0, 6.2, -4);
        trainGroup.add(locoCab);

        // ====================================================================
        // F) LADANG JAGUNG (CORNFIELD) - NORTH OF ROAD (X = 145..290, Z = -145..5)
        // ====================================================================
        const farmGroup = new THREE.Group();
        farmGroup.position.set(220, 0, -70);
        scene.add(farmGroup);

        // Agricultural Soil Patch (150m width x 150m depth)
        const soilMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(150, 150),
            new THREE.MeshStandardMaterial({ color: 0x422a18, roughness: 0.95 })
        );
        soilMesh.position.set(0, 0.05, 0);
        soilMesh.rotation.x = -Math.PI / 2;
        soilMesh.receiveShadow = true;
        farmGroup.add(soilMesh);

        // Ranch Post-and-Rail Fence along Road (South Border)
        const fenceMat = woodBridgeMat;
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

        for (let rowX = -65; rowX <= 65; rowX += 5.2) {
            for (let rowZ = -65; rowZ <= 65; rowZ += 4.5) {
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
        barn.position.set(50, 6.0, -45);
        barn.castShadow = true;
        farmGroup.add(barn);
        addBoxCollider(220 + 50, -70 - 45, 20, 26);

        const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 6, 4), darkRoofBrickMat);
        barnRoof.position.set(50, 15.0, -45);
        barnRoof.rotation.y = Math.PI / 4;
        farmGroup.add(barnRoof);

        // Windmill with Spinning Blades
        const windmillGroup = new THREE.Group();
        windmillGroup.position.set(-52, 0, -45);
        farmGroup.add(windmillGroup);

        const wmTower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, 18, 8), woodBridgeMat);
        wmTower.position.y = 9.0;
        wmTower.castShadow = true;
        windmillGroup.add(wmTower);

        const wmRotor = new THREE.Group();
        wmRotor.position.set(0, 17.5, 1.6);
        windmillGroup.add(wmRotor);

        for (let b = 0; b < 4; b++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.5, 0.12), new THREE.MeshBasicMaterial({ color: 0xf1f5f9 }));
            blade.position.y = 3.25;
            blade.rotation.z = (b * Math.PI) / 2;
            wmRotor.add(blade);
        }

        // ====================================================================
        // G) PERUMAHAN (RESIDENTIAL 3x3 DISTRICT OF HOUSES A1..C3)
        // ====================================================================
        const colRoadX = [345, 405, 465];
        const rowZCoords = [-45, 10, 65];

        function createRoadBox(x, z, w, d) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), asphaltMat);
            mesh.position.set(x, 0.07, z);
            mesh.receiveShadow = true;
            scene.add(mesh);
            return mesh;
        }

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
            const foundation = new THREE.Mesh(new THREE.BoxGeometry(16, 1.1, 14), new THREE.MeshLambertMaterial({ color: 0xc7bdb1 }));
            foundation.position.set(0, 0.55, 0);
            foundation.receiveShadow = true;
            houseGroup.add(foundation);

            // House Body
            const body = new THREE.Mesh(new THREE.BoxGeometry(12.5, 6.8, 13.6), houseCreamBrickMat);
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
            const door = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.5, 2.4), new THREE.MeshLambertMaterial({ color: 0x5c3a21 }));
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
            const pathMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.16, 2.4), new THREE.MeshLambertMaterial({ color: 0xb0a79e }));
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

            const topCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.35 * scale, 1), secondaryMat);
            topCrown.position.set(0.2 * scale, 8.5 * scale, -0.2 * scale);
            topCrown.castShadow = true;
            tree.add(topCrown);

            scene.add(tree);
            if (addCollision) {
                addBoxCollider(x, z, 1.4 * scale, 1.4 * scale);
            }
        }

        function isSpotClearForTree(x, z) {
            if (x < -360 && Math.abs(z) < 40) return false;
            if (Math.abs(x - (-238)) < 26) return false;
            if (x > -145 && x < -20 && Math.abs(z - (-20)) < 22) return false;
            if (x > -10 && x < 55 && z > -5 && z < 35) return false;
            if (Math.abs(x - 110) < 14) return false;
            if (x > 140 && x < 295 && z > -150 && z < 8) return false;
            if (x > 310 && x < 490 && z > -80 && z < 90) return false;
            for (let i = 0; i < highwayPoints.length - 1; i++) {
                const px = (highwayPoints[i][0] + highwayPoints[i+1][0]) / 2;
                const pz = (highwayPoints[i][1] + highwayPoints[i+1][1]) / 2;
                if (Math.hypot(x - px, z - pz) < 15.0) return false;
            }
            return true;
        }

        // Roadside Tree Spawns
        const treeSpawns = [
            [-390, -28], [-370, 26], [-350, -32], [-330, 28], [-310, -25], [-290, 42],
            [-265, -80], [-265, -40], [-265, 90], [-265, 140],
            [-210, -80], [-210, -40], [-210, 90], [-210, 140],
            [-185, 45], [-165, -25], [-145, 38], [-130, -35],
            [-95, -75], [-75, -85], [-55, -80], [-35, -75],
            [-95, 45], [-75, 55], [-55, 50], [-35, 45],
            [15, -35], [35, -25], [55, 42], [75, 48],
            [90, -80], [90, -40], [90, 80], [90, 130],
            [130, -80], [130, -40], [130, 80], [130, 130],
            [160, 45], [190, 48], [220, 46], [250, 44], [280, 38],
            [320, -90], [370, -90], [420, -90], [470, -90],
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

        // Falling leaves particles
        const leafCount = 180;
        const leafGeo = new THREE.PlaneGeometry(0.48, 0.48);
        const leafGroup = new THREE.Group();
        scene.add(leafGroup);
        const leavesData = [];
        const leafColors = [0xd96b27, 0xe68a2e, 0xc23b22, 0xf59e0b, 0xb8531c];

        for (let i = 0; i < leafCount; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: leafColors[i % leafColors.length], side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(leafGeo, mat);
            mesh.position.set(-450 + Math.random() * 900, 2 + Math.random() * 26, -200 + Math.random() * 400);
            leafGroup.add(mesh);
            leavesData.push({ mesh, speedY: 1.5 + Math.random() * 1.6, swayOffset: Math.random() * Math.PI * 2 });
        }
`;

console.log("Replacing world section in index.html with smooth spline highway & real river canyon...");
let html = fs.readFileSync('index.html', 'utf8');

const s4Tag = '/********************************************************************\n         * 4. PROCEDURAL TEXTURES FOR EXTENDED WORLD';
const s8Tag = '/********************************************************************\n         * 8. PLAYER VEHICLE: RED CONVERTIBLE CAR';

const idx4 = html.indexOf(s4Tag);
const idx8 = html.indexOf(s8Tag);

if (idx4 === -1 || idx8 === -1) {
    console.error("Could not find section markers!", idx4, idx8);
    process.exit(1);
}

let newHtml = html.slice(0, idx4) + code.trim() + '\n\n        ' + html.slice(idx8);

// Ensure spawn position is explicitly at -410, 0, Math.PI / 2 facing East
newHtml = newHtml.replace(
    /const carPhysics = \{\s*x: [^,]+,\s*z: [^,]+,\s*angle: [^,]+,/g,
    'const carPhysics = {\n            x: -410,\n            z: 0,\n            angle: Math.PI / 2,'
);

// Ensure spawnCarAtFactory resets to -410, 0, Math.PI / 2
newHtml = newHtml.replace(
    /function spawnCarAtFactory\(\) \{\s*carPhysics\.x = [^;]+;\s*carPhysics\.z = [^;]+;\s*carPhysics\.angle = [^;]+;/g,
    'function spawnCarAtFactory() {\n            carPhysics.x = -410;\n            carPhysics.z = 0;\n            carPhysics.angle = Math.PI / 2;'
);

// Update window.onload to set camera behind car facing East, and show exact greeting
newHtml = newHtml.replace(
    /window\.onload = function \(\) \{[\s\S]*?animate\(lastTime\);/g,
    `window.onload = function () {
            spawnCarAtFactory();
            updateHUD();
            camera.position.set(-426, 5.2, 0);
            camera.lookAt(-410, 1.8, 0);
            showToast(
                '🏭 ANDA DI DEPAN PABRIK PIZZA (TITIK AWAL)',
                'Mundur (S / ▼) ke dalam garasi pabrik untuk mengambil paket pizza!',
                'info'
            );
            lastTime = performance.now();
            animate(lastTime);`
);

fs.writeFileSync('index.html', newHtml, 'utf8');
console.log("Ultimate map successfully written to index.html! New length:", newHtml.length);
