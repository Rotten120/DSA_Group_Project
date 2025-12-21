/**
 * TRACKIT - RAILWAY ROUTING LOGIC (OPTIMIZED)
 * Logic: Graph-Based Breadth-First Search (BFS)
 */

// ==========================================
// 1. DOM ELEMENTS
// ==========================================
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const refreshBtn = document.querySelector('.refresh-btn');
const backButton = document.getElementById('backButton');
const originalView = document.querySelector('.original-view');
const newView = document.querySelector('.new-view');
const selectionModeText = document.getElementById('selectionMode');
const searchInput = document.getElementById('searchInput');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const stations = document.querySelectorAll('.station');
const selectedJourneyView = document.getElementById('selectedJourneyView');
const selectedBackBtn = document.getElementById('selectedBackBtn');
const journeyExpandable = document.getElementById('journeyExpandable');
const expandableDetails = document.getElementById('expandableDetails');

// State Variables
let currentMode = ''; 
let currentRouteData = null;
let userCurrentStation = null;

// Filter out intersection-1 from clickable stations
const clickableStations = Array.from(stations).filter(station => 
    station.getAttribute('data-station') !== 'intersection-1'
);

// ==========================================
// 2. DATA: STATIONS & LINES
// ==========================================

const trainLines = {
    'LRT-1': ['Baclaran', 'EDSA', 'Libertad', 'Gil Puyat', 'Vito Cruz', 'Quirino Ave.', 'Pedro Gil', 'United Nations', 'Central Terminal', 'Carriedo', 'Doroteo Jose', 'Bambang', 'Tayuman', 'Blumentritt', 'Abad Santos', 'R. Papa', '5th Ave.', 'Monumento', 'Malvar', 'Balintawak', 'Roosevelt', 'North Ave. LRT-1'],
    'MRT-3': ['North Ave. MRT-3', 'Quezon Ave.', 'Kamuning', 'Araneta Center-Cubao MRT-3', 'Santolan MRT-3', 'intersection-1','Ortigas', 'Shaw Blvd.', 'Boni', 'Guadalupe', 'Buendia', 'Ayala', 'Magallanes', 'Taft'],
    'LRT-2': ['Recto', 'Legarda', 'Pureza', 'V. Mapa', 'J. Ruiz', 'Gilmore', 'Betty Go-Belmonte', 'Araneta Center-Cubao LRT-2', 'Anonas', 'Katipunan', 'Santolan LRT-2']
};

// Connecting Stations (Edges between lines)
const transferHubs = [
    { lineA: 'LRT-1', stationA: 'Doroteo Jose', lineB: 'LRT-2', stationB: 'Recto' },
    { lineA: 'LRT-2', stationA: 'Araneta Center-Cubao LRT-2', lineB: 'MRT-3', stationB: 'Araneta Center-Cubao MRT-3' },
    { lineA: 'LRT-1', stationA: 'EDSA', lineB: 'MRT-3', stationB: 'Taft' },
    { lineA: 'LRT-1', stationA: 'North Ave. LRT-1', lineB: 'MRT-3', stationB: 'North Ave. MRT-3' }
];

// ==========================================
// 3. GRAPH & ALGORITHM (THE FIX)
// ==========================================

// Helper: Find which line a station belongs to
function findStationLine(stationName) {
    for (const [lineName, stations] of Object.entries(trainLines)) {
        if (stations.includes(stationName)) return lineName;
    }
    return null;
}

// 1. Build Adjacency Graph
// This turns the lists of stations into a connected web
function buildGraph() {
    const graph = {};

    // Add intra-line connections (Neighboring stations)
    for (const [line, stations] of Object.entries(trainLines)) {
        for (let i = 0; i < stations.length; i++) {
            const current = stations[i];
            if (!graph[current]) graph[current] = [];

            // Connect to Previous
            if (i > 0) graph[current].push(stations[i - 1]);
            // Connect to Next
            if (i < stations.length - 1) graph[current].push(stations[i + 1]);
        }
    }

    // Add inter-line connections (Transfer Hubs)
    transferHubs.forEach(hub => {
        if (!graph[hub.stationA]) graph[hub.stationA] = [];
        if (!graph[hub.stationB]) graph[hub.stationB] = [];
        
        // Link them bidirectionally
        graph[hub.stationA].push(hub.stationB);
        graph[hub.stationB].push(hub.stationA);
    });

    return graph;
}

// 2. Breadth-First Search (BFS)
// Finds the path with the fewest number of "hops" (stops + transfers)
function findRoute(origin, destination) {
    if (origin === destination) return null;

    const graph = buildGraph();
    let queue = [[origin]]; // Queue of paths
    let visited = new Set();
    visited.add(origin);

    while (queue.length > 0) {
        let path = queue.shift(); // Dequeue the first path
        let currentStation = path[path.length - 1];

        // Did we reach the destination?
        if (currentStation === destination) {
            return formatRouteResult(path);
        }

        // Check neighbors
        if (graph[currentStation]) {
            for (let neighbor of graph[currentStation]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    // Create new path extending to this neighbor
                    let newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }
    }

    // Fallback if no route found
    return {
        time: 'N/A', cost: 0, line: 'No Route',
        route: 'No connecting route found',
        stations: [origin, destination]
    };
}

// 3. Formatter
// Takes the raw list of stations from BFS and calculates price/time
function formatRouteResult(stationPath) {
    const origin = stationPath[0];
    const destination = stationPath[stationPath.length - 1];
    const originLine = findStationLine(origin);
    
    // Calculate Stats
    // Note: We subtract 1 because N stations = N-1 travel segments
    const totalStops = stationPath.length - 1; 

    // Detect transfers
    let distinctLines = new Set();
    let transferCount = 0;
    
    // Simple logic to count how many unique lines we touched
    // This isn't perfect for "common stations" but works for display
    stationPath.forEach((st, index) => {
        const line = findStationLine(st);
        if (line) distinctLines.add(line);
        
        // Check if we switched lines between this station and the last
        if (index > 0) {
            const prevLine = findStationLine(stationPath[index-1]);
            if (prevLine && line && prevLine !== line) {
                transferCount++;
            }
        }
    });

    const isMultiLine = distinctLines.size > 1;

    // Pricing Model (Example: Base 15 + 3 per stop + 5 per transfer)
    const estimatedCost = 15 + (totalStops * 2) + (transferCount * 5);
    
    // Time Model (3 mins per stop + 10 mins buffer per transfer)
    const minTime = (totalStops * 3) + (transferCount * 5);
    const maxTime = (totalStops * 4) + (transferCount * 10);

    // Route Description
    let routeDesc = '';
    if (isMultiLine) {
        routeDesc = `Via ${Array.from(distinctLines).join(' > ')}`;
    } else {
        routeDesc = `${originLine} Direct`;
    }

    return {
        time: `${minTime} - ${maxTime}`,
        cost: estimatedCost,
        line: isMultiLine ? 'Multi-Line Journey' : originLine,
        route: routeDesc,
        getOn: origin,
        getOff: destination,
        stations: stationPath // Used for map drawing
    };
}

// ==========================================
// 4. MAP & GEOLOCATION UTILS
// ==========================================

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function findNearestStation(lat, lng) {
    let nearest = null, minDst = Infinity;
    for (const [stn, crd] of Object.entries(stationCoordinates)) {
        const dst = calculateDistance(lat, lng, crd.lat, crd.lng);
        if (dst < minDst) { minDst = dst; nearest = stn; }
    }
    return nearest;
}

// ==========================================
// 5. UI INTERACTION
// ==========================================

function displayRoute() {
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();

    if (!origin || !destination) {
        document.querySelector('.illustration-section').style.display = 'flex';
        document.getElementById('routeInfo').classList.remove('active');
        selectedJourneyView.classList.remove('active');
        clearRouteOnMap();
        return;
    }

    document.querySelector('.illustration-section').style.display = 'none';
    document.getElementById('routeInfo').classList.add('active');
    selectedJourneyView.classList.remove('active');

    // Run the new BFS Algorithm
    const routeData = findRoute(origin, destination);
    currentRouteData = routeData;

    // Populate UI
    document.getElementById('lineName').textContent = routeData.line;
    document.getElementById('journeyPrice').textContent = `P ${routeData.cost}.00`;
    document.getElementById('journeyDuration').textContent = `${routeData.time} mins`;

    document.getElementById('expandLineName').textContent = routeData.line;
    document.getElementById('expandPrice').textContent = `P ${routeData.cost}.00`;
    document.getElementById('expandDuration').textContent = `${routeData.time} mins`;
    document.getElementById('routeDetail').textContent = routeData.route;
    document.getElementById('getOnDetail').textContent = routeData.getOn;
    document.getElementById('getOffDetail').textContent = routeData.getOff;

    highlightRouteOnMap(routeData.stations);
}

// View Handling
function switchView(mode) {
    currentMode = mode;
    selectionModeText.textContent = mode === 'origin' ? 'Select Origin' : 'Select Destination';
    originalView.classList.add('hidden');
    newView.classList.add('active');
    searchInput.focus();
}

originInput.addEventListener('click', () => switchView('origin'));
destinationInput.addEventListener('click', () => switchView('destination'));

function selectStation(stationName) {
    if (currentMode === 'origin') originInput.value = stationName;
    else if (currentMode === 'destination') destinationInput.value = stationName;
    
    originalView.classList.remove('hidden');
    newView.classList.remove('active');
    searchInput.value = '';
    currentMode = '';
    displayRoute();
}

// Station Click Handlers
clickableStations.forEach(station => {
    station.addEventListener('click', () => {
        const stationName = station.getAttribute('data-station');
        if (currentMode) selectStation(stationName);
    });
});

// Search Logic
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    clickableStations.forEach(station => {
        const stationName = station.getAttribute('data-station').toLowerCase();
        if (!searchTerm || stationName.includes(searchTerm)) {
            station.style.opacity = '1';
            station.style.pointerEvents = 'auto';
            if (searchTerm) station.style.transform = 'scale(1.2)';
            else station.style.transform = 'scale(1)';
        } else {
            station.style.opacity = '0.2';
            station.style.pointerEvents = 'none';
            station.style.transform = 'scale(1)';
        }
    });
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return;
        
        let match = Array.from(clickableStations).find(s => s.getAttribute('data-station').toLowerCase() === searchTerm);
        if (!match) match = Array.from(clickableStations).find(s => s.getAttribute('data-station').toLowerCase().includes(searchTerm));
        
        if (match) selectStation(match.getAttribute('data-station'));
        else alert(`No station found matching "${searchTerm}"`);
    }
});

// Reset Logic
refreshBtn.addEventListener('click', () => {
    originInput.value = '';
    destinationInput.value = '';
    originalView.classList.remove('hidden');
    newView.classList.remove('active');
    searchInput.value = '';
    currentMode = '';
    document.querySelector('.illustration-section').style.display = 'flex';
    document.getElementById('routeInfo').classList.remove('active');
    selectedJourneyView.classList.remove('active');
    clearRouteOnMap();
});

backButton.addEventListener('click', () => {
    originalView.classList.remove('hidden');
    newView.classList.remove('active');
    searchInput.value = '';
    currentMode = '';
});

// Expandable Logic
journeyExpandable.addEventListener('click', () => {
    if (expandableDetails.classList.contains('visible')) {
        journeyExpandable.classList.add('selected');
        showSelectedJourney();
    } else {
        expandableDetails.classList.toggle('visible');
    }
});

function showSelectedJourney() {
    if (!currentRouteData) return;
    document.getElementById('routeInfo').classList.remove('active');
    selectedJourneyView.classList.add('active');
    
    document.getElementById('selectedLineName').textContent = currentRouteData.line;
    document.getElementById('selectedPrice').textContent = `P ${currentRouteData.cost}.00`;
    document.getElementById('selectedDuration').textContent = `${currentRouteData.time} mins`;
    document.getElementById('selectedExpandLineName').textContent = currentRouteData.line;
    document.getElementById('selectedExpandPrice').textContent = `P ${currentRouteData.cost}.00`;
    document.getElementById('selectedExpandDuration').textContent = `${currentRouteData.time} mins`;
    document.getElementById('selectedRouteDetail').textContent = currentRouteData.route;
    document.getElementById('selectedGetOnDetail').textContent = currentRouteData.getOn;
    document.getElementById('selectedGetOffDetail').textContent = currentRouteData.getOff;
}

selectedBackBtn.addEventListener('click', () => {
    selectedJourneyView.classList.remove('active');
    document.getElementById('routeInfo').classList.add('active');
    journeyExpandable.classList.remove('selected');
});

// Geolocation
function getUserLocation() {
    const locName = document.querySelector('.location-name');
    const locAddr = document.querySelector('.location-address');
    locName.textContent = 'Detecting location...';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const nearest = findNearestStation(position.coords.latitude, position.coords.longitude);
            userCurrentStation = nearest;
            locName.textContent = nearest || 'Unknown';
            locAddr.textContent = nearest ? 'Your nearest station' : 'Out of range';
        }, () => {
            locName.textContent = 'Location unavailable';
            locAddr.textContent = 'Please select manually';
        });
    } else {
        locName.textContent = 'Not supported';
    }
}
getUserLocation();

currentLocationBtn.addEventListener('click', () => {
    if (currentMode && userCurrentStation) selectStation(userCurrentStation);
    else if (currentMode) alert('Location not available.');
});

// ==========================================
// 6. MAP VISUALIZATION
// ==========================================

function highlightRouteOnMap(stationNames) {
    clearRouteOnMap();
    const routeStations = [];
    
    // Convert names back to DOM elements
    stationNames.forEach(name => {
        stations.forEach(stn => {
            if (stn.getAttribute('data-station') === name && !routeStations.includes(stn)) {
                stn.classList.add('on-route');
                routeStations.push(stn);
            }
        });
    });

    if (routeStations.length > 0) {
        const startBadge = document.createElement('div');
        startBadge.className = 'station-badge start';
        startBadge.textContent = 'Start';
        routeStations[0].appendChild(startBadge);

        const endBadge = document.createElement('div');
        endBadge.className = 'station-badge end';
        endBadge.textContent = 'End';
        routeStations[routeStations.length - 1].appendChild(endBadge);
    }
    drawRouteLines(routeStations);
}

function drawRouteLines(routeStations) {
    const mapOverlay = document.querySelector('.map-overlay');
    
    for (let i = 0; i < routeStations.length - 1; i++) {
        const st1 = routeStations[i];
        const st2 = routeStations[i + 1];
        
        // Skip drawing if station names are the same (e.g. self-transfer logic in same hub)
        if(st1 === st2) continue; 

        const r1 = st1.getBoundingClientRect();
        const r2 = st2.getBoundingClientRect();
        const mapR = mapOverlay.getBoundingClientRect();
        
        const x1 = r1.left + r1.width / 2 - mapR.left;
        const y1 = r1.top + r1.height / 2 - mapR.top;
        const x2 = r2.left + r2.width / 2 - mapR.left;
        const y2 = r2.top + r2.height / 2 - mapR.top;
        
        const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        
        const line = document.createElement('div');
        line.className = 'route-connector';
        line.style.width = dist + 'px';
        line.style.height = '5px';
        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 50%';
        
        mapOverlay.appendChild(line);
    }
}

function clearRouteOnMap() {
    stations.forEach(stn => {
        stn.classList.remove('on-route');
        stn.querySelectorAll('.station-badge').forEach(b => b.remove());
    });
    document.querySelectorAll('.route-connector').forEach(c => c.remove());
}