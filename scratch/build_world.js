// scratch/build_world.js - Testing world generation logic and coordinates
console.log("Generating world layout...");

const waypoints = [
    [-410, 0],   // Factory parking
    [-350, 0],   // Factory exit straight
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

console.log("Waypoints count:", waypoints.length);
let dist = 0;
for (let i = 0; i < waypoints.length - 1; i++) {
    const d = Math.hypot(waypoints[i+1][0] - waypoints[i][0], waypoints[i+1][1] - waypoints[i][1]);
    dist += d;
}
console.log("Total route length:", dist.toFixed(1), "meters");
