from typing import Dict

class Node:
    def __init__(self, name: str) -> None:
        self.name: str = name
        self.neighbors: Dict[str, int] = {}