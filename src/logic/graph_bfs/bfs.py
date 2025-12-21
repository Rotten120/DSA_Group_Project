from typing import Dict, List
from collections import deque
from .node import Node

class BreathFirstSearch:
    def __init__(self) -> None:
        self.vertices: Dict[str, Node] = {}

    def add_vertex(self, station_name: str) -> None:
        # Add a station (vertex)
        if station_name not in self.vertices:
            self.vertices[station_name] = Node(station_name)

    def edit_vertex(self, old_name: str, new_name: str) -> None:
        # Edit a station's name (vertex)
        if old_name not in self.vertices:
            return

        node = self.vertices.pop(old_name)
        node.name = new_name
        self.vertices[new_name] = node

        for vertex in self.vertices.values():
            if old_name in vertex.neighbors:
                vertex.neighbors[new_name] = vertex.neighbors.pop(old_name)

    def remove_vertex(self, station_name: str) -> None:
        # Remove station and all connected edges (vertex)
        if station_name not in self.vertices:
            return

        self.vertices.pop(station_name)

        for vertex in self.vertices.values():
            vertex.neighbors.pop(station_name, None)

    def add_edge(self, from_station: str, to_station: str) -> None:
        # Add a connection (edge) between two stations
        if from_station not in self.vertices or to_station not in self.vertices:
            return

        self.vertices[from_station].neighbors[to_station] = 1
        self.vertices[to_station].neighbors[from_station] = 1

    def edit_edge(self, from_station: str, old_to: str, new_to: str) -> None:
        # Edit a connection (edge) from one station to another
        if (
            from_station not in self.vertices
            or old_to not in self.vertices[from_station].neighbors
            or new_to not in self.vertices
        ):
            return

        self.vertices[from_station].neighbors.pop(old_to)
        self.vertices[from_station].neighbors[new_to] = 1

    def remove_edge(self, from_station: str, to_station: str) -> None:
        # Remove a connection (edge) between two stations
        if from_station in self.vertices:
            self.vertices[from_station].neighbors.pop(to_station, None)
        if to_station in self.vertices:
            self.vertices[to_station].neighbors.pop(from_station, None)

    def shortest_path(self, start: str, end: str) -> List[str]:
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

        return []