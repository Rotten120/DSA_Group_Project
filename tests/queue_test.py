from unit_test import *
from dataqueue import Queue

class TestQueue(unittest.TestCase):
    def test_queue(self):
        linked_list = Queue()
        linked_list.enqueue(1)
        linked_list.enqueue(2)
        linked_list.dequeue()
        linked_list.enqueue(3)
        
        self.assertEqual(list(linked_list), [2, 3])

    def test_enqueue(self):
        linked_list = Queue()
        linked_list.enqueue(2)
        linked_list.enqueue(4)
        linked_list.enqueue(6)
        linked_list.enqueue(8)

        self.assertEqual(list(linked_list), [2, 4, 6, 8])

    def test_dequeue(self):
        linked_list = Queue()
        linked_list.enqueue('I')
        linked_list.enqueue('II')
        linked_list.enqueue('III')
        linked_list.dequeue()

        self.assertEqual(list(linked_list), ['II', 'III'])

    def test_empty_queue(self):
        linked_list = Queue()
        linked_list.enqueue('I')
        linked_list.dequeue()

        self.assertEqual(list(linked_list), [])


if __name__ == "__main__":
    unittest.main()
