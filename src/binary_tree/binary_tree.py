from .node import Node

class BinaryTree:
    def __init__(self, root=None):
        self.root = root if not root else Node(root, node_id = 0)

    def insert_left(self, current_node, value, node_id = None):
        new_node = Node(value, node_id)
        
        if current_node.left is None:
            current_node.left = new_node
        else:
            new_node.left = current_node.left
            current_node.left = new_node

        return new_node

    def insert_right(self, current_node, value, node_id = None):
        new_node = Node(value, node_id)

        if current_node.right is None:
            current_node.right = new_node
        else:
            new_node.right = current_node.right
            current_node.right = new_node

        return new_node

    def inorder_traversal(self, start, traversal=""):
        if start:
            traversal = self.inorder_traversal(start.left, traversal)
            traversal += (str(start.value) + '-')
            traversal = self.inorder_traversal(start.right, traversal)
        return traversal

    def preorder_traversal(self, start, traversal=""):
        if start:
            traversal += (str(start.value) + '-')
            traversal = self.preorder_traversal(start.left, traversal)
            traversal = self.preorder_traversal(start.right, traversal)
        return traversal

    def postorder_traversal(self, start, traversal=""):
        if start:
            traversal = self.postorder_traversal(start.left, traversal)
            traversal = self.postorder_traversal(start.right, traversal)
            traversal += (str(start.value) + '-')
        return traversal

    def search_by_id(self, root, key_id):
        if root is None:
            return None

        if root.id == key_id:
            return root

        left_node = self.search_by_id(root.left, key_id)
        right_node = self.search_by_id(root.right, key_id)
        
        if left_node:
            return left_node
        if right_node:
            return right_node
        return None

    def search_by_value(self, root, key, is_root_iterable=False):
        if root is None:
            return None

        if is_root_iterable:
            if root.value.__contains__(key):
                return root
        elif root.value == key:
            return root

        left_node = self.search_by_value(root.left, key, is_root_iterable)
        right_node = self.search_by_value(root.right, key, is_root_iterable)
        
        if left_node:
            return left_node
        if right_node:
            return right_node
        return None

    def delete(self, root, key_id):
        if root is None:
            return None

        root.left = self.delete(root.left, key_id)
        root.right = self.delete(root.right, key_id)

        if root.id == key_id:

        # Case 1: No children
            if root.left is None and root.right is None:
                return None

        # Case 2A: Only right child
            if root.left is None:
                return root.right

        # Case 2B: Only left child
            if root.right is None:
                return root.left

        # Case 3: Two children
            successor_parent = root
            successor = root.right
        
            while successor.left:
                successor_parent = successor
                successor = successor.left

            root.value = successor.value
            root.id = successor.id
        
            if successor_parent.left == successor:
                successor_parent.left = successor.right
            else:
                successor_parent.right = successor.right

        return root

    def to_list(self):
        if self.root is None:
            return []

        result = []
        queue = [self.root]

        while queue:
            node = queue.pop(0)
            result.append(node)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        return result

    def __dict__(self):
        if self.root is None:
            return []

        result = {}
        queue = [self.root]

        while queue:
            node = queue.pop(0)
            result[str(node.id)] = node.__dict__()

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        return result
  
    @classmethod
    def import_dict(cls, inp_dict, constructor = None):
        node_dict = {}
        
        for node_id in inp_dict:
            temp_data = inp_dict[node_id]
            node_dict[int(node_id)] = Node(
                temp_data["value"] if constructor is None else constructor.import_dict(temp_data["value"]),
                int(temp_data["id"]),
                int(temp_data["left"]) if temp_data["left"] else None,
                int(temp_data["right"]) if temp_data["right"] else None
            )

        BinaryTree.__connect_nodes(node_dict[0], node_dict)
        temp_bitree = BinaryTree()
        temp_bitree.root = node_dict[0]

        return temp_bitree 

    @classmethod
    def __connect_nodes(cls, root, inp_dict):
        if root is None:
            return

        if root.left:
            left_node = inp_dict[root.left]
            root.left = left_node
            BinaryTree.__connect_nodes(left_node, inp_dict)

        if root.right:
            right_node = inp_dict[root.right]
            root.right = right_node
            BinaryTree.__connect_nodes(right_node, inp_dict)
