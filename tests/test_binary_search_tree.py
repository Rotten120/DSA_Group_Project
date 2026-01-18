import unittest
import time
from src.logic.binary_search_tree import BinarySearchTree

class TestBSTInsert(unittest.TestCase):

    def setUp(self):
        self.bst = BinarySearchTree()

    def tearDown(self):
        time.sleep(0.1)
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_insert_root(self):
        self.bst.insert(self.bst.root, 10)

        self.assertEqual(self.bst.root.value, 10)

    def test_insert_multiple_values(self):
        values = [10, 5, 15, 3, 7]
        for v in values:
            self.bst.insert(self.bst.root, v)

        self.assertEqual(self.bst.get_ordered(), [3, 5, 7, 10, 15])

    def test_insert_duplicate_raises(self):
        self.bst.insert(self.bst.root, 10)

        with self.assertRaises(ValueError):
            self.bst.insert(self.bst.root, 10)

class TestBSTSearch(unittest.TestCase):

    def setUp(self):
        self.bst = BinarySearchTree()
        for v in [10, 5, 15, 3, 7]:
            self.bst.insert(self.bst.root, v)

    def tearDown(self):
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_search_existing(self):
        node = self.bst.search(self.bst.root, 7)

        self.assertIsNotNone(node)
        self.assertEqual(node.value, 7)

    def test_search_non_existing(self):
        node = self.bst.search(self.bst.root, 100)

        self.assertIsNone(node)

class TestBSTDelete(unittest.TestCase):

    def setUp(self):
        self.bst = BinarySearchTree()
        for v in [10, 5, 15, 3, 7, 12, 20]:
            self.bst.insert(self.bst.root, v)

    def tearDown(self):
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_delete_leaf(self):
        self.bst.delete(self.bst.root, 3)

        self.assertEqual(self.bst.get_ordered(), [5, 7, 10, 12, 15, 20])

    def test_delete_node_with_one_child(self):
        self.bst.delete(self.bst.root, 5)

        self.assertEqual(self.bst.get_ordered(), [3, 7, 10, 12, 15, 20])

    def test_delete_node_with_two_children(self):
        self.bst.delete(self.bst.root, 10)

        self.assertEqual(self.bst.get_ordered(), [3, 5, 7, 12, 15, 20])

class TestBSTUpdate(unittest.TestCase):

    def setUp(self):
        self.bst = BinarySearchTree()
        for v in [10, 5, 15]:
            self.bst.insert(self.bst.root, v)

    def tearDown(self):
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_update_value(self):
        self.bst.update(self.bst.root, 5, 8)

        self.assertEqual(self.bst.get_ordered(), [8, 10, 15])

class TestBSTProperties(unittest.TestCase):

    def setUp(self):
        self.bst = BinarySearchTree()
        for v in [10, 5, 15, 3, 7]:
            self.bst.insert(self.bst.root, v)

    def tearDown(self):
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_get_min(self):
        self.assertEqual(self.bst.get_min(self.bst.root).value, 3)

    def test_get_max(self):
        self.assertEqual(self.bst.get_max(self.bst.root).value, 15)

    def test_get_height(self):
        self.assertEqual(self.bst.get_height(self.bst.root), 2)

if __name__ == "__main__":
    unittest.main()