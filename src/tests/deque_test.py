from unit_test import *
from datadeque import DeQue

class TestDeQue(unittest.TestCase):
    def test_template(self):
        linked_list = DeQue()
        linked_list.add_rear('3')
        linked_list.add_rear('4')
        linked_list.add_front('5')
        linked_list.remove_rear()
        
        self.assertEqual(list(linked_list), ['5', '3'])

if __name__ == "__main__":
    unittest.main()
