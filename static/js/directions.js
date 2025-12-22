import { searchByPath, searchByTime, searchByCost } from '/static/api-js/graph-api.js';

// 1. DOM ELEMENTS
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

let currentMode = ''; 
let currentRouteData = null;
let userCurrentStation = null;
let currentSearchType = 'path';

const clickableStations = Array.from(stations).filter(station => 
    station.getAttribute('data-station') !== 'intersection-1'
);

// 2. DATA: STATIONS & LINES

const trainLines = {
    'LRT-1': [
        'Fernando Poe Jr.', 'Balintawak', 'Monumento', '5th Ave.', 'R. Papa', 'Abad Santos',
        'Blumentritt', 'Tayuman', 'Bambang', 'Doroteo Jose', 'Carriedo',
        'Central Terminal', 'United Nations', 'Pedro Gil', 'Quirino Ave.',
        'Vito Cruz', 'Gil Puyat', 'Libertad', 'EDSA', 'Baclaran',
        'Redemptorist-Aseana', 'MIA Road', 'ASIAWORLD', 'Ninoy Aquino Ave.', 'Dr. Santos'
    ],
    'MRT-3': [
        'North Ave.', 'Quezon Ave.', 'GMA Kamuning', 'Araneta-Cubao',
        'Santolan-Annapolis', 'Ortigas', 'Shaw Blvd.', 'Boni', 'Guadalupe',
        'Buendia', 'Ayala', 'Magallanes', 'Taft Ave.'
    ],
    'LRT-2': [
        'Recto', 'Legarda', 'Pureza', 'V. Mapa', 'J. Ruiz', 'Gilmore',
        'Betty Go-Belmonte', 'Araneta Center-Cubao', 'Anonas',
        'Katipunan', 'Santolan', 'Marikina-Pasig', 'Antipolo'
    ]
};

// 3. UTILITY FUNCTIONS

function determineLines(stationList) {
    const linesUsed = new Set();
    
    for (const station of stationList) {
        for (const [line, lineStations] of Object.entries(trainLines)) {
            if (lineStations.includes(station)) {
                linesUsed.add(line);
            }
        }
    }
    
    return Array.from(linesUsed);
}

function formatLineName(lines) {
    if (lines.length === 0) return 'Unknown Line';
    if (lines.length === 1) return lines[0];
    return lines.join(' + ');
}

function buildRouteString(stationList) {
    if (!stationList || stationList.length === 0) {
        return 'No route available';
    }
    return stationList.map((station, i) => `${i + 1}. ${station}`).join('<br>');
}

// 4. GEOLOCATION UTILS

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

// 5. API INTEGRATION & ROUTE DISPLAY

async function displayRoute() {
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
    
    document.getElementById('lineName').textContent = 'Loading...';
    document.getElementById('journeyPrice').textContent = '...';
    document.getElementById('journeyDuration').textContent = '...';

    try {
        let apiResponse;
        switch (currentSearchType) {
            case 'time':
                apiResponse = await searchByTime(origin, destination);
                break;
            case 'cost':
                apiResponse = await searchByCost(origin, destination);
                break;
            case 'path':
            default:
                apiResponse = await searchByPath(origin, destination);
                break;
        }

        console.log('API Response:', apiResponse);

        const stationList = apiResponse.stations || [];
        const travelTime = apiResponse.time || 0;
        const ticketCost = apiResponse.cost || 0;

        const lines = determineLines(stationList);
        const lineName = formatLineName(lines);
        const routeString = buildRouteString(stationList);
        const getOnStation = stationList.length > 0 ? stationList[0] : 'N/A';
        const getOffStation = stationList.length > 0 ? stationList[stationList.length - 1] : 'N/A';

        currentRouteData = {
            stations: stationList,
            time: travelTime,
            cost: ticketCost,
            line: lineName,
            route: routeString,
            getOn: getOnStation,
            getOff: getOffStation
        };

        document.getElementById('lineName').textContent = currentRouteData.line;
        document.getElementById('journeyPrice').textContent = `P ${currentRouteData.cost}.00`;
        document.getElementById('journeyDuration').textContent = `${currentRouteData.time} mins`;

        document.getElementById('expandLineName').textContent = currentRouteData.line;
        document.getElementById('expandPrice').textContent = `P ${currentRouteData.cost}.00`;
        document.getElementById('expandDuration').textContent = `${currentRouteData.time} mins`;
        document.getElementById('routeDetail').innerHTML = currentRouteData.route;
        document.getElementById('getOnDetail').textContent = currentRouteData.getOn;
        document.getElementById('getOffDetail').textContent = currentRouteData.getOff;

        highlightRouteOnMap(currentRouteData.stations);

    } catch (error) {
        console.error('Error fetching route:', error);
        
        document.getElementById('lineName').textContent = 'Error';
        document.getElementById('journeyPrice').textContent = 'N/A';
        document.getElementById('journeyDuration').textContent = 'N/A';
        document.getElementById('routeDetail').textContent = error.message || 'Failed to load route';
        
        document.getElementById('expandLineName').textContent = 'Error';
        document.getElementById('expandPrice').textContent = 'N/A';
        document.getElementById('expandDuration').textContent = 'N/A';
        document.getElementById('getOnDetail').textContent = 'N/A';
        document.getElementById('getOffDetail').textContent = 'N/A';
        
        alert(`Failed to fetch route: ${error.message}`);
    }
}

// 6. UI INTERACTION

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

clickableStations.forEach(station => {
    station.addEventListener('click', (e) => {
        e.stopPropagation();
        const stationName = station.getAttribute('data-station');
        if (currentMode) {
            selectStation(stationName);
        }
    });
    
    station.style.cursor = 'pointer';
    station.style.pointerEvents = 'auto';
});

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

swapBtn.addEventListener('click', () => {
    const tempOrigin = originInput.value;
    const tempDestination = destinationInput.value;
    
    originInput.value = tempDestination;
    destinationInput.value = tempOrigin;
    
    if (originInput.value && destinationInput.value) {
        displayRoute();
    }
});

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
    document.getElementById('selectedRouteDetail').innerHTML = currentRouteData.route;
    document.getElementById('selectedGetOnDetail').textContent = currentRouteData.getOn;
    document.getElementById('selectedGetOffDetail').textContent = currentRouteData.getOff;
}

selectedBackBtn.addEventListener('click', () => {
    selectedJourneyView.classList.remove('active');
    document.getElementById('routeInfo').classList.add('active');
    journeyExpandable.classList.remove('selected');
});

// MAP VISUALIZATION

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