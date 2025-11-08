from unit_test import *
from dataqueue import Queue

class TestQueue(unittest.TestCase):
    def test_template(self):
        linked_list = Queue()
        linked_list.enqueue(1)
        linked_list.enqueue(2)
        linked_list.dequeue()
        linked_list.enqueue(3)
        
        self.assertEqual(list(linked_list), [2, 3])


if __name__ == "__main__":
    unittest.main()
