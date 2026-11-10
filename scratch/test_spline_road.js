// scratch/test_spline_road.js
// Verify spline mathematics for continuous smooth road ribbon
console.log("Testing smooth spline road generation...");

const roadWaypoints = [
    [-420, 0],    // Factory spawn & forecourt
    [-360, 0],    // Exit factory straight
    [-310, 12],   // Sweeping curve towards bridge
    [-265, 30],   // West bridge entry
    [-210, 30],   // East bridge exit (Bridge spans -265 to -210 at Z = 30)
    [-160, 20],   // Curve off bridge into canyon
    [-120, -5],   // Canyon approach
    [-85, -25],   // West tunnel portal entry
    [-30, -25],   // East tunnel portal exit (Tunnel spans -85 to -30 at Z = -25)
    [5, -15],     // Post-tunnel exit
    [35, 10],     // S-curve around Tebing 2
    [75, 25],     // Straightening towards railway
    [110, 25],    // Railroad level crossing (Railroad at X = 110)
    [160, 22],    // Highway along south border of Cornfield
    [230, 16],    // Highway along south border of Cornfield
    [290, 8],     // Approaching housing entrance
    [345, 0]      // Residential Avenue 1 connection
];

console.log("Total road waypoints:", roadWaypoints.length);
