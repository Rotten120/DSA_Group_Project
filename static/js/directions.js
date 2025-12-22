/**
 * TRACKIT - RAILWAY ROUTING LOGIC (FIXED)
 * Logic: Graph-Based Breadth-First Search (BFS)
 */

// ==========================================
// 1. DOM ELEMENTS
// ==========================================
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const swapBtn = document.querySelector('.refresh-btn');
const refreshJourneyBtn = document.querySelector('.refresh-journey-btn');
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
// 2. DATA: STATIONS & LINES (UPDATED)
// ==========================================

const trainLines = {
    // LRT-1: From North to South (Roosevelt to Dr. Santos)
    'LRT-1': [
        'Roosevelt',
        'Balintawak', 
        'Monumento',
        'R. Papa',
        'Abad Santos',
        'Blumentritt',
        'Tayuman',
        'Bambang',
        'Doroteo Jose',
        'Carriedo',
        'Central Terminal',
        'United Nations',
        'Pedro Gil',
        'Quirino Ave.',
        'Vito Cruz',
        'Gil Puyat',
        'Libertad',
        'EDSA',
        'Baclaran',
        'Redemption-ASEANA',
        'MIA Road',
        'ASIA World',
        'Ninoy Aquino Ave.',
        'Dr. Santos'
    ],
    // MRT-3: From North Ave to Taft
    'MRT-3': [
        'North Ave. MRT-3',
        'Quezon Ave.',
        'Kamuning',
        'Araneta Center-Cubao MRT-3',
        'Santolan MRT-3',
        'Ortigas',
        'Shaw Blvd.',
        'Boni',
        'Guadalupe',
        'Buendia',
        'Ayala',
        'Magallanes',
        'Taft'
    ],
    // LRT-2: From Recto to Antipolo
    'LRT-2': [
        'Recto',
        'Legarda',
        'Pureza',
        'V. Mapa',
        'J. Ruiz',
        'Gilmore',
        'Betty Go-Belmonte',
        'Araneta Center-Cubao LRT-2',
        'Anonas',
        'Katipunan',
        'Santolan',
        'Marikina-Pasig',
        'Antipolo'
    ]
};

// Connecting Stations (Transfer Hubs)
const transferHubs = [
    { lineA: 'LRT-1', stationA: 'Doroteo Jose', lineB: 'LRT-2', stationB: 'Recto' },
    { lineA: 'LRT-2', stationA: 'Araneta Center-Cubao LRT-2', lineB: 'MRT-3', stationB: 'Araneta Center-Cubao MRT-3' },
    { lineA: 'LRT-1', stationA: 'EDSA', lineB: 'MRT-3', stationB: 'Taft' }
];

// Station coordinates for geolocation (approximate Manila coordinates)
const stationCoordinates = {
    // LRT-1
    'Roosevelt': { lat: 14.6541, lng: 121.0198 },
    'Balintawak': { lat: 14.6537, lng: 120.9843 },
    'Monumento': { lat: 14.6544, lng: 120.9840 },
    'R. Papa': { lat: 14.6189, lng: 120.9895 },
    'Abad Santos': { lat: 14.6134, lng: 120.9886 },
    'Blumentritt': { lat: 14.6095, lng: 120.9835 },
    'Tayuman': { lat: 14.6040, lng: 120.9835 },
    'Bambang': { lat: 14.6013, lng: 120.9835 },
    'Doroteo Jose': { lat: 14.5985, lng: 120.9835 },
    'Carriedo': { lat: 14.5924, lng: 120.9835 },
    'Central Terminal': { lat: 14.5890, lng: 120.9835 },
    'United Nations': { lat: 14.5802, lng: 120.9835 },
    'Pedro Gil': { lat: 14.5730, lng: 120.9935 },
    'Quirino Ave.': { lat: 14.5676, lng: 121.0035 },
    'Vito Cruz': { lat: 14.5623, lng: 121.0135 },
    'Gil Puyat': { lat: 14.5534, lng: 121.0235 },
    'Libertad': { lat: 14.5454, lng: 121.0335 },
    'EDSA': { lat: 14.5388, lng: 121.0435 },
    'Baclaran': { lat: 14.5366, lng: 121.0117 },
    'Redemption-ASEANA': { lat: 14.5300, lng: 120.9900 },
    'MIA Road': { lat: 14.5100, lng: 120.9900 },
    'ASIA World': { lat: 14.4900, lng: 120.9900 },
    'Ninoy Aquino Ave.': { lat: 14.4800, lng: 121.0000 },
    'Dr. Santos': { lat: 14.4600, lng: 120.9900 },
    
    // MRT-3
    'North Ave. MRT-3': { lat: 14.6562, lng: 121.0318 },
    'Quezon Ave.': { lat: 14.6352, lng: 121.0497 },
    'Kamuning': { lat: 14.6264, lng: 121.0650 },
    'Araneta Center-Cubao MRT-3': { lat: 14.6195, lng: 121.0518 },
    'Santolan MRT-3': { lat: 14.6103, lng: 121.0855 },
    'Ortigas': { lat: 14.5867, lng: 121.0565 },
    'Shaw Blvd.': { lat: 14.5814, lng: 121.0533 },
    'Boni': { lat: 14.5690, lng: 121.0521 },
    'Guadalupe': { lat: 14.5585, lng: 121.0448 },
    'Buendia': { lat: 14.5529, lng: 121.0329 },
    'Ayala': { lat: 14.5485, lng: 121.0279 },
    'Magallanes': { lat: 14.5425, lng: 121.0198 },
    'Taft': { lat: 14.5388, lng: 121.0435 },
    
    // LRT-2
    'Recto': { lat: 14.5985, lng: 120.9910 },
    'Legarda': { lat: 14.6012, lng: 121.0012 },
    'Pureza': { lat: 14.6035, lng: 121.0135 },
    'V. Mapa': { lat: 14.6058, lng: 121.0235 },
    'J. Ruiz': { lat: 14.6090, lng: 121.0335 },
    'Gilmore': { lat: 14.6113, lng: 121.0435 },
    'Betty Go-Belmonte': { lat: 14.6140, lng: 121.0535 },
    'Araneta Center-Cubao LRT-2': { lat: 14.6195, lng: 121.0518 },
    'Anonas': { lat: 14.6268, lng: 121.0635 },
    'Katipunan': { lat: 14.6310, lng: 121.0735 },
    'Santolan': { lat: 14.6380, lng: 121.0935 },
    'Marikina-Pasig': { lat: 14.6420, lng: 121.1035 },
    'Antipolo': { lat: 14.6450, lng: 121.1835 }
};

// ==========================================
// 3. GRAPH & ALGORITHM
// ==========================================

// Helper: Find which line a station belongs to
function findStationLine(stationName) {
    for (const [lineName, stations] of Object.entries(trainLines)) {
        if (stations.includes(stationName)) return lineName;
    }
    return null;
}

// 1. Build Adjacency Graph
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
function findRoute(origin, destination) {
    if (origin === destination) return null;

    const graph = buildGraph();
    let queue = [[origin]];
    let visited = new Set();
    visited.add(origin);

    while (queue.length > 0) {
        let path = queue.shift();
        let currentStation = path[path.length - 1];

        if (currentStation === destination) {
            return formatRouteResult(path);
        }

        if (graph[currentStation]) {
            for (let neighbor of graph[currentStation]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    let newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }
    }

    return {
        time: 'N/A', 
        cost: 0, 
        line: 'No Route',
        route: 'No connecting route found',
        stations: [origin, destination]
    };
}

// 3. Formatter
function formatRouteResult(stationPath) {
    const origin = stationPath[0];
    const destination = stationPath[stationPath.length - 1];
    const originLine = findStationLine(origin);
    
    const totalStops = stationPath.length - 1;

    let distinctLines = new Set();
    let transferCount = 0;
    
    stationPath.forEach((st, index) => {
        const line = findStationLine(st);
        if (line) distinctLines.add(line);
        
        if (index > 0) {
            const prevLine = findStationLine(stationPath[index-1]);
            if (prevLine && line && prevLine !== line) {
                transferCount++;
            }
        }
    });

    const isMultiLine = distinctLines.size > 1;

    const estimatedCost = 15 + (totalStops * 2) + (transferCount * 5);
    const minTime = (totalStops * 3) + (transferCount * 5);
    const maxTime = (totalStops * 4) + (transferCount * 10);

    let routeDesc = '';
    if (isMultiLine) {
        routeDesc = `Via ${Array.from(distinctLines).join(' → ')}`;
    } else {
        routeDesc = `${originLine}: ${origin} → ${destination}`;
    }

    return {
        time: `${minTime} - ${maxTime}`,
        cost: estimatedCost,
        line: isMultiLine ? 'Multi-Line Journey' : originLine,
        route: routeDesc,
        getOn: origin,
        getOff: destination,
        stations: stationPath
    };
}

// ==========================================
// 4. GEOLOCATION UTILS
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
        if (dst < minDst) { 
            minDst = dst; 
            nearest = stn; 
        }
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

// Station Click Handlers - FIXED
clickableStations.forEach(station => {
    station.addEventListener('click', (e) => {
        e.stopPropagation();
        const stationName = station.getAttribute('data-station');
        console.log('Station clicked:', stationName); // Debug log
        if (currentMode) {
            selectStation(stationName);
        }
    });
    
    // Ensure stations are clickable
    station.style.cursor = 'pointer';
    station.style.pointerEvents = 'auto';
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
        
        let match = Array.from(clickableStations).find(s => 
            s.getAttribute('data-station').toLowerCase() === searchTerm
        );
        if (!match) {
            match = Array.from(clickableStations).find(s => 
                s.getAttribute('data-station').toLowerCase().includes(searchTerm)
            );
        }
        
        if (match) selectStation(match.getAttribute('data-station'));
        else alert(`No station found matching "${searchTerm}"`);
    }
});

// Reset Logic - Swap button functionality
swapBtn.addEventListener('click', () => {
    const tempOrigin = originInput.value;
    const tempDestination = destinationInput.value;
    
    // Swap the values
    originInput.value = tempDestination;
    destinationInput.value = tempOrigin;
    
    // Recalculate route if both fields have values
    if (originInput.value && destinationInput.value) {
        displayRoute();
    }
});

// Refresh Journey Button - Reset everything
refreshJourneyBtn.addEventListener('click', () => {
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
    if (currentMode && userCurrentStation) {
        selectStation(userCurrentStation);
    } else if (currentMode) {
        alert('Location not available.');
    }
});

// ==========================================
// 6. MAP VISUALIZATION
// ==========================================

function highlightRouteOnMap(stationNames) {
    clearRouteOnMap();
    const routeStations = [];
    
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
        line.style.transformOrigin = '0 0';
        line.style.position = 'absolute';
        line.style.backgroundColor = '#FFD700';
        line.style.zIndex = '1';
        
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

// Debug: Log station information on page load
console.log('Total stations found:', stations.length);
console.log('Clickable stations:', clickableStations.length);
console.log('All station names:', Array.from(clickableStations).map(s => s.getAttribute('data-station')));