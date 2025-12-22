from typing import Dict, List
from collections import deque
from .node import Node

class Graph:
    def __init__(self) -> None:
        self.vertices: Dict[str, Node] = {}

    def add_vertex(self, station_name: str, tag: str = None) -> None:
        # Add a station (vertex)
        if station_name not in self.vertices:
            self.vertices[station_name] = Node(station_name, tag)

    def remove_vertex(self, station_name: str) -> None:
        # Remove station and all connected edges (vertex)
        if station_name not in self.vertices:
            return

        self.vertices.pop(station_name)

        for vertex in self.vertices.values():
            vertex.neighbors.pop(station_name, None)

    def add_edge(self, from_station: str, to_station: str, weight, two_way: bool = False) -> None:
        # Add a connection (edge) between two stations
        if from_station not in self.vertices or to_station not in self.vertices:
            return

        self.vertices[from_station].neighbors[to_station] = weight
        if two_way:
            self.vertices[to_station].neighbors[from_station] = weight 

    def remove_edge(self, from_station: str, to_station: str) -> None:
        # Remove a connection (edge) between two stations
        if from_station in self.vertices:
            self.vertices[from_station].neighbors.pop(to_station, None)
        if to_station in self.vertices:
            self.vertices[to_station].neighbors.pop(from_station, None)

    def bfs(self, start: str, end: str, w_counter = 0) -> List[str]:
        # Find the shortest path between two stations using BFS
        if start not in self.vertices or end not in self.vertices:
            return []

        visited: set[str] = set()
        queue: deque[List[str]] = deque()

        queue.append([start])
        visited.add(start)

        while queue:
            path = queue.popleft()
            current = path[-1]

            if current == end:
                return path

            for neighbor in self.vertices[current].neighbors:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(path + [neighbor])

        return [], w_counter
