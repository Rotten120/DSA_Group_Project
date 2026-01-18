import unittest
import time
from src.logic.sorting_algos.insertion_sort import insertion_sort

def run_sort(generator):
    """Consume generator completely to apply sorting"""
    for _ in generator:
        pass

class TestInsertionSort(unittest.TestCase):
    def tearDown(self):
        time.sleep(0.1)
        print(f"[DONE] Test finished ({self._testMethodName})")

    def test_sort_basic(self):
        arr = [5, 2, 4, 6, 1, 3]

        run_sort(insertion_sort(arr))

        self.assertEqual(arr, [1, 2, 3, 4, 5, 6])

    def test_already_sorted(self):
        arr = [1, 2, 3, 4, 5]

        run_sort(insertion_sort(arr))

        self.assertEqual(arr, [1, 2, 3, 4, 5])

    def test_reverse_sorted(self):
        arr = [5, 4, 3, 2, 1]

        run_sort(insertion_sort(arr))

        self.assertEqual(arr, [1, 2, 3, 4, 5])

    def test_with_duplicates(self):
        arr = [3, 1, 2, 3, 1]

        run_sort(insertion_sort(arr))

        self.assertEqual(arr, [1, 1, 2, 3, 3])

    def test_single_element(self):
        arr = [42]

        run_sort(insertion_sort(arr))

        self.assertEqual(arr, [42])

    def test_empty_list(self):
        arr = []

        run_sort(insertion_sort(arr))

        self.assertEqual(arr, [])

if __name__ == "__main__":
    unittest.main()