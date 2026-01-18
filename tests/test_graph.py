import unittest
import time
from src.logic.graph_bfs.graph import Node, Graph

class TestNode(unittest.TestCase):
    def tearDown(self):
        time.sleep(0.1)
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_node_initialization(self):
        node = Node("A", "station")

        self.assertEqual(node.name, "A")
        self.assertEqual(node.tag, "station")
        self.assertEqual(node.neighbors, {})

class TestGraph(unittest.TestCase):
    def setUp(self):
        self.graph = Graph()

    def tearDown(self):
        time.sleep(0.1)
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_add_vertex(self):
        self.graph.add_vertex("A", "start")

        self.assertIn("A", self.graph.vertices)
        self.assertEqual(self.graph.vertices["A"].tag, "start")

    def test_remove_vertex(self):
        self.graph.add_vertex("A")
        self.graph.add_vertex("B")
        self.graph.add_edge("A", "B")

        self.graph.remove_vertex("A")

        self.assertNotIn("A", self.graph.vertices)
        self.assertNotIn("A", self.graph.vertices["B"].neighbors)

    def test_add_edge_one_way(self):
        self.graph.add_vertex("A")
        self.graph.add_vertex("B")

        self.graph.add_edge("A", "B", weight=5)

        self.assertIn("B", self.graph.vertices["A"].neighbors)
        self.assertEqual(self.graph.vertices["A"].neighbors["B"], 5)
        self.assertNotIn("A", self.graph.vertices["B"].neighbors)

    def test_add_edge_two_way(self):
        self.graph.add_vertex("A")
        self.graph.add_vertex("B")

        self.graph.add_edge("A", "B", weight=10, two_way=True)

        self.assertIn("B", self.graph.vertices["A"].neighbors)
        self.assertIn("A", self.graph.vertices["B"].neighbors)

    def test_remove_edge(self):
        self.graph.add_vertex("A")
        self.graph.add_vertex("B")
        self.graph.add_edge("A", "B", two_way=True)

        self.graph.remove_edge("A", "B")

        self.assertNotIn("B", self.graph.vertices["A"].neighbors)
        self.assertNotIn("A", self.graph.vertices["B"].neighbors)

    def test_bfs_no_path(self):
        self.graph.add_vertex("A")
        self.graph.add_vertex("B")

        path, tags = self.graph.bfs("A", "B")

        self.assertEqual(path, [])
        self.assertEqual(tags, [])

    def test_bfs_invalid_nodes(self):
        path, tags = self.graph.bfs("X", "Y")

        self.assertEqual(path, [])
        self.assertEqual(tags, [])

if __name__ == "__main__":
    unittest.main()