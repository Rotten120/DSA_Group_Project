import { getGraph } from '/static/api-js/bst-api.js';
import { getCurrentGraph, initializeSidebar, setGraphChangeCallback } from './side-bar-bst.js';

let treeData = null;
let sortedData = null;

async function initializeTreeData() {
    try {
        const graph = getCurrentGraph();
        
        if (!graph) {
            console.log('No graph selected');
             updateAllInfoButtons(null, []);
            return false;
        }
        
        const data = await getGraph(graph.name);
        
        if (data && data.nodes) {
            treeData = convertToTreeStructure(data.nodes);
            sortedData = data.order || [];
            updateAllInfoButtons(treeData, sortedData);
            console.log('Tree data loaded from backend');
            return true;
        }
        
        treeData = null;
        sortedData = [];
        return true;
    } catch (error) {
        console.error('Error loading tree data:', error);
        return false;
    }
}

function convertToTreeStructure(nodes) {
    if (!nodes || !nodes.root) {
        return null;
    }
    
    const nodeMap = new Map();
    
    nodeMap.set(nodes.root.value, {
        name: nodes.root.value,
        left: nodes.root.left !== null ? nodes.root.left : null,
        right: nodes.root.right !== null ? nodes.root.right : null
    });
    
    if (nodes.children && nodes.children.length > 0) {
        nodes.children.forEach(child => {
            nodeMap.set(child.value, {
                name: child.value,
                left: child.left !== null ? child.left : null,
                right: child.right !== null ? child.right : null
            });
        });
    }
    
    function buildNode(value) {
        if (value === null) return null;
        
        const nodeData = nodeMap.get(value);
        if (!nodeData) return null;
        
        return {
            name: nodeData.name,
            left: buildNode(nodeData.left),
            right: buildNode(nodeData.right)
        };
    }
    
    return buildNode(nodes.root.value);
}

async function getSortedNames() {
    try {
        const graph = getCurrentGraph();
        
        if (!graph) {
            return [];
        }
        
        return sortedData || [];
    } catch (error) {
        console.error('Error loading sorted data:', error);
        return [];
    }
}

function drawTree() {
    const container = document.getElementById('treeContainer');
    if (!container) {
        console.error('Tree container not found');
        return;
    }
    
    container.innerHTML = '';
    
    const graph = getCurrentGraph();
    
    if (!graph) {
        container.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-size: 18px;"><div style="font-size: 48px; margin-top: 100px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div><div>No graphs available</div><div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "CREATE NEW GRAPH" to get started</div></div>';
        return;
    }
    
    const titleEl = document.createElement('div');
    titleEl.className = 'graph-title';
    titleEl.textContent = graph.name;
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
    
    if (!treeData) {
        console.log('Empty graph - no tree to display');
        const emptyMessage = document.createElement('div');
        emptyMessage.style.cssText = 'color: white; text-align: center; padding: 50px; font-size: 18px; opacity: 0.7;';
        emptyMessage.innerHTML = `
            <div style="font-size: 48px; margin-top: 50px; margin-bottom: 20px;"><i class="fa-solid fa-file"></i></div>
            <div>This graph is empty</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "EDIT GRAPH" to add names</div>
        `;
        container.appendChild(emptyMessage);
        return;
    }

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

async function drawSortedList() {
    const listContainer = document.getElementById('orderList');
    
    if (!listContainer) {
        console.error('Order list container not found');
        return;
    }
    
    listContainer.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Loading...</div>';

    const sortedNames = await getSortedNames();
    
    console.log('Drawing sorted list with names:', sortedNames);
    listContainer.innerHTML = '';

    const graph = getCurrentGraph();
    
    if (!graph) {
        listContainer.innerHTML = '<div style="color: white; text-align: center; padding: 50px; font-size: 18px;"><div style="font-size: 48px; margin-top: 100px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div><div>No graphs available</div><div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "CREATE NEW GRAPH" to get started</div></div>';
        return;
    }
    
    const titleEl = document.createElement('div');
    titleEl.className = 'graph-title';
    titleEl.textContent = graph.name;
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

    if (!sortedNames || sortedNames.length === 0) {
        console.log('Empty graph - no order to display');
        const emptyMessage = document.createElement('div');
        emptyMessage.style.cssText = 'color: white; text-align: center; padding: 50px; font-size: 18px; opacity: 0.7;';
        emptyMessage.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;"><i class="fa-solid fa-chart-area"></i></div>
            <div>This graph is empty</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.6;">Click "EDIT GRAPH" to add names</div>
        `;
        listContainer.appendChild(emptyMessage);
        return;
    }

    sortedNames.forEach(name => {
        const item = document.createElement('div');
        item.className = 'order-item';
        item.textContent = name;
        listContainer.appendChild(item);
    });

    console.log('Sorted list drawn with', sortedNames.length, 'items');
}

async function onGraphChanged() {
    console.log('Graph changed, reloading data...');
    await initializeTreeData();
    
    const treeView = document.getElementById('treeView');
    if (treeView && treeView.classList.contains('active')) {
        drawTree();
    } else {
        await drawSortedList();
    }
}

function initializeTreeView() {
    console.log('Initializing tree view...');
    
    const buttons = document.querySelectorAll('.view-button');
    const treeView = document.getElementById('treeView');
    const orderView = document.getElementById('orderView');

    if (!buttons.length || !treeView || !orderView) {
        console.error('Required elements not found');
        return;
    }

    treeView.classList.add('active');
    orderView.classList.remove('active');

    buttons.forEach((button) => {
        button.addEventListener('click', function() {
            console.log('View button clicked:', this.textContent.trim());
            
            buttons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');

            const buttonText = this.textContent.trim().toLowerCase();
            
            if (buttonText.includes('order')) {
                console.log('Switching to ORDER view');
                treeView.classList.remove('active');
                orderView.classList.add('active');
                drawSortedList();
            } 
            else if (buttonText.includes('graph')) {
                console.log('Switching to GRAPH view');
                orderView.classList.remove('active');
                treeView.classList.add('active');
                drawTree();
            }
        });
    });

    console.log('Tree view initialized successfully');
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - Initializing BST Application');
    
    setGraphChangeCallback(onGraphChanged);
    
    initializeSidebar();
    
    const loaded = await initializeTreeData();
    if (!loaded) {
        console.error('Failed to load tree data from backend');
    }
    
    initializeTreeView();
    
    console.log('Drawing initial tree');
    drawTree();
    
    console.log('BST Application initialized successfully');
});