const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const startMarker = `        // 1. Underbody Chassis Floor Pan
        const underChassisPlate = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.12, 5.25), blackTrimMat);`;

const endMarker = `        // Lower Rear Apron with Diffuser notch
        const rearApron = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.20, 0.32), blackTrimMat);
        rearApron.position.set(0, 0.44, 2.52);
        carChassis.add(rearApron);`;

if (!content.includes(startMarker)) {
    console.error("Start marker not found!");
    process.exit(1);
}

if (!content.includes(endMarker)) {
    console.error("End marker not found!");
    process.exit(1);
}

const replacementCode = `        // 1. Underbody Chassis Floor Pan
        const underChassisPlate = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.12, 5.25), blackTrimMat);
        underChassisPlate.position.set(0, 0.40, -0.05);
        underChassisPlate.castShadow = true;
        carChassis.add(underChassisPlate);

        // 2. Lower Main Body Base Tub
        const mainLowerTub = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.52, 5.08), carRedMat);
        mainLowerTub.position.set(0, 0.68, -0.05);
        mainLowerTub.castShadow = true;
        mainLowerTub.receiveShadow = true;
        carChassis.add(mainLowerTub);

        // 3. FRONT NOSE, BUMPER & AIR DAM (Ref: Front 3/4 & Front Elevation)
        // A) Front Lip Splitter
        const frontLip = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.14, 0.62), blackTrimMat);
        frontLip.position.set(0, 0.35, -2.55);
        frontLip.castShadow = true;
        carChassis.add(frontLip);

        // B) Aerodynamic Front Air Dam Bumper
        const frontAirDam = new THREE.Mesh(new THREE.BoxGeometry(2.64, 0.36, 0.52), carRedMat);
        frontAirDam.position.set(0, 0.56, -2.58);
        frontAirDam.castShadow = true;
        carChassis.add(frontAirDam);

        // C) Air Dam Horizontal Intake Slots (3 Center cooling slits)
        [-0.08, 0.04].forEach(slotY => {
            const airSlot = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.055, 0.08), blackTrimMat);
            airSlot.position.set(0, 0.54 + slotY, -2.85);
            carChassis.add(airSlot);
        });

        // D) Lower Corner Amber Indicators & Fog Lights
        [-1.02, 1.02].forEach(ix => {
            const indLamp = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.13, 0.06), amberLightMat);
            indLamp.position.set(ix, 0.52, -2.84);
            carChassis.add(indLamp);
        });

        // E) Main Front Bumper Bar & Black Impact Rub Strip
        const frontBumperBar = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.25, 0.40), carRedMat);
        frontBumperBar.position.set(0, 0.78, -2.62);
        frontBumperBar.castShadow = true;
        carChassis.add(frontBumperBar);

        const frontRubStrip = new THREE.Mesh(new THREE.BoxGeometry(2.70, 0.08, 0.42), blackTrimMat);
        frontRubStrip.position.set(0, 0.80, -2.63);
        carChassis.add(frontRubStrip);

        // 4. FRONT GRILLE FASCIA: QUAD ROUND HEADLIGHTS & TWIN KIDNEY GRILLE (Signature E30!)
        const frontGrilleBacking = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.38, 0.12), blackTrimMat);
        frontGrilleBacking.position.set(0, 1.02, -2.62);
        frontGrilleBacking.castShadow = true;
        carChassis.add(frontGrilleBacking);

        // A) Twin Kidney Grilles in Center
        [-0.16, 0.16].forEach(kx => {
            // Chrome frame
            const kFrame = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 0.06), chromeTrimMat);
            kFrame.position.set(kx, 1.02, -2.69);
            carChassis.add(kFrame);

            // Black inner slats
            const kInner = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.04), blackTrimMat);
            kInner.position.set(kx, 1.02, -2.71);
            carChassis.add(kInner);
        });

        // B) Quad Round Headlights (2 Left, 2 Right)
        [-0.96, -0.60, 0.60, 0.96].forEach(hx => {
            // Chrome outer trim bezel
            const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.022, 10, 20), chromeTrimMat);
            bezel.position.set(hx, 1.02, -2.68);
            carChassis.add(bezel);

            // Crystal glowing white lens
            const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.04, 18), headlightGlassMat);
            lens.rotation.x = Math.PI / 2;
            lens.position.set(hx, 1.02, -2.68);
            carChassis.add(lens);
        });

        // Reposition Headlight Spotlights to Outer Round Headlights
        leftHeadlightSpot.position.set(-0.96, 1.02, -2.75);
        leftHeadlightSpot.target.position.set(-0.96, 0.2, -45);
        rightHeadlightSpot.position.set(0.96, 1.02, -2.75);
        rightHeadlightSpot.target.position.set(0.96, 0.2, -45);

        const headlightBeam = new THREE.SpotLight(0xffecd2, 1.6, 52, Math.PI / 3.8, 0.45, 1.2);
        headlightBeam.position.set(0, 1.02, -2.75);
        headlightBeam.target.position.set(0, 0.2, -25);
        carChassis.add(headlightBeam);
        carChassis.add(headlightBeam.target);

        // 5. HOOD (BONNET) - SLEEK, AERODYNAMIC, FLUSH WITH FENDERS & DOWNWARD RAKE (Fixes "kap mesin ga lurus"!)
        // Slopes gently DOWN towards the nose (-0.046 rad) from cowl Y=1.23 down to nose Y=1.14
        const hoodMesh = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.08, 1.68), carRedMat);
        hoodMesh.position.set(0, 1.18, -1.785);
        hoodMesh.rotation.x = -0.046;
        hoodMesh.castShadow = true;
        carChassis.add(hoodMesh);

        // Center power crease ridge on hood (Signature E30 M3 hood line)
        const hoodCrease = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 1.64), carRedMat);
        hoodCrease.position.set(0, 1.225, -1.785);
        hoodCrease.rotation.x = -0.046;
        carChassis.add(hoodCrease);

        // Dual hood cooling vents near cowl (Ref: blueprint-car.jpg)
        [-0.42, 0.42].forEach(vx => {
            const hoodVent = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.22), blackTrimMat);
            hoodVent.position.set(vx, 1.218, -1.25);
            hoodVent.rotation.x = -0.046;
            carChassis.add(hoodVent);
        });

        // Wiper cowl panel & black air vents at base of windshield
        const cowlPanel = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.06, 0.16), blackTrimMat);
        cowlPanel.position.set(0, 1.23, -0.96);
        carChassis.add(cowlPanel);

        // 6. ICONIC E30 M3 BOX FLARED FENDERS & CONTINUOUS WIDEBODY WORK
        // A) Front Box Fender Flares (over front wheels Z = -1.75)
        [-1.34, 1.34].forEach(fx => {
            const frontFlare = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.60, 1.58), carRedMat);
            frontFlare.position.set(fx, 0.78, -1.75);
            frontFlare.castShadow = true;
            carChassis.add(frontFlare);

            // Chamfered top edge of the box flare - sloped flush with hood (-0.046 rad)
            const flareTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 1.58), carRedMat);
            flareTop.position.set(fx, 1.14, -1.75);
            flareTop.rotation.x = -0.046;
            flareTop.castShadow = true;
            carChassis.add(flareTop);
        });

        // B) CONTINUOUS REAR WIDEBODY QUARTER PANELS (From Door Z=0.61 all the way to Rear Bumper Z=2.58!)
        // Fixes "bumper belakang bolong" 100% with a single, seamless, sculpted widebody panel!
        [-1.34, 1.34].forEach(rx => {
            // Main widebody rear fender and quarter panel (Length = 1.97, Center Z = 1.595)
            const rearWideBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.60, 1.97), carRedMat);
            rearWideBody.position.set(rx, 0.78, 1.595);
            rearWideBody.castShadow = true;
            carChassis.add(rearWideBody);

            // Chamfered top edge of the rear widebody running flush to the trunk deck
            const rWideTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.10, 1.97), carRedMat);
            rWideTop.position.set(rx, 1.13, 1.595);
            rWideTop.castShadow = true;
            carChassis.add(rWideTop);

            // Rear Bumper Wrapped Corners seamlessly enclosing the rear panel
            const bumperSideWrap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.40), carRedMat);
            bumperSideWrap.position.set(rx > 0 ? rx + 0.02 : rx - 0.02, 0.68, 2.38);
            bumperSideWrap.castShadow = true;
            carChassis.add(bumperSideWrap);

            const rubSideWrap = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.40), blackTrimMat);
            rubSideWrap.position.set(rx > 0 ? rx + 0.02 : rx - 0.02, 0.70, 2.38);
            carChassis.add(rubSideWrap);
        });

        // C) SOLID DOOR PANELS & LEVEL SIDE SKIRTS (Fixes "skirt jomplang" & missing side body!)
        // Solid Door Bodywork: fills the cabin sides completely up to beltline Y=1.23 between flares
        [-1.21, 1.21].forEach(dx => {
            const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.58, 1.57), carRedMat);
            doorPanel.position.set(dx, 0.94, -0.175);
            doorPanel.castShadow = true;
            carChassis.add(doorPanel);

            // Signature E30 Side Impact Protective Rub Strip (Horizontal continuous molding)
            const sideRubStrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 1.57), blackTrimMat);
            sideRubStrip.position.set(dx > 0 ? dx + 0.075 : dx - 0.075, 0.82, -0.175);
            carChassis.add(sideRubStrip);

            // Door handle recess
            const dHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.18), blackTrimMat);
            dHandle.position.set(dx > 0 ? dx + 0.075 : dx - 0.075, 1.15, 0.08);
            carChassis.add(dHandle);
        });

        // Integrated Level Side Skirts (Rocker Sill) - Level with front/rear flare bottoms at Y=0.48
        // Width 0.20, outer edge at X = +-1.42 (perfect athletic Coke-bottle tuck between flares at 1.48)
        [-1.32, 1.32].forEach(sx => {
            const sideSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.18, 1.57), carRedMat);
            sideSkirt.position.set(sx, 0.57, -0.175);
            sideSkirt.castShadow = true;
            carChassis.add(sideSkirt);
        });

        // D) AERODYNAMIC DTM SIDE VIEW MIRRORS (Fixes "spion dll"!)
        // Mounted cleanly on the A-pillar door corner triangle, not floating in empty air
        [-1.22, 1.22].forEach(mx => {
            const isRight = mx > 0;
            // Black aerodynamic triangle base mount
            const mirrorMount = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.08), blackTrimMat);
            mirrorMount.position.set(isRight ? mx + 0.02 : mx - 0.02, 1.26, -0.56);
            carChassis.add(mirrorMount);

            // Sculpted sports mirror pod housing (aerodynamic teardrop)
            const mirrorBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.18), carRedMat);
            mirrorBody.position.set(isRight ? mx + 0.10 : mx - 0.10, 1.28, -0.55);
            mirrorBody.rotation.y = isRight ? -0.10 : 0.10;
            mirrorBody.castShadow = true;
            carChassis.add(mirrorBody);

            // Rear-facing reflective mirror glass
            const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.075, 0.02), chromeTrimMat);
            mirrorGlass.position.set(isRight ? mx + 0.10 : mx - 0.10, 1.28, -0.46);
            mirrorGlass.rotation.y = isRight ? -0.10 : 0.10;
            carChassis.add(mirrorGlass);
        });

        // 7. HARDTOP COUPE CABIN (Greenhouse, Flush Windshield, Roof, Windows, C-Pillar)
        // Mathematically calibrated: ZERO overhang, ZERO protruding horns above roof!
        // Roof spans Z = -0.58 to +0.90, Y = 1.73 (bottom) to 1.79 (top)

        // A) Hardtop Roof Panel & Black Roof Gutter Trim
        const roofPanel = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.06, 1.48), carRedMat);
        roofPanel.position.set(0, 1.76, 0.16);
        roofPanel.castShadow = true;
        carChassis.add(roofPanel);

        // Roof front transverse header bar
        const roofFrontHeader = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.06, 0.08), carRedMat);
        roofFrontHeader.position.set(0, 1.76, -0.58);
        carChassis.add(roofFrontHeader);

        // Roof rear transverse header bar
        const roofRearHeader = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.06, 0.08), carRedMat);
        roofRearHeader.position.set(0, 1.76, 0.90);
        carChassis.add(roofRearHeader);

        // Subtle Roof Rain Gutters (Left & Right) - flush with roof edge
        [-1.09, 1.09].forEach(rx => {
            const roofRail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 1.48), blackTrimMat);
            roofRail.position.set(rx, 1.77, 0.16);
            carChassis.add(roofRail);
        });

        // B) Slanted Front Windshield & Flush A-Pillars (Connects cowl Y=1.23, Z=-0.96 to roof Y=1.73, Z=-0.58)
        const windshieldMesh = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.628, 0.03), glassMat);
        windshieldMesh.position.set(0, 1.48, -0.77);
        windshieldMesh.rotation.x = 0.650;
        carChassis.add(windshieldMesh);

        [-1.08, 1.08].forEach(px => {
            const aPillar = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.628, 0.08), carRedMat);
            aPillar.position.set(px, 1.48, -0.77);
            aPillar.rotation.x = 0.650;
            aPillar.castShadow = true;
            carChassis.add(aPillar);
        });

        // C) Slanted Rear Windshield & C-Pillars (Connects roof Y=1.73, Z=0.90 to trunk Y=1.23, Z=1.48)
        const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.766, 0.03), glassMat);
        rearWindshield.position.set(0, 1.48, 1.19);
        rearWindshield.rotation.x = -0.859;
        carChassis.add(rearWindshield);

        // E30 M3 Aerodynamic Fastback C-Pillars (Wider signature race pillars)
        [-1.08, 1.08].forEach(cx => {
            const cPillar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.766, 0.12), carRedMat);
            cPillar.position.set(cx, 1.48, 1.19);
            cPillar.rotation.x = -0.859;
            cPillar.castShadow = true;
            carChassis.add(cPillar);
        });

        // D) Side Windows & Satin B-Pillars
        [-1.10, 1.10].forEach(wx => {
            // Front Door Glass
            const frontDoorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.48, 0.92), glassMat);
            frontDoorGlass.position.set(wx, 1.48, -0.06);
            carChassis.add(frontDoorGlass);

            // Satin Black B-Pillar Divider
            const bPillar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.49, 0.08), blackTrimMat);
            bPillar.position.set(wx, 1.48, 0.40);
            carChassis.add(bPillar);

            // Rear Quarter Glass meeting C-Pillar seamlessly
            const rearQtrGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.48, 0.52), glassMat);
            rearQtrGlass.position.set(wx, 1.48, 0.66);
            carChassis.add(rearQtrGlass);

            // Front Window Triangle Corner Trim
            const frontCornerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.12), blackTrimMat);
            frontCornerTrim.position.set(wx, 1.30, -0.54);
            carChassis.add(frontCornerTrim);

            // Horizontal Beltline Weatherstrip Window Sill Trim
            const beltTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 1.48), blackTrimMat);
            beltTrim.position.set(wx > 0 ? wx + 0.02 : wx - 0.02, 1.23, 0.16);
            carChassis.add(beltTrim);
        });

        // 8. INTERIOR CABIN (Steering wheel, sports seats visible inside)
        const cabinFloor = new THREE.Mesh(new THREE.BoxGeometry(2.20, 0.12, 1.75), darkInteriorMat);
        cabinFloor.position.set(0, 0.62, 0.15);
        carChassis.add(cabinFloor);

        const dashBoard = new THREE.Mesh(new THREE.BoxGeometry(2.20, 0.32, 0.42), darkInteriorMat);
        dashBoard.position.set(0, 1.15, -0.72);
        carChassis.add(dashBoard);

        const steeringCol = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 10), blackTrimMat);
        steeringCol.position.set(-0.48, 1.12, -0.48);
        steeringCol.rotation.x = 0.95;
        carChassis.add(steeringCol);

        const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 10, 24), blackTrimMat);
        steeringWheel.position.set(-0.48, 1.30, -0.28);
        steeringWheel.rotation.x = -0.42;
        carChassis.add(steeringWheel);

        // Sports bucket seats
        [-0.48, 0.48].forEach(sx => {
            const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.62), darkInteriorMat);
            seatBase.position.set(sx, 0.72, 0.05);
            carChassis.add(seatBase);

            const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.68, 0.18), darkInteriorMat);
            seatBack.position.set(sx, 1.10, 0.38);
            seatBack.rotation.x = -0.15;
            carChassis.add(seatBack);
        });

        // 9. REAR DECK, TRUNK & AERODYNAMIC M3 WING (Ref: Blueprint Rear Views)
        // A) Flat Rear Trunk Lid - Seamlessly flush with C-pillars and rear quarter panels
        const trunkDeck = new THREE.Mesh(new THREE.BoxGeometry(2.40, 0.10, 1.10), carRedMat);
        trunkDeck.position.set(0, 1.20, 2.03);
        trunkDeck.castShadow = true;
        carChassis.add(trunkDeck);

        // B) High-Mount E30 M3 Rear Spoiler Wing
        // Vertical upright wing pylons
        [-0.92, 0.92].forEach(wx => {
            const wingPylon = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.28, 0.36), carRedMat);
            wingPylon.position.set(wx, 1.35, 2.36);
            wingPylon.castShadow = true;
            carChassis.add(wingPylon);
        });

        // Horizontal Aerodynamic Airfoil Wing Blade
        const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.06, 0.42), carRedMat);
        wingBlade.position.set(0, 1.48, 2.38);
        wingBlade.rotation.x = -0.06;
        wingBlade.castShadow = true;
        carChassis.add(wingBlade);

        // Gurney Flap / Wickerbill on trailing edge of the wing
        const gurneyFlap = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.035, 0.04), blackTrimMat);
        gurneyFlap.position.set(0, 1.52, 2.56);
        carChassis.add(gurneyFlap);

        // 10. REAR FASCIA, RIBBED TAILLIGHTS & REAR BUMPER
        const rearFascia = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.44, 0.12), carRedMat);
        rearFascia.position.set(0, 0.98, 2.58);
        rearFascia.castShadow = true;
        carChassis.add(rearFascia);

        // License plate black recess
        const plateRecess = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.22, 0.04), blackTrimMat);
        plateRecess.position.set(0, 0.98, 2.65);
        carChassis.add(plateRecess);

        // Iconic E30 Ribbed Rectangular Taillights
        // Left Taillight (Amber outer, Red center brake, White inner reverse)
        const lAmber = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.24, 0.04), amberLightMat);
        lAmber.position.set(-1.05, 0.98, 2.65);
        carChassis.add(lAmber);

        const lRed = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.04), tailLightMat);
        lRed.position.set(-0.81, 0.98, 2.65);
        carChassis.add(lRed);

        const lWhite = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.24, 0.04), reverseLightMat);
        lWhite.position.set(-0.57, 0.98, 2.65);
        carChassis.add(lWhite);

        // Right Taillight (White inner reverse, Red center brake, Amber outer)
        const rWhite = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.24, 0.04), reverseLightMat);
        rWhite.position.set(0.57, 0.98, 2.65);
        carChassis.add(rWhite);

        const rRed = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.04), tailLightMat);
        rRed.position.set(0.81, 0.98, 2.65);
        carChassis.add(rRed);

        const rAmber = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.24, 0.04), amberLightMat);
        rAmber.position.set(1.05, 0.98, 2.65);
        carChassis.add(rAmber);

        const rearTailGlowLight = new THREE.PointLight(0xff2222, 0.8, 10);
        rearTailGlowLight.position.set(0, 0.98, 2.95);
        carChassis.add(rearTailGlowLight);

        // Rear Bumper Bar & Rub Strip (Wrapped around rear quarter panels)
        const rearBumperBar = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.28, 0.38), carRedMat);
        rearBumperBar.position.set(0, 0.68, 2.55);
        rearBumperBar.castShadow = true;
        carChassis.add(rearBumperBar);

        const rearRubStrip = new THREE.Mesh(new THREE.BoxGeometry(2.70, 0.08, 0.40), blackTrimMat);
        rearRubStrip.position.set(0, 0.70, 2.56);
        carChassis.add(rearRubStrip);

        // Lower Rear Apron with Diffuser notch
        const rearApron = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.20, 0.32), blackTrimMat);
        rearApron.position.set(0, 0.44, 2.52);
        carChassis.add(rearApron);`;

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

const updatedContent = content.substring(0, startIndex) + replacementCode + content.substring(endIndex);

fs.writeFileSync(indexPath, updatedContent, 'utf8');
console.log("Successfully refined car exterior in index.html!");
