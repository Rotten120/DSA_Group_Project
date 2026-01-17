// ============================================
// MOCK API - Replace with real backend later
// ============================================

const SortingAPI = {
    // Generate random array
    generateArray: async (size) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }
        return { success: true, data: array };
    },

    // Get sorting steps for visualization
    getSortingSteps: async (array, algorithm) => {
        // This would normally call backend
        // For now, return the array to be sorted client-side
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return { 
            success: true, 
            data: { array: [...array], algorithm } 
        };
    },

    // Save graph to storage
    saveGraph: async (graphData) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const saved = localStorage.getItem('sortingGraphs');
            const graphs = saved ? JSON.parse(saved) : [];
            
            const newGraph = {
                id: Date.now(),
                ...graphData,
                createdAt: new Date().toISOString()
            };
            
            graphs.push(newGraph);
            localStorage.setItem('sortingGraphs', JSON.stringify(graphs));
            
            return { success: true, data: newGraph };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Load all saved graphs
    loadGraphs: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const saved = localStorage.getItem('sortingGraphs');
            const graphs = saved ? JSON.parse(saved) : [];
            return { success: true, data: graphs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Load specific graph by ID
    loadGraphById: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const saved = localStorage.getItem('sortingGraphs');
            const graphs = saved ? JSON.parse(saved) : [];
            const graph = graphs.find(g => g.id === id);
            
            if (graph) {
                return { success: true, data: graph };
            } else {
                return { success: false, error: 'Graph not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Delete graph
    deleteGraph: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const saved = localStorage.getItem('sortingGraphs');
            const graphs = saved ? JSON.parse(saved) : [];
            const filtered = graphs.filter(g => g.id !== id);
            
            localStorage.setItem('sortingGraphs', JSON.stringify(filtered));
            
            return { success: true, data: { deleted: id } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update graph
    updateGraph: async (id, updates) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const saved = localStorage.getItem('sortingGraphs');
            const graphs = saved ? JSON.parse(saved) : [];
            const index = graphs.findIndex(g => g.id === id);
            
            if (index !== -1) {
                graphs[index] = { ...graphs[index], ...updates, updatedAt: new Date().toISOString() };
                localStorage.setItem('sortingGraphs', JSON.stringify(graphs));
                return { success: true, data: graphs[index] };
            } else {
                return { success: false, error: 'Graph not found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// ============================================
// SORTING ALGORITHMS (Client-side visualization)
// ============================================

class SortingVisualizer {
    constructor() {
        this.array = [];
        this.steps = [];
        this.currentStep = 0;
    }

    async bubbleSort(array, delay, updateCallback) {
        const arr = [...array];
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (state.shouldStop) return arr;
                
                await updateCallback(j, j + 1, 'comparing');
                await this.sleep(state.delay);
                
                if (arr[j] > arr[j + 1]) {
                    await updateCallback(j, j + 1, 'swapping');
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    await updateCallback(null, null, 'render', arr);
                    await this.sleep(state.delay);
                }
                
                await updateCallback(j, j + 1, 'default');
            }
            await updateCallback(arr.length - i - 1, null, 'sorted');
        }
        await updateCallback(0, null, 'sorted');
        return arr;
    }

    async selectionSort(array, delay, updateCallback) {
        const arr = [...array];
        for (let i = 0; i < arr.length - 1; i++) {
            if (state.shouldStop) return arr;
            
            let minIdx = i;
            await updateCallback(minIdx, null, 'selected');
            
            for (let j = i + 1; j < arr.length; j++) {
                if (state.shouldStop) return arr;
                
                await updateCallback(j, null, 'comparing');
                await this.sleep(state.delay);
                
                if (arr[j] < arr[minIdx]) {
                    await updateCallback(minIdx, null, 'default');
                    minIdx = j;
                    await updateCallback(minIdx, null, 'selected');
                } else {
                    await updateCallback(j, null, 'default');
                }
            }
            
            if (minIdx !== i) {
                await updateCallback(i, minIdx, 'swapping');
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                await updateCallback(null, null, 'render', arr);
                await this.sleep(state.delay);
            }
            
            await updateCallback(i, null, 'sorted');
        }
        await updateCallback(arr.length - 1, null, 'sorted');
        return arr;
    }

    async insertionSort(array, delay, updateCallback) {
        const arr = [...array];
        await updateCallback(0, null, 'sorted');
        
        for (let i = 1; i < arr.length; i++) {
            if (state.shouldStop) return arr;
            
            let key = arr[i];
            let j = i - 1;
            
            await updateCallback(i, null, 'selected');
            await this.sleep(state.delay);
            
            while (j >= 0 && arr[j] > key) {
                if (state.shouldStop) return arr;
                
                await updateCallback(j, null, 'comparing');
                arr[j + 1] = arr[j];
                await updateCallback(null, null, 'render', arr);
                await this.sleep(state.delay);
                await updateCallback(j, null, 'sorted');
                j--;
            }
            
            arr[j + 1] = key;
            await updateCallback(null, null, 'render', arr);
            await updateCallback(j + 1, null, 'sorted');
            await this.sleep(state.delay);
        }
        return arr;
    }

    async mergeSort(array, delay, updateCallback) {
        const arr = [...array];
        await this._mergeSortHelper(arr, 0, arr.length - 1, delay, updateCallback);
    }

    async _mergeSortHelper(arr, left, right, delay, updateCallback) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await this._mergeSortHelper(arr, left, mid, delay, updateCallback);
            await this._mergeSortHelper(arr, mid + 1, right, delay, updateCallback);
            await this._merge(arr, left, mid, right, delay, updateCallback);
        }
    }

    async _merge(arr, left, mid, right, delay, updateCallback) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            if (state.shouldStop) return;
            
            await updateCallback(k, null, 'comparing');
            
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            
            await updateCallback(null, null, 'render', arr);
            await updateCallback(k, null, 'swapping');
            await this.sleep(state.delay);
            await updateCallback(k, null, 'default');
            k++;
        }
        
        while (i < leftArr.length) {
            if (state.shouldStop) return;
            
            await updateCallback(k, null, 'comparing');
            arr[k] = leftArr[i];
            i++;
            await updateCallback(null, null, 'render', arr);
            await updateCallback(k, null, 'swapping');
            await this.sleep(state.delay);
            await updateCallback(k, null, 'default');
            k++;
        }
        
        while (j < rightArr.length) {
            if (state.shouldStop) return;
            
            await updateCallback(k, null, 'comparing');
            arr[k] = rightArr[j];
            j++;
            await updateCallback(null, null, 'render', arr);
            await updateCallback(k, null, 'swapping');
            await this.sleep(state.delay);
            await updateCallback(k, null, 'default');
            k++;
        }
    }

    async quickSort(array, delay, updateCallback) {
        const arr = [...array];
        await this._quickSortHelper(arr, 0, arr.length - 1, delay, updateCallback);
    }

    async _quickSortHelper(arr, low, high, delay, updateCallback) {
        if (low < high) {
            const pi = await this._partition(arr, low, high, delay, updateCallback);
            await this._quickSortHelper(arr, low, pi - 1, delay, updateCallback);
            await this._quickSortHelper(arr, pi + 1, high, delay, updateCallback);
        }
    }

    async _partition(arr, low, high, delay, updateCallback) {
        const pivot = arr[high];
        await updateCallback(high, null, 'pivot');
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (state.shouldStop) return i + 1;
            
            await updateCallback(j, null, 'comparing');
            await this.sleep(state.delay);
            
            if (arr[j] < pivot) {
                i++;
                await updateCallback(i, j, 'swapping');
                [arr[i], arr[j]] = [arr[j], arr[i]];
                await updateCallback(null, null, 'render', arr);
                await this.sleep(state.delay);
                await updateCallback(i, null, 'default');
            }
            await updateCallback(j, null, 'default');
        }
        
        await updateCallback(i + 1, null, 'swapping');
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        await updateCallback(null, null, 'render', arr);
        await this.sleep(state.delay);
        await updateCallback(i + 1, null, 'sorted');
        
        return i + 1;
    }

    async heapSort(array, delay, updateCallback) {
        const arr = [...array];
        const n = arr.length;
        
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if (state.shouldStop) return arr;
            await this._heapify(arr, n, i, delay, updateCallback);
        }
        
        for (let i = n - 1; i > 0; i--) {
            if (state.shouldStop) return arr;
            
            await updateCallback(0, i, 'swapping');
            [arr[0], arr[i]] = [arr[i], arr[0]];
            await updateCallback(null, null, 'render', arr);
            await this.sleep(state.delay);
            await updateCallback(i, null, 'sorted');
            await updateCallback(0, null, 'default');
            await this._heapify(arr, i, 0, delay, updateCallback);
        }
        await updateCallback(0, null, 'sorted');
        return arr;
    }

    async _heapify(arr, n, i, delay, updateCallback) {
        if (state.shouldStop) return;
        
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        await updateCallback(i, null, 'comparing');
        if (left < n) await updateCallback(left, null, 'comparing');
        if (right < n) await updateCallback(right, null, 'comparing');
        await this.sleep(state.delay);
        
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
        
        if (largest !== i) {
            await updateCallback(i, largest, 'swapping');
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            await updateCallback(null, null, 'render', arr);
            await this.sleep(state.delay);
            await updateCallback(i, null, 'default');
            if (left < n) await updateCallback(left, null, 'default');
            if (right < n) await updateCallback(right, null, 'default');
            await this._heapify(arr, n, largest, delay, updateCallback);
        } else {
            await updateCallback(i, null, 'default');
            if (left < n) await updateCallback(left, null, 'default');
            if (right < n) await updateCallback(right, null, 'default');
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// APPLICATION STATE & DOM MANAGEMENT
// ============================================

let state = {
    array: [],
    arraySize: 30,
    delay: 100,
    isPlaying: false,
    isPaused: false,
    shouldStop: false,
    currentAlgorithm: 'bubble',
    savedGraphs: [],
    currentGraphId: null
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

// Sidebar elements
const editButton = document.querySelector('.edit-button');
const createButton = document.querySelector('.create-button');
const createIcon = document.querySelector('.create-icon');
const createGraphModal = document.getElementById('createGraphModal');
const confirmCreateGraph = document.getElementById('confirmCreateGraph');
const cancelCreateGraph = document.getElementById('cancelCreateGraph');
const newGraphNameInput = document.getElementById('newGraphNameInput');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    // Load saved graphs from API
    const response = await SortingAPI.loadGraphs();
    if (response.success) {
        state.savedGraphs = response.data;
        if (state.savedGraphs.length > 0) {
            displayGraphList();
        }
    }
    
    // Generate initial array
    await generateArray();
}

function setupEventListeners() {
    // Size slider
    sizeSlider.addEventListener('input', async (e) => {
        state.arraySize = parseInt(e.target.value);
        sizeValue.textContent = state.arraySize;
        if (!state.isPlaying) {
            await generateArray();
        }
    });
    
    // Delay slider
    delaySlider.addEventListener('input', (e) => {
        state.delay = parseInt(e.target.value);
        delayValue.textContent = `${state.delay}ms`;
        // Speed can now be adjusted during sorting
    });
    
    // Algorithm selector
    algorithmSelect.addEventListener('change', (e) => {
        state.currentAlgorithm = e.target.value;
    });
    
    // Control buttons
    resetBtn.addEventListener('click', async () => {
        if (!state.isPlaying) {
            await generateArray();
        }
    });
    
    playBtn.addEventListener('click', async () => {
        if (state.isPlaying) {
            // Stop/Pause the sorting
            state.shouldStop = true;
            state.isPlaying = false;
            playBtn.querySelector('i').className = 'fa-solid fa-play';
        } else {
            // Start sorting
            state.shouldStop = false;
            await startSorting();
        }
    });
    
    clearBtn.addEventListener('click', () => {
        if (!state.isPlaying) {
            state.array = [];
            renderBars();
        }
    });
    
    // Sidebar buttons
    editButton.addEventListener('click', toggleEditMode);
    createButton.addEventListener('click', showCreateModal);
    createIcon.addEventListener('click', showCreateModal);
    confirmCreateGraph.addEventListener('click', createNewGraph);
    cancelCreateGraph.addEventListener('click', hideCreateModal);
    
    // Modal close on outside click
    createGraphModal.addEventListener('click', (e) => {
        if (e.target === createGraphModal) {
            hideCreateModal();
        }
    });
}

// ============================================
// CORE FUNCTIONS
// ============================================

async function generateArray() {
    const response = await SortingAPI.generateArray(state.arraySize);
    if (response.success) {
        state.array = response.data;
        renderBars();
    }
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
        
        bar.appendChild(valueLabel);  // Add value inside the bar
        barWrapper.appendChild(bar);
        barWrapper.appendChild(indexLabel);
        visualizationContainer.appendChild(barWrapper);
    });
}

async function startSorting() {
    state.isPlaying = true;
    state.shouldStop = false;
    playBtn.querySelector('i').className = 'fa-solid fa-pause';
    
    // Reset all bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.className = 'bar');
    
    // Get sorting data from API
    const response = await SortingAPI.getSortingSteps(state.array, state.currentAlgorithm);
    
    if (response.success) {
        // Update callback for visualization
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
        
        // Execute sorting algorithm
        let result;
        switch (state.currentAlgorithm) {
            case 'bubble':
                result = await visualizer.bubbleSort(state.array, state.delay, updateCallback);
                break;
            case 'selection':
                result = await visualizer.selectionSort(state.array, state.delay, updateCallback);
                break;
            case 'insertion':
                result = await visualizer.insertionSort(state.array, state.delay, updateCallback);
                break;
            case 'merge':
                result = await visualizer.mergeSort(state.array, state.delay, updateCallback);
                break;
            case 'quick':
                result = await visualizer.quickSort(state.array, state.delay, updateCallback);
                break;
            case 'heap':
                result = await visualizer.heapSort(state.array, state.delay, updateCallback);
                break;
        }
        
        // Update array if sorting completed
        if (result && !state.shouldStop) {
            state.array = result;
            renderBars();
        }
        
        // Final animation only if not stopped
        if (!state.shouldStop) {
            for (let i = 0; i < state.array.length; i++) {
                updateBarState(i, 'sorted');
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
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

// ============================================
// GRAPH MANAGEMENT
// ============================================

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