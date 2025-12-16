import unittest
from src.logic.queue_deque import DeQue

class TestDeQue(unittest.TestCase):
    def test_deque(self):
        linked_list = DeQue()
        linked_list.add_rear('3')
        linked_list.add_rear('4')
        linked_list.add_front('5')
        linked_list.remove_rear()
        
        self.assertEqual(list(linked_list), ['5', '3'])

    def test_add_rear(self):
        linked_list = DeQue()
        linked_list.add_rear('y')
        linked_list.add_rear('x')

        self.assertEqual(list(linked_list), ['y', 'x'])

    def test_add_front(self):
        linked_list = DeQue()
        linked_list.add_front('I')
        linked_list.add_front('III')
        linked_list.add_front('V')

        self.assertEqual(list(linked_list), ['V', 'III', 'I'])

    def test_remove_front(self):
        linked_list = DeQue()
        linked_list.add_front('III')
        linked_list.add_front('II')
        linked_list.add_front('I')
        linked_list.remove_front()
        linked_list.remove_front()
        

        self.assertEqual(list(linked_list), ['III'])

    def test_remove_rear(self):
        linked_list = DeQue()
        linked_list.add_front('6')
        linked_list.add_rear('7')
        linked_list.add_rear('8')
        linked_list.add_rear('9')
        linked_list.remove_rear()
        linked_list.remove_rear()
        

        self.assertEqual(list(linked_list), ['6', '7'])

    def test_empty_queue(self):
        linked_list = DeQue()
        linked_list.add_rear('A')
        linked_list.remove_front()

        self.assertEqual(list(linked_list), [])

if __name__ == "__main__":
    unittest.main()
