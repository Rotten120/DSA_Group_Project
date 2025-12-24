class Node:
    def __init__(self, name: str, tag: str = None) -> None:
        self.name: str = name
        self.tag: str = tag
        self.neighbors: dict = {}
