from .node import Node

class BinarySearchTree:
    def __init__(self, data = None, val_import = None, val_export = None):
        self.root = None if data is None else Node(data)
        self.val_import = val_import
        self.val_export = val_export

    def insert(self, node: Node | None, value) -> Node | None:
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
    
    def update(self, node: Node | None, old_value, new_value):
        self.delete(node, old_value)
        self.insert(self.root, new_value)

    def search(self, node: Node | None, value) -> Node | None:
        if node is None:
            return None
        if value == node.value:
            return node
        if value < node.value:
            return self.search(node.left, value)
        else:
            return self.search(node.right, value)

    def delete(self, node: Node | None, value) -> Node | None:
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

    def get_max(self, node: Node | None) -> Node | None:
        if node is None:
            return None
        while node.right is not None:
            node = node.right
        return node

    def get_min(self, node: Node | None) -> Node | None:
        if node is None:
            return None
        while node.left is not None:
            node = node.left
        return node

    def get_height(self, node: Node | None) -> int:
        if node is None:
            return -1
        return 1 + max(self.get_height(node.left), self.get_height(node.right))

    def get_ordered(self) -> list:
        """In-order traversal iterator"""

        def inorder(node):
            if node:
                yield from inorder(node.left)
                yield node.value
                yield from inorder(node.right)

        return list(inorder(self.root))

    """ CLASS IMPORT/EXPORT METHODS """

    def export(self) -> dict:
        def inorder(node):
            if node:
                yield from inorder(node.left)
                yield node.export(self.val_export)
                yield from inorder(node.right)

        bst_dict = {"root": None, "children": []}
        if self.root is None:
            return bst_dict

        left_root = list(inorder(self.root.left))
        right_root = list(inorder(self.root.right))
       
        bst_dict["root"] = self.root.export(self.val_export)
        bst_dict["children"] = left_root + right_root

        return bst_dict

    @classmethod
    def import_dict(
        cls,
        inp_dict: dict,
        val_import = None,
        val_export = None
    ):
        temp_bst = BinarySearchTree(
            val_import = val_import,
            val_export = val_export
        )

        if inp_dict["root"] is None:
            return temp_bst

        child_list = inp_dict["children"]
        node_dict = {}

        for node_json in child_list:
            value = node_json["value"]
            node_dict[value] = Node.import_dict(node_json)

        root_node = Node.import_dict(inp_dict["root"], val_import)
        temp_bst.root = root_node
        
        BinarySearchTree.__connect_nodes(root_node, node_dict)
        return temp_bst

    @classmethod
    def __connect_nodes(
        cls,
        root: Node | None,
        inp_dict: dict
    ):
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
