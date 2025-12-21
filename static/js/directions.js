// DOM Elements
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

let currentMode = ''; // 'origin' or 'destination'
let currentRouteData = null;
let userCurrentStation = null; // Will be set after geolocation

// Station coordinates (approximate locations in Manila)
const stationCoordinates = {
    // LRT-1
    'Baclaran': { lat: 14.5369, lng: 121.0011 },
    'EDSA': { lat: 14.5391, lng: 121.0034 },
    'Libertad': { lat: 14.5461, lng: 121.0056 },
    'Gil Puyat': { lat: 14.5538, lng: 121.0103 },
    'Vito Cruz': { lat: 14.5612, lng: 121.0168 },
    'Quirino Ave.': { lat: 14.5706, lng: 121.0223 },
    'Pedro Gil': { lat: 14.5774, lng: 121.0293 },
    'United Nations': { lat: 14.5815, lng: 121.0333 },
    'Central Terminal': { lat: 14.5889, lng: 121.0417 },
    'Carriedo': { lat: 14.5944, lng: 121.0467 },
    'Doroteo Jose': { lat: 14.6001, lng: 121.0517 },
    'Bambang': { lat: 14.6059, lng: 121.0556 },
    'Tayuman': { lat: 14.6101, lng: 121.0596 },
    'Blumentritt': { lat: 14.6159, lng: 121.0636 },
    'Abad Santos': { lat: 14.6201, lng: 121.0686 },
    'R. Papa': { lat: 14.6231, lng: 121.0736 },
    '5th Ave.': { lat: 14.6281, lng: 121.0786 },
    'Monumento': { lat: 14.6541, lng: 121.0836 },
    'Malvar': { lat: 14.6587, lng: 121.0876 },
    'Balintawak': { lat: 14.6633, lng: 121.0916 },
    'Roosevelt': { lat: 14.6547, lng: 121.1008 },
    // MRT-3
    'North Ave.': { lat: 14.6565, lng: 121.0321 },
    'Quezon Ave.': { lat: 14.6373, lng: 121.0388 },
    'Kamuning': { lat: 14.6277, lng: 121.0432 },
    'Araneta Center-Cubao': { lat: 14.6191, lng: 121.0519 },
    'Santolan': { lat: 14.6099, lng: 121.0854 },
    'Ortigas': { lat: 14.5865, lng: 121.0567 },
    'Shaw Blvd.': { lat: 14.5815, lng: 121.0548 },
    'Boni': { lat: 14.5743, lng: 121.0528 },
    'Guadalupe': { lat: 14.5643, lng: 121.0488 },
    'Buendia': { lat: 14.5565, lng: 121.0330 },
    'Ayala': { lat: 14.5488, lng: 121.0288 },
    'Magallanes': { lat: 14.5433, lng: 121.0198 },
    'Taft': { lat: 14.5378, lng: 121.0138 },
    // LRT-2
    'Recto': { lat: 14.6031, lng: 120.9920 },
    'Legarda': { lat: 14.6067, lng: 120.9960 },
    'Pureza': { lat: 14.6102, lng: 121.0050 },
    'V. Mapa': { lat: 14.6138, lng: 121.0130 },
    'J. Ruiz': { lat: 14.6173, lng: 121.0220 },
    'Gilmore': { lat: 14.6209, lng: 121.0310 },
    'Betty Go-Belmonte': { lat: 14.6244, lng: 121.0400 },
    'Anonas': { lat: 14.6315, lng: 121.0570 },
    'Katipunan': { lat: 14.6351, lng: 121.0660 },
};

// Function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

// Function to find nearest station to user's location
function findNearestStation(userLat, userLng) {
    let nearestStation = null;
    let minDistance = Infinity;
    
    for (const [station, coords] of Object.entries(stationCoordinates)) {
        const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
        }
    }
    
    return nearestStation;
}

// Get user's current location
function getUserLocation() {
    // Show loading state
    document.querySelector('.location-name').textContent = 'Detecting location...';
    document.querySelector('.location-address').textContent = 'Please wait';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Find nearest station
                userCurrentStation = findNearestStation(userLat, userLng);
                
                // Update the display
                document.querySelector('.location-name').textContent = userCurrentStation;
                document.querySelector('.location-address').textContent = 'Your nearest station';
                
                console.log(`User location detected: ${userCurrentStation}`);
            },
            (error) => {
                console.log('Geolocation error:', error.message);
                // Show error message
                document.querySelector('.location-name').textContent = 'Location unavailable';
                document.querySelector('.location-address').textContent = 'Please enable location access or select manually';
                userCurrentStation = null;
            }
        );
    } else {
        console.log('Geolocation not supported');
        document.querySelector('.location-name').textContent = 'Location not supported';
        document.querySelector('.location-address').textContent = 'Please select station manually';
        userCurrentStation = null;
    }
}

// Call getUserLocation when page loads
getUserLocation();

// Sample route data (will be replaced with backend later)
const sampleRoutes = {
    'Roosevelt-Blumentritt': {
        time: '15 - 20',
        cost: 30,
        line: 'LRT 1',
        route: 'LRT-1: Fernando Poe Jr. - Bñ Arcadio Santos',
        getOn: 'Fernando Poe Jr. (Roosevelt) LRT',
        getOff: 'Blumentritt LRT',
        stations: ['Roosevelt', 'Balintawak', 'Malvar', 'Monumento', '5th Ave.', 'R. Papa', 'Abad Santos', 'Blumentritt']
    },
    'Monumento-Baclaran': {
        time: '40 - 50',
        cost: 35,
        line: 'LRT 1',
        route: 'LRT-1: Monumento - Baclaran',
        getOn: 'Monumento LRT',
        getOff: 'Baclaran LRT',
        stations: ['Monumento', '5th Ave.', 'R. Papa', 'Abad Santos', 'Blumentritt', 'Tayuman', 'Bambang', 'Doroteo Jose', 'Carriedo', 'Central Terminal', 'United Nations', 'Pedro Gil', 'Quirino Ave.', 'Vito Cruz', 'Gil Puyat', 'Libertad', 'EDSA', 'Baclaran']
    },
    'North Ave.-Taft': {
        time: '30 - 40',
        cost: 28,
        line: 'MRT 3',
        route: 'MRT-3: North Avenue - Taft Avenue',
        getOn: 'North Avenue MRT',
        getOff: 'Taft Avenue MRT',
        stations: ['North Ave.', 'Quezon Ave.', 'Kamuning', 'Araneta Center-Cubao', 'Santolan', 'Ortigas', 'Shaw Blvd.', 'Boni', 'Guadalupe', 'Buendia', 'Ayala', 'Magallanes', 'Taft']
    },
    'Abad Santos-V. Mapa': {
        time: '20 - 30',
        cost: 30,
        line: 'Transfer Route',
        route: 'LRT-1 to LRT-2 via Recto',
        getOn: 'Abad Santos LRT-1',
        getOff: 'V. Mapa LRT-2',
        stations: ['Abad Santos', 'Blumentritt', 'Tayuman', 'Bambang', 'Doroteo Jose', 'Carriedo', 'Recto', 'Legarda', 'Pureza', 'V. Mapa']
    }
};

// Complete train line definitions for automatic route finding
const trainLines = {
    'LRT-1': ['Baclaran', 'EDSA', 'Libertad', 'Gil Puyat', 'Vito Cruz', 'Quirino Ave.', 'Pedro Gil', 'United Nations', 'Central Terminal', 'Carriedo', 'Doroteo Jose', 'Bambang', 'Tayuman', 'Blumentritt', 'Abad Santos', 'R. Papa', '5th Ave.', 'Monumento', 'Malvar', 'Balintawak', 'Roosevelt', 'North Ave.'],
    'MRT-3': ['North Ave.', 'Quezon Ave.', 'Kamuning', 'Araneta Center-Cubao', 'Santolan', 'Ortigas', 'Shaw Blvd.', 'Boni', 'Guadalupe', 'Buendia', 'Ayala', 'Magallanes', 'Taft'],
    'LRT-2': ['Recto', 'Legarda', 'Pureza', 'V. Mapa', 'J. Ruiz', 'Gilmore', 'Betty Go-Belmonte', 'Araneta Center-Cubao', 'Anonas', 'Katipunan', 'Santolan']
};

// Transfer points between lines
const transferStations = {
    'Recto': ['LRT-1', 'LRT-2'],  // Can transfer between LRT-1 (Doroteo Jose/Carriedo area) and LRT-2
    'Araneta Center-Cubao': ['MRT-3', 'LRT-2'],
    'Taft': ['LRT-1', 'MRT-3'],
    'North Ave.': ['LRT-1', 'MRT-3']
};

// Function to find which line a station is on
function findStationLine(stationName) {
    for (const [lineName, stations] of Object.entries(trainLines)) {
        if (stations.includes(stationName)) {
            return lineName;
        }
    }
    return null;
}

// Function to find route between two stations on the same line
function getRouteOnLine(lineName, origin, destination) {
    const stations = trainLines[lineName];
    const originIndex = stations.indexOf(origin);
    const destIndex = stations.indexOf(destination);
    
    if (originIndex === -1 || destIndex === -1) return null;
    
    const start = Math.min(originIndex, destIndex);
    const end = Math.max(originIndex, destIndex);
    const route = stations.slice(start, end + 1);
    
    // Reverse if going backwards
    if (originIndex > destIndex) {
        route.reverse();
    }
    
    return route;
}

// Function to find route between two stations (with transfers)
function findRoute(origin, destination) {
    const originLine = findStationLine(origin);
    const destLine = findStationLine(destination);
    
    if (!originLine || !destLine) {
        return {
            time: '20 - 30',
            cost: 30,
            line: 'Unknown Route',
            route: `${origin} - ${destination}`,
            getOn: origin,
            getOff: destination,
            stations: [origin, destination]
        };
    }
    
    // Same line - direct route
    if (originLine === destLine) {
        const route = getRouteOnLine(originLine, origin, destination);
        if (route) {
            return {
                time: `${(route.length - 1) * 2} - ${(route.length - 1) * 3}`,
                cost: 30,
                line: originLine,
                route: `${originLine}: ${origin} - ${destination}`,
                getOn: `${origin} ${originLine}`,
                getOff: `${destination} ${originLine}`,
                stations: route
            };
        }
    }
    
    // Different lines - need transfer
    // Find common transfer station
    let transferStation = null;
    let transferLines = [];
    
    for (const [station, lines] of Object.entries(transferStations)) {
        if (lines.includes(originLine) && lines.includes(destLine)) {
            transferStation = station;
            transferLines = lines;
            break;
        }
    }
    
    // Special case: LRT-2 to MRT-3 via Recto/Doroteo Jose (close stations)
    if ((originLine === 'LRT-2' && destLine === 'MRT-3') || (originLine === 'MRT-3' && destLine === 'LRT-2')) {
        // Route through Araneta Center-Cubao (actual transfer point)
        transferStation = 'Araneta Center-Cubao';
    }
    
    // Special case: Pureza (LRT-2) to Ortigas (MRT-3)
    if (origin === 'Pureza' && destination === 'Ortigas') {
        // Go via Araneta Center-Cubao
        const route1 = getRouteOnLine('LRT-2', 'Pureza', 'Araneta Center-Cubao');
        const route2 = getRouteOnLine('MRT-3', 'Araneta Center-Cubao', 'Ortigas');
        
        if (route1 && route2) {
            // Combine routes, removing duplicate transfer station
            const fullRoute = [...route1, ...route2.slice(1)];
            return {
                time: `${(fullRoute.length - 1) * 2} - ${(fullRoute.length - 1) * 3}`,
                cost: 30,
                line: 'Transfer Route',
                route: `LRT-2 to MRT-3 via Araneta Center-Cubao`,
                getOn: `${origin} LRT-2`,
                getOff: `${destination} MRT-3`,
                stations: fullRoute
            };
        }
    }
    
    if (transferStation) {
        const route1 = getRouteOnLine(originLine, origin, transferStation);
        const route2 = getRouteOnLine(destLine, transferStation, destination);
        
        if (route1 && route2) {
            // Combine routes, removing duplicate transfer station
            const fullRoute = [...route1, ...route2.slice(1)];
            return {
                time: `${(fullRoute.length - 1) * 2} - ${(fullRoute.length - 1) * 3}`,
                cost: 30,
                line: 'Transfer Route',
                route: `${originLine} to ${destLine} via ${transferStation}`,
                getOn: `${origin} ${originLine}`,
                getOff: `${destination} ${destLine}`,
                stations: fullRoute
            };
        }
    }
    
    // No route found
    return {
        time: '20 - 30',
        cost: 30,
        line: 'Transfer Route',
        route: `${origin} - ${destination}`,
        getOn: origin,
        getOff: destination,
        stations: [origin, destination]
    };
}

// Switch to new view when origin is clicked
originInput.addEventListener('click', () => {
    currentMode = 'origin';
    selectionModeText.textContent = 'Select Origin';
    originalView.classList.add('hidden');
    newView.classList.add('active');
    searchInput.focus();
});

// Switch to new view when destination is clicked
destinationInput.addEventListener('click', () => {
    currentMode = 'destination';
    selectionModeText.textContent = 'Select Destination';
    originalView.classList.add('hidden');
    newView.classList.add('active');
    searchInput.focus();
});

// Function to select a station
function selectStation(stationName) {
    if (currentMode === 'origin') {
        originInput.value = stationName;
    } else if (currentMode === 'destination') {
        destinationInput.value = stationName;
    }
    
    // Return to original view
    originalView.classList.remove('hidden');
    newView.classList.remove('active');
    searchInput.value = '';
    currentMode = '';

    // Check if both origin and destination are filled, then display route
    displayRoute();
}

// Station click functionality
stations.forEach(station => {
    station.addEventListener('click', () => {
        const stationName = station.getAttribute('data-station');
        if (currentMode) {
            selectStation(stationName);
        }
    });
});

// Current location button
currentLocationBtn.addEventListener('click', () => {
    if (currentMode) {
        if (userCurrentStation) {
            selectStation(userCurrentStation);
        } else {
            alert('Location not available. Please enable location access or select a station manually.');
        }
    }
});

// Search input - filter and select stations
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        // Show all stations when search is empty
        stations.forEach(station => {
            station.style.opacity = '1';
            station.style.pointerEvents = 'auto';
        });
        return;
    }
    
    // Filter stations based on search
    let foundStations = [];
    stations.forEach(station => {
        const stationName = station.getAttribute('data-station').toLowerCase();
        if (stationName.includes(searchTerm)) {
            station.style.opacity = '1';
            station.style.transform = 'scale(1.2)';
            station.style.pointerEvents = 'auto';
            foundStations.push(station);
        } else {
            station.style.opacity = '0.2';
            station.style.transform = 'scale(1)';
            station.style.pointerEvents = 'none';
        }
    });
    
    console.log(`Found ${foundStations.length} stations matching "${searchTerm}"`);
});

// Search input - select on Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;
        
        // Find exact or close match
        const searchLower = searchTerm.toLowerCase();
        let matchedStation = null;
        
        stations.forEach(station => {
            const stationName = station.getAttribute('data-station');
            if (stationName.toLowerCase() === searchLower) {
                matchedStation = stationName;
            }
        });
        
        // If no exact match, find first partial match
        if (!matchedStation) {
            stations.forEach(station => {
                const stationName = station.getAttribute('data-station');
                if (stationName.toLowerCase().includes(searchLower) && !matchedStation) {
                    matchedStation = stationName;
                }
            });
        }
        
        if (matchedStation) {
            selectStation(matchedStation);
        } else {
            alert(`No station found matching "${searchTerm}"`);
        }
    }
});

// Back button - return to original view
backButton.addEventListener('click', () => {
    originalView.classList.remove('hidden');
    newView.classList.remove('active');
    searchInput.value = '';
    currentMode = '';
});

// Refresh button - clear inputs and return to original view
refreshBtn.addEventListener('click', () => {
    originInput.value = '';
    destinationInput.value = '';
    originalView.classList.remove('hidden');
    newView.classList.remove('active');
    searchInput.value = '';
    currentMode = '';
    
    // Reset to illustration view
    document.querySelector('.illustration-section').style.display = 'flex';
    document.getElementById('routeInfo').classList.remove('active');
    selectedJourneyView.classList.remove('active');
    clearRouteOnMap();
});

// Function to calculate and display route
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

    // Hide illustration, show route info
    document.querySelector('.illustration-section').style.display = 'none';
    document.getElementById('routeInfo').classList.add('active');
    selectedJourneyView.classList.remove('active');

    // Use sample data first, then try automatic route finding
    const routeKey = `${origin}-${destination}`;
    const reverseRouteKey = `${destination}-${origin}`;
    
    let routeData = sampleRoutes[routeKey] || sampleRoutes[reverseRouteKey];
    
    // If no predefined route, use automatic route finder
    if (!routeData) {
        routeData = findRoute(origin, destination);
    }

    // Update journey card
    document.getElementById('lineName').textContent = routeData.line;
    document.getElementById('journeyPrice').textContent = `P ${routeData.cost}.00`;
    document.getElementById('journeyDuration').textContent = `${routeData.time} mins`;
    
    // Update expandable section
    document.getElementById('expandLineName').textContent = routeData.line;
    document.getElementById('expandPrice').textContent = `P ${routeData.cost}.00`;
    document.getElementById('expandDuration').textContent = `${routeData.time} minutes`;
    document.getElementById('routeDetail').textContent = routeData.route;
    document.getElementById('getOnDetail').textContent = routeData.getOn;
    document.getElementById('getOffDetail').textContent = routeData.getOff;

    // Store current route data
    currentRouteData = routeData;

    // Highlight route on map
    highlightRouteOnMap(routeData.stations);
}

// Function to show selected journey view
function showSelectedJourney() {
    if (!currentRouteData) return;

    // Hide route info, show selected journey
    document.getElementById('routeInfo').classList.remove('active');
    selectedJourneyView.classList.add('active');

    // Populate selected journey details
    document.getElementById('selectedLineName').textContent = currentRouteData.line;
    document.getElementById('selectedPrice').textContent = `P ${currentRouteData.cost}.00`;
    document.getElementById('selectedDuration').textContent = `${currentRouteData.time} mins`;
    document.getElementById('selectedExpandLineName').textContent = currentRouteData.line;
    document.getElementById('selectedExpandPrice').textContent = `P ${currentRouteData.cost}.00`;
    document.getElementById('selectedExpandDuration').textContent = `${currentRouteData.time} minutes`;
    document.getElementById('selectedRouteDetail').textContent = currentRouteData.route;
    document.getElementById('selectedGetOnDetail').textContent = currentRouteData.getOn;
    document.getElementById('selectedGetOffDetail').textContent = currentRouteData.getOff;
}

// Function to highlight route on map
function highlightRouteOnMap(stationNames) {
    // Clear previous highlights
    clearRouteOnMap();

    // Highlight stations on route and collect them in order
    const routeStations = [];
    
    // Find stations in the exact order specified in stationNames array
    stationNames.forEach(stationName => {
        stations.forEach(station => {
            const name = station.getAttribute('data-station');
            if (name === stationName && !routeStations.includes(station)) {
                station.classList.add('on-route');
                routeStations.push(station);
            }
        });
    });

    // Add Start and End badges
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

    // Draw connecting lines between consecutive stations
    drawRouteLines(routeStations);
}

// Function to draw lines connecting stations
function drawRouteLines(routeStations) {
    const mapOverlay = document.querySelector('.map-overlay');
    
    for (let i = 0; i < routeStations.length - 1; i++) {
        const station1 = routeStations[i];
        const station2 = routeStations[i + 1];
        
        const rect1 = station1.getBoundingClientRect();
        const rect2 = station2.getBoundingClientRect();
        const mapRect = mapOverlay.getBoundingClientRect();
        
        const x1 = rect1.left + rect1.width / 2 - mapRect.left;
        const y1 = rect1.top + rect1.height / 2 - mapRect.top;
        const x2 = rect2.left + rect2.width / 2 - mapRect.left;
        const y2 = rect2.top + rect2.height / 2 - mapRect.top;
        
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        
        const line = document.createElement('div');
        line.className = 'route-connector';
        line.style.width = distance + 'px';
        line.style.height = '5px';
        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 50%';
        
        mapOverlay.appendChild(line);
    }
}

// Function to clear route highlighting
function clearRouteOnMap() {
    stations.forEach(station => {
        station.classList.remove('on-route');
        // Remove badges
        const badges = station.querySelectorAll('.station-badge');
        badges.forEach(badge => badge.remove());
    });
    
    // Remove all connector lines
    const connectors = document.querySelectorAll('.route-connector');
    connectors.forEach(connector => connector.remove());
}

// Journey expandable toggle
const journeyExpandable = document.getElementById('journeyExpandable');
const expandableDetails = document.getElementById('expandableDetails');

journeyExpandable.addEventListener('click', (e) => {
    // Check if it's just a toggle or a selection
    if (expandableDetails.classList.contains('visible')) {
        // Already expanded, so this is a selection
        journeyExpandable.classList.add('selected');
        showSelectedJourney();
    } else {
        // Just toggle expand
        expandableDetails.classList.toggle('visible');
    }
});

// Selected journey back button
selectedBackBtn.addEventListener('click', () => {
    selectedJourneyView.classList.remove('active');
    document.getElementById('routeInfo').classList.add('active');
    journeyExpandable.classList.remove('selected');
});