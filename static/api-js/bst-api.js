//------------ GRAPH OPERATIONS ---------------//

export async function getGraph(graph_name, is_updated = false) {
    const res = await fetch(`/bst/graph/fetch/${encodeURIComponent(graph_name)}?is_updated=${is_updated}`);
    const graph_data = await res.json();
    return graph_data;
}

export async function getAllGraphs(is_updated = false) {
    const res = await fetch(`/bst/graph/fetch/all?is_updated=${is_updated}`);
    const all_graphs = await res.json();
    return all_graphs;
}

export async function createGraph(graph_name) {
    const res = await fetch(`/bst/graph/create/${graph_name}`, {
        method: "POST"
    });
    const allGraphs = await res.json();
    return allGraphs;
}

export async function deleteGraph(graph_name) {
    const res = await fetch(`/bst/graph/delete/${encodeURIComponent(graph_name)}`, {
        method: "DELETE"
    });
    const allGraphs = await res.json();
    return allGraphs;
}

export async function renameGraph(old_name, new_name) {
    const res = await fetch(`/bst/graph/rename/${old_name}?new_name=${new_name}`, {
        method: "PUT"
    });
    const allGraphs = await res.json();
    return allGraphs;
}

//------------ NODE OPERATIONS ---------------//
export async function createNode(graph_name, value) {
    const res = await fetch(`/bst/node/create/${graph_name}?value=${encodeURIComponent(value)}`, {
        method: "POST"
    });
    const updatedGraph = await res.json();
    return updatedGraph;
}

 export async function updateNode(graph_name, old_value, new_value) {
    const res = await fetch(`/bst/node/update/${graph_name}?old_value=${encodeURIComponent(old_value)}&new_value=${encodeURIComponent(new_value)}`, {
        method: "PUT"
    });
    const updatedGraph = await res.json();
    return updatedGraph;
}

export async function deleteNode(graph_name, value) {
    const res = await fetch(`/bst/node/delete/${graph_name}?value=${encodeURIComponent(value)}`, {
        method: "DELETE"
    });
    const updatedGraph = await res.json();
    return updatedGraph;
}