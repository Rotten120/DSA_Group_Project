export async function searchByPath(start, end) {
    const res = await fetch(`/search/path/${encodeURIComponent(start)}/${encodeURIComponent(end)}`);
    const route_data = await res.json();
    return route_data;
}

export async function searchByTime(start, end) {
    const res = await fetch(`/search/time/${encodeURIComponent(start)}/${encodeURIComponent(end)}`);
    const route_data = await res.json();
    return route_data;
}

export async function searchByCost(start, end) {
    const res = await fetch(`/search/cost/${encodeURIComponent(start)}/${encodeURIComponent(end)}`);
    const route_data = await res.json();
    return route_data;
}