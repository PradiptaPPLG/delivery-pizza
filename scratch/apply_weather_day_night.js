const fs = require('fs');

let html = fs.readFileSync('c:/Projects/delivery-pizza/index.html', 'utf8');

// ============================================================================
// 1. ADD WEATHER & TIME HUD WIDGET INTO HTML (TOP RIGHT / CENTER)
// ============================================================================
const oldTopHudRight = `        <!-- Right: Testing Tools & Camera Controls (Clean, minimal, no bulky container box) -->
        <div class="flex items-center justify-end gap-2 pointer-events-auto">
            <div class="flex flex-wrap items-center gap-2 text-xs bg-transparent border-0 shadow-none">
                <div class="flex items-center gap-1.5">
                    <label class="text-[11px] text-amber-200/90 font-bold block drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">Target:</label>
                    <select id="next-house-select" onchange="this.blur()" class="bg-black/55 hover:bg-black/80 backdrop-blur-sm text-white font-bold text-xs rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none shadow">
                        <option value="AUTO">Otomatis (Mulai C1, lalu Acak)</option>`;

const newTopHudRight = `        <!-- Right: Testing Tools, Camera Controls & Weather/Day-Night Widget -->
        <div class="flex flex-col items-end gap-2 pointer-events-auto">
            <!-- Weather & 10-Minute Day/Night HUD Widget -->
            <div class="hud-glass rounded-2xl px-3.5 py-2 flex flex-wrap items-center gap-2.5 shadow-lg border border-white/15">
                <!-- Clock & Status Pill -->
                <div class="flex items-center gap-2 pr-2 border-r border-white/15">
                    <span id="weather-clock-icon" class="text-base animate-pulse">☀️</span>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span id="weather-clock-text" class="font-display text-sm font-black text-amber-300 tracking-wider">12:00</span>
                            <span id="weather-period-badge" class="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">SIANG</span>
                        </div>
                        <div id="weather-condition-text" class="text-[10px] font-bold text-white/80 leading-tight">Cerah Berawan</div>
                    </div>
                </div>

                <!-- Fast Preset Buttons (Quick Preview for User) -->
                <div class="flex items-center gap-1">
                    <button id="btn-weather-day" onclick="setWeatherPreset('DAY'); this.blur();" title="Set Siang Hari (12:00)" class="px-2 py-1 rounded-lg bg-white/10 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold transition flex items-center gap-1">
                        ☀️ Siang
                    </button>
                    <button id="btn-weather-sunset" onclick="setWeatherPreset('SUNSET'); this.blur();" title="Set Senja / Sunset (18:00)" class="px-2 py-1 rounded-lg bg-white/10 hover:bg-orange-500/30 text-orange-300 text-[11px] font-bold transition flex items-center gap-1">
                        🌅 Senja
                    </button>
                    <button id="btn-weather-night" onclick="setWeatherPreset('NIGHT'); this.blur();" title="Set Malam Berbintang (00:00)" class="px-2 py-1 rounded-lg bg-white/10 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold transition flex items-center gap-1">
                        🌙 Malam
                    </button>
                    <button id="btn-weather-rain" onclick="toggleRainWeather(); this.blur();" title="Toggle Cuaca Hujan / Badai" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-200 text-[11px] font-bold transition flex items-center gap-1 border border-sky-400/30">
                        🌧️ <span id="btn-rain-label">Hujan</span>
                    </button>
                    <button id="btn-time-speed" onclick="toggleTimeSpeed(); this.blur();" title="Percepat Siklus Waktu (10 Menit vs 1 Menit)" class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-[11px] font-bold transition">
                        ⏩ <span id="speed-multiplier-label">1x</span>
                    </button>
                    <button id="btn-car-lights" onclick="toggleCarHeadlights(); this.blur();" title="Lampu Depan Mobil" class="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/40 text-amber-200 text-[11px] font-bold transition">
                        💡 <span id="headlights-label">Auto</span>
                    </button>
                </div>
            </div>

            <!-- Existing Testing Tools (Target House & Reset) -->
            <div class="flex flex-wrap items-center gap-2 text-xs bg-transparent border-0 shadow-none">
                <div class="flex items-center gap-1.5">
                    <label class="text-[11px] text-amber-200/90 font-bold block drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">Target:</label>
                    <select id="next-house-select" onchange="this.blur()" class="bg-black/55 hover:bg-black/80 backdrop-blur-sm text-white font-bold text-xs rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none shadow">
                        <option value="AUTO">Otomatis (Mulai C1, lalu Acak)</option>`;

if (!html.includes(oldTopHudRight)) {
    console.error("oldTopHudRight not found!");
    process.exit(1);
}
html = html.replace(oldTopHudRight, newTopHudRight);

// ============================================================================
// 2. REPLACE STATIC createSunsetSky WITH DYNAMIC 3D PROCEDURAL SKY SHADER &
//    DYNAMIC SUN, MOON, STARS & LIGHTING SYSTEM
// ============================================================================
const oldSkyAndSunSection = `        // Sunset Sky Dome (Warm Roblox Autumn Sunset Palette)
        function createSunsetSky() {
            const skyCanvas = document.createElement('canvas');
            skyCanvas.width = 512;
            skyCanvas.height = 512;
            const ctx = skyCanvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, 512);
            grad.addColorStop(0.0, '#3b1f16');
            grad.addColorStop(0.28, '#8c4627');
            grad.addColorStop(0.48, '#cc6f3d');
            grad.addColorStop(0.66, '#eb985b');
            grad.addColorStop(0.82, '#f5b57f');
            grad.addColorStop(1.0, '#b56135');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);

            // Soft sunset clouds matching reference sky
            ctx.fillStyle = 'rgba(255, 220, 185, 0.22)';
            for (let i = 0; i < 80; i++) {
                const x = Math.random() * 512;
                const y = 60 + Math.random() * 200;
                const w = 35 + Math.random() * 115;
                const h = 6 + Math.random() * 18;
                ctx.beginPath();
                ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            const skyTex = new THREE.CanvasTexture(skyCanvas);
            const skyGeo = new THREE.SphereGeometry(1100, 32, 24);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false });
            const skyMesh = new THREE.Mesh(skyGeo, skyMat);
            scene.add(skyMesh);
        }
        createSunsetSky();

        // Balanced Golden Hour Lighting (Rich contrast, no overexposure)
        const hemiLight = new THREE.HemisphereLight(0xffcf9e, 0x3d2214, 0.62);
        scene.add(hemiLight);

        const sunPosition = new THREE.Vector3(-190, 95, -150);
        const dirLight = new THREE.DirectionalLight(0xffaa5c, 0.92);
        dirLight.position.copy(sunPosition);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 10;
        dirLight.shadow.camera.far = 480;
        const d = 185;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.bias = -0.0005;
        scene.add(dirLight);

        // Distant Sunset Sun Orb in the Sky Horizon
        const sunGroup = new THREE.Group();
        scene.add(sunGroup);

        const sunGlowTex = createSunGlowTexture();
        const sunSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: sunGlowTex,
                color: 0xffbe73,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                fog: false
            })
        );
        sunSprite.position.copy(sunPosition.clone().multiplyScalar(1.8));
        sunSprite.scale.set(110, 110, 1);
        sunGroup.add(sunSprite);

        // Subtle Distant Horizon Sunbeams (Kept far away from camera so it never blinds the screen)
        const godRaysGroup = new THREE.Group();
        scene.add(godRaysGroup);
        const godRayMeshes = [];

        const rayMat = new THREE.MeshBasicMaterial({
            color: 0xffae63,
            transparent: true,
            opacity: 0.022,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false
        });

        for (let i = 0; i < 6; i++) {
            const rayGeo = new THREE.CylinderGeometry(1.5, 9, 180, 12, 1, true);
            const rayMesh = new THREE.Mesh(rayGeo, rayMat.clone());

            const targetPt = new THREE.Vector3(-120 + i * 28, 0, -145 + (i % 2) * 15);
            const midPt = new THREE.Vector3().addVectors(sunPosition, targetPt).multiplyScalar(0.5);
            rayMesh.position.copy(midPt);
            rayMesh.lookAt(sunPosition);
            rayMesh.rotateX(Math.PI / 2);

            godRaysGroup.add(rayMesh);
            godRayMeshes.push({
                mesh: rayMesh,
                baseOpacity: 0.018 + Math.random() * 0.012,
                phase: Math.random() * Math.PI * 2
            });
        }`;

const newSkyAndSunSection = `        // ====================================================================
        // DYNAMIC 3D PROCEDURAL SKY DOME SHADER (BUKAN FOTO / CANVAS STATIS)
        // Menampilkan siklus siang, senja, malam berbintang, dan cuaca hujan!
        // ====================================================================
        const skyVertexShader = \`
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPos.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        \`;

        const skyFragmentShader = \`
            uniform vec3 uSunPosition;
            uniform vec3 uMoonPosition;
            uniform float uTimeOfDay; // 0.0 to 1.0 (0=dawn, 0.25=noon, 0.5=sunset, 0.75=midnight)
            uniform float uRainIntensity; // 0.0 to 1.0
            uniform float uTime; // elapsed time in seconds

            varying vec3 vWorldPosition;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            float fbm(vec2 p) {
                float v = 0.0;
                v += 0.500 * noise(p); p *= 2.02;
                v += 0.250 * noise(p); p *= 2.03;
                v += 0.125 * noise(p); p *= 2.01;
                v += 0.0625 * noise(p);
                return v;
            }

            void main() {
                vec3 dir = normalize(vWorldPosition);
                float y = dir.y;

                vec3 sunDir = normalize(uSunPosition);
                vec3 moonDir = normalize(uMoonPosition);

                float sunDot = max(0.0, dot(dir, sunDir));
                float moonDot = max(0.0, dot(dir, moonDir));
                float sunElev = sunDir.y;

                // Palette definitions
                // 1. Day Palette
                vec3 dayZenith = vec3(0.12, 0.45, 0.82);
                vec3 dayHorizon = vec3(0.68, 0.85, 0.98);

                // 2. Sunset Palette (Warm golden-crimson)
                vec3 sunsetZenith = vec3(0.24, 0.15, 0.38);
                vec3 sunsetHorizon = vec3(0.96, 0.52, 0.18);
                vec3 sunsetGlow = vec3(1.0, 0.72, 0.32);

                // 3. Night Palette (Cosmic indigo/navy)
                vec3 nightZenith = vec3(0.012, 0.022, 0.058);
                vec3 nightHorizon = vec3(0.038, 0.068, 0.14);

                // 4. Rain Storm Palette (Moody slate grey)
                vec3 rainZenith = vec3(0.16, 0.20, 0.25);
                vec3 rainHorizon = vec3(0.28, 0.32, 0.36);

                // Sun Elevation Blending
                float dayFactor = smoothstep(0.02, 0.40, sunElev);
                float sunsetFactor = smoothstep(-0.14, 0.12, sunElev) * (1.0 - dayFactor);
                float nightFactor = smoothstep(0.02, -0.22, sunElev);

                float hFactor = clamp(y * 1.5, 0.0, 1.0);
                vec3 daySky = mix(dayHorizon, dayZenith, hFactor);
                vec3 sunsetSky = mix(sunsetHorizon, sunsetZenith, hFactor) + sunsetGlow * pow(sunDot, 4.0) * 0.45;
                vec3 nightSky = mix(nightHorizon, nightZenith, hFactor);

                vec3 skyColor = daySky * dayFactor + sunsetSky * sunsetFactor + nightSky * nightFactor;

                // Rain Blend
                vec3 rainSky = mix(rainHorizon, rainZenith, hFactor);
                skyColor = mix(skyColor, rainSky, uRainIntensity * 0.88);

                // Starfield at Night
                if (y > 0.02 && nightFactor > 0.08 && uRainIntensity < 0.6) {
                    vec2 starCoord = dir.xz / (y + 0.35) * 170.0;
                    float starHash = hash(floor(starCoord));
                    if (starHash > 0.982) {
                        float twinkle = 0.6 + 0.4 * sin(uTime * 3.5 + starHash * 62.0);
                        float starBright = (starHash - 0.982) / (1.0 - 0.982) * twinkle;
                        vec2 center = fract(starCoord) - 0.5;
                        float starCircle = smoothstep(0.35, 0.0, length(center));
                        skyColor += vec3(0.85, 0.92, 1.0) * starCircle * starBright * nightFactor * (1.0 - uRainIntensity);
                    }
                }

                // Sun Disc & Corona Glow
                if (sunElev > -0.15 && uRainIntensity < 0.85) {
                    float sunSize = smoothstep(0.9985, 0.9998, sunDot);
                    float sunGlow = pow(sunDot, 64.0) * 0.7 + pow(sunDot, 8.0) * 0.25;
                    vec3 sunCol = mix(vec3(1.0, 0.55, 0.2), vec3(1.0, 0.98, 0.9), smoothstep(0.0, 0.3, sunElev));
                    skyColor += (sunCol * sunSize * 2.5 + sunCol * sunGlow * 1.2) * (1.0 - uRainIntensity * 0.75);
                }

                // Moon Disc & Soft Lunar Halo
                if (sunElev < 0.15 && uRainIntensity < 0.8) {
                    float moonSize = smoothstep(0.9975, 0.9992, moonDot);
                    float moonGlow = pow(moonDot, 32.0) * 0.35 + pow(moonDot, 6.0) * 0.15;
                    vec3 moonCol = vec3(0.88, 0.94, 1.0);
                    skyColor += (moonCol * moonSize * 1.8 + moonCol * moonGlow * 0.6) * nightFactor * (1.0 - uRainIntensity);
                }

                // Dynamic Drifting Clouds (Fractal Noise moving with wind)
                if (y > 0.04) {
                    vec2 cloudUV = dir.xz / (y + 0.25) * 1.6 + vec2(uTime * 0.006, uTime * 0.003);
                    float cloudDense = fbm(cloudUV);
                    float coverThreshold = mix(0.53, 0.36, uRainIntensity);
                    float cloudMask = smoothstep(coverThreshold, coverThreshold + 0.22, cloudDense);

                    vec3 cloudDay = vec3(0.95, 0.98, 1.0);
                    vec3 cloudSunset = vec3(1.0, 0.65, 0.45);
                    vec3 cloudNight = vec3(0.08, 0.11, 0.18);
                    vec3 cloudRain = vec3(0.22, 0.25, 0.29);

                    vec3 cloudCol = cloudDay * dayFactor + cloudSunset * sunsetFactor + cloudNight * nightFactor;
                    cloudCol = mix(cloudCol, cloudRain, uRainIntensity * 0.9);

                    skyColor = mix(skyColor, cloudCol, cloudMask * (0.68 + uRainIntensity * 0.28));
                }

                gl_FragColor = vec4(skyColor, 1.0);
            }
        \`;

        const skyUniforms = {
            uSunPosition: { value: new THREE.Vector3(-190, 95, -150) },
            uMoonPosition: { value: new THREE.Vector3(190, -95, 150) },
            uTimeOfDay: { value: 0.42 }, // Start in afternoon / sunset
            uRainIntensity: { value: 0.0 },
            uTime: { value: 0.0 }
        };

        const skyMat = new THREE.ShaderMaterial({
            vertexShader: skyVertexShader,
            fragmentShader: skyFragmentShader,
            uniforms: skyUniforms,
            side: THREE.BackSide,
            depthWrite: false,
            fog: false
        });

        const skyGeo = new THREE.SphereGeometry(1300, 48, 32);
        const skyMesh = new THREE.Mesh(skyGeo, skyMat);
        scene.add(skyMesh);

        // Dynamic Celestial Lights
        const hemiLight = new THREE.HemisphereLight(0xffcf9e, 0x3d2214, 0.65);
        scene.add(hemiLight);

        const sunPosition = new THREE.Vector3(-190, 95, -150);
        const dirLight = new THREE.DirectionalLight(0xffaa5c, 0.92);
        dirLight.position.copy(sunPosition);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 10;
        dirLight.shadow.camera.far = 480;
        const d = 185;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.bias = -0.0005;
        scene.add(dirLight);

        // Distant 3D Sun Sprite & Corona
        const sunGroup = new THREE.Group();
        scene.add(sunGroup);

        const sunGlowTex = createSunGlowTexture();
        const sunSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: sunGlowTex,
                color: 0xffbe73,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                fog: false
            })
        );
        sunSprite.scale.set(120, 120, 1);
        sunGroup.add(sunSprite);

        // Distant 3D Moon Sprite & Corona
        const moonGroup = new THREE.Group();
        scene.add(moonGroup);

        const moonSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: sunGlowTex,
                color: 0xc8ddff,
                transparent: true,
                opacity: 0.70,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                fog: false
            })
        );
        moonSprite.scale.set(90, 90, 1);
        moonGroup.add(moonSprite);

        // Subtle Distant Horizon Sunbeams (God Rays)
        const godRaysGroup = new THREE.Group();
        scene.add(godRaysGroup);
        const godRayMeshes = [];

        const rayMat = new THREE.MeshBasicMaterial({
            color: 0xffae63,
            transparent: true,
            opacity: 0.022,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false
        });

        for (let i = 0; i < 6; i++) {
            const rayGeo = new THREE.CylinderGeometry(1.5, 9, 180, 12, 1, true);
            const rayMesh = new THREE.Mesh(rayGeo, rayMat.clone());

            const targetPt = new THREE.Vector3(-120 + i * 28, 0, -145 + (i % 2) * 15);
            const midPt = new THREE.Vector3().addVectors(sunPosition, targetPt).multiplyScalar(0.5);
            rayMesh.position.copy(midPt);
            rayMesh.lookAt(sunPosition);
            rayMesh.rotateX(Math.PI / 2);

            godRaysGroup.add(rayMesh);
            godRayMeshes.push({
                mesh: rayMesh,
                baseOpacity: 0.018 + Math.random() * 0.012,
                phase: Math.random() * Math.PI * 2
            });
        }`;

if (!html.includes(oldSkyAndSunSection)) {
    console.error("oldSkyAndSunSection not found!");
    process.exit(1);
}
html = html.replace(oldSkyAndSunSection, newSkyAndSunSection);

// ============================================================================
// 3. ADD FALLING RAIN SYSTEM & DYNAMIC CAR HEADLIGHTS & AUDIO AMBIENCE
// ============================================================================
// Search for carGroup.add(carChassis)
const oldCarChassisHook = `        const carChassis = new THREE.Group();
        carGroup.add(carChassis);`;

const newCarChassisWithLights = `        const carChassis = new THREE.Group();
        carGroup.add(carChassis);

        // ====================================================================
        // DYNAMIC HIGH-BEAM HEADLIGHTS & TAILLIGHTS
        // ====================================================================
        const headlightGroup = new THREE.Group();
        carChassis.add(headlightGroup);

        const leftHeadlightSpot = new THREE.SpotLight(0xfff6e6, 0, 95, Math.PI / 5.0, 0.45, 1.2);
        leftHeadlightSpot.position.set(-0.92, 0.72, -2.5);
        leftHeadlightSpot.target.position.set(-0.92, 0.1, -45);
        headlightGroup.add(leftHeadlightSpot);
        headlightGroup.add(leftHeadlightSpot.target);

        const rightHeadlightSpot = new THREE.SpotLight(0xfff6e6, 0, 95, Math.PI / 5.0, 0.45, 1.2);
        rightHeadlightSpot.position.set(0.92, 0.72, -2.5);
        rightHeadlightSpot.target.position.set(0.92, 0.1, -45);
        headlightGroup.add(rightHeadlightSpot);
        headlightGroup.add(rightHeadlightSpot.target);

        // Glowing Headlight Lenses
        const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12);
        lensGeo.rotateX(Math.PI / 2);
        const lensMat = new THREE.MeshBasicMaterial({ color: 0x444444 });
        
        const leftLensMesh = new THREE.Mesh(lensGeo, lensMat);
        leftLensMesh.position.set(-0.92, 0.72, -2.55);
        headlightGroup.add(leftLensMesh);

        const rightLensMesh = new THREE.Mesh(lensGeo, lensMat);
        rightLensMesh.position.set(0.92, 0.72, -2.55);
        headlightGroup.add(rightLensMesh);

        // Rear Taillights
        const tailGeo = new THREE.BoxGeometry(0.42, 0.22, 0.08);
        const tailMat = new THREE.MeshBasicMaterial({ color: 0x660000 });
        const leftTailMesh = new THREE.Mesh(tailGeo, tailMat);
        leftTailMesh.position.set(-0.95, 0.76, 2.75);
        headlightGroup.add(leftTailMesh);

        const rightTailMesh = new THREE.Mesh(tailGeo, tailMat);
        rightTailMesh.position.set(0.95, 0.76, 2.75);
        headlightGroup.add(rightTailMesh);`;

if (!html.includes(oldCarChassisHook)) {
    console.error("oldCarChassisHook not found!");
    process.exit(1);
}
html = html.replace(oldCarChassisHook, newCarChassisWithLights);

// ============================================================================
// 4. ADD DAY/NIGHT & RAIN SYSTEM CONTROLLER BEFORE updateGame
// ============================================================================
const oldBeforeUpdateGame = `        function resolveCircleBoxCollision(pos, radius, box) {`;

const newWeatherAndDayNightController = `        // ====================================================================
        // 10-MINUTE DAY/NIGHT CYCLE & DYNAMIC RAIN WEATHER CONTROLLER
        // 10 menit = 600 detik siklus penuh 24 jam (Fajar -> Siang -> Senja -> Malam)
        // ====================================================================
        const DAY_CYCLE_SECONDS = 600.0; // 10 menit siklus penuh
        let gameTimeOfDay = 0.45; // Mulai di sore / senja keemasan (~17:00)
        let timeSpeedMultiplier = 1.0; // 1.0x (10 menit) atau 10.0x (1 menit cepat)
        let weatherState = 'CLEAR'; // 'CLEAR', 'RAIN'
        let currentRainIntensity = 0.0;
        let targetRainIntensity = 0.0;
        let headlightsMode = 'AUTO'; // 'AUTO', 'ON', 'OFF'
        let lightningFlashTimer = 0;
        let totalGameElapsed = 0;

        // 3D Falling Raindrop Particle System (3,000 Rain Streaks following player)
        const RAIN_COUNT = 3000;
        const rainPositions = new Float32Array(RAIN_COUNT * 6);
        for (let i = 0; i < RAIN_COUNT; i++) {
            const rx = (Math.random() - 0.5) * 160;
            const ry = Math.random() * 75;
            const rz = (Math.random() - 0.5) * 160;
            const b = i * 6;
            rainPositions[b] = rx;
            rainPositions[b + 1] = ry;
            rainPositions[b + 2] = rz;
            rainPositions[b + 3] = rx + 0.15;
            rainPositions[b + 4] = ry - 1.8;
            rainPositions[b + 5] = rz - 0.25;
        }

        const rainGeo = new THREE.BufferGeometry();
        rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
        const rainMat = new THREE.LineBasicMaterial({
            color: 0x9bc8f0,
            transparent: true,
            opacity: 0.0,
            depthWrite: false
        });
        const rainLines = new THREE.LineSegments(rainGeo, rainMat);
        scene.add(rainLines);

        // Procedural Web Audio Ambient Rainfall Generator
        let rainAudioGain = null;
        function initRainAudio() {
            if (rainAudioGain) return;
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const bufferSize = ctx.sampleRate * 2;
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                const whiteNoise = ctx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;

                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(850, ctx.currentTime);

                rainAudioGain = ctx.createGain();
                rainAudioGain.gain.setValueAtTime(0.0001, ctx.currentTime);

                whiteNoise.connect(filter);
                filter.connect(rainAudioGain);
                rainAudioGain.connect(ctx.destination);
                whiteNoise.start();
            } catch (e) {
                // Audio context not yet started by user interaction
            }
        }

        function updateWeatherAndDayNight(dt) {
            totalGameElapsed += dt;

            // 1. Advance in-game time (10 minutes = 1 full day cycle)
            gameTimeOfDay = (gameTimeOfDay + (dt * timeSpeedMultiplier) / DAY_CYCLE_SECONDS) % 1.0;

            // 2. Smoothly transition rain intensity
            currentRainIntensity = THREE.MathUtils.lerp(currentRainIntensity, targetRainIntensity, dt * 1.5);
            rainMat.opacity = currentRainIntensity * 0.55;

            // Update procedural rain sound volume
            if (rainAudioGain) {
                try {
                    const ctx = getAudioContext();
                    const targetVol = currentRainIntensity > 0.05 ? currentRainIntensity * 0.25 : 0.0001;
                    rainAudioGain.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.2);
                } catch (e) {}
            }

            // 3. Move Rain particles with car
            if (currentRainIntensity > 0.01) {
                rainLines.position.set(carPhysics.x, 0, carPhysics.z);
                const posArr = rainGeo.attributes.position.array;
                const fallSpeed = 62.0 * dt;
                const windDriftX = 5.0 * dt;
                const windDriftZ = -8.0 * dt;

                for (let i = 0; i < RAIN_COUNT; i++) {
                    const b = i * 6;
                    posArr[b + 1] -= fallSpeed;
                    posArr[b + 4] -= fallSpeed;
                    posArr[b] += windDriftX;
                    posArr[b + 3] += windDriftX;
                    posArr[b + 2] += windDriftZ;
                    posArr[b + 5] += windDriftZ;

                    if (posArr[b + 1] < 0) {
                        const nx = (Math.random() - 0.5) * 160;
                        const ny = 65 + Math.random() * 15;
                        const nz = (Math.random() - 0.5) * 160;
                        posArr[b] = nx;
                        posArr[b + 1] = ny;
                        posArr[b + 2] = nz;
                        posArr[b + 3] = nx + 0.15;
                        posArr[b + 4] = ny - 1.8;
                        posArr[b + 5] = nz - 0.25;
                    }
                }
                rainGeo.attributes.position.needsUpdate = true;
            }

            // 4. Calculate Sun & Moon Celestial Coordinates
            // 0.0 = 06:00 (Dawn), 0.25 = 12:00 (Noon), 0.5 = 18:00 (Sunset), 0.75 = 00:00 (Midnight)
            const sunAngle = gameTimeOfDay * Math.PI * 2 - Math.PI / 2;
            const orbitDist = 850.0;
            const sunX = Math.cos(sunAngle) * orbitDist;
            const sunY = Math.sin(sunAngle) * orbitDist;
            const sunZ = -Math.cos(sunAngle) * 320.0;

            const moonX = -sunX;
            const moonY = -sunY;
            const moonZ = -sunZ;

            // Center sky dome on camera so player never reaches edge
            skyMesh.position.copy(camera.position);

            // Update sky shader uniforms
            skyUniforms.uSunPosition.value.set(sunX, sunY, sunZ);
            skyUniforms.uMoonPosition.value.set(moonX, moonY, moonZ);
            skyUniforms.uTimeOfDay.value = gameTimeOfDay;
            skyUniforms.uRainIntensity.value = currentRainIntensity;
            skyUniforms.uTime.value = totalGameElapsed;

            // Position 3D Sun Sprite & Moon Sprite
            if (sunY > -80) {
                sunSprite.visible = true;
                sunSprite.position.set(camera.position.x + sunX * 0.85, Math.max(0, camera.position.y + sunY * 0.85), camera.position.z + sunZ * 0.85);
                const sunAlpha = Math.max(0, Math.min(1, (sunY + 40) / 100)) * (1.0 - currentRainIntensity * 0.8);
                sunSprite.material.opacity = sunAlpha * 0.85;
            } else {
                sunSprite.visible = false;
            }

            if (moonY > -80) {
                moonSprite.visible = true;
                moonSprite.position.set(camera.position.x + moonX * 0.85, Math.max(0, camera.position.y + moonY * 0.85), camera.position.z + moonZ * 0.85);
                const moonAlpha = Math.max(0, Math.min(1, (moonY + 40) / 100)) * (1.0 - currentRainIntensity * 0.7);
                moonSprite.material.opacity = moonAlpha * 0.70;
            } else {
                moonSprite.visible = false;
            }

            // 5. Dynamic Lighting & Fog Transition
            const sunElevNorm = Math.sin(sunAngle); // 1 at noon, -1 at midnight
            const isDay = sunElevNorm > 0.05;
            const isSunset = sunElevNorm >= -0.15 && sunElevNorm <= 0.25;

            // Directional Light tracking active celestial body
            if (sunElevNorm > -0.05) {
                dirLight.position.set(carPhysics.x + sunX * 0.5, Math.max(20, sunY * 0.5), carPhysics.z + sunZ * 0.5);
                dirLight.target.position.set(carPhysics.x, 0, carPhysics.z);
                // Golden hour color at low elevation, crisp warm white at high noon
                const warmth = THREE.MathUtils.clamp((0.35 - sunElevNorm) / 0.35, 0, 1);
                dirLight.color.setRGB(
                    1.0,
                    THREE.MathUtils.lerp(0.96, 0.62, warmth),
                    THREE.MathUtils.lerp(0.88, 0.28, warmth)
                );
                dirLight.intensity = Math.max(0.1, Math.min(1.15, (sunElevNorm + 0.1) * 1.35)) * (1.0 - currentRainIntensity * 0.55);
            } else {
                // Moonlight at night
                dirLight.position.set(carPhysics.x + moonX * 0.5, Math.max(20, moonY * 0.5), carPhysics.z + moonZ * 0.5);
                dirLight.target.position.set(carPhysics.x, 0, carPhysics.z);
                dirLight.color.setRGB(0.55, 0.72, 1.0);
                dirLight.intensity = 0.22 * (1.0 - currentRainIntensity * 0.5);
            }

            // Hemisphere Ambient Light
            if (isDay) {
                hemiLight.color.setRGB(
                    THREE.MathUtils.lerp(0.55, 0.95, sunElevNorm),
                    THREE.MathUtils.lerp(0.72, 0.98, sunElevNorm),
                    1.0
                );
                hemiLight.groundColor.setRGB(0.35, 0.25, 0.18);
                hemiLight.intensity = (0.55 + sunElevNorm * 0.25) * (1.0 - currentRainIntensity * 0.4);
            } else if (isSunset) {
                hemiLight.color.setRGB(1.0, 0.55, 0.28);
                hemiLight.groundColor.setRGB(0.28, 0.16, 0.10);
                hemiLight.intensity = 0.50;
            } else {
                // Night
                hemiLight.color.setRGB(0.10, 0.16, 0.28);
                hemiLight.groundColor.setRGB(0.04, 0.06, 0.10);
                hemiLight.intensity = 0.35;
            }

            // Rain modifies hemisphere to gloomy slate
            if (currentRainIntensity > 0.05) {
                hemiLight.color.lerp(new THREE.Color(0x3e4a58), currentRainIntensity * 0.7);
                hemiLight.groundColor.lerp(new THREE.Color(0x181e22), currentRainIntensity * 0.7);
            }

            // Dynamic Fog
            if (currentRainIntensity > 0.2) {
                scene.fog.color.setHex(0x4a5563);
                scene.fog.density = THREE.MathUtils.lerp(0.0011, 0.0024, currentRainIntensity);
            } else if (sunElevNorm < -0.1) {
                scene.fog.color.setHex(0x0c1424);
                scene.fog.density = 0.0013;
            } else if (isSunset) {
                scene.fog.color.setHex(0xe2925e);
                scene.fog.density = 0.0011;
            } else {
                scene.fog.color.setHex(0xa8cce6);
                scene.fog.density = 0.0010;
            }

            // Wet Asphalt Road Glistening Reflection
            if (typeof asphaltMat !== 'undefined') {
                asphaltMat.roughness = THREE.MathUtils.lerp(0.82, 0.22, currentRainIntensity);
                asphaltMat.metalness = THREE.MathUtils.lerp(0.05, 0.26, currentRainIntensity);
            }

            // 6. Car Headlights & Taillights
            const shouldHeadlightsBeOn = (headlightsMode === 'ON') || (headlightsMode === 'AUTO' && (sunElevNorm < 0.12 || currentRainIntensity > 0.45));
            const targetLightIntensity = shouldHeadlightsBeOn ? 2.8 : 0.0;
            leftHeadlightSpot.intensity = THREE.MathUtils.lerp(leftHeadlightSpot.intensity, targetLightIntensity, dt * 5.0);
            rightHeadlightSpot.intensity = THREE.MathUtils.lerp(rightHeadlightSpot.intensity, targetLightIntensity, dt * 5.0);

            if (shouldHeadlightsBeOn) {
                lensMat.color.setHex(0xfffae0);
                tailMat.color.setHex(keys.down || keys.brake ? 0xff0000 : 0xaa1111);
            } else {
                lensMat.color.setHex(0x444444);
                tailMat.color.setHex(keys.down || keys.brake ? 0xff0000 : 0x440000);
            }

            // 7. Thunder & Lightning Flash during Rain
            if (currentRainIntensity > 0.4) {
                lightningFlashTimer += dt;
                if (lightningFlashTimer > 18.0 + Math.random() * 12.0) {
                    lightningFlashTimer = 0;
                    // Trigger double-flash lightning
                    hemiLight.color.setHex(0xd0e8ff);
                    hemiLight.intensity = 2.4;
                    setTimeout(() => {
                        hemiLight.intensity = 0.6;
                        setTimeout(() => {
                            hemiLight.intensity = 2.0;
                            setTimeout(() => {
                                hemiLight.intensity = 0.4;
                            }, 70);
                        }, 80);
                    }, 60);
                }
            }

            // 8. Update HUD Weather Pill
            updateWeatherHUD(sunElevNorm);
        }

        function updateWeatherHUD(sunElevNorm) {
            const clockTextEl = document.getElementById('weather-clock-text');
            const clockIconEl = document.getElementById('weather-clock-icon');
            const periodBadgeEl = document.getElementById('weather-period-badge');
            const conditionEl = document.getElementById('weather-condition-text');
            if (!clockTextEl) return;

            // In-game 24h clock calculation
            const totalMins = gameTimeOfDay * 24 * 60;
            const hours = Math.floor(totalMins / 60) % 24;
            const mins = Math.floor(totalMins % 60);
            const hStr = (hours < 10 ? '0' : '') + hours;
            const mStr = (mins < 10 ? '0' : '') + mins;
            clockTextEl.textContent = \`\${hStr}:\${mStr}\`;

            // State Badges
            let period = 'SIANG';
            let icon = '☀️';
            let badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-400/30';
            let condition = currentRainIntensity > 0.3 ? 'Hujan Deras 🌧️' : 'Cerah Berawan';

            if (sunElevNorm < -0.15) {
                period = 'MALAM';
                icon = '🌙';
                badgeClass = 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30';
                condition = currentRainIntensity > 0.3 ? 'Hujan Malam 🌧️' : 'Malam Berbintang';
            } else if (sunElevNorm >= -0.15 && sunElevNorm < 0.15) {
                if (gameTimeOfDay > 0.5) {
                    period = 'SENJA';
                    icon = '🌅';
                    badgeClass = 'bg-orange-500/20 text-orange-300 border-orange-400/30';
                    condition = currentRainIntensity > 0.3 ? 'Hujan Sore 🌧️' : 'Senja Keemasan';
                } else {
                    period = 'FAJAR';
                    icon = '🌄';
                    badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-400/30';
                    condition = currentRainIntensity > 0.3 ? 'Hujan Pagi 🌧️' : 'Fajar Menyingsing';
                }
            }

            clockIconEl.textContent = icon;
            periodBadgeEl.textContent = period;
            periodBadgeEl.className = \`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border \${badgeClass}\`;
            conditionEl.textContent = condition;
        }

        // Global User Controls for Weather & Time
        window.setWeatherPreset = function(preset) {
            initRainAudio();
            if (preset === 'DAY') {
                gameTimeOfDay = 0.25; // 12:00
                targetRainIntensity = 0.0;
                weatherState = 'CLEAR';
                showToast('☀️ SIANG TERIK (12:00)', 'Langit biru cerah dengan awan bergerak dinamis!', 'info');
            } else if (preset === 'SUNSET') {
                gameTimeOfDay = 0.50; // 18:00
                targetRainIntensity = 0.0;
                weatherState = 'CLEAR';
                showToast('🌅 SENJA KEEMASAN (18:00)', 'Matahari terbenam dengan warna langit senja yang hangat!', 'warning');
            } else if (preset === 'NIGHT') {
                gameTimeOfDay = 0.75; // 00:00
                targetRainIntensity = 0.0;
                weatherState = 'CLEAR';
                showToast('🌙 MALAM BERBINTANG (00:00)', 'Bulan perak bersinar dengan ribuan bintang berkedip!', 'info');
            }
            document.getElementById('btn-rain-label').textContent = 'Hujan';
        };

        window.toggleRainWeather = function() {
            initRainAudio();
            if (targetRainIntensity < 0.5) {
                targetRainIntensity = 1.0;
                weatherState = 'RAIN';
                document.getElementById('btn-rain-label').textContent = 'Reda';
                showToast('🌧️ CUACA HUJAN AKTIF', 'Aspal menjadi basah berkilau & tetesan hujan membasahi dunia!', 'info');
            } else {
                targetRainIntensity = 0.0;
                weatherState = 'CLEAR';
                document.getElementById('btn-rain-label').textContent = 'Hujan';
                showToast('🌤️ HUJAN REDA', 'Langit berangsur cerah kembali!', 'success');
            }
        };

        window.toggleTimeSpeed = function() {
            if (timeSpeedMultiplier === 1.0) {
                timeSpeedMultiplier = 10.0; // 10x fast forward (1 menit siklus penuh!)
                document.getElementById('speed-multiplier-label').textContent = '10x';
                showToast('⏩ SIKLUS DIPERCEPAT (10x)', 'Pergantian siang & malam berjalan cepat (1 menit/hari)!', 'warning');
            } else {
                timeSpeedMultiplier = 1.0; // 1x normal (10 menit siklus penuh)
                document.getElementById('speed-multiplier-label').textContent = '1x';
                showToast('⏱️ SIKLUS NORMAL (1x)', 'Pergantian siang & malam normal (10 menit per siklus)!', 'info');
            }
        };

        window.toggleCarHeadlights = function() {
            if (headlightsMode === 'AUTO') {
                headlightsMode = 'ON';
                document.getElementById('headlights-label').textContent = 'ON';
                showToast('💡 LAMPU DEPAN: ON', 'Lampu sorot mobil menyala terang!', 'info');
            } else if (headlightsMode === 'ON') {
                headlightsMode = 'OFF';
                document.getElementById('headlights-label').textContent = 'OFF';
                showToast('💡 LAMPU DEPAN: OFF', 'Lampu mobil dimatikan.', 'info');
            } else {
                headlightsMode = 'AUTO';
                document.getElementById('headlights-label').textContent = 'Auto';
                showToast('💡 LAMPU DEPAN: OTOMATIS', 'Lampu akan menyala sendiri saat senja/malam atau hujan.', 'info');
            }
        };

        // Hotkey L for headlights toggle
        window.addEventListener('keydown', (e) => {
            if (e.key === 'l' || e.key === 'L') {
                toggleCarHeadlights();
            }
        });

        function resolveCircleBoxCollision(pos, radius, box) {`;

if (!html.includes(oldBeforeUpdateGame)) {
    console.error("oldBeforeUpdateGame not found!");
    process.exit(1);
}
html = html.replace(oldBeforeUpdateGame, newWeatherAndDayNightController);

// ============================================================================
// 5. CALL updateWeatherAndDayNight(dt) INSIDE updateGame(dt)
// ============================================================================
const oldUpdateGameStart = `        function updateGame(dt) {
            // Update visual key indicators in bottom-right HUD`;

const newUpdateGameStart = `        function updateGame(dt) {
            // Update 10-Minute Day/Night Cycle, Procedural Sky Shader, Rain & Headlights
            updateWeatherAndDayNight(dt);

            // Update visual key indicators in bottom-right HUD`;

if (!html.includes(oldUpdateGameStart)) {
    console.error("oldUpdateGameStart not found!");
    process.exit(1);
}
html = html.replace(oldUpdateGameStart, newUpdateGameStart);

fs.writeFileSync('c:/Projects/delivery-pizza/index.html', html, 'utf8');
console.log("Successfully integrated 10-Minute Day/Night Cycle, Dynamic Procedural Sky Shader, and Rain Weather System!");
