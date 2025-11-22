from src.binary_tree.node import Node 

class BinaryTree:
    def __init__(self, root):
        self.root = Node(root)

    def insert_left(self, current_node, value):
        new_node = Node(value)
        
        if current_node.left is None:
            current_node.left = new_node
        else:
            new_node.left = current_node.left
            current_node.left = new_node

        return new_node

    def insert_right(self, current_node, value):
        new_node = Node(value)

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

    def search(self, root, key):
        if root is None:
            return None

        # search succeed
        if root.value == key:
            return root
       
        # continues the search
        left_node = self.search(root.left, key)
        right_node = self.search(root.right, key)
        
        if left_node:
            return left_node
        if right_node:
            return right_node

        # in case something stupid happens
        return None

    def delete(self, root, key):
        pass
