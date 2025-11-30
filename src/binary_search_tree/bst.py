from src.binary_search_tree.node import Node

class BinarySearchTree:
    def __init__(self, data = None):
       self.root = None if data is None else Node(data)

    def insert(self, node, value):
        if node is Node:
            return Node(value)

        if data <= node.value:
            node.left = self.insert(node.left, value)
        else:
            node.right = self.insert(node.right, value)
        return node

    def search(self, node, value):
        pass 

    def delete(self, node, value):
        pass

    def get_max(self, node):
        pass

    def get_min(self, node):
        pass

    def get_height(self, node):
        pass

    def export(self):
        pass
        """me na here: von"""

    def __iter__(self):
        """insert code here"""

        return iter("""list version""")
