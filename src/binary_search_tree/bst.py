from src.binary_search_tree.node import Node

class BinarySearchTree:
    def __init__(self, data = None):
       self.root = None if data is None else Node(data)

    def insert(self, node, value):
        if self.root is None:
            self.root = Node(value)
            return

        if node is None:
            return Node(value)

        if node.value == value:
            raise ValueError(f"Value {value} already exists in the tree")
        if value <= node.value:
            node.left = self.insert(node.left, value)
        else:
            node.right = self.insert(node.right, value)
        return node
    
    def update(self, node, old_value, new_value):
        self.delete(searched_node, old_value)
        self.insert(self.root, new_value)

    def search(self, node, value):
        if node is None:
            return None
        if value == node.value:
            return node
        if value < node.value:
            return self.search(node.left, value)
        else:
            return self.search(node.right, value)

    def delete(self, node, value):
        if node is None:
            return None

        if value < node.value:
            node.left = self.delete(node.left, value)
        elif value > node.value:
            node.right = self.delete(node.right, value)
        else:
            # Case 1: No child
            if node.left is None and node.right is None:
                return None
            # Case 2: Only one child
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left
            # Case 3: Two children
            temp = self.get_min(node.right)
            node.value = temp.value
            node.right = self.delete(node.right, temp.value)

        return node

    def get_max(self, node):
        if node is None:
            return None
        while node.right is not None:
            node = node.right
        return node

    def get_min(self, node):
        if node is None:
            return None
        while node.left is not None:
            node = node.left
        return node

    def get_height(self, node):
        if node is None:
            return -1
        return 1 + max(self.get_height(node.left), self.get_height(node.right))

    def get_ordered(self):
        """In-order traversal iterator"""

        def inorder(node):
            if node:
                yield from inorder(node.left)
                yield node.value
                yield from inorder(node.right)

        return list(inorder(self.root))

    def __dict__(self):
        def inorder(node):
            if node:
                yield from inorder(node.left)
                yield node.__dict__()
                yield from inorder(node.right)

        bst_dict = {"root": None, "children": []}
        if self.root is None:
            return bst_dict

        left_root = list(inorder(self.root.left))
        right_root = list(inorder(self.root.right))
       
        bst_dict["root"] = self.root.__dict__()
        bst_dict["children"] = left_root + right_root

        return bst_dict

    @classmethod
    def import_dict(cls, inp_dict):
        def to_node(inp):
            return Node(
                inp["value"],
                left = inp["left"],
                right = inp["right"]
            )

        if inp_dict["root"] is None:
            return BinarySearchTree()

        root_node = to_node(inp_dict["root"])
        child_list = inp_dict["children"]
        node_dict = {}

        temp_bst = BinarySearchTree()
        for node_json in child_list:
            value = node_json["value"]
            node_dict[value] = to_node(node_json)

        BinarySearchTree.__connect_nodes(root_node, node_dict)
        temp_bst = BinarySearchTree()
        temp_bst.root = root_node

        return temp_bst

    @classmethod
    def __connect_nodes(cls, root, inp_dict):
        if root is None:
            return

        if root.left:
            left_node = inp_dict[root.left]
            root.left = left_node
            BinarySearchTree.__connect_nodes(left_node, inp_dict)

        if root.right:
            right_node = inp_dict[root.right]
            root.right = right_node
            BinarySearchTree.__connect_nodes(right_node, inp_dict)
