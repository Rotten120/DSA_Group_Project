// ------------ ROUTE SEARCH OPERATIONS --------------- //
async function handleResponse(res) {
    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            const data = await res.json();
            message = data.message || message;
        } catch {
            
        }
        throw new Error(message);
    }
    return res.json();
}

export async function searchByPath(start, end) {
    const res = await fetch(
        `/graph/search/path/${encodeURIComponent(start)}/${encodeURIComponent(end)}`
    );
    return handleResponse(res);
}

export async function searchByTime(start, end) {
    const res = await fetch(
        `/graph/search/time/${encodeURIComponent(start)}/${encodeURIComponent(end)}`
    );
    return handleResponse(res);
}

export async function searchByCost(start, end) {
    const res = await fetch(
        `/graph/search/cost/${encodeURIComponent(start)}/${encodeURIComponent(end)}`
    );
    return handleResponse(res);
}
