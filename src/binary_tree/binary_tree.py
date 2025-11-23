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
        if root is None:
            return None

        if root.left is None and root.right is None:
            if root.value == key:
                return None
            else:
                return root

        queue = [root]
        target_node = None
        parent_of_deepest = None
        deepest_node = None
        last_direction = None  

        while queue:
            temp = queue.pop(0)

            if temp.value == key:
                target_node = temp

            if temp.left:
                parent_of_deepest = temp
                last_direction = "left"
                queue.append(temp.left)

            if temp.right:
                parent_of_deepest = temp
                last_direction = "right"
                queue.append(temp.right)

            deepest_node = temp  

        if target_node is None:
            return root

        target_node.value = deepest_node.value

        if parent_of_deepest:
            if last_direction == "left":
                parent_of_deepest.left = None
            else:
                parent_of_deepest.right = None

        return root

    def to_list(self):
        if self.root is None:
            return []

        result = []
        queue = [self.root]

        while queue:
            node = queue.pop(0)
            result.append(node.value)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        return result
