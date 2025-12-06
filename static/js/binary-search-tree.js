// ============================================
// TEMPORARY MOCK BACKEND API (Replace with real backend later)
// ============================================

const MockBackendAPI = {
    // Simulate backend building BST and returning tree structure
    async buildBST(names) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Backend would build the tree and return the structure
        const tree = this._buildTreeStructure(names);
        return {
            success: true,
            tree: tree
        };
    },

    // Simulate backend returning sorted order
    async getSortedOrder(names) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Backend would return sorted names
        const sorted = [...names].sort((a, b) => 
            a.toLowerCase().localeCompare(b.toLowerCase())
        );
        return {
            success: true,
            sorted: sorted
        };
    },

    // Helper: Build tree structure (this logic would be in backend)
    _buildTreeStructure(names) {
        if (!names || names.length === 0) return null;

        class TreeNode {
            constructor(name) {
                this.name = name;
                this.left = null;
                this.right = null;
            }
        }

        let root = null;

        const insert = (node, name) => {
            if (!node) return new TreeNode(name);
            
            if (name.toLowerCase() < node.name.toLowerCase()) {
                node.left = insert(node.left, name);
            } else {
                node.right = insert(node.right, name);
            }
            return node;
        };

        names.forEach(name => {
            root = insert(root, name);
        });

        return root;
    }
};

// FRONTEND CODE

let treeData = null;
let sortedData = null;

// TEMPORARY DICTIONARY ( OR CAN BE USE TO SAVE THE DATA.)
let graph = {
    title: "My Name Organizer",
    names: ["Angel", "Laika", "Clarito", "The", "Best", "Skye", "User"]
};

// Initialize tree data from backend
async function initializeTreeData() {
    try {
        // TODO: Replace with real backend API call
        // const response = await fetch('/api/bst/build', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ names: names })
        // });
        // const data = await response.json();
        
        const data = await MockBackendAPI.buildBST(graph.names);
        
        if (data.success) {
            treeData = data.tree;
            console.log('Tree data loaded from backend');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error loading tree data:', error);
        return false;
    }
}

// Get sorted order from backend
async function getSortedNames() {
    try {
        // TODO: Replace with real backend API call
        // const response = await fetch('/api/bst/sorted', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ names: names })
        // });
        // const data = await response.json();
        
        const data = await MockBackendAPI.getSortedOrder(graph.names);
        
        if (data.success) {
            sortedData = data.sorted;
            return sortedData;
        }
        return [];
    } catch (error) {
        console.error('Error loading sorted data:', error);
        return [];
    }
}

// Draw tree function (uses backend data).
function drawTree() {
    const container = document.getElementById('treeContainer');
    if (!container) {
        console.error('Tree container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (!treeData) {
        console.error('Tree data not loaded');
        container.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Loading tree data...</div>';
        return;
    }

    // For the tile.
    const titleEl = document.createElement('div');
    titleEl.className = 'graph-title';
    titleEl.textContent = graph.title;
    titleEl.style.cssText = `
        color: white;
        font-size: 24px;
        font-weight: bold;
        font-style: italic;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px 30px;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 20px;
        width: 100%;
        max-width: 800px;
        box-sizing: border-box;
    `;
    container.appendChild(titleEl);

    const levelGap = 100;
    const startX = 400;
    const startY = 130; 
    const initialOffset = 400;
    
    const positions = new Map();

    function calculatePositions(node, x, y, level, xOffset) {
        if (!node) return;

        positions.set(node, { x, y });

        const gap = xOffset / 2;
        if (node.left) {
            calculatePositions(node.left, x - gap, y + levelGap, level + 1, gap);
        }
        if (node.right) {
            calculatePositions(node.right, x + gap, y + levelGap, level + 1, gap);
        }
    }

    calculatePositions(treeData, startX, startY, 0, initialOffset);

    // Draw lines first.
    positions.forEach((pos, node) => {
        if (node.left) {
            const childPos = positions.get(node.left);
            drawLine(pos.x, pos.y, childPos.x, childPos.y, container);
        }
        if (node.right) {
            const childPos = positions.get(node.right);
            drawLine(pos.x, pos.y, childPos.x, childPos.y, container);
        }
    });

    // Draw nodes.
    positions.forEach((pos, node) => {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'tree-node';
        nodeEl.textContent = node.name;
        nodeEl.style.left = pos.x + 'px';
        nodeEl.style.top = pos.y + 'px';
        container.appendChild(nodeEl);
    });

    console.log('Tree drawn with', positions.size, 'nodes');
}

// Draw line helper function.
function drawLine(x1, y1, x2, y2, container) {
    const line = document.createElement('div');
    line.className = 'tree-line';
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    line.style.width = length + 'px';
    line.style.left = x1 + 'px';
    line.style.top = y1 + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    
    container.appendChild(line);
}

// Draw sorted list function (uses backend data).
async function drawSortedList() {
    const listContainer = document.getElementById('orderList');
    
    if (!listContainer) {
        console.error('Order list container not found');
        return;
    }
    
    listContainer.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Loading...</div>';

    // Get sorted data from backend.
    const sortedNames = await getSortedNames();
    
    if (!sortedNames || sortedNames.length === 0) {
        listContainer.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">No data available</div>';
        return;
    }
    
    console.log('Drawing sorted list with names:', sortedNames);
    listContainer.innerHTML = '';

    // Add title at the top (matching tree view style).
    const titleEl = document.createElement('div');
    titleEl.className = 'graph-title';
    titleEl.textContent = graph.title;
    titleEl.style.cssText = `
        display: block;
        color: white;
        font-size: 24px;
        font-weight: bold;
        font-style: italic;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px 30px;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 20px;
        width: 100%;
        box-sizing: border-box;
    `;
    listContainer.appendChild(titleEl);

    sortedNames.forEach(name => {
        const item = document.createElement('div');
        item.className = 'order-item';
        item.textContent = name;
        listContainer.appendChild(item);
    });

    console.log('Sorted list drawn with', sortedNames.length, 'items');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - Initializing BST');
    
    // Load tree data from backend first
    const loaded = await initializeTreeData();
    if (!loaded) {
        console.error('Failed to load tree data from backend');
        return;
    }
    
    const buttons = document.querySelectorAll('.view-button');
    const treeView = document.getElementById('treeView');
    const orderView = document.getElementById('orderView');

    console.log('Found', buttons.length, 'buttons');
    console.log('Tree view:', treeView);
    console.log('Order view:', orderView);

    if (!buttons.length || !treeView || !orderView) {
        console.error('Required elements not found');
        return;
    }

    // Make sure tree view is active initially.
    treeView.classList.add('active');
    orderView.classList.remove('active');

    // Handle graph title input if it exists.
    const titleInput = document.getElementById('graphTitleInput');
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            graph.title = this.value || 'My Name Organizer';
            // Redraw based on current view.
            if (treeView.classList.contains('active')) {
                drawTree();
            } else if (orderView.classList.contains('active')) {
                drawSortedList();
            }
        });
    }

    // Button click handlers.
    buttons.forEach((button, index) => {
        console.log('Button', index, ':', button.textContent.trim());
        
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent.trim());
            
            // Remove active class from all buttons.
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button.
            this.classList.add('active');

            const buttonText = this.textContent.trim().toLowerCase();
            
            if (buttonText.includes('order')) {
                // VIEW ORDER button.
                console.log('Switching to ORDER view');
                treeView.classList.remove('active');
                orderView.classList.add('active');
                drawSortedList();
            } else if (buttonText.includes('graph')) {
                // VIEW GRAPH button.
                console.log('Switching to GRAPH view');
                orderView.classList.remove('active');
                treeView.classList.add('active');
                drawTree();
            }
        });
    });

    // Initial draw - show tree by default.
    console.log('Drawing initial tree');
    drawTree();
});

// ============================================
// BACKEND INTEGRATION GUIDE
// ============================================
/*
To integrate with your real backend:

1. Replace MockBackendAPI with actual API calls:
   
   Backend Endpoints needed:
   - POST /api/bst/build
     Input: { names: ["Angel", "Laika", ...] }
     Output: { success: true, tree: <TreeNode structure> }
   
   - POST /api/bst/sorted  
     Input: { names: ["Angel", "Laika", ...] }
     Output: { success: true, sorted: ["Angel", "Best", ...] }

2. Backend should implement:
   - BST construction algorithm (insert nodes alphabetically)
   - In-order traversal for sorted output
   - Return tree as JSON structure with {name, left, right} nodes

3. Update the fetch calls in:
   - initializeTreeData() function
   - getSortedNames() function

4. Remove the entire MockBackendAPI object once backend is ready

Example backend response format:
{
  "success": true,
  "tree": {
    "name": "Angel",
    "left": {
      "name": "Laika",
      "left": {...},
      "right": {...}
    },
    "right": null
  }
}
*/