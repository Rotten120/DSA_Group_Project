let allGraphs = [
    { id: 1, title: "My Name Organizer", names: ["Angel", "Laika", "Clarito", "The", "Best", "Skye", "User"] },
    { id: 2, title: "graph2", names: ["Alice", "Bob", "Charlie"] },
    { id: 3, title: "graph3", names: ["Zara", "Mike", "Nina"] }
];
let currentGraphId = 1;
let editMode = false;

function getCurrentGraph() {
    if (!allGraphs || allGraphs.length === 0) {
        return null;
    }
    return allGraphs.find(g => g.id === currentGraphId);
}

function updateGraphList() {
    const graphListContainer = document.getElementById('graph-list-organizer');
    const noSavedGraph = document.getElementById('noSavedGraph');
    
    if (!graphListContainer) return;

    if (!allGraphs || allGraphs.length === 0) {
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

    allGraphs.forEach(graph => {
        const item = document.createElement('div');
        item.className = 'graph-list-item';
        if (graph.id === currentGraphId) {
            item.classList.add('active');
        }
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = graph.title;
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
            deleteGraph(graph.id);
        });
        
        item.appendChild(titleSpan);
        item.appendChild(deleteBtn);
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        
        titleSpan.addEventListener('click', () => {
            selectGraph(graph.id);
        });
        
        graphListContainer.appendChild(item);
    });
}

async function selectGraph(graphId) {
    currentGraphId = graphId;
    
    if (typeof onGraphChanged === 'function') {
        await onGraphChanged();
    }
    
    updateGraphList();
}

function showEditMode() {
    editMode = true;
    const graph = getCurrentGraph();
    
    document.getElementById('graph-list-organizer').style.display = 'none';
    document.getElementById('node-listOrganizer').style.display = 'flex';
    const noSavedGraph = document.getElementById('noSavedGraph');
    if (noSavedGraph) {
        noSavedGraph.style.display = 'none';
    }
    
    const nameList = document.getElementById('nameList');
    const graphTitle = document.getElementById('graphTitle');
    
    nameList.innerHTML = '';
    if (graph.names && graph.names.length > 0) {
        graph.names.forEach((name, index) => {
            addNameToList(name, index);
        });
    } else {
        console.log('Empty graph - no names to display');
    }
    
    graphTitle.textContent = graph.title;
}

function addNameToList(name = '', index = null) {
    const nameList = document.getElementById('nameList');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = name;
    input.placeholder = 'Enter name...';
    input.style.cssText = 'background: transparent; border: none; color: white; flex: 1; outline: none;';
    input.dataset.index = index !== null ? index : nameList.children.length;
    
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
    const nameList = document.getElementById('nameList');
    const inputs = nameList.querySelectorAll('input');
    const newNames = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(name => name.length > 0);
    
    const graphTitle = document.getElementById('graphTitle');
    const newTitle = graphTitle.textContent.trim() || 'My Name Organizer';
    
    const graph = getCurrentGraph();
    graph.names = newNames;
    graph.title = newTitle;
    
    // TODO: Replace with real backend API call to save graph
    // const response = await fetch('/api/graphs/update', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ id: graph.id, title: newTitle, names: newNames })
    // });
    
    hideEditMode();
    updateGraphList();
    
    if (typeof onGraphChanged === 'function') {
        await onGraphChanged();
    }
    
    console.log('Graph saved:', graph);
}

function createNewGraph() {
    const newId = Math.max(...allGraphs.map(g => g.id)) + 1;
    const newGraph = {
        id: newId,
        title: `Graph ${newId}`,
        names: []
    };
    
    // TODO: Replace with real backend API call to create graph
    // const response = await fetch('/api/graphs/create', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(newGraph)
    // });
    
    allGraphs.push(newGraph);
    selectGraph(newId);
    showEditMode();
}

async function deleteGraph(graphId) {
    const graphToDelete = allGraphs.find(g => g.id === graphId);
    if (!confirm(`Are you sure you want to delete "${graphToDelete.title}"?`)) {
        return;
    }
    
    // TODO: Replace with real backend API call to delete graph
    // const response = await fetch(`/api/graphs/${graphId}`, {
    //     method: 'DELETE',
    //     headers: { 'Content-Type': 'application/json' }
    // });
    
    allGraphs = allGraphs.filter(g => g.id !== graphId);
    
    if (currentGraphId === graphId && allGraphs.length > 0) {
        currentGraphId = allGraphs[0].id;
        
        if (typeof onGraphChanged === 'function') {
            await onGraphChanged();
        }
    } else if (allGraphs.length === 0) {
        currentGraphId = null;
        const treeContainer = document.getElementById('treeContainer');
        const orderList = document.getElementById('orderList');
        
        if (treeContainer) {
            treeContainer.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-size: 18px;"><div style="font-size: 48px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div><div>No graphs available</div><div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "CREATE NEW GRAPH" to get started</div></div>';
        }
        
        if (orderList) {
            orderList.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-size: 18px;"><div style="font-size: 48px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div><div>No graphs available</div><div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "CREATE NEW GRAPH" to get started</div></div>';
        }
    }
    
    updateGraphList();
    
    console.log(`Graph ${graphId} deleted successfully`);
}

function initializeSidebar() {
    console.log('Initializing sidebar...');
    
    updateGraphList();
    
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