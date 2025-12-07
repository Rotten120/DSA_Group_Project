let allGraphs = {};
let currentGraphName = null;
let editMode = false;

function getCurrentGraph() {
    if (!allGraphs || Object.keys(allGraphs).length === 0) {
        return null;
    }
    if (!currentGraphName || !allGraphs[currentGraphName]) {
        return null;
    }
    return {
        name: currentGraphName,
        ...allGraphs[currentGraphName]
    };
}

async function loadAllGraphs() {
    try {
        const data = await getAllGraphs();
        allGraphs = data;
        
        if (!currentGraphName && Object.keys(allGraphs).length > 0) {
            currentGraphName = Object.keys(allGraphs)[0];
        }
        
        updateGraphList();
        return true;
    } catch (error) {
        console.error('Error loading graphs:', error);
        return false;
    }
}

function updateGraphList() {
    const graphListContainer = document.getElementById('graph-list-organizer');
    const noSavedGraph = document.getElementById('noSavedGraph');
    
    if (!graphListContainer) return;

    if (!allGraphs || Object.keys(allGraphs).length === 0) {
        graphListContainer.style.display = 'none';
        if (noSavedGraph) {
            noSavedGraph.style.display = 'flex';
        }
        return;
    }

    graphListContainer.style.display = 'flex';
    if (noSavedGraph) {
        noSavedGraph.style.display = 'none';
    }

    const titleDiv = graphListContainer.querySelector('.graph-list-title');
    graphListContainer.innerHTML = '';
    
    if (titleDiv) {
        graphListContainer.appendChild(titleDiv);
    } else {
        const newTitle = document.createElement('div');
        newTitle.className = 'graph-list-title';
        newTitle.textContent = 'All Graphs';
        graphListContainer.appendChild(newTitle);
    }

    Object.keys(allGraphs).forEach(graphName => {
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
            selectGraph(graphName);
        });
        
        graphListContainer.appendChild(item);
    });
}

async function selectGraph(graphName) {
    currentGraphName = graphName;
    
    if (typeof onGraphChanged === 'function') {
        await onGraphChanged();
    }
    
    updateGraphList();
}

function showEditMode() {
    editMode = true;
    const graph = getCurrentGraph();
    
    if (!graph) {
        console.error('No graph selected');
        return;
    }
    
    document.getElementById('graph-list-organizer').style.display = 'none';
    document.getElementById('node-listOrganizer').style.display = 'flex';
    const noSavedGraph = document.getElementById('noSavedGraph');
    if (noSavedGraph) {
        noSavedGraph.style.display = 'none';
    }
    
    const nameList = document.getElementById('nameList');
    const graphTitle = document.getElementById('graphTitle');
    
    nameList.innerHTML = '';
    
    if (graph.order && graph.order.length > 0) {
        graph.order.forEach((value, index) => {
            addNameToList(value, index);
        });
    } else {
        console.log('Empty graph - no names to display');
    }
    
    graphTitle.textContent = graph.name;
    graphTitle.contentEditable = 'true';
}

function addNameToList(name = '', index = null) {
    const nameList = document.getElementById('nameList');
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
    editMode = false;
    document.getElementById('node-listOrganizer').style.display = 'none';
    document.getElementById('graph-list-organizer').style.display = 'flex';
}

async function saveEditedGraph() {
    const graph = getCurrentGraph();
    if (!graph) return;
    
    const nameList = document.getElementById('nameList');
    const inputs = nameList.querySelectorAll('input');
    const graphTitle = document.getElementById('graphTitle');
    const newTitle = graphTitle.textContent.trim() || graph.name;
    
    try {
        if (newTitle !== graph.name) {
            const response = await renameGraph(graph.name, newTitle);
            allGraphs = response;
            currentGraphName = newTitle;
        }
        
        const currentValues = graph.order || [];
        const newValues = Array.from(inputs)
            .map(input => input.value.trim())
            .filter(name => name.length > 0);
        
        for (const oldValue of currentValues) {
            if (!newValues.includes(oldValue)) {
                await deleteNode(currentGraphName, oldValue);
            }
        }
        
        for (const newValue of newValues) {
            if (!currentValues.includes(newValue)) {
                await createNode(currentGraphName, newValue);
            }
        }
        
        await loadAllGraphs();
        
        hideEditMode();
        
        if (typeof onGraphChanged === 'function') {
            await onGraphChanged();
        }
        
        console.log('Graph saved successfully');
    } catch (error) {
        console.error('Error saving graph:', error);
        alert('Failed to save graph. Please try again.');
    }
}

async function createNewGraph() {
    const graphName = prompt('Enter new graph name:');
    if (!graphName || graphName.trim() === '') {
        return;
    }
    
    const trimmedName = graphName.trim();
    
    if (allGraphs[trimmedName]) {
        alert('A graph with this name already exists!');
        return;
    }
    
    try {
        const response = await createGraph(trimmedName);
        allGraphs = response;
        currentGraphName = trimmedName;
        
        updateGraphList();
        showEditMode();
    } catch (error) {
        console.error('Error creating graph:', error);
        alert('Failed to create graph. Please try again.');
    }
}

async function deleteGraph(graphName) {
    if (!confirm(`Are you sure you want to delete "${graphName}"?`)) {
        return;
    }
    
    try {
        const response = await deleteGraphAPI(graphName);
        allGraphs = response;
        
        if (currentGraphName === graphName) {
            const remainingGraphs = Object.keys(allGraphs);
            if (remainingGraphs.length > 0) {
                currentGraphName = remainingGraphs[0];
                
                if (typeof onGraphChanged === 'function') {
                    await onGraphChanged();
                }
            } else {
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
        console.log(`Graph ${graphName} deleted successfully`);
    } catch (error) {
        console.error('Error deleting graph:', error);
        alert('Failed to delete graph. Please try again.');
    }
}

function initializeSidebar() {
    console.log('Initializing sidebar...');
    
    loadAllGraphs();
    
    const editBtn = document.querySelector('.edit-button');
    if (editBtn) {
        editBtn.addEventListener('click', showEditMode);
    }
    
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideEditMode);
    }
    
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveEditedGraph);
    }
    
    const addNameBtn = document.getElementById('addNameBtn');
    if (addNameBtn) {
        addNameBtn.addEventListener('click', () => addNameToList());
    }

    const createBtn = document.querySelector('.create-button');
    if (createBtn) {
        createBtn.addEventListener('click', createNewGraph);
    }
    
    console.log('Sidebar initialized successfully');
}