// ============================================
// BACKEND API MODULE
// ============================================

const API_BASE_URL = '';

// In-memory storage for saved graphs
let savedGraphsStore = [];

const SortingAPI = {
    /**
     * Generate a random array of specified size
     * @param {number} size - Size of array to generate
     * @returns {Promise<{success: boolean, data: array}>}
     */
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

    /**
     * Get sorting animation steps from backend
     * @param {array} array - Array to sort
     * @param {string} algorithm - Algorithm name (bubble, selection, insertion, merge, quick)
     * @returns {Promise<{success: boolean, data: array}>}
     */
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
                    // Ignore if we can't read error
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

    /**
     * Save graph to storage
     * @param {object} graphData - Graph data to save
     * @returns {Promise<{success: boolean, data: object}>}
     */
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

    /**
     * Load all saved graphs
     * @returns {Promise<{success: boolean, data: array}>}
     */
    loadGraphs: async () => {
        try {
            return { success: true, data: savedGraphsStore };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Load specific graph by ID
     * @param {number} id - Graph ID
     * @returns {Promise<{success: boolean, data: object}>}
     */
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

    /**
     * Delete graph by ID
     * @param {number} id - Graph ID
     * @returns {Promise<{success: boolean, data: object}>}
     */
    deleteGraph: async (id) => {
        try {
            savedGraphsStore = savedGraphsStore.filter(g => g.id !== id);
            return { success: true, data: { deleted: id } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Update graph by ID
     * @param {number} id - Graph ID
     * @param {object} updates - Updates to apply
     * @returns {Promise<{success: boolean, data: object}>}
     */
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingAPI;
}