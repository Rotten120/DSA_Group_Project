// Use absolute path from static root
import { 
    getAllGraphs, 
    createGraph, 
    deleteGraph as deleteGraphAPI, 
    renameGraph,
    createNode,
    deleteNode 
} from '/static/api-js/bst-api.js';

let allGraphs = {};
let currentGraphName = null;
let editMode = false;
let graphChangeCallback = null;

export function setGraphChangeCallback(callback) {
    console.log('Setting graph change callback');
    graphChangeCallback = callback;
}

export function getCurrentGraph() {
    if (!allGraphs || Object.keys(allGraphs).length === 0) {
        console.log('getCurrentGraph: No graphs available');
        return null;
    }
    if (!currentGraphName || !allGraphs[currentGraphName]) {
        console.log('getCurrentGraph: No current graph selected');
        return null;
    }
    return {
        name: currentGraphName,
        ...allGraphs[currentGraphName]
    };
}

async function loadAllGraphs() {
    try {
        console.log('Loading all graphs from API...');
        const data = await getAllGraphs();
        console.log('Received graphs data:', data);
        
        allGraphs = data;
        console.log('All graphs loaded:', Object.keys(allGraphs));
        
        if (!currentGraphName && Object.keys(allGraphs).length > 0) {
            currentGraphName = Object.keys(allGraphs)[0];
            console.log('Set current graph to:', currentGraphName);
        }
        
        updateGraphList();
        return true;
    } catch (error) {
        console.error('Error loading graphs:', error);
        alert('Failed to load graphs. Check console for details.');
        return false;
    }
}

function updateGraphList() {
    const graphListContainer = document.getElementById('graph-list-organizer');
    const noSavedGraph = document.getElementById('noSavedGraph');
    
    console.log('Updating graph list...');
    console.log('   Graph count:', Object.keys(allGraphs).length);
    console.log('   Container found:', !!graphListContainer);
    console.log('   NoSavedGraph found:', !!noSavedGraph);
    
    if (!graphListContainer) {
        console.error('graph-list-organizer element not found!');
        return;
    }

    if (!allGraphs || Object.keys(allGraphs).length === 0) {
        console.log('No graphs - showing empty state');
        graphListContainer.style.display = 'none';
        if (noSavedGraph) {
            noSavedGraph.style.display = 'flex';
            noSavedGraph.style.flexDirection = 'column';
            noSavedGraph.style.alignItems = 'center';
        }
        return;
    }

    console.log('Showing graph list with', Object.keys(allGraphs).length, 'graphs');
    graphListContainer.style.display = 'flex';
    if (noSavedGraph) {
        noSavedGraph.style.display = 'none';
    }

    const titleDiv = graphListContainer.querySelector('.graph-list-title');
    graphListContainer.innerHTML = '';
    
    if (titleDiv) {
        graphListContainer.appendChild(titleDiv.cloneNode(true));
    } else {
        const newTitle = document.createElement('div');
        newTitle.className = 'graph-list-title';
        newTitle.textContent = 'All Graphs';
        graphListContainer.appendChild(newTitle);
    }

    Object.keys(allGraphs).forEach(graphName => {
        console.log('   Adding graph to list:', graphName);
        const item = document.createElement('div');
        item.className = 'graph-list-item';
        if (graphName === currentGraphName) {
            item.classList.add('active');
        }
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = graphName;
        titleSpan.style.cursor = 'pointer';
        titleSpan.style.flex = '1';
        
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-graph-btn';
        deleteBtn.style.cssText = 'cursor: pointer; font-size: 20px; margin-left: 10px; padding: 0 5px; opacity: 0.7; transition: opacity 0.2s;';
        deleteBtn.title = 'Delete graph';
        
        deleteBtn.addEventListener('mouseenter', () => {
            deleteBtn.style.opacity = '1';
        });
        
        deleteBtn.addEventListener('mouseleave', () => {
            deleteBtn.style.opacity = '0.7';
        });
        
        deleteBtn.addEventListener('click', (e) => {
            console.log('Delete button clicked for:', graphName);
            e.stopPropagation();
            deleteGraph(graphName);
        });
        
        item.appendChild(titleSpan);
        item.appendChild(deleteBtn);
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        
        titleSpan.addEventListener('click', () => {
            console.log('Graph selected:', graphName);
            selectGraph(graphName);
        });
        
        graphListContainer.appendChild(item);
    });
    
    console.log('Graph list updated successfully');
}

async function selectGraph(graphName) {
    console.log('Selecting graph:', graphName);
    currentGraphName = graphName;
    
    if (graphChangeCallback) {
        console.log('Calling graph change callback...');
        await graphChangeCallback();
    }
    
    updateGraphList();
}

function showEditMode() {
    console.log('Showing edit mode');
    editMode = true;
    const graph = getCurrentGraph();
    
    if (!graph) {
        console.error('No graph selected for editing');
        alert('Please select or create a graph first');
        return;
    }
    
    console.log('Editing graph:', graph.name);
    
    const graphListOrganizer = document.getElementById('graph-list-organizer');
    const nodeListOrganizer = document.getElementById('node-listOrganizer');
    const noSavedGraph = document.getElementById('noSavedGraph');
    
    console.log('   Elements found:', {
        graphListOrganizer: !!graphListOrganizer,
        nodeListOrganizer: !!nodeListOrganizer,
        noSavedGraph: !!noSavedGraph
    });
    
    if (graphListOrganizer) graphListOrganizer.style.display = 'none';
    if (nodeListOrganizer) nodeListOrganizer.style.display = 'flex';
    if (noSavedGraph) noSavedGraph.style.display = 'none';
    
    const nameList = document.getElementById('nameList');
    const graphTitle = document.getElementById('graphTitle');
    
    if (!nameList || !graphTitle) {
        console.error('nameList or graphTitle not found!');
        return;
    }
    
    nameList.innerHTML = '';
    
    if (graph.order && graph.order.length > 0) {
        console.log('   Adding', graph.order.length, 'names to list');
        graph.order.forEach((value, index) => {
            addNameToList(value, index);
        });
    } else {
        console.log('   Empty graph - no names to display');
    }
    
    graphTitle.textContent = graph.name;
    graphTitle.contentEditable = 'true';
    
    console.log('Edit mode shown');
}

function addNameToList(name = '', index = null) {
    console.log('Adding name to list:', name);
    const nameList = document.getElementById('nameList');
    if (!nameList) {
        console.error('nameList not found!');
        return;
    }
    
    const item = document.createElement('div');
    item.className = 'list-item';
    item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px; margin-bottom: 5px;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = name;
    input.placeholder = 'Enter name...';
    input.style.cssText = 'background: transparent; border: none; color: white; flex: 1; outline: none;';
    input.dataset.originalValue = name;
    
    const deleteBtn = document.createElement('span');
    deleteBtn.textContent = '×';
    deleteBtn.style.cssText = 'cursor: pointer; font-size: 20px; color: white; margin-left: 10px;';
    deleteBtn.addEventListener('click', () => {
        console.log('Removing name from list:', name);
        item.remove();
    });
    
    item.appendChild(input);
    item.appendChild(deleteBtn);
    nameList.appendChild(item);
    
    if (!name) {
        input.focus();
    }
}

function hideEditMode() {
    console.log('Hiding edit mode');
    editMode = false;
    
    const nodeListOrganizer = document.getElementById('node-listOrganizer');
    if (nodeListOrganizer) nodeListOrganizer.style.display = 'none';
    
    // Show appropriate view based on whether graphs exist
    if (allGraphs && Object.keys(allGraphs).length > 0) {
        const graphListOrganizer = document.getElementById('graph-list-organizer');
        if (graphListOrganizer) graphListOrganizer.style.display = 'flex';
    } else {
        const noSavedGraph = document.getElementById('noSavedGraph');
        if (noSavedGraph) {
            noSavedGraph.style.display = 'flex';
            noSavedGraph.style.flexDirection = 'column';
            noSavedGraph.style.alignItems = 'center';
        }
    }
    
    console.log('Edit mode hidden');
}

async function saveEditedGraph() {
    console.log('Saving edited graph...');
    const graph = getCurrentGraph();
    if (!graph) {
        console.error('No graph to save');
        return;
    }
    
    const nameList = document.getElementById('nameList');
    const inputs = nameList.querySelectorAll('input');
    const graphTitle = document.getElementById('graphTitle');
    const newTitle = graphTitle.textContent.trim() || graph.name;
    
    console.log('   Current graph name:', graph.name);
    console.log('   New graph name:', newTitle);
    console.log('   Number of inputs:', inputs.length);
    
    try {
        if (newTitle !== graph.name) {
            console.log('Renaming graph:', graph.name, '->', newTitle);
            const response = await renameGraph(graph.name, newTitle);
            allGraphs = response;
            currentGraphName = newTitle;
            console.log('Graph renamed successfully');
        }
        
        const currentValues = graph.order || [];
        const newValues = Array.from(inputs)
            .map(input => input.value.trim())
            .filter(name => name.length > 0);
        
        console.log('   Current values:', currentValues);
        console.log('   New values:', newValues);
        
        for (const oldValue of currentValues) {
            if (!newValues.includes(oldValue)) {
                console.log('Deleting node:', oldValue);
                await deleteNode(currentGraphName, oldValue);
            }
        }
        
        for (const newValue of newValues) {
            if (!currentValues.includes(newValue)) {
                console.log('Creating node:', newValue);
                await createNode(currentGraphName, newValue);
            }
        }
        
        console.log('Reloading graphs...');
        await loadAllGraphs();
        
        hideEditMode();
        
        if (graphChangeCallback) {
            console.log('Calling graph change callback...');
            await graphChangeCallback();
        }
        
        console.log('Graph saved successfully');
    } catch (error) {
        console.error('Error saving graph:', error);
        alert('Failed to save graph. Error: ' + error.message);
    }
}

async function createNewGraph() {
    console.log('Creating new graph...');
    
    const modal = document.getElementById('createGraphModal');
    const input = document.getElementById('newGraphNameInput');
    const confirmBtn = document.getElementById('confirmCreateGraph');
    const cancelBtn = document.getElementById('cancelCreateGraph');
    
    modal.style.display = 'flex';
    input.value = '';
    input.focus();
    
    const handleConfirm = async () => {
        const graphName = input.value.trim();
        
        if (!graphName || graphName === '') {
            console.log('Graph creation cancelled - no name provided');
            modal.style.display = 'none';
            cleanup();
            return;
        }
        
        if (allGraphs[graphName]) {
            console.log('Graph already exists:', graphName);
            alert('A graph with this name already exists!');
            return;
        }
        
        try {
            console.log('Calling API to create graph:', graphName);
            const response = await createGraph(graphName);
            console.log('API response:', response);
            
            allGraphs = response;
            currentGraphName = graphName;
            
            console.log('Graph created:', graphName);
            console.log('   Total graphs now:', Object.keys(allGraphs).length);
            
            updateGraphList();
            showEditMode();
            
            modal.style.display = 'none';
            cleanup();
        } catch (error) {
            console.error('Error creating graph:', error);
            alert('Failed to create graph. Error: ' + error.message);
        }
    };
    
    const handleCancel = () => {
        console.log('Graph creation cancelled');
        modal.style.display = 'none';
        cleanup();
    };
    
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };
    
    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
        input.removeEventListener('keydown', handleEnter);
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    input.addEventListener('keydown', handleEnter);
}

async function deleteGraph(graphName) {
    console.log('Attempting to delete graph:', graphName);
    
    if (!confirm(`Are you sure you want to delete "${graphName}"?`)) {
        console.log('Deletion cancelled by user');
        return;
    }
    
    try {
        console.log('Calling API to delete graph:', graphName);
        const response = await deleteGraphAPI(graphName);
        allGraphs = response;
        
        console.log('Graph deleted:', graphName);
        console.log('   Remaining graphs:', Object.keys(allGraphs).length);
        
        if (currentGraphName === graphName) {
            const remainingGraphs = Object.keys(allGraphs);
            if (remainingGraphs.length > 0) {
                currentGraphName = remainingGraphs[0];
                console.log('Switched to graph:', currentGraphName);
                
                if (graphChangeCallback) {
                    await graphChangeCallback();
                }
            } else {
                console.log('📭 No graphs remaining');
                currentGraphName = null;
                const treeContainer = document.getElementById('treeContainer');
                const orderList = document.getElementById('orderList');
                
                if (treeContainer) {
                    treeContainer.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-size: 18px;"><div style="font-size: 48px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div><div>No graphs available</div><div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "CREATE NEW GRAPH" to get started</div></div>';
                }
                
                if (orderList) {
                    orderList.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-size: 18px;"><div style="font-size: 48px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div><div>No graphs available</div><div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "CREATE NEW GRAPH" to get started</div></div>';
                }
            }
        }
        
        updateGraphList();
    } catch (error) {
        console.error('Error deleting graph:', error);
        alert('Failed to delete graph. Error: ' + error.message);
    }
}

export function initializeSidebar() {
    console.log('Initializing sidebar...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        console.log('DOM still loading, waiting...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, setting up now');
            setupSidebarListeners();
        });
    } else {
        console.log('DOM ready, setting up now');
        setupSidebarListeners();
    }
    
    loadAllGraphs();
}

function setupSidebarListeners() {
    console.log('Setting up sidebar listeners...');
    
    const editBtn = document.querySelector('.edit-button');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');
    const addNameBtn = document.getElementById('addNameBtn');
    const createBtn = document.querySelector('.create-button');
    
    const foundButtons = {
        editBtn: !!editBtn,
        cancelBtn: !!cancelBtn,
        saveBtn: !!saveBtn,
        addNameBtn: !!addNameBtn,
        createBtn: !!createBtn
    };
    
    console.log('Button search results:', foundButtons);
    
    if (editBtn) {
        console.log('Edit button found, attaching listener');
        editBtn.addEventListener('click', (e) => {
            console.log('EDIT BUTTON CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            showEditMode();
        });
        editBtn.style.cursor = 'pointer';
        editBtn.style.userSelect = 'none';
    } else {
        console.error('Edit button (.edit-button) not found in DOM!');
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            console.log('CANCEL BUTTON CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            hideEditMode();
        });
    } else {
        console.error('Cancel button (.cancel-btn) not found!');
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            console.log('SAVE BUTTON CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            saveEditedGraph();
        });
    } else {
        console.error('Save button (.save-btn) not found!');
    }
    
    if (addNameBtn) {
        addNameBtn.addEventListener('click', (e) => {
            console.log('🖱️ ADD NAME BUTTON CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            addNameToList();
        });
    } else {
        console.error('Add name button (#addNameBtn) not found!');
    }

    if (createBtn) {
        console.log('Create button found, attaching listener');
        createBtn.addEventListener('click', (e) => {
            console.log('CREATE BUTTON CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            createNewGraph();
        });
        createBtn.style.cursor = 'pointer';
        createBtn.style.userSelect = 'none';
    } else {
        console.error('Create button (.create-button) not found in DOM!');
    }
    
    console.log('Sidebar listeners setup complete');
}