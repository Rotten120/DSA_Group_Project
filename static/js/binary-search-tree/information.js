import { getCurrentGraph } from './side-bar-bst.js';
import { getGraph } from '/static/api-js/bst-api.js';

class InfoButton {
    constructor(buttonId, popupId, minValueId, maxValueId, heightId) {
        this.infoButton = null;
        this.infoPopup = null;
        this.minValueElement = null;
        this.maxValueElement = null;
        this.heightElement = null;
        this.isVisible = false;
        this.minValue = 0;
        this.maxValue = 0;
        this.height = 0;
        
        this.buttonId = buttonId;
        this.popupId = popupId;
        this.minValueId = minValueId;
        this.maxValueId = maxValueId;
        this.heightId = heightId;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.infoButton = document.getElementById(this.buttonId);
        this.infoPopup = document.getElementById(this.popupId);
        this.minValueElement = document.getElementById(this.minValueId);
        this.maxValueElement = document.getElementById(this.maxValueId);
        this.heightElement = document.getElementById(this.heightId);
        
        if (!this.infoButton || !this.infoPopup) {
            console.error(`Info button elements not found: ${this.buttonId}`);
            return;
        }
        
        this.infoButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePopup();
        });
        
        document.addEventListener('click', (e) => {
            if (this.isVisible && 
                !this.infoPopup.contains(e.target) && 
                !this.infoButton.contains(e.target)) {
                this.hidePopup();
            }
        });
        
        this.infoPopup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    togglePopup() {
        if (this.isVisible) {
            this.hidePopup();
        } else {
            this.showPopup();
        }
    }
    
    showPopup() {
        this.infoPopup.classList.add('show');
        this.isVisible = true;
    }
    
    hidePopup() {
        this.infoPopup.classList.remove('show');
        this.isVisible = false;
    }
    
    updateValues(minValue = 0, maxValue = 0, height = 0) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.height = height;
        
        if (this.minValueElement) {
            this.minValueElement.textContent = this.minValue;
        }
        
        if (this.maxValueElement) {
            this.maxValueElement.textContent = this.maxValue;
        }
        
        if (this.heightElement) {
            this.heightElement.textContent = this.height;
        }
    }
    
    setTreeInfo(minValue, maxValue, height) {
        this.updateValues(minValue, maxValue, height);
    }
    
    getTreeInfo() {
        return {
            minValue: this.minValue,
            maxValue: this.maxValue,
            height: this.height
        };
    }
}

let infoButtonTop = null;
let infoButtonBottom = null;

function initInfoButtons() {
    infoButtonTop = new InfoButton(
        'infoButtonTop',
        'infoPopupTop',
        'minHeightValueTop',
        'maxHeightValueTop',
        'heightTop'
    );
    
    infoButtonBottom = new InfoButton(
        'infoButtonBottom',
        'infoPopupBottom',
        'minHeightValueBottom',
        'maxHeightValueBottom',
        'heightBottom'
    );
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfoButtons);
} else {
    initInfoButtons();
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

async function calculateTreeStatsFromCurrentGraph() {
    try {
        const graph = getCurrentGraph();
        
        if (!graph) {
            console.log('No graph selected');
            return {
                minValue: 'N/A',
                maxValue: 'N/A',
                height: 0
            };
        }
        
        const data = await getGraph(graph.name);
        
        if (!data || !data.nodes || !data.order || data.order.length === 0) {
            return {
                minValue: 'N/A',
                maxValue: 'N/A',
                height: 0
            };
        }

        const treeData = convertToTreeStructure(data.nodes);
        const sortedData = data.order;
        
        return calculateTreeStats(treeData, sortedData);
    } catch (error) {
        console.error('Error calculating tree stats:', error);
        return {
            minValue: 'N/A',
            maxValue: 'N/A',
            height: 0
        };
    }
}

function calculateTreeStats(treeData, sortedData) {
    if (!treeData || !sortedData || sortedData.length === 0) {
        return {
            minValue: 'N/A',
            maxValue: 'N/A',
            height: 0
        };
    }
    
    const minValue = sortedData[0];
    const maxValue = sortedData[sortedData.length - 1];
    
    function getHeight(node) {
        if (!node) return 0;
        const leftHeight = getHeight(node.left);
        const rightHeight = getHeight(node.right);
        return 1 + Math.max(leftHeight, rightHeight);
    }
    
    const height = getHeight(treeData);
    
    return {
        minValue,
        maxValue,
        height
    };
}

async function updateAllInfoButtons(treeData = null, sortedData = null) {
    let stats;

    if (treeData === null || sortedData === null) {
        stats = await calculateTreeStatsFromCurrentGraph();
    } else {
        stats = calculateTreeStats(treeData, sortedData);
    }
    
    if (infoButtonTop) {
        infoButtonTop.setTreeInfo(stats.minValue, stats.maxValue, stats.height);
    }
    if (infoButtonBottom) {
        infoButtonBottom.setTreeInfo(stats.minValue, stats.maxValue, stats.height);
    }
    
    console.log('Info buttons updated:', stats);
}

export { 
    InfoButton, 
    updateAllInfoButtons, 
    calculateTreeStats,
    calculateTreeStatsFromCurrentGraph 
};

if (typeof window !== 'undefined') {
    window.updateAllInfoButtons = updateAllInfoButtons;
    window.calculateTreeStatsFromCurrentGraph = calculateTreeStatsFromCurrentGraph;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        InfoButton, 
        updateAllInfoButtons, 
        calculateTreeStats,
        calculateTreeStatsFromCurrentGraph 
    };
}