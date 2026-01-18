// BACKEND API - Backend Integration
const API_BASE_URL = '';

let savedGraphsStore = [];

const SortingAPI = {
    generateArray: async (size) => {
        try {
            const array = [];
            for (let i = 0; i < size; i++) {
                array.push(Math.floor(Math.random() * 100) + 1);
            }
            return { success: true, data: array };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    getSortingSteps: async (array, algorithm) => {
        try {
            const algoMap = {
                'bubble': 'bubbleSort',
                'selection': 'selectionSort',
                'insertion': 'insertionSort',
                'merge': 'mergeSort',
                'quick': 'quickSort'
            };
            
            const algoName = algoMap[algorithm];
            
            const endpoint = `/sort/${algoName}`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    arrToSort: array
                })
            });
            
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.error('Backend error details:', errorData);
                    errorMessage += `\n\nBackend says: ${errorData.substring(0, 200)}`;
                } catch (e) {
                }
                throw new Error(errorMessage);
            }
            
            const animationSteps = await response.json();
            return { success: true, data: animationSteps };
        } catch (error) {
            console.error('Error fetching sorting steps:', error);
            return { success: false, error: error.message };
        }
    },

    saveGraph: async (graphData) => {
        try {
            const newGraph = {
                id: Date.now(),
                ...graphData,
                createdAt: new Date().toISOString()
            };
            
            savedGraphsStore.push(newGraph);
            return { success: true, data: newGraph };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    loadGraphs: async () => {
        try {
            return { success: true, data: savedGraphsStore };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    loadGraphById: async (id) => {
        try {
            const graph = savedGraphsStore.find(g => g.id === id);
            
            if (graph) {
                return { success: true, data: graph };
            } else {
                return { success: false, error: 'Graph not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    deleteGraph: async (id) => {
        try {
            savedGraphsStore = savedGraphsStore.filter(g => g.id !== id);
            return { success: true, data: { deleted: id } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    updateGraph: async (id, updates) => {
        try {
            const index = savedGraphsStore.findIndex(g => g.id === id);
            
            if (index !== -1) {
                savedGraphsStore[index] = { 
                    ...savedGraphsStore[index], 
                    ...updates, 
                    updatedAt: new Date().toISOString() 
                };
                return { success: true, data: savedGraphsStore[index] };
            } else {
                return { success: false, error: 'Graph not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// BACKEND ANIMATION PLAYER
class SortingVisualizer {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async playBackendAnimation(animationSteps, updateCallback) {
        
        for (let step of animationSteps) {
            if (state.shouldStop) break;
            
            const [arr, redBar1, redBar2, blueBar1, blueBar2] = step;
            
            state.array = [...arr];
            await updateCallback(null, null, 'render', arr);
            
            if (redBar1 !== null && redBar1 !== -1) {
                updateBarState(redBar1, 'comparing');
            }
            if (redBar2 !== null && redBar2 !== -1) {
                updateBarState(redBar2, 'comparing');
            }
            
            if (blueBar1 !== null && blueBar1 !== -1) {
                updateBarState(blueBar1, 'swapping');
            }
            if (blueBar2 !== null && blueBar2 !== -1) {
                updateBarState(blueBar2, 'swapping');
            }
            
            incrementStep();
            await this.sleep(state.delay);
            
            if (redBar1 !== null && redBar1 !== -1) {
                updateBarState(redBar1, 'default');
            }
            if (redBar2 !== null && redBar2 !== -1) {
                updateBarState(redBar2, 'default');
            }
            if (blueBar1 !== null && blueBar1 !== -1) {
                updateBarState(blueBar1, 'default');
            }
            if (blueBar2 !== null && blueBar2 !== -1) {
                updateBarState(blueBar2, 'default');
            }
        }
        
        return state.array;
    }
}

// APPLICATION STATE & DOM MANAGEMENT
let state = {
    array: [],
    originalArray: [],
    arraySize: 30,
    delay: 100,
    isPlaying: false,
    isPaused: false,
    shouldStop: false,
    currentAlgorithm: 'bubble',
    savedGraphs: [],
    currentGraphId: null,
    stepCount: 0
};

const visualizer = new SortingVisualizer();

// DOM Elements
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const delaySlider = document.getElementById('delaySlider');
const delayValue = document.getElementById('delayValue');
const algorithmSelect = document.getElementById('algorithmSelect');
const resetBtn = document.getElementById('resetBtn');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const visualizationContainer = document.getElementById('visualizationContainer');
const stepCounter = document.getElementById('stepCounter');

// Sidebar elements
const editButton = document.querySelector('.edit-button');
const createButton = document.querySelector('.create-button');
const createIcon = document.querySelector('.create-icon');
const createGraphModal = document.getElementById('createGraphModal');
const confirmCreateGraph = document.getElementById('confirmCreateGraph');
const cancelCreateGraph = document.getElementById('cancelCreateGraph');
const newGraphNameInput = document.getElementById('newGraphNameInput');

// INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    const response = await SortingAPI.loadGraphs();
    if (response.success) {
        state.savedGraphs = response.data;
        if (state.savedGraphs.length > 0) {
            displayGraphList();
        }
    }
    
    await generateArray();
}

function setupEventListeners() {
    sizeSlider.addEventListener('input', async (e) => {
        state.arraySize = parseInt(e.target.value);
        sizeValue.textContent = state.arraySize;
        if (!state.isPlaying) {
            await generateArray();
        }
    });
    
    delaySlider.addEventListener('input', (e) => {
        state.delay = parseInt(e.target.value);
        delayValue.textContent = `${state.delay}ms`;
    });
    
    algorithmSelect.addEventListener('change', (e) => {
        state.currentAlgorithm = e.target.value;
    });
    
    resetBtn.addEventListener('click', async () => {
        if (!state.isPlaying) {
            if (state.originalArray.length > 0) {
                state.array = [...state.originalArray];
                state.stepCount = 0;
                updateStepCounter();
                renderBars();
            }
        }
    });
    
    playBtn.addEventListener('click', async () => {
        if (state.isPlaying) {
            state.shouldStop = true;
            state.isPlaying = false;
            playBtn.querySelector('i').className = 'fa-solid fa-play';
        } else {
            state.shouldStop = false;
            await startSorting();
        }
    });
    
    clearBtn.addEventListener('click', () => {
        if (!state.isPlaying) {
            state.array = [];
            state.stepCount = 0;
            updateStepCounter();
            renderBars();
        }
    });
    
    editButton.addEventListener('click', toggleEditMode);
    createButton.addEventListener('click', showCreateModal);
    createIcon.addEventListener('click', showCreateModal);
    confirmCreateGraph.addEventListener('click', createNewGraph);
    cancelCreateGraph.addEventListener('click', hideCreateModal);
    
    createGraphModal.addEventListener('click', (e) => {
        if (e.target === createGraphModal) {
            hideCreateModal();
        }
    });
}

// CORE FUNCTIONS
async function generateArray() {
    const response = await SortingAPI.generateArray(state.arraySize);
    if (response.success) {
        state.array = response.data;
        state.originalArray = [...response.data];
        state.stepCount = 0;
        updateStepCounter();
        renderBars();
    }
}

function updateStepCounter() {
    if (stepCounter) {
        stepCounter.textContent = `Step: ${state.stepCount}`;
    }
}

function incrementStep() {
    state.stepCount++;
    updateStepCounter();
}

function renderBars() {
    visualizationContainer.innerHTML = '';
    if (state.array.length === 0) return;
    
    const maxHeight = Math.max(...state.array);
    const containerWidth = visualizationContainer.offsetWidth;
    const barWidth = Math.min((containerWidth / state.array.length) - 4, 60);
    
    state.array.forEach((value, index) => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';
        barWrapper.style.width = `${barWidth}px`;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        const heightPercent = (value / maxHeight) * 100;
        bar.style.height = `${heightPercent}%`;
        bar.dataset.index = index;
        
        const valueLabel = document.createElement('div');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = value;
        
        const indexLabel = document.createElement('div');
        indexLabel.className = 'bar-index';
        indexLabel.textContent = index;
        
        bar.appendChild(valueLabel);
        barWrapper.appendChild(bar);
        barWrapper.appendChild(indexLabel);
        visualizationContainer.appendChild(barWrapper);
    });
}

async function startSorting() {
    state.isPlaying = true;
    state.shouldStop = false;
    state.stepCount = 0;
    updateStepCounter();
    playBtn.querySelector('i').className = 'fa-solid fa-pause';
    
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.className = 'bar');
    
    const response = await SortingAPI.getSortingSteps(state.array, state.currentAlgorithm);
    
    if (response.success) {
        const updateCallback = async (index1, index2, action, newArray) => {
            if (state.shouldStop) return;
            
            if (action === 'render' && newArray) {
                state.array = [...newArray];
                renderBars();
            } else if (index1 !== null) {
                updateBarState(index1, action);
            }
            if (index2 !== null) {
                updateBarState(index2, action);
            }
        };
        
        const result = await visualizer.playBackendAnimation(response.data, updateCallback);
        
        if (!state.shouldStop) {
            for (let i = 0; i < state.array.length; i++) {
                updateBarState(i, 'sorted');
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
    } else {
        alert('Error connecting to backend: ' + response.error);
    }
    
    state.isPlaying = false;
    state.shouldStop = false;
    playBtn.querySelector('i').className = 'fa-solid fa-play';
}

function updateBarState(index, state) {
    const bars = document.querySelectorAll('.bar');
    if (bars[index]) {
        bars[index].className = 'bar';
        if (state !== 'default') {
            bars[index].classList.add(state);
        }
    }
}

// GRAPH MANAGEMENT
function toggleEditMode() {
    console.log('Edit mode toggled');
}

function showCreateModal() {
    createGraphModal.style.display = 'flex';
    newGraphNameInput.value = '';
    newGraphNameInput.focus();
}

function hideCreateModal() {
    createGraphModal.style.display = 'none';
}

async function createNewGraph() {
    const name = newGraphNameInput.value.trim();
    if (!name) {
        alert('Please enter a graph name');
        return;
    }
    
    const graphData = {
        name: name,
        array: [...state.array],
        size: state.arraySize,
        algorithm: state.currentAlgorithm
    };
    
    const response = await SortingAPI.saveGraph(graphData);
    
    if (response.success) {
        state.savedGraphs.push(response.data);
        displayGraphList();
        hideCreateModal();
    } else {
        alert('Error saving graph: ' + response.error);
    }
}

function displayGraphList() {
    const noSavedGraph = document.getElementById('noSavedGraph');
    const graphList = document.getElementById('graph-list-organizer');
    
    noSavedGraph.style.display = 'none';
    graphList.style.display = 'flex';
    
    graphList.innerHTML = '<div class="graph-list-title">All Graphs</div>';
    
    state.savedGraphs.forEach((graph) => {
        const item = document.createElement('div');
        item.className = 'graph-list-item';
        if (state.currentGraphId === graph.id) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <span>${graph.name}</span>
            <span class="delete-graph-btn" data-id="${graph.id}">×</span>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-graph-btn')) {
                loadGraph(graph.id);
            }
        });
        
        const deleteBtn = item.querySelector('.delete-graph-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteGraph(graph.id);
        });
        
        graphList.appendChild(item);
    });
}

async function loadGraph(graphId) {
    const response = await SortingAPI.loadGraphById(graphId);
    
    if (response.success) {
        const graph = response.data;
        state.currentGraphId = graphId;
        state.array = [...graph.array];
        state.originalArray = [...graph.array];
        state.arraySize = graph.size;
        state.currentAlgorithm = graph.algorithm;
        
        sizeSlider.value = state.arraySize;
        sizeValue.textContent = state.arraySize;
        algorithmSelect.value = state.currentAlgorithm;
        
        renderBars();
        displayGraphList();
    } else {
        alert('Error loading graph: ' + response.error);
    }
}

async function deleteGraph(graphId) {
    if (confirm('Are you sure you want to delete this graph?')) {
        const response = await SortingAPI.deleteGraph(graphId);
        
        if (response.success) {
            state.savedGraphs = state.savedGraphs.filter(g => g.id !== graphId);
            
            if (state.currentGraphId === graphId) {
                state.currentGraphId = null;
                await generateArray();
            }
            
            if (state.savedGraphs.length === 0) {
                document.getElementById('noSavedGraph').style.display = 'flex';
                document.getElementById('graph-list-organizer').style.display = 'none';
            } else {
                displayGraphList();
            }
        } else {
            alert('Error deleting graph: ' + response.error);
        }
    }
}