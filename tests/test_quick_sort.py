import unittest
import time
from src.logic.sorting_algos.quick_sort import quick_sort

def run_sort(generator):
    for _ in generator:
        pass

class TestQuickSort(unittest.TestCase):

    def tearDown(self):
        time.sleep(0.1)
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_quick_sort_basic(self):
        arr = [64, 25, 12, 22, 11]
        run_sort(quick_sort(arr, 0, len(arr) - 1))
        self.assertEqual(arr, [11, 12, 22, 25, 64])

    def test_quick_sort_empty(self):
        arr = []
        run_sort(quick_sort(arr, 0, len(arr) - 1))
        self.assertEqual(arr, [])

    def test_quick_sort_single(self):
        arr = [42]
        run_sort(quick_sort(arr, 0, len(arr) - 1))
        self.assertEqual(arr, [42])

    def test_quick_sort_duplicates(self):
        arr = [3, 1, 2, 1]
        run_sort(quick_sort(arr, 0, len(arr) - 1))
        self.assertEqual(arr, [1, 1, 2, 3])

if __name__ == "__main__":
    unittest.main()