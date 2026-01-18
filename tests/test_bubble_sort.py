import unittest
import time
from src.logic.sorting_algos.bubble_sort import bubble_sort

def run_sort(generator):
    """Consume generator completely"""
    for _ in generator:
        pass

class TestBubbleSort(unittest.TestCase):
    def tearDown(self):
        time.sleep(0.1)
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_sort_basic(self):
        arr = [5, 3, 1, 4, 2]

        run_sort(bubble_sort(arr))

        self.assertEqual(arr, [1, 2, 3, 4, 5])

    def test_already_sorted(self):
        arr = [1, 2, 3, 4, 5]

        run_sort(bubble_sort(arr))

        self.assertEqual(arr, [1, 2, 3, 4, 5])

    def test_reverse_sorted(self):
        arr = [5, 4, 3, 2, 1]

        run_sort(bubble_sort(arr))

        self.assertEqual(arr, [1, 2, 3, 4, 5])

    def test_with_duplicates(self):
        arr = [3, 1, 2, 3, 1]

        run_sort(bubble_sort(arr))

        self.assertEqual(arr, [1, 1, 2, 3, 3])

    def test_single_element(self):
        arr = [1]

        run_sort(bubble_sort(arr))

        self.assertEqual(arr, [1])

    def test_empty_list(self):
        arr = []

        run_sort(bubble_sort(arr))

        self.assertEqual(arr, [])

if __name__ == "__main__":
    unittest.main()