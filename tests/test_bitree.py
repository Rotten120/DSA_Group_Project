import unittest
from src.logic.binary_tree import BinaryTree, Node

class TestBinaryTree(unittest.TestCase):

    def setUp(self):
        """setup"""
        self.tree = BinaryTree(1)
        self.l = self.tree.insert_left(self.tree.root, 2)
        self.r = self.tree.insert_right(self.tree.root, 3)
        self.tree.insert_left(self.l, 4)
        self.tree.insert_right(self.l, 5)

    def test_insert_left(self):
        self.assertEqual(self.tree.root.left.value, 2)

    def test_insert_right(self):
        self.assertEqual(self.tree.root.right.value, 3)

    def test_inorder_traversal(self):
        result = self.tree.inorder_traversal(self.tree.root)
        self.assertEqual(result, "4-2-5-1-3-")

    def test_preorder_traversal(self):
        result = self.tree.preorder_traversal(self.tree.root)
        self.assertEqual(result, "1-2-4-5-3-")

    def test_postorder_traversal(self):
        result = self.tree.postorder_traversal(self.tree.root)
        self.assertEqual(result, "4-5-2-3-1-")

    def test_search_found(self):
        node = self.tree.search_by_value(self.tree.root, 5)
        self.assertIsNotNone(node)
        self.assertEqual(node.value, 5)

    def test_search_not_found(self):
        node = self.tree.search_by_value(self.tree.root, 99)
        self.assertIsNone(node)

    def test_delete_leaf(self):
        self.tree.delete(self.tree.root, 5)
        self.assertNotIn(5, self.tree.to_list())

    def test_delete_root(self):
        self.tree.delete(self.tree.root, 1)
        self.assertIn(self.tree.root, self.tree.to_list())
    
    def test_to_list(self):
        lst = self.tree.to_list()
        out = [node.value for node in lst]
        self.assertEqual(out, [1, 2, 3, 4, 5])

if __name__ == "__main__":
    unittest.main()
